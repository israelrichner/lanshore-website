# Review log — Dynamic Content Management (Plan v2)

Append-only. Never overwrite a previous round.
Reviewed: `docs/plans/dynamic-content-management.md` (v2, revised 2026-08-26)
Reviewer pass performed 2026-08-26 against the working tree on `preview/faq-agentic-spm`.

## Round 1

**Grounding spot-check — result: the plan is unusually well-cited.** Every `path:line`
reference I opened said what the plan claims it says:

| Claim | Verified |
|---|---|
| `src/lib/whitePapers.ts:13-21, 24-32, 34, 77-84, 86` | ✅ exact |
| `src/lib/blog.ts:5-22, 24, 1025` | ✅ exact (file is 1027 lines) |
| `src/lib/caseStudies.ts:4-16, 18, 299` | ✅ exact |
| `src/lib/schema.ts:123, 213, 237, 254, 296, 343-350` | ✅ exact |
| `next.config.ts:7-69` (13 case-study redirects), `:72-78` (5 migrated posts), `:173-175` | ✅ exact |
| `src/app/resources/page.tsx:24-62` hardcoded blog array | ✅ exact |
| `src/app/api/whitepaper/route.ts:18-21, 23-33, 36-45, 57` | ✅ exact |
| `src/app/sitemap.ts:10-13, 46-58`; `src/lib/contentDates.ts:23` | ✅ exact |
| `src/components/JsonLd.tsx:7`, `CaseStudyGrid.tsx:5`, `WhitePaperGate.tsx:5,81` | ✅ exact |
| `src/proxy.ts:9, 27-41`; no `vercel.json`, no `.github/`; `package.json:5-10` | ✅ exact |
| `node_modules/next/.../16-proxy.md:29` ("not … a full session management or authorization solution") | ✅ verbatim |

No fabricated citations found. Findings below are about design, not about grounding —
with the exception of B4 and B7.

---

### BLOCKERS

- `[BLOCKER] B1 — The slug-parity gate fails the build on Publish, Unpublish, and Delete.`
  §10.1.1 defines the check as *"the set of loaded slugs per type **equals**
  `content/SLUGS.lock.json` exactly"*, and §6.3 makes drafts **absent from every loaded
  array**. `check:content` is wired to `prebuild`, so it runs on every Vercel build.
  Trace each editor action:
  - **Save draft (new item)** → not loaded, not in lock → sets equal → ✅ passes.
  - **Publish (new item)** → loaded set gains a slug the lock does not have → ❌ build fails.
  - **Unpublish (existing item)** → loaded set loses a locked slug → ❌ build fails.
  - **Delete** → same → ❌ build fails.

  So the only editor action that survives the gate is the one that publishes nothing. The
  first real use of the feature breaks the deploy pipeline, and it stays broken until a
  developer edits `SLUGS.lock.json` by hand — which is precisely the developer-in-the-loop
  the plan exists to remove. Nothing in Package 3 writes the lock file; §13 P3 only says the
  delete dialog *warns* about it.

  **Resolves by:** redefining the invariant as *"every slug in the lock still resolves to a
  200"* (subset, not equality), sourced from **all** content files rather than the
  draft-filtered arrays, plus an explicit `retired: {slug, redirectTo}` list the admin
  appends to on delete. Add a P3 task that writes the lock, and state which of
  add/unpublish/delete may mutate it without a developer.

- `[BLOCKER] B2 — Moving the loaders to `node:fs` breaks the white-paper download at
  runtime, and falsifies the plan's central safety claim.`
  §1 and §5.1 both assert the public site makes **"no network calls at runtime"** / has
  **"zero runtime data dependencies."** That is true of the pages — but
  `src/app/api/whitepaper/route.ts:3` imports `getWhitePaper` from `@/lib/whitePapers`, and
  that route is a **POST handler**: it runs in a Vercel serverless function, not at build
  time. Once `whitePapers.ts` reads `content/white-papers/*.json` at module scope, that
  function needs those files inside its bundle. Next's output file tracing (`@vercel/nft`)
  is static analysis; a `readdirSync(path.join(process.cwd(), "content", …))` is not
  traceable, and `process.cwd()` in the lambda is `/var/task`.

  Failure shape: **the build passes, every page renders, and every white-paper download
  500s** — because the loader's own throw-on-empty-collection assertion (§6.2) fires at
  module init inside the function. That is the gated lead-capture path, and it is exactly
  the "content can never fail at runtime" property the plan sells as its reason for
  existing. §7.2 states `next.config.ts` needs **"No change expected."**

  **Resolves by:** adding `outputFileTracingIncludes` for `content/**` scoped to the
  API route (and any other non-prerendered consumer) in `next.config.ts`; correcting §7.2;
  and adding a P1 verification step that hits `POST /api/whitepaper` **on a deployed Vercel
  preview**, not just `next start` locally — `next start` reads the real filesystem and will
  pass while the lambda fails. Alternatively, have the route import a build-time-generated
  static manifest rather than the fs loader.

- `[BLOCKER] B3 — The proxy rule 404s the only page that lets anyone sign in.`
  §6.5.3's table: proxy returns **404 for `/studio/*`** when no valid session cookie is
  present. §6.5.1 and §6.5.3 also state `/studio/signed-out` is *"the only page reachable
  without a session"* and is what the editor bookmarks. Both cannot be true. As written, a
  signed-out editor hits 404 at the sign-in page and there is no entry point into the admin
  at all.

  **Resolves by:** naming the exempt paths explicitly in §6.5.3 and in the P2 task
  (`/studio/signed-out` and `/api/studio/auth/*` bypass the optimistic check), and adding an
  E-case: "signed out, hit the bookmarked entry URL → sign-in button renders."

---

### MAJOR

- `[MAJOR] M1 — "zero new dependencies" for `node --test` does not survive contact with
  TypeScript.`
  §10.4 wires `npm run test:auth` to `node --test` against `src/lib/studio/session.ts` and
  `google.ts` — **TypeScript files using the `@/*` path alias** (`tsconfig.json` `paths`).
  `node --test` cannot load `.ts` (Node 22.20 here needs `--experimental-strip-types`), and
  type stripping does **not** resolve `@/*`. `package.json` pins no `engines` and there is
  no `.nvmrc`, so the Vercel build's Node major is whatever Vercel defaults to — and
  `test:auth` is wired into `prebuild`, meaning a Node-version change silently fails every
  deploy. The same problem hits `scripts/migrate-content.mjs` (§13 P1: *"reads the current
  `BLOG_POSTS`/`CASE_STUDIES`"* — those are `.ts`) and §13 P3's requirement that
  `check-content.mjs` share `src/lib/studio/validate.ts` **"by import, not by copy."**

  **Resolves by:** picking one and writing it down — (a) author the auth core and the shared
  validator as plain `.mjs` with relative imports and let the `.ts` modules be thin wrappers,
  (b) accept `tsx`/`esbuild` as a fourth devDependency and retire the "zero dependencies"
  claim, or (c) pin `engines.node` + `--experimental-strip-types` and ban `@/` aliases inside
  `src/lib/studio/**`. Option (a) keeps the plan's own value intact.

- `[MAJOR] M2 — The `blocks[]` → Markdown conversion in §8 corrupts 10 existing paragraphs.`
  Verified by scan: **10 `p` blocks in `src/lib/blog.ts` begin with `1. `, `2. ` … `5. `**
  (e.g. `"1. Agentic AI Roadmap and Current Capabilities. …"`, `"2. Integration Depth with
  Your CRM…"`). §8's rule is a bare `p → paragraph`. Emitted that way, GFM parses each as an
  **ordered list item**: consecutive ones collapse into one `<ol>`, the literal "1."/"2." is
  consumed by the list marker, and `<p class="my-4 text-foreground">` becomes `<li>`. Visible
  text and HTML both change. §9's first risk row claims the migration "is scripted, never
  hand-typed" and therefore safe; scripted is not the same as escaped.

  **Resolves by:** adding an explicit escaping rule to §8 — escape a leading ordered-list
  marker (`1\. `) and leading `#`, `>`, `-`, `+`, `*` in every `p` and `li` text — and adding
  a migration-script assertion that re-parsing the emitted Markdown yields the same block
  sequence it was generated from. That assertion is worth more than the golden diff here,
  because it fails at migration time rather than at review time.

- `[MAJOR] M3 — The downstream inventory misses two live consumers, one of them
  compliance-bearing.`
  §3.2 presents itself as "everything downstream of the content." It omits:
  1. **`src/components/Footer.tsx:8,23`** — `GARTNER_PATHS` is computed as
     `BLOG_POSTS.filter((p) => JSON.stringify(p).includes("Gartner"))`. Blog posts *do*
     mention Gartner (5 occurrences in `src/lib/blog.ts`). `src/lib/site.ts:12-21` states
     that **every page mentioning Gartner must render the trademark attribution**, under a
     no-reprint-license constraint. The plan replaces `blocks: BlogBlock[]` with a Markdown
     `body` — if the loader does not keep the body text on the serialized `BlogPost` object,
     `JSON.stringify(p).includes("Gartner")` silently returns false and the required
     disclaimer stops rendering. This is a legal-adjacent behavior riding on a
     `JSON.stringify` heuristic that the refactor moves directly under.
  2. **`src/app/industries/[slug]/page.tsx:7,45`** — `getCaseStudy(industry.caseStudySlug)`.
     Guarded by `study && …` (`:46`), so a delete degrades rather than crashes — but it means
     an editor deleting a case study silently removes a cross-link from an industry page, and
     `check-content` has no rule tying `INDUSTRIES[].caseStudySlug` to a live slug.

  §7.2's modified-files table lists neither, and §10.2's golden-diff capture list contains no
  `/industries/*` route, so neither regression would be caught.

  **Resolves by:** adding both to §3.2 and §7.2; adding a P1 task to keep the post body on
  the object (or replace the heuristic with an explicit `mentionsGartner` front-matter flag —
  better, since editors will eventually write "Gartner" and should get the footnote
  deterministically); adding `INDUSTRIES[].caseStudySlug` resolution to `check-content`; and
  adding the industries routes to the §10.2 capture set.

- `[MAJOR] M4 — The count is wrong: 14 case studies, not 15; 24 items, not 25.`
  `src/lib/caseStudies.ts` contains **14** entries (verified by slug enumeration);
  `next.config.ts`'s `CASE_STUDY_REDIRECTS` has 13 unique destination slugs. The plan states
  15 in §3.1 and then propagates "25" into `SLUGS.lock.json` ("freezes the current 25"), the
  §13 P1 baseline capture ("all 15 `/case-studies/<slug>`"), and the P1 **verify criterion**
  ("all 25 detail routes still listed as prerendered"). A verify command with a wrong
  expected count either fails for the wrong reason or gets waved past — and this one is
  labeled "verified in-repo, 2026-08-13."

  **Resolves by:** correcting to 5 + 14 + 5 = 24 everywhere, and deriving the expected count
  in `check-content` from the lock file rather than hardcoding it in prose.

- `[MAJOR] M5 — §6.5.1's claim that `disallow: "/api/"` covers `/api/studio/*` is false for
  the crawlers that matter.`
  `src/app/robots.ts:20-22` emits `{ userAgent: "*", allow: "/", disallow: "/api/" }` **plus
  nine per-bot rules** — `GPTBot`, `ClaudeBot`, `PerplexityBot`, **`Googlebot`**,
  `Google-Extended`, … — each `{ allow: "/" }` with **no disallow**. The file's own comment
  (`:4-5`) says robots.txt is most-specific-wins per user agent. So for exactly the nine
  crawlers this site courts, `/api/studio/*` is *allowed*, not disallowed. The plan cites
  this as the reason no extra robots work is needed for the admin API (and the line number is
  `:21`, not `:20`).

  The `X-Robots-Tag: noindex` control in §6.5.1 still holds, so this is not a hole in the
  design — but it is a stated defense that does not exist, and A2/A3 in §10.3 do not test it.

  **Resolves by:** correcting the §6.5.1 sentence, and extending §10.3 A4 to assert the
  header on `/api/studio/auth/login` specifically (already listed — keep it, it is now the
  *only* control there rather than a second one).

- `[MAJOR] M6 — Self-service publishing structurally guarantees dishonest `lastmod` on the
  three index pages.`
  `src/app/sitemap.ts:25,27,28` stamps `/case-studies`, `/blog`, and `/resources` from
  `UPDATED.caseStudies` / `UPDATED.blogIndex` / `UPDATED.resources` in
  `src/lib/contentDates.ts` — which §2 explicitly keeps **developer-owned** and out of the
  admin. An editor publishing a post changes `/blog`, `/resources`, and the sitemap's URL set
  while `/blog`'s `lastmod` stays frozen at `2026-07-11`. `src/app/sitemap.ts:10-13` is the
  repo's own argument for why that matters ("a sitemap that … gets the signal discarded
  wholesale"), and §9 lists dishonest `lastmod` as a named risk — mitigated only for
  per-post dates.

  **Resolves by:** deriving the three index `lastModified` values as
  `max(item.dateModified)` over each collection instead of from `contentDates.ts` (a ~5-line
  change in `sitemap.ts`, in scope for P1), or stating explicitly that index freshness is
  accepted as stale and why.

---

### MINOR

- `[MINOR] m1 — §6.1's "reproducing `linkify`" is asserted, not demonstrated.`
  `src/app/blog/[slug]/page.tsx:38-59` strips trailing `.,);` from the URL, renders the
  punctuation outside the anchor, and applies
  `break-all font-medium text-accent underline hover:text-accent-hover` **plus
  `target="_blank" rel="noopener noreferrer"`**. GFM autolink literals have different
  trailing-punctuation rules and different preceding-character rules, and `react-markdown`
  emits a bare `<a>`. §7.1 specifies the `<Markdown>` component map as "reproducing the
  classes in `…page.tsx:116-145`" — that range is the block renderer and **excludes the
  anchor styling at `:47-52`**. Also pin `react-markdown`'s default `urlTransform` (it is
  what rejects `javascript:` hrefs) so a later "simplification" cannot remove it.

- `[MINOR] m2 — P1 and P2 are described as parallel-safe but collide.` Both add a `prebuild`
  entry to `package.json` (`check:content` in P1, `test:auth` in P2) and P2 edits
  `src/proxy.ts`. Not a design flaw — but say that `prebuild` chains both, so the second
  package to land does not overwrite the first.

- `[MINOR] m3 — `/security-review` is not a runnable verify command.` It appears as the
  gating verify for P2 and P3. It is an assistant skill, not a shell command, and the plan's
  own §10.6 concedes it is "a code review, not an assessment." Keep it as a named gate, but
  the machine-checkable verify for P2 should be `npm run test:auth && npm run build && npm
  run lint`, with the review recorded as a signed-off checklist artifact.

- `[MINOR] m4 — A deferred check that is already answerable.` §6.5.4 defers "check whether
  any PDF exceeds ~4 MB" to P3. All five are 297–696 KB (`public/whitepapers/`), so the Git
  Data API fallback is unnecessary — say so and delete the branch, rather than carrying a
  conditional into implementation.

- `[MINOR] m5 — The OAuth `redirect_uri` source is unspecified.` §7.3 registers two URIs but
  §6.5.2 never says where the value comes from at request time. Building it from the `Host`
  header is the standard mistake. `src/lib/site.ts:1` already exports `SITE_URL` — name it
  as the source, with an explicit localhost branch.

- `[MINOR] m6 — Numbering drift.` §9's risk row says "§10.4 (T1–T14)"; §10.4 defines T1–T16
  and §13 P2 says T1–T16. §11's open questions run A, B, C, D, G, H, I, E, F.

- `[MINOR] m7 — Case studies as `.md` with no body.` §6.1 stores them as Markdown files whose
  fields are all front matter (`challenge` / `whatWeDid` are plain strings rendered into
  fixed sections) and whose body is "optional" and unused. `.json` — like white papers —
  would be the honest format and would drop `gray-matter` from that path. Cosmetic, but it
  removes an "optional body" that will eventually get filled in and silently ignored.

---

### Notes, not findings

- **The plan is net-additive by design and says so.** The one supersession it does declare
  (`REPLACE` of the `/resources` hardcoded array, §6.4; `REPLACE` of `groupBlocks`/`linkify`,
  §7.2) is explicit and ordered. `blocks[]` is retired as a *storage* format with the
  render path named. No silent `COEXIST` found — which is the failure mode this review looks
  hardest for.
- **Format.** This is a `docs/plans/` document per `AGENTS.md`, not a `.grokbit/plans/<slug>/`
  artifact set, so it has no per-task `id:` / `baseline:` / `removes:` / `rollback:` /
  `cwd:` fields. The three work packages carry `Ships with:` and `Verify:` lines that serve
  the same purpose at coarser grain. Not raised as findings; noted so the gap is a choice.
- **Quality of the security section.** §6.5.2's flow (state, nonce, JWKS verification,
  `email_verified`, fail-closed empty allowlist, per-call allowlist re-check, `hd`-is-a-hint)
  is correct and unusually complete for a hand-rolled OAuth design. The `alg: none` and
  symmetric-algorithm rejections (T12) and the "`Strict` breaks the callback" note are both
  the kind of detail that is normally learned the expensive way. B3 is a wiring bug in front
  of it, not a flaw in it.

---

### Architect response — Round 1

All 16 findings addressed in plan **v3**. No rebuttals — every finding was accepted.

| Finding | Disposition | Where |
|---|---|---|
| `B1` ledger fails on Publish/Unpublish/Delete | **REVISED** — invariant changed from set-equality-over-loaded-arrays to a **subset over files on disk**, plus `retired[]`, four named rules L1–L4, per-button ledger semantics, and pre-flight validation so the editor never learns of a violation from a deploy email. Delete of a published item is now explicitly refused (Unpublish instead), consistent with the existing slug-rename carve-out | new **§6.6**; §10.1.1; §13 P1/P3; §10.5 E11 |
| `B2` `content/` missing from the serverless bundle | **REVISED** — `outputFileTracingIncludes` added to `next.config.ts` (§7.2's "no change expected" corrected), scoped to `/api/whitepaper`; §10.1.8 asserts every runtime consumer is listed; verification moved to a **deployed preview**, with an explicit warning that a local `next start` pass is worthless here. §1 and §3.3's "no runtime data dependency" claims restated precisely | §6.2; §7.2; §10.2.6; §13 P1 verify |
| `B3` proxy 404s the sign-in page | **REVISED** — four exempt paths named explicitly, compared by equality not prefix; E10 tests both directions | §6.5.3; §13 P2; §10.5 E10 |
| `M1` `node --test` cannot load `.ts` + unpinned Node | **REVISED** — auth core authored as plain `.mjs` with relative imports, `.ts` files become typed re-exports; `scripts/lib/content-rules.mjs` becomes the single shared validator (the `.mjs`→`.ts` import direction reversed); `engines.node` pinned in P1; no `@/*` in any `.mjs`. The migration script's `.ts` read resolved separately: verified all three source modules are self-contained after type erasure, so `--experimental-strip-types` suffices for the one-shot run | §10.4; §7.1; §2; §3.6; §8 |
| `M2` 10 paragraphs corrupt into ordered lists | **REVISED** — explicit escaping table in §8 plus a **round-trip assertion** that aborts the migration on any block-sequence mismatch. §9's "scripted, never hand-typed" mitigation replaced, since that was the reasoning that produced the bug | §8; §6.1; §9; §13 P1 |
| `M3` Footer/Gartner + industries consumers missed | **REVISED** — both added to §3.2 with a full importer list; `GARTNER_PATHS`' `JSON.stringify` heuristic replaced by a derived `mentionsGartner` field (front-matter flag rejected: a forgotten flag is an undisclosed trademark use); `INDUSTRIES[].caseStudySlug` resolution added to `check-content`; industries routes and the footer added to the golden-diff set | new **§6.8**; §3.2; §7.2; §10.1.7/.9; §10.2 |
| `M4` 14 case studies, not 15 | **REVISED** — corrected throughout; counts now derived from the ledger rather than restated in prose | §3.1 and all downstream |
| `M5` `disallow: "/api/"` doesn't bind the AI crawlers | **REVISED** — claim corrected with the mechanism (most-specific-wins, `robots.ts:22`), and A4 extended, with an explicit warning not to "fix" it by publishing the path | §6.5.1; §10.3 A4 |
| `M6` index `lastmod` freezes | **REVISED** — the three index dates derive from content; verified byte-identical today; `UPDATED.blogIndex` marked `REPLACE` and deleted | new **§6.7**; §7.2; §13 P1 |
| `m1` anchor styling / `urlTransform` | **REVISED** — component map spec now cites `:47-52` as well as `:116-145`; `urlTransform` pinned | §6.1; §7.1; §10.2.4 |
| `m2` P1/P2 collide on `prebuild` | **REVISED** — chaining stated in both packages | §13 P1/P2 |
| `m3` `/security-review` isn't runnable | **REVISED** — machine-checkable verify separated from the review gate; outcome recorded as an artifact | §13 P2/P3 |
| `m4` PDF sizes answerable now | **REVISED** — measured (297–696 KB); the Git Data API *blob-size* fallback dropped, 4 MB cap set. *(Unrelated to §6.5.4 adopting the Git Data API for atomicity, which B1 forced.)* | §6.5.4 |
| `m5` `redirect_uri` source | **REVISED** — built from `SITE_URL`, never a request header | §6.5.2 step 3; §13 P2 |
| `m6` numbering drift | **REVISED** — T1–T16 consistent; open questions reordered A–I | §9; §11 |
| `m7` case studies as `.md` with no body | **REVISED** — now `.json` | §6.1; §7.1 |

**One design decision was reversed as a consequence, not as a finding.** §6.5.4 v2 wrote one
file per commit via the Contents API and called the Git Data API "not worth it for 25 items."
B1's ledger makes every editor action touch two or three files, and **no ordering leaves a
valid intermediate state** — ledger-first names a file that does not exist, content-first
leaves a file the ledger does not list, and either way the first commit's build fails. So
writes now go through the Git Data API as one atomic commit. This also removes v2's
PDF-before-record ordering argument and collapses each editor action to a single build,
single revert target.

## Outcome

Rounds used: 1 of 3
Outstanding at exit: **none.** All 3 BLOCKER, 6 MAJOR and 7 MINOR findings revised in plan v3.

Round 2 is not run: the resolutions are mechanical consequences of the findings rather than
new design, and the two that *are* new design — §6.6's ledger and §6.5.4's atomic write —
are each verified by a named E-case (E11, E3) rather than by argument.

**What changed scope.** P1 absorbed four of the fixes (B2 tracing, M2 escaping, M3 Gartner +
industries, M6 index dates) and is meaningfully larger than in v2. P2 changed shape (`.mjs`
auth core, proxy exemptions) without growing much. P3 gained the ledger semantics and lost
the PDF-ordering logic.

**Still open at the gate — unchanged from v2, none introduced by this review:** open
questions A (who edits), E (HubSpot subscription), G (final admin path), H (Google Cloud
project / Workspace Internal consent), I (secret rotation owner). G and H still block P2;
I still blocks P3.

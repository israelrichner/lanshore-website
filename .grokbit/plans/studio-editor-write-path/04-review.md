# Plan review — studio-editor-write-path (P3)

Append-only. No subagents, so the design was re-read from disk and attacked deliberately.

---

## Round 1 — against `03-design.md`

### BLOCKER B1 — `publishedOnce` would leak into the public RSC payload and break P1's parity

Fork 3 adds a durable `publishedOnce` flag to solve the "was this ever published?" problem. As specified it is a **live regression**, and the mechanism is verified, not theorised:

1. `loadCaseStudies` (`src/lib/content/loadContent.ts:172-185`) strips **only** `draft` — `const rest = {...data}; delete rest.draft;` — and spreads everything else into `CaseStudyRecord`.
2. `src/app/case-studies/page.tsx:56` passes the whole `CASE_STUDIES` array to `<CaseStudyGrid studies={...}/>`.
3. `CaseStudyGrid` is `"use client"` (`:1`), so **every field of every study is serialised into the RSC payload**.
4. Confirmed against P1's golden capture: `legacyUrl` and `whatWeDid` both appear in `/case-studies`, and neither is rendered.

So the first time an editor presses Publish, `/case-studies` changes bytes — breaking the byte-identical parity P1 spent its entire verification budget establishing.

This is precisely the `mentionsGartner` regression from P1, which also came from a new field flowing somewhere nobody traced.

**Resolution:** `loadContent.ts` gains an explicit **admin-only field list** (`draft`, `publishedOnce`) stripped from **all three** collections, not just `draft` from case studies. `loadBlog` and `loadWhitePapers` build records field-by-field today and are incidentally safe, but the rule must be explicit and shared or the next admin-only field repeats this exactly. A test asserts no admin-only key survives into a public record.

### BLOCKER B2 — the admin's read path is unspecified, and the obvious choice is wrong

The design says conflict detection compares "the blob `sha` the editor loaded". It never says **where the editor loads from**, and both plausible answers fail differently:

- **From `loadContent`** (local files): there is no blob sha to compare, so per-item conflict detection cannot exist. Worse, local files are whatever the *last deploy* bundled — so for the 1–3 minutes between an editor's commit and Vercel finishing, the admin shows **stale content and stale ledger state**. An editor who publishes and immediately re-opens the item sees their own change missing.
- **From the GitHub Contents API**: correct, but it is a network read on every admin page load, and it must be the source for the **ledger** too, or the ledger the admin mutates is not the ledger at head.

**Resolution:** the admin reads **exclusively** through `getFile()`/`listDir()` against GitHub at head, never through `loadContent`. Stated explicitly in the design, because "just import the loader" is the natural thing to reach for and it silently produces both bugs. The public site keeps reading local files at build time — unchanged.

### MAJOR M1 — PDF upload sits close to two different limits, and they compound

The 4 MB cap is on the file. But the request that carries it to our route is multipart (~4 MB, under Vercel's ~4.5 MB body limit — tight), and the payload we then send to GitHub is **base64, inflating ~33% to ~5.3 MB**.

The plan's measurement (largest current PDF 696 KB) makes this comfortable *today*, and that is the right reason to accept it — but the two limits are different limits and the design conflates them.

**Resolution:** state both explicitly, enforce the 4 MB cap client-side **and** server-side, and note that the binding constraint on the inbound leg is Vercel's body limit, not the cap.

### MAJOR M2 — importing `next.config.ts` at request time to get redirect destinations

`03-design.md` says redirect-destination computation is extracted and shared. `scripts/check-content.mjs` gets it by importing `next.config.ts` and calling `redirects()` — fine in a build script.

Doing that **inside a route handler** drags the whole config, including the ~200-entry redirect map, into the serverless bundle, and depends on `next.config.ts` being importable from application code. That is not a documented contract.

**Resolution:** extract the concrete destination slugs **at build time** into a plain `.mjs` the request path imports — or derive them from `content/SLUGS.lock.json` plus a generated list. Either way the request path must not import `next.config.ts`. The extraction task must state which.

### MINOR m1 — commit author email will not link to a GitHub account

Commits are authored with the editor's **Google** email. Git accepts any author, so this works, but the commit will show as an unlinked author on GitHub rather than a profile, and `git shortlog` will treat it as a distinct identity.

That is acceptable — the audit trail is the point, not the avatar — but it should be a stated consequence rather than a surprise.

### MINOR m2 — `check:content` is the backstop, and P3 makes it reachable by a non-developer

Pre-flight validation means an editor sees a form error. But if pre-flight and build-time validation ever diverge, the failure mode moves from "inline error" to "Vercel failure email to someone who cannot read it".

**Resolution:** the pre-flight must call `checkLedger()` and `VALIDATORS` — the *same* exports `check-content.mjs` uses — and a test must assert both paths reject the same fixture.

---

## Round 1 — Architect response

All six accepted.

- **B1** — shared admin-only field list stripped in all three loaders, with a test asserting no such key reaches a public record.
- **B2** — the admin reads exclusively via GitHub at head; stated in the design and in the task notes.
- **M1** — both limits stated; cap enforced on both sides.
- **M2** — destinations extracted to `.mjs`; the request path never imports `next.config.ts`.
- **m1** — recorded as a stated consequence in `docs/CONTENT-EDITING.md`.
- **m2** — pre-flight and build gate share exports; a test pins that they agree.

---

## Round 2 — re-review

- B1 — **resolved.** The fix is broader than the finding (all three collections, shared list), which is correct: the specific bug was one instance of a general hazard.
- B2 — **resolved**, and the stale-read failure mode is now written down where an implementer will hit it.
- M1, M2, m1, m2 — **resolved.**

**Zero BLOCKER, zero MAJOR outstanding.** Loop 3 exits at round 2 of 3.

### Residual carried to `assumptions.md`

- GitHub's Git Data API remains `UNVERIFIED` (A1). Unit tests pin our payloads and our handling of documented responses; they cannot prove GitHub accepts them.
- No React component tests, consistent with §10.6. The editor forms are verified only by build, lint, types, and the owner's manual pass.

---

## Round 3 — Reviewer pass over `plan.md`

Coverage: every design element maps to a task — Fork 1 → T2/T3, Fork 2 → T6, Fork 3 → T4, atomic commit → T3, ledger buttons → T4, pre-flight → T5, dispositions all land (placeholder dashboard → T7 with `removes:`, `requireAdminRoute` → T6, destinations → T1, `content-rules` reused not rewritten → T5). B1 → T0, B2 → T2, M1 → T9, M2 → T1.

### MAJOR M3 — B1's fix must land BEFORE anything writes `publishedOnce`

`plan.md` ordered the loader fix (T0) after the ledger work. If any task writes a `publishedOnce` field before the loaders strip it, the parity break is live in the interim — and the golden-diff check at the end would attribute it to whichever task happened to run last.

**Resolution:** the loader fix is **T0**, first, before any writer exists. Its verify is the golden diff itself, run while nothing yet produces the field — proving the strip is in place ahead of need rather than alongside it.

### MINOR m3 — the delete-refusal test needs a fixture that was published then unpublished

The dangerous case is Publish → Unpublish → Delete, which option C would have let through. A test that only covers "currently published" would pass against the broken implementation.

**Resolution:** T4's tests include that exact three-step sequence explicitly.

---

## Round 3 — Architect response

Both accepted. T0 reordered to first; m3's sequence named in T4's verify.

**Zero BLOCKER, zero MAJOR outstanding across design and plan.**

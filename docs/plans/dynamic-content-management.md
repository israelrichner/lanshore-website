# Dynamic Content Management — Blogs, Case Studies, White Papers

- **Status:** Plan v3 — **review findings resolved 2026-08-26**; ready to implement (P1 unblocked)
- **Date:** 2026-08-13 · **Revised:** 2026-08-26 (v2 direction, v3 review response)

> **v3 revision note — adversarial review response.** `docs/plans/dynamic-content-management.review.md` (Round 1) raised **3 BLOCKER, 6 MAJOR, 7 MINOR** findings against v2. Every one is resolved in this revision; the review log carries the per-finding disposition. The three blockers were all cases where the feature's primary path broke while `npm run build` stayed green:
>
> - **B1 — the slug lock failed the build on Publish/Unpublish/Delete.** §10.1's parity check demanded set *equality* against `SLUGS.lock.json` while §6.3 excluded drafts from the loaded arrays, so the only editor action that passed the gate was the one that published nothing. **Fixed:** the lock is now a *subset* invariant over all content files (not the draft-filtered arrays), plus a `retired[]` list the admin maintains. §6.6 is new and specifies it end to end.
> - **B2 — `node:fs` loaders broke the white-paper download at runtime.** `src/app/api/whitepaper/route.ts:3` is a POST handler running in a Vercel function, not at build time; the `content/` directory is not traceable by `@vercel/nft`, so the loader would have thrown at module init inside the lambda while the build passed. **Fixed:** §6.2 adds `outputFileTracingIncludes`, §7.2 corrects the "no `next.config.ts` change" claim, and §10.2 moves that verification onto a deployed preview (local `next start` reads the real filesystem and would have passed).
> - **B3 — the proxy 404'd the sign-in page.** **Fixed:** §6.5.3 now names the exempt paths explicitly.
>
> The majors changed P1's scope in three places (Markdown escaping §8, the two missed consumers §3.2, index `lastmod` §6.7) and retired the "zero new dev dependencies" phrasing around `node --test` (§10.4) in favour of authoring the auth core as plain `.mjs`. Counts are corrected throughout: **14 case studies, 24 items** — not 15/25.

> **v2 revision note.** The owner chose to build the editor **as an admin section of this site** rather than adopt a third-party CMS UI. Sign-in is **Google OAuth**, access is restricted by an **email allowlist in env vars**, and the admin is **unlinked from the public site** (URL-only entry). Two of the three open questions are now decided:
>
> - **Open Question B (which editor UI)** → **RESOLVED: none of them.** We build `/studio` in-app. §6.5 is rewritten; Pages CMS / Keystatic / Tina are retained in §15 only as the record of what was compared.
> - **Open Question C (one build per publish)** → **RESOLVED: accepted.** Publish commits content files to `main` via the GitHub API; Vercel rebuilds. The public site keeps **zero runtime data dependencies**, so §12's hosted-CMS design stays an appendix.
> - **Open Question D (Markdown vs `blocks[]`)** → **Markdown**, as recommended.
>
> §§1–4 (the Vercel/HubSpot research and current-state inventory) are unchanged and still the record of *why not HubSpot*. §5 onward reflects the in-app admin.
>
> **What did NOT change:** content still lives in the repo as files, the loaders still keep their exported API, the public site still reads content at build time, and every SEO/GEO behavior is still expected to survive byte-for-byte. The admin replaces the *editor UI* only — it does not change where content lives or how the public site reads it.
- **Repo:** `lanshore-web` — Next.js **16.2.10** (App Router, `src/app`), React 19.2.4, Tailwind v4, deployed on Vercel
- **Asked by:** site owner — *"We want to update Blogs, Case Studies and White Papers without having to do git commits and redeploy on Vercel. If Vercel offers this functionality we can do it there, or we also have HubSpot. What is the best way to allow dynamic content management?"*
- **Related plans:** `docs/plans/hubspot-expansion.md` (HubSpot Starter feature build-out), `docs/plans/geo-audit.md` (GEO/SEO health — the bar this plan must not lower)

---

## 1. The direct answer, up front

**Does Vercel offer a CMS? No.** Vercel has no first-party content-management product. Its own docs describe CMS support as *integrations with third-party platforms*: "Vercel Content Management System (CMS) Integrations allow you to connect your projects with CMS platforms, including Contentful, Sanity, Sitecore XM Cloud and more" ([Vercel CMS Integrations](https://vercel.com/docs/integrations/cms)). The Marketplace CMS category lists only third-party products (Contentful, Sanity, DatoCMS, Builder.io, Storyblok, etc.) ([Vercel Marketplace — CMS](https://vercel.com/marketplace/category/cms)). What Vercel *does* provide is the glue: environment-variable import, **Draft Mode** through the toolbar, and **Edit Mode / Content Link** (click a rendered element, jump to the CMS field) — the latter available on **Pro and Enterprise plans** and only for CMSes that emit content source maps (Contentful, Sanity, Builder, TinaCMS, DatoCMS, Payload, Uniform, Strapi) ([Vercel Edit Mode](https://vercel.com/docs/edit-mode)). Vercel's own storage products (Blob, Edge Config) are infrastructure, not editorial tools. **So "just do it in Vercel" is not an option.**

**Can HubSpot do it? Partly — and the part it can't do is the expensive part.**

- **Blog posts: yes, on any tier.** The HubSpot blog tool is supported on "all products and plans" ([HubSpot KB — Create and publish blog posts](https://knowledge.hubspot.com/blog/create-and-publish-blog-posts)), and the CMS Blog Posts API (`GET /cms/v3/blogs/posts`, `GET /cms/v3/blogs/posts/{postId}`, plus separate `/draft` endpoints and `push-live`) can serve them to an external Next.js frontend; it needs the `content` OAuth/private-app scope ([HubSpot CMS Blog Posts API](https://developers.hubspot.com/docs/reference/api/cms/blogs/blog-posts)).
- **Case studies and white papers: not on the current subscription.** These are *structured* records (client, industry, pillar, quantified results, tech stack, PDF file, HubSpot property value) — not blog articles. In HubSpot the structured-content tools are **HubDB**, which requires **Content Hub Professional or Enterprise** to drive pages ([HubSpot HubDB docs](https://developers.hubspot.com/docs/cms/data/hubdb); the [Content Hub pricing page](https://www.hubspot.com/pricing/content) shows HubDB excluded from Free and Starter), and **custom objects**, which are **Enterprise-only** across every hub ([HubSpot KB — Create custom objects](https://knowledge.hubspot.com/object-settings/create-custom-objects)). Content Hub list pricing as read on 2026-08-13: Free $0, **Starter $7/seat/mo**, **Professional $450/mo** (3 seats), **Enterprise $1,500/mo** (5 seats); Free/Starter are limited to **one blog and 100 posts** with HubSpot branding, Pro/Enterprise get multiple blogs and 10K posts ([hubspot.com/pricing/content](https://www.hubspot.com/pricing/content)).
- The workaround — cramming case studies and white papers into the single Starter blog as tagged posts — **destroys the structured fields** that this site's JSON-LD depends on (`results[]` → `Article.abstract`, `stack[]` → `mentions[]`, `industry`/`pillar` → `about[]`; see `src/lib/schema.ts:254-292`). That is a direct hit to the GEO posture `docs/plans/geo-audit.md` documents as "strong". **Not recommended.**

**The decision** (details in §5–§6): keep the content **in this repo**, in plain Markdown/JSON files, and build the editor **into this site** as an unlinked admin section at `/studio`, gated by Google sign-in against an env-var email allowlist. An editor opens the URL, signs in with their Google account, edits in a browser form, and clicks Publish; the app commits the content file to `main` through the GitHub API and Vercel redeploys (~1–3 min, to be measured). The editor never touches git, GitHub, GitHub Desktop, or Vercel. Nothing about the site's SEO machinery, build-time safety, or cost changes — every public **page** still reads content **at build time** and makes **no network calls at runtime**, so no CMS, database, or API outage can ever empty `/blog`. (Precisely stated: *pages* have no runtime data dependency. One route handler, `src/app/api/whitepaper/route.ts:3`, imports the white-paper registry and runs in a serverless function — it reads the same repo files from its own bundle, still with no network call, but it requires the file-tracing config in §6.2. That distinction was wrong in v2 and is the subject of review finding B2.) If instant, build-free publishing later becomes a hard requirement, §12 specifies the escalation path (Sanity + ISR + webhook revalidation) as a separate, larger project.

**Why an in-app admin instead of the third-party CMS UI v1 recommended:** the owner wants sign-in on the company's own Google identities, no third-party product holding write access to the repo, and full control of the editing surface. The cost is that we now own ~600 lines of auth + editor code that Pages CMS would have given us free; the benefit is no external vendor in the publishing path and no GitHub App installed by a third party. Because the *content format* is unchanged, this is still reversible: the files a third-party CMS would have edited are the same files our admin edits.

---

## 2. Goal & non-goals

**Goal.** A non-developer at Lanshore can create, edit, and unpublish **blog posts**, **case studies**, and **white papers** (including uploading the PDF) through a browser UI, with no git commands, no local dev environment, and no developer in the loop — while every current SEO/GEO behavior (canonicals, OG, JSON-LD, honest `lastmod`, `llms.txt`, redirects, slugs) survives byte-for-byte except where content itself changed.

**Non-goals (explicit).**

- **Not migrating the rest of the site.** Services, pillars (`/agentic-spm/*`), SPM platform pages, industries, glossary, home, about, careers, contact, privacy stay exactly as they are (typed modules in `src/lib/`). Only `blog`, `caseStudies`, and `whitePapers` move.
- **Not moving the site to HubSpot CMS / HubSpot-hosted pages.** `docs/plans/hubspot-expansion.md:44` already ruled this out; this plan does not reopen it.
- **Not changing any URL.** Every existing slug is preserved (§8). No new redirects should be needed.
- **Not changing the lead-capture design.** White papers keep the HubSpot Forms v3 gate (`src/app/api/whitepaper/route.ts`, `src/components/WhitePaperGate.tsx`) and the `hutk` attribution chain.
- **Not adding a visual page builder,** drag-and-drop layout editing, or per-page design control. Editors edit *content*, not layout.
- **Not building a general-purpose auth system.** One provider (Google), one role (editor), no self-registration, no password reset, no invitations, no user table, no account linking. Access is granted by adding an email to an env var and redeploying. If the site ever needs real user accounts, this is not the foundation to grow.
- **Not making the admin path a security control.** The unlinked URL is convenience and noise-reduction; the *control* is Google OAuth + the allowlist. The plan assumes the path will eventually be discovered and must hold anyway.
- **Not editing the site's other content through the admin.** Services, pillars, industries, glossary, `contentDates.ts`, navigation, and copy outside the three collections stay developer-owned.
- **Not building a hosted-CMS integration in this pass** (fetch layer, webhook revalidation, draft mode against a remote API). That design is specified in §12 as the named alternative but is out of scope unless Decision 1 flips.
- **Not adding a test *framework*.** The repo has none (§3.6) and no third-party runner is introduced. **Amended in v2:** the admin is a security boundary, and shipping one into a repo with zero automated verification is not defensible, so P2 adds `node --test` (built into Node, **no new packages**) covering the auth logic only — see §10.4. This is a deliberate, bounded exception, not the start of a test suite for the site. **Corrected in v3 (review M1):** `node --test` cannot load `.ts`, and type stripping does not resolve this repo's `@/*` path alias — so the auth *core* is authored as plain `.mjs` with relative imports and the `.ts` modules are thin re-export wrappers. The "no new packages" property is real only because of that choice; it is not free (§10.4).

---

## 3. Current state (verified in-repo 2026-08-13; re-verified and corrected 2026-08-26 — see §15)

### 3.1 Where the three content types actually live

All three are **hand-authored TypeScript modules** imported directly by server components — there is no `src/content`, no MDX, no data layer, no CMS of any kind.

| Type | Source of truth | Count | Shape |
|---|---|---|---|
| Blog | `src/lib/blog.ts` (`BLOG_POSTS`, `src/lib/blog.ts:24`; `getPost`, `src/lib/blog.ts:1025`) | 5 posts | `src/lib/blog.ts:5-22` |
| Case studies | `src/lib/caseStudies.ts` (`CASE_STUDIES`, `:18`; `getCaseStudy`, `:299`) | **14 studies** | `src/lib/caseStudies.ts:4-16` |
| White papers | `src/lib/whitePapers.ts` (`WHITE_PAPERS`, `:34`; `getWhitePaper`, `:86`) | 5 papers | `src/lib/whitePapers.ts:13-21` |

**Total: 24 items** (5 + 14 + 5). *v2 said 15 case studies and 24→"25" items throughout; that was wrong (review M4) and had propagated into `SLUGS.lock.json`'s description and into P1's verify criterion. Corrected everywhere in v3. `next.config.ts`'s `CASE_STUDY_REDIRECTS` has **13** unique destination slugs, so one of the 14 studies has no legacy URL — that is expected, not a gap.* Nothing downstream should hardcode the count: `check-content` derives it from `SLUGS.lock.json` (§10.1).

**Exact field inventory** (every field must be mapped or explicitly dropped):

```
BlogPost (src/lib/blog.ts:7-22)
  slug            string   — URL segment; also a redirect target in next.config.ts:72-78
  title           string
  description     string   — meta description + OG description + BlogPosting.description
  dateModified    string   — YYYY-MM-DD; visible byline, BlogPosting.dateModified, sitemap lastmod
  faq?            FaqItem[]— {question, answer}; FAQPage schema, must mirror visible content
  blocks          BlogBlock[] — {type: "h2"|"h3"|"p"|"li", text}
  (deliberately NO datePublished, NO author Person, NO hero image, NO tags — see src/lib/schema.ts:199-212)

CaseStudy (src/lib/caseStudies.ts:4-16)
  slug, title, client, industry, outcome, challenge, whatWeDid
  pillar          "Executive Dashboards" | "SPM Operations" | "Custom Apps" | "Services"  (enum; joins PILLARS)
  results         string[]  — the site's only quantified claims; becomes Article.abstract
  stack           string[]  — becomes schema `mentions[]`
  legacyUrl       string    — provenance only; not rendered
  (no per-study date — all share UPDATED.caseStudies, src/lib/contentDates.ts:23)

WhitePaper (src/lib/whitePapers.ts:13-21)
  slug, title, description
  file            string  — MUST match /^\/whitepapers\/[a-z0-9][a-z0-9-]*\.pdf$/ AND equal `/whitepapers/${slug}.pdf`
                            (enforced at module load, src/lib/whitePapers.ts:24-32, 77-84 — throws, i.e. fails the build)
  hubspotValue    string  — matches an option of the HubSpot dropdown contact property `whitepaper_requested`
                            (currently identical to `slug` for all 5 entries)
  PDFs: public/whitepapers/*.pdf (5 files present)
```

### 3.2 Routes and everything downstream of the content

- **Blog list** `src/app/blog/page.tsx` — static `metadata` (`:8-22`), `blogSchema()` + `breadcrumbSchema()` + `itemListSchema()` over all posts (`:27-43`), renders title/`dateModified`/description cards.
- **Blog detail** `src/app/blog/[slug]/page.tsx` — `generateStaticParams` (`:10-12`), `generateMetadata` with canonical + OG `type: "article"` (`:14-35`), `BlogPosting` + `BreadcrumbList` + conditional `FAQPage` JSON-LD (`:91-99`), bespoke block renderer with `groupBlocks`/`linkify` (`:37-78`, `:116-145`), pillar cross-links (`:147-161`), env-gated newsletter form (`:163-173`).
- **Case-studies list** `src/app/case-studies/page.tsx` — `itemListSchema` (`:32-41`) + client-side industry filter in `src/components/CaseStudyGrid.tsx` (renders `industry`, `client`, `outcome`).
- **Case-study detail** `src/app/case-studies/[slug]/page.tsx` — `generateStaticParams` (`:10-12`), `generateMetadata` using `outcome` as the description (`:14-35`), `caseStudySchema({...study, dateModified: UPDATED.caseStudies})` (`:50`), sections for challenge / whatWeDid / results / stack, pillar-derived related link (`:46`, `:96-118`).
- **White papers** are surfaced only on `/resources` (`src/app/resources/page.tsx:123-155`) through `WhitePaperGate`; the download itself is server-validated against the registry in `src/app/api/whitepaper/route.ts:18-21` and returned as `{ ok: true, url: paper.file }` (`:57`).
- **`/resources` duplicates the blog list in a hardcoded local array** — `src/app/resources/page.tsx:24-62` (title/summary/url/featured, *not* imported from `src/lib/blog.ts`). This is already a drift hazard and would become a guaranteed bug the moment a non-developer adds a post. **In scope to fix.**
- **Sitemap** `src/app/sitemap.ts:46-58` — case studies stamped with `UPDATED.caseStudies`, blog posts with their own `post.dateModified`; the file header (`:10-13`) documents *why* honest `lastmod` matters. `src/lib/contentDates.ts:1-35` is the shared date registry.
- **Schema** `src/lib/schema.ts` — `blogPostingSchema` (`:213-235`), `blogSchema` (`:237-249`), `caseStudySchema` (`:254-292`), `itemListSchema` (`:296-315`), `faqSchema` (`:123-133`), `toJsonLd` XSS-safe serializer (`:343-350`).
- **`llms.txt` / `llms-full.txt`** (`src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts`, both `dynamic = "force-static"`) link to `/blog` and `/case-studies` as sections but do **not** enumerate individual posts — so they need no change.
- **Redirects** `next.config.ts:72-78` (5 migrated blog slugs) and `:7-69` (13 legacy case-study URLs → current slugs) hard-code slugs. **Renaming a slug breaks a live 301.**

**Two consumers v2's inventory missed** (review M3) — both are `import`ers of the loaders that no section of v2 mentioned, and both are in scope:

- **`src/components/Footer.tsx:8,23` — the Gartner trademark gate.** `GARTNER_PATHS` is computed as `...BLOG_POSTS.filter((p) => JSON.stringify(p).includes("Gartner")).map((p) => `/blog/${p.slug}`)`. Blog posts do mention Gartner (5 occurrences in `src/lib/blog.ts`), so this branch is live. `src/lib/site.ts:12-21` makes the attribution mandatory on any page that mentions Gartner, under an explicit no-reprint-license constraint. **This is the single most fragile coupling the migration touches:** the detection works today only because `blocks[]` is part of the serialized post object, and this plan replaces `blocks[]` with a Markdown body. If the body does not survive on the object, the required disclaimer silently stops rendering. §6.8 replaces the heuristic outright.
- **`src/app/industries/[slug]/page.tsx:7,45` — `getCaseStudy(industry.caseStudySlug)`.** Guarded by `study && …` (`:46`), so a missing study degrades to a dropped cross-link rather than a crash. But it means an industry page silently loses its case-study link when an editor deletes or unpublishes the wrong study, and nothing today ties `INDUSTRIES[].caseStudySlug` to a live slug. `check-content` gains that assertion (§10.1.7), and the industries routes join the golden-diff capture set (§10.2).

### 3.3 Rendering model — the decisive constraint

`next.config.ts` has **no `output: "export"`**. The app is a normal server-rendered/prerendered Next.js app on Vercel. Consequences:

- **ISR and on-demand revalidation are available** if we ever want them — this is *not* a static-export site. (Confirmed against the bundled Next 16.2.10 docs: `node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration.md` — ISR requires the Node runtime and is unsupported only for static export.)
- **`cacheComponents` is not enabled** (no such key in `next.config.ts`), so the *previous* caching model applies: `export const revalidate`, `fetch(..., { next: { tags } })`, `unstable_cache`, and `revalidateTag`/`revalidatePath` callable from a Route Handler (`node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration.md:282-398`). `draftMode()` is async in 15+ (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/draft-mode.md:41-47`).
- Every content **page** today is fully prerendered at build with zero runtime data access, which is why the site currently cannot fail at runtime because of content. **But `src/app/api/whitepaper/route.ts` is not a page** — it is a POST handler, so it runs in a serverless function on every gated download and it imports `getWhitePaper` from the registry (`:3`). Today that is harmless (the registry is a TypeScript array compiled into the bundle). The moment the registry becomes a filesystem read, that route needs the `content/` files **inside its function bundle**, which Next's output file tracing will not infer on its own. This is review finding B2 and it is handled in §6.2.
- **Full importer list for the three loaders** (`grep` over `src/`, verified): `src/app/api/whitepaper/route.ts:3` (runtime), `src/app/blog/page.tsx:6`, `src/app/blog/[slug]/page.tsx:8`, `src/app/case-studies/page.tsx:5`, `src/app/case-studies/[slug]/page.tsx:7`, `src/app/industries/[slug]/page.tsx:7`, `src/app/resources/page.tsx:6`, `src/app/sitemap.ts:5,7`, `src/components/Footer.tsx:8` — plus two **type-only** importers, `src/components/CaseStudyGrid.tsx:5` and `src/components/WhitePaperGate.tsx:5`. Exactly one of the value importers is a runtime consumer. Any new value importer in a route handler inherits the same tracing requirement.
- `images.remotePatterns` allows **only `img.youtube.com`** (`next.config.ts:173-175`) — any externally hosted CMS image domain must be added there.
- `src/proxy.ts:9` noindexes non-canonical hosts (previews are safe from indexing).

### 3.4 Existing HubSpot integration

Portal **6603479**, region **NA2**, subscription **Starter** (per `docs/plans/hubspot-expansion.md:6`). Live surface: tracking loader (`src/components/HubSpotLoader.tsx`), Forms v3 proxy (`src/lib/hubspot.ts:46-80`), four server routes (`src/app/api/{contact,newsletter,careers,whitepaper}/route.ts`), portal ID constant (`src/lib/hubspot-config.ts:5`), cookie consent (`src/components/CookieSettingsButton.tsx`), meetings embed. Env contract in `.env.example`. **No HubSpot CMS/HubDB/custom-object usage anywhere.** `docs/plans/hubspot-expansion.md:44,48` explicitly scopes out HubSpot CMS hosting and states "all content stays file-based in `src/lib/*.ts`".

### 3.5 SEO/GEO surface that must survive

`src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/schema.ts` (Organization/WebSite/LocalBusiness/Blog/BlogPosting/Article/ItemList/FAQPage/BreadcrumbList), per-page `alternates.canonical` + `openGraph`, `src/app/opengraph-image.tsx` (site-wide OG image; no per-post images today), `llms.txt`, `llms-full.txt`, and the 301 map in `next.config.ts`. `docs/plans/geo-audit.md:27-31` records the site as being in "strong GEO health" with "no blockers" — this plan's job is to keep it there. There is **no RSS feed** today (not a regression risk; optional future add).

### 3.6 Deployment / CI reality (AGENTS.md's claim verified)

- `package.json:5-10` — `dev`, `build`, `start`, `lint`. **No test script, no test framework in `devDependencies`.** AGENTS.md's "Unit tests: NONE / Coverage: NONE / Regression: NONE" is accurate.
- **No `engines.node`, no `.nvmrc`** (verified). The Vercel build therefore runs whatever Node major Vercel currently defaults to, and local dev here is v22.20.0 with `@types/node: ^20`. This did not matter while `npm run build` was the only gate. It matters the moment `prebuild` runs Node scripts and tests (§10.4, review M1), so **P1 pins `engines.node`** — an unpinned major is a deploy that fails on a day nobody changed anything.
- **No `vercel.json`**, no `.github/` workflows. Deploys are Vercel's default git integration.
- `scripts/githooks/pre-commit` + `scripts/prepare_commit_metrics.py` exist for VERSION/token-ledger bookkeeping — **not** a quality gate.
- `npm run build` (plus `npm run lint`) is the only automated gate that exists. `docs/plans/geo-audit.md:180-182` set this precedent explicitly.
- Runtime dependency count is deliberately tiny (`next`, `react`, `react-dom`, `lucide-react`), and `docs/plans/hubspot-expansion.md:49` states "No new npm dependencies" as a project value. This plan adds three small ones and justifies them (§6.2).

### 3.7 Who edits — unknown, and it matters

Nothing in the repo identifies an editorial owner: `README.md` is untouched `create-next-app` boilerplate, `docs/USER_GUIDE.md` and `docs/WORKFLOW.md` are agentic-template docs, and git history shows a single committer. `docs/plans/hubspot-expansion.md:4` names **Doug Erb (business decisions)** and **Israel Richner (implementation)**, which suggests the intended editor is Doug or a marketing colleague, not a developer. **See Open Question A** — the answer changes how much editorial polish is worth paying for.

---

## 4. Options considered

| | **A. Git-backed content files** — v1: third-party CMS UI; **v2 CHOSEN: in-app admin (§6.5)** | **B. Hosted headless CMS** (Sanity) | **C. HubSpot as CMS** (Blog API + HubDB) | **D. Status quo** (dev edits TS) |
|---|---|---|---|---|
| **Who can edit** | Anyone with a browser + invite; no git knowledge | Anyone with a browser | Anyone already in HubSpot | Developer only ❌ |
| **Publishing mechanics** | Editor clicks Publish → CMS commits to `main` → Vercel auto-deploys (~1–3 min, to measure) | Editor clicks Publish → webhook → `revalidateTag` → live in seconds, no build | Publish in HubSpot → webhook/ISR → live | Commit + push |
| **Long-form editorial UX** | Markdown WYSIWYG, image upload to repo | Best in class (rich text, image CDN, crop/hotspot) | Good for blog posts; **bad** for structured records | n/a |
| **Structured fields** (client, industry, pillar, results[], stack[]) | Native — typed schema, same fields as today | Native | ❌ Needs HubDB = **Content Hub Pro $450/mo**, or custom objects = **Enterprise** | Native |
| **Cost/mo at this scale** | **$0** (Pages CMS & Keystatic MIT-licensed; Tina free ≤2 users) | $0 on Free (public dataset only) or **$15/seat** Growth | **$450+** for the structured half | $0 |
| **Preview / drafts** | `draft: true` front matter + branch → Vercel preview URL | Draft Mode + Presentation tool (mature) | Draft endpoints exist; no native preview for external frontends | n/a |
| **SEO/JSON-LD fidelity** | **Unchanged** — same typed objects reach `schema.ts`; sitemap/`llms.txt` untouched | Preserved, but every read path must be rewritten and re-verified | **Lossy** for case studies/white papers unless HubDB | Baseline |
| **Gated white papers + lead capture** | Unchanged (HubSpot Forms v3 gate stays); PDF stays same-origin, keeps `src/lib/whitePapers.ts:24-32` validation | PDF moves to CMS CDN → same-origin check must be relaxed | HubSpot Files + forms is a genuine structural fit **for this one type** | Baseline |
| **Build-time failure risk** | **None** — content is in the repo; a bad edit fails the *deploy*, prod keeps serving the last good build | Real — CMS outage/500 during build ⇒ failed build or empty list pages; needs fallback design | Real, plus HubSpot API rate limits | None |
| **Migration effort** | Moderate: script-convert 24 items, rewrite 3 loaders, 1 renderer, rewire 1 page | High: schemas + import + rewrite 6 read sites + fetch layer + webhook + draft mode | High and partly blocked by tier | — |
| **Lock-in / exit cost** | **Zero** — content is MD/JSON in our repo; swap the editor any time | Export + rewrite reads | High (content in HubSpot; export is HTML) | Zero |
| **Vercel-native?** | Yes (git integration) | Yes (Marketplace, Edit Mode on Pro) | Not integrated | Yes |

Rejected without deep analysis, with reasons: **Contentful** — free tier exists but the first paid tier is widely reported around $300/mo+ (*price unverified this session — contentful.com/pricing returned HTTP 429*), far past this site's needs; **Storyblok** — free plan is **1 seat / 1 space**, first paid plan **$99/mo** for 5 seats ([storyblok.com/pricing](https://www.storyblok.com/pricing)), so a second editor costs $99/mo; **Payload** — excellent, but self-hosting a Node CMS + database is a new operational surface for a 4-dependency marketing site with no ops team.

---

## 5. Recommendation

**Move the three content types out of TypeScript modules into repo-native content files (Markdown + JSON) under `content/`, keep the existing typed loaders' public API, and build an unlinked, Google-authenticated admin section into this site that commits those files through the GitHub API so a non-developer publishes from a browser.**

### Why this over the main alternative (hosted headless CMS)

1. **The failure mode we most need to avoid disappears.** A marketing site must never fail its build or serve an empty `/blog` because an API call 500'd. With content in the repo there is no build-time network dependency at all — the class of bug simply does not exist. With a hosted CMS it must be actively engineered around (cached fallbacks, non-empty assertions, retry) and it will still be the thing that eventually breaks at 2am.
2. **The SEO/GEO surface survives untouched.** `sitemap.ts`, `schema.ts`, `llms.txt`, `llms-full.txt`, `robots.ts`, and every `generateMetadata` keep consuming the *same shaped objects* from the *same module paths*. `docs/plans/geo-audit.md` documents a site in strong health with metadata fidelity as a hard requirement; the smallest-blast-radius change is the one that doesn't rewrite ten read paths.
3. **Scale says so.** 5 posts + 14 case studies + 5 white papers, edited maybe monthly. A per-seat SaaS CMS and a webhook revalidation pipeline is machinery for a content operation that does not exist yet.
4. **Cost and lock-in are zero, and the decision is reversible.** The consequential choice here is the **content format**, not the editor. Because the content lands as plain Markdown/JSON in our own repo, swapping our admin → Pages CMS → Keystatic → (eventually) Sanity costs a migration script, not a rebuild. That reversibility is what makes it safe to build a small editor now.
5. **It matches this repo's grain.** Typed content modules, build-time assertions that throw (`src/lib/whitePapers.ts:26-32`), honest hand-maintained `lastmod` dates, near-zero dependencies. Keeping content in-repo is the conventional pattern *for this codebase*; a runtime CMS would be the new pattern needing justification.

### What the owner gives up, honestly

- **Publishing still produces a git commit and a Vercel deploy.** The difference is that the *admin* does both, from a browser, with no developer and no local tooling. Latency is one build (~1–3 min; measure `npm run build` locally to set the expectation) instead of seconds.
- **A bad edit fails the deploy** rather than half-publishing. The live site keeps serving the last good build — safe, but the editor must be told where to see "deploy failed" (Vercel notification email; §6.5.7).
- **Renaming an existing slug remains a developer task** (it must be paired with a 301 in `next.config.ts:7-78`). The admin makes the slug field read-only after creation. **So does *deleting* anything that was ever published** — the admin offers Unpublish instead, for the same reason (§6.6). Removing content is self-service; removing a *URL* is not.
- **Adding a *new* white paper still touches HubSpot once** — the `whitepaper_requested` property needs the new option value, unless the owner switches that property to free-text (recommended; §7.4).
- **We now own auth code.** Roughly 600–800 lines of admin (OAuth callback, session cookie, editor forms, GitHub write layer, slug ledger) that a third-party CMS would have provided — the upper end after v3 added the ledger (§6.6) and the atomic Git Data API write path (§6.5.4). It is a security boundary in a repo with no test runner, which is why §10.4 specifies auth checks as the one place this plan does add executable tests.
- **Granting access requires a deploy.** The allowlist is an env var, so adding an editor means editing it in Vercel and redeploying. For a 1–3 person editorial team that is the right trade (no user table, no invite flow); at ~5+ editors it stops being.
- **Two secrets now exist that did not before** — a GitHub write token and a session-signing secret. They need a rotation owner and a rotation date (§9).

### The named escalation path

If, after living with it, "instant publish, no rebuild" or "multiple editors with rich media and scheduled publishing" becomes a real requirement, §12 specifies the Sanity + ISR + webhook design as a separate project. The repo-native content files convert to Sanity documents with a script; no content is lost.

---

## 6. Design detail (recommended path)

### 6.1 Content layout

```
content/
  blog/<slug>.md                 # YAML front matter + Markdown body
  case-studies/<slug>.json       # structured record — no prose body (see note)
  white-papers/<slug>.json       # small structured record
  SLUGS.lock.json                # slug ledger + retired[] — see §6.6
public/whitepapers/<slug>.pdf    # unchanged location (same-origin gate stays valid)
public/images/blog/<file>        # NEW: optional post images, committed by the admin
```

*Case studies are `.json`, not `.md` (review m7).* v2 stored them as Markdown files whose every field lived in front matter and whose body was "optional" and unused — `challenge` and `whatWeDid` are plain strings rendered into fixed page sections (`src/app/case-studies/[slug]/page.tsx`), not free-form prose. A `.md` file with an always-empty body is an invitation to fill it in and have it silently ignored. JSON also keeps `gray-matter` off this path entirely; only blog posts need front-matter parsing.

**Blog front matter** (1:1 with `BlogPost`, plus two additions):

```yaml
title: "Elevating Sales Performance: The Power of Agentic AI in SPM"
description: "What agentic AI changes in sales performance management…"
dateModified: "2026-07-11"          # required; CMS date widget defaults to today
draft: false                        # NEW — excluded from production builds
featured: false                     # NEW — drives the "Start here" card on /resources
summary: ""                         # NEW, optional — /resources card text; falls back to description
faq:                                # optional; unchanged semantics (must mirror visible body)
  - question: "…"
    answer: "…"
```
Body = Markdown. `blocks[]` is **retired as a storage format** — `h2`/`h3`/`p`/`li` map onto `##`, `###`, paragraphs and `-` lists. **Two corrections from review (M2, m1):**

- The mapping is *not* character-safe as v2 stated it. Ten existing `p` blocks begin with `1. ` … `5. ` and would be re-parsed as ordered-list items. §8 now carries the escaping rules and the round-trip assertion that enforces them. "Scripted, never hand-typed" prevents typos; it does not prevent the Markdown parser reinterpreting the text.
- Bare URLs are *not* automatically equivalent to `linkify`. GFM autolink literals differ from `src/app/blog/[slug]/page.tsx:38-59` in trailing-punctuation handling (`linkify` strips `.,);` and renders the punctuation outside the anchor) and in the preceding-character rule, and `react-markdown` emits a bare `<a>` with none of `linkify`'s attributes. The `<Markdown>` component map must reproduce the **anchor** at `:47-52` — `target="_blank"`, `rel="noopener noreferrer"`, and `className="break-all font-medium text-accent underline hover:text-accent-hover"` — not only the block classes at `:116-145`. Keep `react-markdown`'s default `urlTransform` (it is what rejects `javascript:` hrefs) and pin that in a comment so it is not "simplified" away once editor input flows through it.

**Case-study record** — every existing field kept verbatim (`slug` from filename, `title`, `client`, `industry`, `pillar` as a fixed 4-value select, `outcome`, `challenge`, `whatWeDid`, `results[]`, `stack[]`, `legacyUrl`), plus optional `dateModified` (falls back to `UPDATED.caseStudies` so today's sitemap output is unchanged until an editor actually edits one) and optional `draft`. Because these strings render as plain text into fixed sections, **they are never passed through the Markdown renderer** — no escaping question arises for this collection.

**White-paper record** — `title`, `description`, `file` (`/whitepapers/<slug>.pdf`), optional `hubspotValue` (defaults to `slug`; all 5 current values already equal the slug), optional `draft`. The `file`-shape assertions from `src/lib/whitePapers.ts:24-32,77-84` move into the loader unchanged.

**Nothing is dropped.** `legacyUrl` is retained even though it is not rendered (provenance). `faq` semantics, the deliberate absence of `datePublished`/author-Person (`src/lib/schema.ts:199-212`), and the `pillar` enum all carry over.

### 6.2 Loaders keep the current public API

`src/lib/blog.ts`, `src/lib/caseStudies.ts`, `src/lib/whitePapers.ts` keep exporting **the same names and types** (`BLOG_POSTS`, `getPost`, `BlogPost`, `CASE_STUDIES`, `getCaseStudy`, `CaseStudy`, `WHITE_PAPERS`, `getWhitePaper`, `WhitePaper`) — they just build the arrays by reading `content/**` with `node:fs` at module scope and validating. Every consumer (`sitemap.ts`, both list pages, both detail pages, `/resources`, `api/whitepaper`) therefore keeps working with a **type-only** change or none at all.

Three constraints the implementer must respect:

- **Client components may import only types from these modules.** `src/components/CaseStudyGrid.tsx:5` and `src/components/WhitePaperGate.tsx:5` already use `import type` — they must stay type-only, or `node:fs` lands in the client bundle and the build breaks.
- **Validation throws at module load**, matching today's behavior (`src/lib/whitePapers.ts:77-84`): unknown/missing required field, bad date format, duplicate slug, `file` path not matching the regex or not equal to `/whitepapers/<slug>.pdf`, missing PDF on disk, empty collection. A malformed edit therefore **fails the build loudly** instead of shipping a broken page.
- **The `content/` files must be traced into the serverless function bundle** — review **BLOCKER B2**, and the one thing in this plan that fails in production while every local check passes.

  `src/app/api/whitepaper/route.ts` is a POST handler, so it runs in a Vercel function rather than at build time, and it imports `getWhitePaper` (`:3`). Next's output file tracing (`@vercel/nft`) is static analysis: a `readdirSync(path.join(process.cwd(), "content", "white-papers"))` is not a traceable reference, and `process.cwd()` inside the function is `/var/task`. The failure shape is nasty precisely because it is quiet — **the build succeeds, every page prerenders correctly, and then every gated white-paper download 500s**, because the loader's own throw-on-empty-collection assertion (above) fires at module init inside the lambda. That is the lead-capture path, and it is the exact class of runtime content failure §1 and §5 claim this design eliminates.

  Two acceptable fixes; **P1 implements (a)**:

  **(a) Trace the files.** Add to `next.config.ts`:

  ```ts
  outputFileTracingIncludes: {
    "/api/whitepaper": ["./content/white-papers/**/*"],
  },
  ```

  The bundled Next 16 docs describe this option for exactly this situation — *"There are some cases in which Next.js might fail to include required files … you can leverage `outputFileTracingExcludes` and `outputFileTracingIncludes`"* — with keys as **route globs** matched against the route path and values as **globs resolved from the project root** (`node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md:80-108`). Scope it to the routes that need it rather than globbing `content/**` into every function. Any future *runtime* consumer of a loader must be added here — §10.1.8 asserts that mechanically so it cannot be forgotten.

  **(b) Generate a static manifest.** Have the build emit a plain TS/JSON module from `content/white-papers/**` and have the route import that instead of the fs loader, restoring a genuinely zero-filesystem runtime path. Cleaner in principle, but it adds a build step and a generated artifact for one route; revisit only if a second runtime consumer appears.

  **Neither fix is verifiable locally.** `next start` reads the real repo filesystem and will pass with or without the config. The check has to run against a **deployed Vercel preview** — see §10.2.6.

**New dependencies (3):** `gray-matter` (front-matter parsing), `react-markdown` + `remark-gfm` (render Markdown to React elements with an explicit component map, so today's exact Tailwind classes are reproduced and no `dangerouslySetInnerHTML` is introduced). This knowingly deviates from `docs/plans/hubspot-expansion.md:49` ("no new npm dependencies"); the justification is that Markdown is what makes the editor usable by a non-developer, and `react-markdown`'s component-mapping keeps rendered output identical without an HTML-injection surface. *Alternative if the owner wants zero new deps:* keep the `blocks[]` JSON model and have editors fill a repeating block list in the admin — worse authoring UX, no dependency. (Minor fork, noted in §11 Open Question D.)

### 6.3 Draft handling — simplified in v2

**v1 said:** filter drafts when `VERCEL_ENV === "production"`, so drafts render on preview deployments.

**v2 says: `draft: true` never renders publicly, anywhere — no environment condition at all.** The loader drops draft items unconditionally from `BLOG_POSTS`/`CASE_STUDIES`/`WHITE_PAPERS`, so they are absent from list pages, detail routes (→ 404 via `notFound()`), sitemap, `llms.txt`, and ItemList JSON-LD in every environment including local dev.

This is both simpler and safer, and the in-app admin is what makes it possible:

- **Preview no longer needs a deployment.** The admin renders the draft with the *same* `<Markdown>` component and page chrome in its own preview pane (§6.5.5). Preview is instant and requires no commit, no branch, and no `draftMode()` cookie plumbing.
- **It removes a whole bug class.** A conditional draft filter has an environment in which drafts *do* render; an unconditional one does not. Since drafts commit to `main` (which builds as production), the v1 condition would have meant drafts were invisible everywhere anyway — the condition was dead logic that only created the *impression* of a preview story.
- **Drafts still persist across sessions and devices**, because they are committed to `main` as ordinary files with `draft: true`. An editor can start a post on a laptop and finish it on a phone. The commit is inert: the file exists in git, and no public route reads it.

The one consequence to document for editors: **saving a draft still creates a commit and triggers a rebuild** (which will produce an identical public site). That is wasted CI, not a correctness problem. §6.5.5 mitigates it by keeping in-progress edits client-side and only committing on an explicit **Save draft** or **Publish**.

### 6.4 `/resources` de-duplication

`src/app/resources/page.tsx:24-62`'s hardcoded array is deleted and replaced by a derivation from `BLOG_POSTS` (`featured` flag → the "Start here" full-width card; `summary ?? description` → card text). The current five summaries are preserved by seeding the `summary` field during migration, so the rendered page is byte-identical on day one.

### 6.5 The admin section (v2 — replaces the third-party CMS)

#### 6.5.1 Shape of it

```
/studio                        → dashboard: three collections, item counts, draft badges
/studio/blog                   → list; New / Edit / Delete
/studio/blog/[slug]            → editor form + live preview pane
/studio/case-studies           → list
/studio/case-studies/[slug]    → editor form (structured fields, no Markdown body)
/studio/white-papers           → list
/studio/white-papers/[slug]    → editor form + PDF upload
/studio/signed-out             → the only page reachable without a session

/api/studio/auth/login         → starts Google OAuth
/api/studio/auth/callback      → completes it, sets the session cookie
/api/studio/auth/logout        → clears it
```

**Path.** `/studio` is a placeholder — the owner picks the final segment before P2 starts, and it should *not* be `/admin` (universally scanned by bots). Whatever it is, treat it as **unlisted, not secret**: it will end up in browser history, a bookmark, a Slack message, and eventually somebody's scan. The auth is the control.

**One deliberate anti-SEO decision, stated because it looks like an omission:** we do **not** add the admin path to `src/app/robots.ts` as a `Disallow`. `robots.txt` is world-readable, so disallowing `/studio` would *publish the URL* to precisely the people the owner wants not to have it — the opposite of the requirement. Instead:

1. `src/proxy.ts` sets `X-Robots-Tag: noindex, nofollow` on every `/studio/*` and `/api/studio/*` response. This is strictly stronger than `robots.txt` (which only requests non-crawling; `noindex` forbids indexing) and it leaks nothing.
2. Every admin page exports `metadata.robots = { index: false, follow: false }`.
3. Nothing in the public site links to it — no header, no footer, no sitemap, no `llms.txt`. §10.3 asserts this mechanically.

**Correction from review (M5).** v2 claimed `/api/studio/*` was *additionally* covered by the existing `disallow: "/api/"` rule. **It is not, for the crawlers this site actually cares about.** `src/app/robots.ts:21` emits `{ userAgent: "*", allow: "/", disallow: "/api/" }`, but `:22` then emits nine per-bot rules — `GPTBot`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`, `PerplexityBot`, **`Googlebot`**, `Google-Extended`, `Applebot-Extended`, `cohere-ai` — each `{ allow: "/" }` with **no disallow**. robots.txt is most-specific-wins per user agent (the file's own comment, `:4-5`, says exactly this), so for those nine agents `/api/studio/*` is *allowed*.

This does not open a hole — item 1 above (`X-Robots-Tag: noindex, nofollow`) is a stronger control than a `Disallow` and it applies to every agent. But it means the header is the **only** control on the admin API, not a second one, so §10.3 A4 must verify it on an `/api/studio/*` response rather than assuming it. Do **not** "fix" this by adding `disallow: "/api/studio"` to the AI-crawler rules: that publishes the path, which is the thing item 1 exists to avoid.

#### 6.5.2 Authentication — hand-rolled Google OAuth 2.0

No new dependencies. The full flow, in the order it must be implemented:

**Login** (`GET /api/studio/auth/login`)
1. Generate `state` and `nonce` — 32 random bytes each via `crypto.getRandomValues`, base64url.
2. Store both in a short-lived (10 min) `httpOnly`, `Secure`, `SameSite=Lax`, `Path=/api/studio/auth` cookie. **`Lax` is required, not incidental:** the Google callback is a top-level cross-site GET navigation, which `Lax` permits and `Strict` would silently drop — a `Strict` cookie here produces a login loop that looks like a state-mismatch bug.
3. Redirect to `https://accounts.google.com/o/oauth2/v2/auth` with `client_id`, `redirect_uri`, `response_type=code`, `scope=openid email profile`, `state`, `nonce`, `prompt=select_account`, and `hd` set to the company domain when `ADMIN_ALLOWED_DOMAIN` is configured. **`hd` is a UI hint only — Google does not enforce it and it must never be treated as a check** (§6.5.3 step 5 is the check).

   **Where `redirect_uri` comes from (review m5).** From a constant, never from the request. Build it as `` `${SITE_URL}/api/studio/auth/callback` `` using the existing `src/lib/site.ts:1` export, with a single explicit `http://localhost:3000` branch when `process.env.NODE_ENV !== "production"`. Deriving it from the `Host` or `X-Forwarded-Host` header is the standard mistake here and it is attacker-controlled input on the one request that hands out a session. The same constant must be used in **both** the login redirect and the token exchange (step 5) — Google requires them to match, and a mismatch is a confusing `redirect_uri_mismatch` rather than a clean error.

**Callback** (`GET /api/studio/auth/callback`)
4. Compare the returned `state` to the cookie. Mismatch or missing → 400, clear cookies, stop. This is the CSRF control; it is not optional.
5. Exchange `code` at `https://oauth2.googleapis.com/token` (POST, `client_id` + `client_secret` + `code` + `redirect_uri` + `grant_type=authorization_code`).
6. **Verify the `id_token` — do not decode-and-trust.** Fetch Google's JWKS (`https://www.googleapis.com/oauth2/v3/certs`, cached by `kid` in module scope with the response's `max-age`), verify the RS256 signature via `crypto.subtle.verify`, then assert: `iss` ∈ {`accounts.google.com`, `https://accounts.google.com`}, `aud` === our client id, `exp` in the future, and `nonce` === the cookie nonce.
7. Assert `email_verified === true`. An unverified Google email is an attacker-controlled string.

**Authorization** (the allowlist)

8. Lowercase and trim `email`; require exact membership in `ADMIN_ALLOWED_EMAILS` (comma-separated). Optionally *also* require the domain to equal `ADMIN_ALLOWED_DOMAIN` when set — the allowlist is the gate, the domain is a second condition, never a substitute.
9. **Fail closed.** If `ADMIN_ALLOWED_EMAILS` is empty or unset, *nobody* is authorized — never interpret an empty list as "allow all". This is the single most important line of the feature and §10.4 T5–T6 test it directly.
10. Non-allowlisted but validly authenticated → clear cookies, render a bare 403 with no site chrome and no hint about what the correct account would be. Log the attempt server-side with the email.

**Session**

11. On success set `studio_session`: `base64url(payload) + "." + base64url(HMAC-SHA256(payload, ADMIN_SESSION_SECRET))`, where `payload = {email, iat, exp}`. `httpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, `Max-Age` 8h. Verify with `crypto.subtle.verify` (constant-time by construction — never compare signature strings with `===`).
12. No refresh, no sliding expiry. After 8 hours the editor signs in again; a re-auth with Google is one click when their session there is live.

**Why hand-rolled is defensible here** (recorded because "we wrote our own auth" deserves a justification): one provider, no account linking, no password handling, no user store, no session revocation requirement, no roles. The genuinely dangerous parts of auth — credential storage, password reset, account recovery, multi-tenancy — are all absent. What remains is a code exchange, a signature verification, and an HMAC cookie, in ~200 lines that fit in one review. The alternative, `next-auth@5`, is still published as a beta and brings adapters, providers, and callback machinery this use case never touches. **If the implementer finds themselves writing anything not on the list above, stop and reconsider the dependency.**

#### 6.5.3 Where the check actually runs

Next 16's own guidance is explicit: Proxy "should not be used as a full session management or authorization solution" and is for "optimistic checks" only (`node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md:29`). So:

| Layer | Does what | Is it the security boundary? |
|---|---|---|
| `src/proxy.ts` | Cheap optimistic check: session cookie present and signature valid → continue; else **404** (not 401/redirect) for `/studio/*` **except the exempt paths below**. Sets `X-Robots-Tag: noindex`. | **No** |
| Every admin page (server component) | `await requireAdmin()` before rendering anything | **Yes** |
| Every admin route handler / server action | `await requireAdmin()` as the first statement, before reading the body | **Yes** |

`requireAdmin()` lives in `src/lib/studio/session.ts`, verifies the cookie HMAC and expiry, re-checks the email against the allowlist **on every call** (so removing someone from the env var and redeploying revokes their live session immediately, rather than 8 hours later), and throws/redirects otherwise.

**Exempt paths — review BLOCKER B3.** v2's proxy rule 404'd *everything* under `/studio/*` without a session, including `/studio/signed-out` — the page it simultaneously described as the bookmarkable way in. As written there was no entry point at all. The optimistic check therefore skips exactly these, and the list is exhaustive:

```
/studio/signed-out          → renders the "Sign in with Google" button, no session required
/api/studio/auth/login      → starts the flow; there is by definition no session yet
/api/studio/auth/callback   → completes it; the session is set by this response
/api/studio/auth/logout     → must work with an expired or invalid cookie
```

Everything else under `/studio/*` 404s without a valid cookie. The three auth routes are **not** 404'd by the proxy because they are their own boundary — each validates `state`/`nonce`/`id_token`/allowlist itself (§6.5.2), and 404ing them would break the flow the same way. They still get `X-Robots-Tag: noindex, nofollow`.

Implement the exemption as an explicit allowlist compared against `request.nextUrl.pathname`, not a prefix or regex — a `startsWith("/studio/signed-out")` would exempt `/studio/signed-out-and-then-something`, and this check runs before the real gate. §10.5 E2 and E10 verify both directions.

**The 404-instead-of-401 choice:** an unauthenticated hit on `/studio` returns a normal 404, indistinguishable from any other missing page, so a scanner learns nothing. The signed-in entry point is `/studio/signed-out`, which *does* render a "Sign in with Google" button — the editor bookmarks that. Note this is cloaking, not a control; it is worth the ten lines only because it costs nothing. It also means the one exempt page is the one thing a scanner *can* find, which is fine: it is a sign-in button in front of Google.

**Fail-closed on misconfiguration:** if `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `ADMIN_SESSION_SECRET`, or `ADMIN_ALLOWED_EMAILS` is missing, the admin routes 404 and the login route refuses to start a flow. A half-configured deploy is never an open door. (Contrast with today's HubSpot pattern at `src/app/api/whitepaper/route.ts:23-33`, which logs and 503s on a missing form id — same instinct, stricter outcome, because this one guards writes.)

#### 6.5.4 Publishing — the GitHub write layer

`src/lib/studio/github.ts` wraps the REST API against `GITHUB_REPO` on branch `GITHUB_BRANCH` (default `main`), authenticated with `GITHUB_TOKEN`.

**Reads** use the simple Contents API:

- `getFile(path)` → `GET /repos/{owner}/{repo}/contents/{path}?ref={branch}` — returns decoded content **and the blob `sha`**
- `listDir(path)` → for the admin list views

**Writes go through the Git Data API as one atomic commit** — `commitFiles(changes[], message, author)`, where each change is `{path, content}` or `{path, delete: true}`:

1. `GET /git/ref/heads/{branch}` → current head sha
2. `POST /git/blobs` per changed file → blob shas
3. `POST /git/trees` with `base_tree` = head's tree → new tree sha
4. `POST /git/commits` with that tree and head as parent → commit sha
5. `PATCH /git/refs/heads/{branch}` with `force: false` → fails on a non-fast-forward

**This reverses v2's decision** ("the Git Data API … not worth it for 25 items"), and the slug ledger (§6.6) is what changed the arithmetic. Every editor action now touches **two or three files at once** — the content file, the ledger, and for a white paper the PDF. With one-file-per-commit there is no ordering that leaves the intermediate state valid: commit the ledger first and it names a file that does not exist yet; commit the content first and a file exists that the ledger does not list. Either way the first of the two commits triggers a Vercel build that **fails**, so every single publish would produce a failure email followed by a success email. Four extra API calls is a very cheap price for not doing that.

Three things fall out of the change, all good: one build per editor action rather than two or three (which §6.3 already wanted), one commit to `git revert` for a complete rollback, and no intermediate repo state that `check-content` has to tolerate.

Four properties fall out of this that are worth naming, because each replaces something we would otherwise have to build:

1. **Conflict detection, at two levels.** Before building the tree, compare the blob `sha` the editor loaded against the one at current head: if they differ, stop with *"This item changed since you opened it — reload to see the current version."* Then `PATCH` the ref with `force: false`, which rejects a non-fast-forward if the branch moved between steps 1 and 5 — retry once against the new head, then surface the same message. The first check gives a precise per-item message; the second closes the race. Two editors cannot silently clobber each other.
2. **The audit trail is free and truthful.** Each commit sets `author` to the signed-in editor's name and Google email, so `git log` answers "who published this?" without an audit table. The commit message is generated: `content(blog): update "<title>" [studio]`.
3. **Rollback is free.** `git revert` on the commit, or the admin's own "restore previous version" reading the file's commit history.
4. **Multi-file writes are atomic, so ordering stops mattering.** Adding a white paper is one commit containing the PDF, the JSON record, and the ledger entry. v2 solved this with careful ordering (PDF first, record second, so an orphan is inert); with three files and a ledger that has to stay consistent, ordering is no longer sufficient — see the reversal above. There is no partial state to reason about, which also means §6.5.7's failure table loses a row rather than gaining one.

**Token.** A fine-grained PAT scoped to `lanshore-web` with **Contents: read and write** only, stored as `GITHUB_TOKEN` in Vercel (all environments). Fine-grained PATs expire — set a calendar reminder and record the expiry in `docs/CONTENT-EDITING.md`, because the failure mode is "Publish silently stops working" and it will happen a year from now to someone who wasn't in this conversation. A GitHub App (auto-rotating installation tokens) is the upgrade if that becomes annoying.

**Upload limits.** The Contents API takes base64 and is documented for files up to ~1 MB comfortably (hard ceiling 100 MB, but base64 inflates by ~33% and Vercel caps request bodies at ~4.5 MB). **Measured, not deferred (review m4):** the five current PDFs in `public/whitepapers/` are 297 KB, 337 KB, 458 KB, 465 KB and 696 KB — the largest is ~15% of the practical ceiling even after base64 inflation. **The Contents API is sufficient and the Git Data API blob fallback is dropped from the plan**; v2 carried it as a conditional branch into implementation for a question that was answerable by `ls`. Enforce a **4 MB** cap in the admin so the limit is hit as a clear UI error rather than an opaque 413, and revisit only if a future paper approaches it. The admin must also validate `Content-Type: application/pdf`, sniff the `%PDF-` magic bytes rather than trusting the declared type, and reject anything whose filename does not normalize to `<slug>.pdf` — the loader assertion at `src/lib/whitePapers.ts:24-32` is the backstop, but a clear error in the UI beats a failed deploy.

#### 6.5.5 The editor UI

Deliberately plain — Tailwind, the site's existing tokens, no rich-text engine, no new dependencies:

- **Blog:** text inputs for `title` / `description` / `dateModified` (date input, defaults to today), checkboxes for `draft` / `featured`, a repeatable FAQ list, and a `<textarea>` for the Markdown body. **Side-by-side live preview** rendering through the very same `<Markdown>` component the public page uses (§7.1), so what the editor sees is what ships. This preview pane is the entire reason §6.3 could drop preview deployments.
- **Case studies:** structured fields only — `title`, `client`, `industry`, `pillar` (`<select>` over the 4-value enum, never free text), `outcome`, `challenge`, `whatWeDid`, plus repeatable `results[]` and `stack[]` rows. `legacyUrl` is shown read-only (provenance).
- **White papers:** `title`, `description`, PDF upload, `hubspotValue` (defaults to slug, with the §7.4 note inline).
- **Slug:** free to set on create (validated `^[a-z0-9][a-z0-9-]*$`, checked for collisions against the whole collection); **read-only forever after**, with inline text explaining that renames need a developer because they require a paired 301.
- **Buttons:** *Save draft* (commits with `draft: true`), *Publish* (commits with `draft: false`), *Unpublish* (flips back to `draft: true`), *Delete* (confirm dialog). Each of these has a defined effect on the slug ledger — **see §6.6, which is what makes them work at all**; in v2 three of these four buttons broke the build (review BLOCKER B1).
- In-progress typing stays **client-side only** until a button is pressed, so keystrokes never generate commits.

#### 6.5.6 Content escaping — what makes editor input safe

Editor input becomes site HTML, so the injection surface is worth stating explicitly rather than assuming:

- **Markdown body** → `react-markdown` with an explicit component map and **no `rehype-raw`**, so embedded HTML renders as literal text. Never introduce `rehype-raw`, and never route editor content through `dangerouslySetInnerHTML`.
- **JSON-LD** → already safe. `toJsonLd()` (`src/lib/schema.ts:343-350`) escapes `<`, `>`, `&`, U+2028, and U+2029, so an editor typing `</script>` into a title cannot break out of the `<script type="application/ld+json">` sink at `src/components/JsonLd.tsx:7`. **This is pre-existing and must not be "simplified" later** — it is load-bearing the moment content becomes user-editable. §10.4 T15 pins it with a test.
- **Metadata strings** (`title`, `description`) → consumed by Next's Metadata API, which escapes attribute values itself.
- **Frontmatter** → parsed with `gray-matter`; the loader validates types and rejects unknown/malformed fields rather than spreading them into the rendered object.

#### 6.5.7 Failure modes the editor will actually hit

| What happens | What the editor sees | Where it's handled |
|---|---|---|
| Publish while someone else edited the same item | "This changed since you opened it — reload" | `sha` compare + non-fast-forward ref check in `commitFiles()` (§6.5.4) |
| Publish with a required field empty | Inline validation error, no commit attempted | Client + server validation mirroring `check-content` |
| An edit that passes the admin but fails `check-content` | Vercel deploy-failure email; **production keeps serving the previous build** | `prebuild` gate (§10.1) |
| GitHub token expired or revoked | "Publishing is unavailable — contact Israel", commit refused | `commitFiles()` 401/403 mapped to a clear message |
| Session expired mid-edit | Re-auth prompt; **draft text preserved in the form** (do not discard the body on a 401) | Client-side retry after re-login |
| Removed from the allowlist | Next request 404s | `requireAdmin()` re-checks per call (§6.5.3) |

### 6.6 The slug ledger — `content/SLUGS.lock.json`

Review **BLOCKER B1**. v2 defined the gate as *"the set of loaded slugs per type **equals** `SLUGS.lock.json` exactly"* while §6.3 excluded drafts from the loaded arrays. Trace each editor action against that rule:

| Action | Loaded slug set | v2 gate | Result |
|---|---|---|---|
| Save draft (new item) | unchanged (drafts excluded) | equal | ✅ passes |
| **Publish (new item)** | gains a slug | not equal | ❌ **build fails** |
| **Unpublish** | loses a slug | not equal | ❌ **build fails** |
| **Delete** | loses a slug | not equal | ❌ **build fails** |

The only action that passed was the one that publishes nothing, and no task in v2 wrote the ledger — §13 P3 only had the delete dialog *warn* about it. The first real use of the feature would have failed the deploy and stayed failed until a developer hand-edited a JSON file, which is precisely the developer-in-the-loop this plan exists to remove.

**Two changes fix it: the check reads the disk instead of the loaded arrays, and the invariant becomes a subset rather than an equality.**

**Shape.**

```json
{
  "version": 1,
  "blog":        ["elevating-sales-performance-…", "…"],
  "caseStudies": ["commission-architecture-redesign", "…"],
  "whitePapers": ["death-of-commissions", "…"],
  "retired": [
    { "slug": "…", "collection": "blog", "retiredOn": "2026-09-01", "redirectTo": "/blog" }
  ]
}
```

**Rules (`check-content`, §10.1.1).** All of them read **content files on disk, drafts included** — never `BLOG_POSTS`/`CASE_STUDIES`/`WHITE_PAPERS`. That single sourcing change is what makes Unpublish safe: the file is still there, so the ledger still resolves.

- **L1 — nothing vanishes.** Every slug in a live list resolves to a file on disk. Missing → **fail**, unless it appears in `retired[]`.
- **L2 — retirement is complete.** Every `retired[]` entry has **no** file on disk, a `redirectTo` that resolves to a live path, and a matching 301 in `next.config.ts`. A slug cannot be in both a live list and `retired[]`.
- **L3 — nothing is unregistered.** Every content file on disk appears in its collection's live list. → **fail** with the exact line to add. This catches a hand-added file; the admin satisfies it automatically because the ledger update travels in the same atomic commit (§6.5.4).
- **L4 — live 301s still land on something published.** Every destination in `MIGRATED_POSTS` (`next.config.ts:72-78`, 5 blog slugs) and `CASE_STUDY_REDIRECTS` (`:7-69`, 13 case-study slugs) resolves to a slug that is on disk **and not `draft: true`**. This is the rule v2 was reaching for and it is the one with teeth: unpublishing one of those 18 items turns a live 301 into a 301-to-404.

**Who writes it.** The admin, in the same commit as the content change — never a separate commit (§6.5.4 explains why the Git Data API is now required rather than optional).

**What each button does to the ledger:**

| Button | Content file | Ledger | Notes |
|---|---|---|---|
| Save draft (new) | created, `draft: true` | slug appended to live list | L3 satisfied in the same commit |
| Publish | `draft: false` | unchanged | already registered |
| Unpublish | `draft: true` | unchanged | file stays on disk, so L1 holds — **blocked in the UI if the slug is an L4 redirect destination** |
| Delete (never published) | deleted | slug removed from live list | no redirect needed; no URL was ever live |
| Delete (was published) | **refused** | — | see below |

**Deleting a published item is not self-service, and that is deliberate.** Removing a live URL needs a paired 301, which means editing `next.config.ts` — a developer task, exactly like the slug renames §5 already carves out. The admin offers **Unpublish** instead and says why: unpublishing 404s the URL (the correct signal for withdrawn content) and is reversible in one click, while deleting is permanent and leaves a dead legacy link. If the owner genuinely wants it gone, a developer adds the redirect and moves the slug into `retired[]` in the same PR.

**Pre-flight, not post-mortem.** All four rules are mirrored in `src/lib/studio/validate.ts`, which the admin runs **before** committing (§6.5.7's "Inline validation error, no commit attempted" row). `check-content` at build time is the backstop for hand edits, not the primary UX. An editor should never learn about a ledger violation from a Vercel failure email.

### 6.7 Index-page `lastmod` — closing the honesty gap

Review **M6**. `src/app/sitemap.ts:25,27,28` stamps the three index pages from `src/lib/contentDates.ts` — `UPDATED.caseStudies`, `UPDATED.blogIndex`, `UPDATED.resources` — and §2 keeps `contentDates.ts` developer-owned and outside the admin. So an editor publishing a post changes `/blog`, `/resources` and the sitemap's URL set while `/blog`'s `lastmod` stays frozen. `src/app/sitemap.ts:10-13` is the repo's own argument for why that is corrosive ("a sitemap that restamps every URL on every deploy gets the signal discarded wholesale" — the inverse failure is a sitemap that *never* restamps a page that did change). §9 lists dishonest `lastmod` as a named risk and v2 mitigated it only for per-post dates.

**Fix (P1, ~5 lines in `sitemap.ts`):** derive the three index dates from the content instead of the registry.

| Path | v2 | v3 |
|---|---|---|
| `/blog` | `UPDATED.blogIndex` | `max(BLOG_POSTS[].dateModified)` |
| `/case-studies` | `UPDATED.caseStudies` | `max(CASE_STUDIES[].dateModified ?? UPDATED.caseStudies)` |
| `/resources` | `UPDATED.resources` | `max(UPDATED.resources, max(BLOG_POSTS[].dateModified))` — the manual value stays the floor, because the page carries press and glossary content the collections do not know about |

**Verified byte-identical on day one**, which is why this can land inside P1 without disturbing the golden diff: all five posts carry `dateModified: 2026-07-11` and `UPDATED.blogIndex` is `2026-07-11`; all 14 studies fall back to `UPDATED.caseStudies` = `2026-07-08`; `UPDATED.resources` = `2026-07-15` ≥ the blog max. Every index `lastmod` computes to exactly its current value. The change only starts moving the day an editor actually publishes — which is the point.

`UPDATED.blogIndex` becomes unused. **Disposition: `REPLACE`** — delete the key in P1 and note it in the migration, rather than leaving a registry entry nothing reads. `UPDATED.caseStudies` and `UPDATED.resources` stay (`COEXIST`): both are still real fallbacks with live callers.

### 6.8 The Gartner trademark gate

Review **M3**, and the sharpest edge in the migration. `src/components/Footer.tsx:23` computes which pages must render the Gartner attribution:

```ts
...BLOG_POSTS.filter((p) => JSON.stringify(p).includes("Gartner")).map((p) => `/blog/${p.slug}`),
```

It works today **only because `blocks[]` is part of the serialized post object** — and this plan replaces `blocks[]` with a Markdown body. If the loader keeps the body off the typed object, or nests it, or renders it before assignment, `JSON.stringify(p)` stops containing the post's prose, the filter silently returns fewer paths, and three blog posts stop rendering a disclaimer that `src/lib/site.ts:12-21` says is mandatory under a no-reprint-license constraint. Nothing throws. The build stays green.

Three posts currently match: `sales-performance-management-build-vs-buy-…`, `territory-white-space-…`, and `the-agent-advantage-…`.

**Fix (P1): make it a derived field instead of a serialization accident.** The loader computes `mentionsGartner` per post by scanning the **raw file text** (front matter + body) with `/gartner/i`, and exports it on `BlogPost`. `Footer.tsx` becomes `BLOG_POSTS.filter((p) => p.mentionsGartner)`. Three properties this buys:

- It cannot be broken by a change in object shape, which is exactly the failure above.
- It is **case-insensitive**, where `includes("Gartner")` is not — so an editor typing "gartner" now gets the disclaimer. *Verified no day-one diff:* case-sensitive and case-insensitive matching both select the same 3 posts today, so the golden diff stays clean.
- It works for content the editor writes tomorrow without anyone remembering a checkbox. A front-matter flag was the obvious alternative and is **rejected**: the failure mode of a forgotten flag is an undisclosed trademark use, and no editorial process should be load-bearing for that.

`check-content` asserts the derived flag against an independent scan of the file (§10.1.9), and §10.2 adds the footer of a Gartner-mentioning post to the golden-diff set — v2 captured post bodies but never asserted anything about the footer.

---

## 7. Change surface

### 7.1 New files

| Path | Purpose |
|---|---|
| `content/blog/*.md` (5) | Migrated posts |
| `content/case-studies/*.json` (14) | Migrated studies — JSON, not Markdown (§6.1) |
| `content/white-papers/*.json` (5) | Migrated registry entries |
| `src/lib/content/loadContent.ts` | Shared fs+front-matter reader, slug derivation, required-field/date/duplicate validation, `draft` filtering, `mentionsGartner` derivation (§6.8) |
| `src/components/Markdown.tsx` | `react-markdown` + `remark-gfm` with a component map reproducing the block classes at `src/app/blog/[slug]/page.tsx:116-145` **and the anchor at `:47-52`** (`target`/`rel`/`className`); default `urlTransform` retained, no `rehype-raw` |
| `scripts/lib/content-rules.mjs` | **Plain `.mjs`, no TypeScript.** The single implementation of field validation + the four ledger rules (§6.6), imported by `check-content.mjs`, by `migrate-content.mjs`, and — via a thin `.ts` re-export — by the admin. Review M1: a `.mjs` script cannot import a `.ts` module, so the shared code has to live on the `.mjs` side of the line |
| `scripts/migrate-content.mjs` | One-shot, deterministic array → content-file generator, **including the Markdown escaping and round-trip assertion in §8** (kept in-repo as the migration record; archived after P1) |
| `scripts/check-content.mjs` | Standalone validator + ledger check; wired to `npm run check:content` and `prebuild` |
| `content/SLUGS.lock.json` | Slug ledger for the current **24** items plus `retired[]`; enforces the four rules in **§6.6** and guards the 18 live 301 destinations in `next.config.ts:7-78` |
| **— admin, P2 (auth) —** | |
| `src/lib/studio/session.mjs` + `session.ts` | **The logic lives in `.mjs`** (cookie sign/verify via Web Crypto HMAC-SHA256, allowlist check, fail-closed config guard) so `node --test` can load it without a transpiler; the `.ts` file is a typed re-export plus `requireAdmin()`, which needs `next/headers`. Review M1 |
| `src/lib/studio/google.mjs` + `google.ts` | Same split: authorization URL builder, code exchange, JWKS fetch + cache and `id_token` verification are pure functions in `.mjs`; the `.ts` wrapper adds types. No `@/*` aliases inside either `.mjs` — Node's resolver does not read `tsconfig` paths |
| `src/app/api/studio/auth/login/route.ts` | Starts the flow; sets `state`/`nonce` cookie |
| `src/app/api/studio/auth/callback/route.ts` | State check → code exchange → token verify → allowlist → session cookie |
| `src/app/api/studio/auth/logout/route.ts` | Clears the session |
| `src/app/studio/layout.tsx` | `requireAdmin()` gate, `robots: {index:false,follow:false}`, minimal admin chrome (no public Header/Footer) |
| `src/app/studio/signed-out/page.tsx` | The only unauthenticated admin page — "Sign in with Google" |
| **— admin, P3 (editor) —** | |
| `src/lib/studio/github.ts` | `getFile`/`listDir` + **`commitFiles()` (Git Data API, one atomic commit per editor action)** + two-level conflict detection + commit authorship (§6.5.4) |
| `src/lib/studio/validate.ts` | Thin typed re-export of `scripts/lib/content-rules.mjs` — **not** a second implementation. The admin's pre-flight check and the build gate run the same code by construction (§6.6) |
| `src/app/studio/page.tsx` | Dashboard |
| `src/app/studio/blog/…`, `case-studies/…`, `white-papers/…` | List + editor routes (§6.5.1) |
| `src/components/studio/*` | Form controls, repeatable-row editor, preview pane |
| `docs/CONTENT-EDITING.md` *(P3)* | Owner-facing guide: add a post, add a case study, upload a white paper, drafts, what happens after Publish, what to do if a deploy fails, **and the GitHub token expiry date** |

### 7.2 Modified files

| Path | Change |
|---|---|
| `src/lib/blog.ts` | Body replaced by loader; same exports/types; `+draft/featured/summary`; `blocks` → Markdown `body`; `+mentionsGartner` derived (§6.8) |
| `src/lib/caseStudies.ts` | Body replaced by loader; same exports/types; `+dateModified?`, `+draft?` |
| `src/lib/whitePapers.ts` | Body replaced by loader; keeps `WHITEPAPER_FILE_RE` assertions; `hubspotValue` optional (defaults to slug) |
| `src/app/blog/[slug]/page.tsx` | `groupBlocks`/`linkify` block renderer (`:37-78`, `:116-145`) replaced by `<Markdown>`; everything else (metadata, JSON-LD, newsletter gate) untouched |
| `src/app/resources/page.tsx` | Hardcoded `BLOG_POSTS` array (`:24-62`) replaced by an import-derived list |
| `src/app/case-studies/[slug]/page.tsx` | `dateModified: study.dateModified ?? UPDATED.caseStudies` (`:50`) |
| `src/app/sitemap.ts` | Case-study entries use per-study `dateModified` when present (`:46-49`); **the three index entries (`:25,27,28`) derive their `lastModified` from the content instead of `contentDates.ts` (§6.7)** — verified byte-identical on day one |
| **`src/components/Footer.tsx`** | **NEW in v3 (review M3).** `GARTNER_PATHS` (`:23`) stops using `JSON.stringify(p).includes("Gartner")` and uses the derived `p.mentionsGartner` (§6.8). The legally-required trademark attribution currently rides on a serialization side-effect that this migration would have silently broken |
| **`src/lib/contentDates.ts`** | **NEW in v3.** Delete the now-unread `blogIndex` key (`:26`); `caseStudies` and `resources` stay as fallbacks (§6.7) |
| `package.json` | `+gray-matter`, `+react-markdown`, `+remark-gfm`; `+"check:content"`, `+"test:auth"`, `+"prebuild"` (chains both — see §13); **`+engines.node`** (review M1: `prebuild` now runs Node scripts, so the major cannot stay unpinned) |
| `src/proxy.ts` | **P2:** optimistic session check → 404 for `/studio/*` without a valid cookie, **minus the four exempt paths in §6.5.3** (review B3 — v2's rule 404'd the sign-in page); `X-Robots-Tag: noindex, nofollow` on `/studio/*` and `/api/studio/*`. Must not disturb the existing WordPress-410 and host-canonicalization logic (`:27-41`) |
| `src/app/robots.ts` | **No change.** Deliberately *not* adding a `/studio` disallow — that would publish the URL (§6.5.1). `disallow: "/api/"` already covers the admin API generically |
| `next.config.ts` | **Changed — v2 said "no change expected" and that was review BLOCKER B2.** P1 adds `outputFileTracingIncludes` so `content/white-papers/**` reaches the `/api/whitepaper` serverless bundle (§6.2); without it the build passes and every gated download 500s. Otherwise touched only for a slug rename (new 301) or remote images (`:173-175`) |
| `.env.example` | Document the six new admin vars (names + shape only, never values) |

### 7.3 Environment variables

All set in **Vercel → Project → Settings → Environment Variables**, documented by name in `.env.example`, values never committed.

| Var | Scope | Purpose |
|---|---|---|
| `GOOGLE_OAUTH_CLIENT_ID` | server | OAuth client (Google Cloud console → Credentials → Web application) |
| `GOOGLE_OAUTH_CLIENT_SECRET` | server, **secret** | Code exchange |
| `ADMIN_ALLOWED_EMAILS` | server | Comma-separated allowlist, lowercased, exact match. **Empty ⇒ nobody is authorized** (§6.5.2 step 9) |
| `ADMIN_ALLOWED_DOMAIN` | server, optional | Extra condition + Google `hd` UI hint. Never a substitute for the allowlist |
| `ADMIN_SESSION_SECRET` | server, **secret** | ≥32 random bytes; HMAC key for the session cookie. Rotating it signs everyone out (that is the revocation lever) |
| `GITHUB_TOKEN` | server, **secret** | Fine-grained PAT, `lanshore-web` only, Contents: read+write. **Has an expiry — record it** |
| `GITHUB_REPO` | server | `lanshore/lanshore-web` |
| `GITHUB_BRANCH` | server | `main` |

**Redirect URIs** to register on the Google client: `https://lanshore.com/api/studio/auth/callback` and `http://localhost:3000/api/studio/auth/callback` for local development. Vercel preview deployments have per-deployment hostnames that cannot be pre-registered, so **the admin will not work on preview URLs** — an acceptable and in fact desirable limitation, since preview deployments should not be able to publish to `main`. State this in `docs/CONTENT-EDITING.md`.

**If the hosted-CMS path is ever chosen instead (§12):** `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (server-only, draft reads), `SANITY_WEBHOOK_SECRET` (server-only, webhook HMAC) — same Vercel location.

### 7.4 HubSpot-side touch (small, P3)

To make white papers fully self-service, change the `whitepaper_requested` contact property from a dropdown to single-line text (or pre-create option values in bulk). Until then, adding a paper requires one 2-minute portal step, which `docs/CONTENT-EDITING.md` must state. No code change either way — `src/app/api/whitepaper/route.ts:36-45` already sends whatever value the registry holds. This is an amendment to, not a contradiction of, `docs/plans/hubspot-expansion.md` Phase 5.

---

## 8. Content migration & URLs

- **Mechanical, not manual.** `scripts/migrate-content.mjs` imports the current arrays and writes the content files, so no prose is retyped and no character (curly quotes, em dashes, the reference URLs) drifts. Blog `blocks[]` → Markdown: `h2`→`## `, `h3`→`### `, `p`→ paragraph, consecutive `li`→ `- ` list (mirrors `groupBlocks`, `src/app/blog/[slug]/page.tsx:61-77`).

  *How a `.mjs` script reads `.ts` data (review M1):* run it once as `node --experimental-strip-types scripts/migrate-content.mjs`. This works **only** because all three source modules are self-contained after type erasure — `src/lib/blog.ts:3` is an `import type` (erased), and `caseStudies.ts`/`whitePapers.ts` have no imports at all, so no `@/*` alias resolution is ever needed. Verified. This is a one-shot requirement that never reaches the build.

- **Escaping is mandatory, and "scripted" does not cover it (review M2 — v2 got this wrong).** A scripted conversion prevents typos; it does not prevent the *Markdown parser* reinterpreting text that was never Markdown. **Ten `p` blocks in `src/lib/blog.ts` begin with `1. ` … `5. `** (verified: `"1. Agentic AI Roadmap and Current Capabilities. …"`, `"2. Integration Depth with Your CRM and ERP Ecosystem. …"`, and eight more). Emitted as bare paragraphs, GFM parses each as an **ordered list item**: consecutive ones collapse into a single `<ol>`, the literal `1.`/`2.` is swallowed by the list marker, and `<p class="my-4 text-foreground">` becomes `<li>`. Visible text *and* HTML change.

  The migration script therefore escapes, in every `p` and `li` text:

  | Pattern at start of text | Emitted as |
  |---|---|
  | `1. ` / `12) ` (ordered-list marker) | `1\. ` / `12\) ` |
  | `- ` / `+ ` / `* ` (bullet) | `\- ` / `\+ ` / `\* ` |
  | `# ` … `###### ` (ATX heading) | `\# ` |
  | `> ` (blockquote) | `\> ` |
  | `    ` (4+ spaces — indented code block) | collapsed to one space |

  Inline metacharacters are a smaller problem than they look: a scan found exactly **one** `p` block containing `*`, `_`, `[`, `]` or `|` (a reference line reading `"… What is agentic AI? | Agentic AI examples. Retrieved from https://…"`, where a lone `|` outside a delimiter-row table is inert) and **zero** backticks. The script still escapes paired `*`/`_` runs defensively, since editor-written content will not stay this tidy.

- **The round-trip assertion is the real gate.** After writing each file the script re-parses the emitted Markdown and asserts the resulting block sequence is identical to the `blocks[]` it came from — same types, same order, same text. A mismatch aborts the migration. This fails at migration time on the developer's machine, which is worth far more than the golden diff catching it at review time, and it is the check that would have caught M2 without anyone knowing to look for it.

- **Slugs are preserved exactly**; the filename *is* the slug. `content/SLUGS.lock.json` registers the current **24** (5 + 14 + 5) and enforces the four rules in §6.6.
- **No URL changes ⇒ no new redirects.** All 5 entries in `MIGRATED_POSTS` (`next.config.ts:72-78`) and all 13 in `CASE_STUDY_REDIRECTS` (`:7-69`) must still land on a 200; this is ledger rule **L4** (§6.6) and an explicit test (§10.1). *One of the 14 studies has no legacy URL — 13 redirects, 14 studies is correct, not a gap.*
- **Slug renames are a developer task, by design.** The CMS makes the slug read-only after creation; if the owner needs one renamed, it is a paired change (rename + 301 in `next.config.ts`), documented in `docs/CONTENT-EDITING.md`.
- **PDFs stay at `public/whitepapers/<slug>.pdf`** — no re-hosting, so `src/lib/whitePapers.ts:24-32`'s same-origin guarantee and `WhitePaperGate`'s `window.location.assign(url)` (`src/components/WhitePaperGate.tsx:81`) are unaffected.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| **Migration silently alters rendered copy** (smart quotes, spacing, list grouping, **Markdown re-interpretation**) | v2 relied on "scripted, never hand-typed" — insufficient, and demonstrably so: 10 paragraphs start with `1. ` and would have become list items (review M2). Now: explicit escaping table (§8), a **round-trip assertion** that aborts the migration on any block-sequence mismatch, *and* the golden diff (§10.2) as the backstop |
| **The `content/` files are missing from the serverless bundle** → every white-paper download 500s while the build stays green | `outputFileTracingIncludes` in `next.config.ts` (§6.2); §10.1.8 asserts every runtime loader consumer is listed there; §10.2.6 verifies on a **deployed preview**, because `next start` cannot catch this (review B2) |
| **The slug ledger fails the build on the editor's first Publish** | Subset invariant sourced from files on disk, not the draft-filtered arrays; `retired[]`; the admin writes the ledger in the same atomic commit; pre-flight validation so the editor never learns this from a deploy email (§6.6, review B1) |
| **The sign-in page is unreachable because the proxy 404s it** | Explicit four-path exemption list, compared by equality not prefix (§6.5.3); §10.5 E2 and E10 test both directions (review B3) |
| **The Gartner trademark disclaimer silently stops rendering** after `blocks[]` is retired — a legal exposure, not a cosmetic one | `Footer.tsx:23`'s `JSON.stringify` heuristic replaced by a derived `mentionsGartner` field computed from raw file text (§6.8); `check-content` asserts it; golden diff now covers the footer of a Gartner-mentioning post (review M3) |
| **Index-page `lastmod` freezes** while editors publish, degrading the exact sitemap signal `src/app/sitemap.ts:10-13` protects | `/blog`, `/case-studies`, `/resources` derive `lastModified` from content (§6.7); verified byte-identical on day one (review M6) |
| An industry page silently loses its case-study cross-link | `check-content` resolves every `INDUSTRIES[].caseStudySlug` (§10.1.7); industries routes added to the golden-diff capture set (review M3) |
| `node:fs` leaks into a client bundle via `CaseStudyGrid`/`WhitePaperGate` | Keep those imports `import type`; the build fails loudly if violated — verify in P1 |
| Editor forgets to bump `dateModified` → dishonest `lastmod` (the exact thing `src/app/sitemap.ts:10-13` warns about) | CMS date field defaults to today on save; `check-content` fails on missing/malformed dates; guide explains the rule (bump on substance, not restyle) |
| Editor renames a slug and breaks a live 301 | Slug read-only in the CMS + ledger rule **L4**, which fails on any redirect destination that stops resolving to a published item (§6.6) |
| Editor **unpublishes** one of the 18 items that a live 301 points at, turning it into a 301-to-404 | Blocked in the UI before the commit, and caught by L4 at build time if it happens by hand (§6.6) |
| Non-developer's edit fails the build and nobody notices | Enable Vercel deploy-failure notifications to the editor + developer; guide documents "the site keeps serving the last good version" |
| Markdown editor lets someone paste raw HTML | `react-markdown` does not render raw HTML by default (no `rehype-raw`); keep it that way (§6.5.6). Also keep its default `urlTransform`, which is what rejects a `javascript:` href (§6.1) |
| FAQ schema drifts from visible body (Google spam risk — `src/lib/schema.ts:121-122`) | `faq` entries are rendered visibly by the same page; validator check in §10.2 |
| Scope creep into "let's move services/industries too" | Explicit non-goal (§2) |
| **— admin-specific (new in v2) —** | |
| **Hand-rolled auth has a flaw** — the headline risk of this plan | Scope is deliberately tiny (§6.5.2): one provider, no user store, no passwords. Every step of the flow is enumerated so it is reviewable against a checklist rather than from memory. §10.4 (**T1–T16**) makes the auth logic the *only* thing in this repo with real automated tests. Run `/security-review` on the P2 diff before merge — non-negotiable |
| Auth is enforced only in `src/proxy.ts` and someone finds a bypass | Proxy is explicitly **not** the boundary (Next's own docs, `16-proxy.md:29`); `requireAdmin()` runs in every page and every route handler. §10.4 T13–T14 test a direct route-handler call with no session |
| **Empty `ADMIN_ALLOWED_EMAILS` interpreted as "allow everyone"** | Fail closed by construction, called out at §6.5.2 step 9, and pinned by a test. The classic version of this bug |
| Session cookie forged | HMAC-SHA256 over the payload with a ≥32-byte secret, verified via `crypto.subtle.verify` (constant-time); never compare signatures with `===` |
| `id_token` decoded but not verified (the common shortcut) | JWKS signature verification + `iss`/`aud`/`exp`/`nonce`/`email_verified` assertions, spelled out at §6.5.2 step 6-7 |
| Google `hd` param mistaken for a domain check | Documented as a UI hint only; the allowlist is the check (§6.5.2 step 8) |
| **GitHub PAT expires → Publish silently breaks** a year from now | Expiry recorded in `docs/CONTENT-EDITING.md` + calendar reminder; `commitFiles()` maps 401/403 to an explicit "publishing unavailable" message rather than a generic failure |
| GitHub token leaks | Fine-grained, single-repo, Contents-only — blast radius is this repo's content. Rotatable in minutes. Never sent to the client; all GitHub calls are server-side |
| Two editors clobber each other | `sha` optimistic lock → 409 → reload prompt (§6.5.4) |
| White-paper PDF, JSON record and ledger entry land in different commits | **Eliminated, not mitigated:** all writes are one atomic Git Data API commit, so no partial state exists (§6.5.4). v2's ordering trick could not survive the ledger, where every intermediate state fails a rule |
| Google `redirect_uri` derived from an attacker-controlled `Host` header | Built from the `SITE_URL` constant (`src/lib/site.ts:1`) with one explicit localhost branch; the same constant in both the redirect and the exchange (§6.5.2 step 3) |
| `node --test` cannot load the auth modules on the Vercel builder, failing `prebuild` for a reason unrelated to any change | Auth core authored as plain `.mjs` with relative imports; `engines.node` pinned; no `@/*` alias inside `src/lib/studio/**.mjs` (§10.4, review M1) |
| Editor publishes something libellous/wrong with no review step | Accepted by design — this is the point of self-service. Mitigated by git history + one-commit revert, not by a workflow |
| Admin URL leaks | Assumed from the start (§2 non-goal); auth is the control, obscurity is not |
| Admin discovered and indexed by Google | `X-Robots-Tag: noindex, nofollow` from proxy + per-page metadata + no inbound links; verified in §10.3 A1–A4 |

---

## 10. Test strategy

**Honest statement of the baseline:** this repo has **no test runner, no CI, and no coverage tooling** (`package.json:5-10`, verified §3.6). That means (a) there is no automated regression net today and none is created by accident here, (b) `npm run build` + `npm run lint` are the only existing gates, and (c) a plan that moves 24 pieces of content **must** ship its own executable checks or it is unverifiable. So P1 ships `scripts/check-content.mjs` — a plain Node script, zero new dev dependencies, runnable as `npm run check:content` and wired into `prebuild` so it also guards every future editor publish.

### 10.1 Automated (`npm run check:content`)

1. **Ledger rules L1–L4** (§6.6), **read from content files on disk — never from the draft-filtered arrays.** L1: every registered slug resolves to a file. L2: every `retired[]` entry has no file, a resolving `redirectTo`, and a matching 301. L3: every file on disk is registered. L4: all 18 destinations in `MIGRATED_POSTS` (`next.config.ts:72-78`) and `CASE_STUDY_REDIRECTS` (`:7-69`) resolve to a slug that is on disk **and not `draft: true`**. *v2 demanded set equality against the loaded arrays, which failed the build on Publish, Unpublish and Delete — review BLOCKER B1. The sourcing change is the fix; do not "simplify" it back to reading `BLOG_POSTS`.* The expected item count is derived from the ledger, never hardcoded.
2. **Non-empty collections** — each of the three collections has ≥1 non-draft item. *This is the "must not serve empty list pages" guard*; it fails the build rather than deploying an empty `/blog`.
3. **Required fields + types** — title/description present and non-empty; `dateModified` matches `^\d{4}-\d{2}-\d{2}$` and parses; `pillar` ∈ the 4-value enum; `results`/`stack` are non-empty arrays.
4. **White-paper integrity** — `file` matches `/^\/whitepapers\/[a-z0-9][a-z0-9-]*\.pdf$/`, equals `/whitepapers/<slug>.pdf`, **and the file exists on disk**; `hubspotValue` non-empty after slug defaulting.
5. **Duplicate slug detection** across each collection.
6. **Draft isolation** — *(revised in v2, §6.3: no `VERCEL_ENV` fixture)* an item marked `draft: true` is absent from every loaded array, from `/sitemap.xml`, and from `llms.txt`, in **every** environment; its detail route 404s. Note the interaction with rule 1: the draft's *file* is still on disk and still registered, which is exactly why L1/L3 pass while the item is unpublished.
7. **Cross-collection references resolve** *(new in v3, review M3)* — every `INDUSTRIES[].caseStudySlug` (`src/lib/industries.ts`, consumed at `src/app/industries/[slug]/page.tsx:45`) matches a case study that is on disk and not draft. `src/app/industries/[slug]/page.tsx:46` guards with `study && …`, so today this degrades to a silently dropped cross-link rather than a crash — which is precisely why it needs an assertion rather than a stack trace.
8. **Runtime consumers are traced** *(new in v3, review B2)* — grep every non-page consumer of the three loaders (route handlers, `proxy.ts`, server actions) and assert each appears as a key in `next.config.ts`'s `outputFileTracingIncludes`. Today that is exactly one: `src/app/api/whitepaper/route.ts`. This is the cheap mechanical guard that stops the next runtime importer from reintroducing B2 a year from now.
9. **`mentionsGartner` is honest** *(new in v3, review M3)* — for every post, the derived flag equals an independent `/gartner/i` scan of the raw content file, and `src/components/Footer.tsx` contains no literal `"Gartner"` string test over `BLOG_POSTS`. Guards the trademark obligation in `src/lib/site.ts:12-21` (§6.8).

### 10.2 Golden-output regression (manual, scripted, mandatory before merge)

Capture **before** any code change, on `main`: `npm run build && npm run start`, then fetch and save `/blog`, all 5 `/blog/<slug>`, `/case-studies`, all **14** `/case-studies/<slug>`, **every `/industries/<slug>`** *(new in v3, review M3 — these consume `getCaseStudy` and v2's capture set omitted them entirely)*, `/resources`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt` into the scratchpad. Repeat **after** and diff:

1. **Metadata fidelity** — `<title>`, `meta[name=description]`, `link[rel=canonical]`, all `og:*` identical per route.
2. **JSON-LD fidelity** — every `application/ld+json` block byte-identical: `BlogPosting` (headline truncation at 110 chars, `dateModified`, `@id`), `Article` for case studies (`abstract` from `results`, `mentions` from `stack`, `about` from industry/pillar), `ItemList` (`numberOfItems` and ordering), `FAQPage`, `BreadcrumbList`. Paste one blog post and one case study into the Rich Results Test → zero errors.
3. **Sitemap correctness** — `/sitemap.xml` identical (URL set, order, `lastmod`, `priority`), except intentional per-study `lastmod` if any study gained one.
4. **Rendered copy** — visible text diff of each post/study is empty, **and the HTML structure matches too**. Specifically: the ten `1. `–`5. ` paragraphs still render as `<p class="my-4 text-foreground">` and not as `<ol><li>` (review M2); headings and lists are unchanged; and the "Retrieved from https://…" reference links carry the *same anchor attributes* `linkify` produced — `target="_blank"`, `rel="noopener noreferrer"`, `class="break-all font-medium text-accent underline hover:text-accent-hover"`, with trailing `.,);` outside the anchor (review m1). A visible-text-only diff passes while all of these are wrong, so diff the markup.
5. **Redirect parity** — every legacy URL in `next.config.ts:7-78` still 301s to a 200 page.
6. **White-paper flow — run this against a deployed Vercel preview, not `next start`.** `POST /api/whitepaper` with a known slug → `{ok:true,url}` and the URL 200s; unknown slug → 400; the gate UI transitions card → form → download. **This is the only check that catches review BLOCKER B2**, and it catches it *only* on a real deployment: `next start` serves from the repo working tree, so the missing-from-bundle failure is invisible locally and the check would pass while production 500s. Treat a local pass here as no evidence at all.
7. **404 behavior** — an unknown blog/case-study slug still returns 404.
8. **Footer / Gartner attribution** *(new in v3, review M3)* — the three posts that mention Gartner (`sales-performance-management-build-vs-buy-…`, `territory-white-space-…`, `the-agent-advantage-…`) still render the trademark note in their footer, and the set of pages that render it is unchanged site-wide. v2 diffed post bodies and never looked at the footer, which is where the legal obligation actually lands.
9. **Build + lint** — `npm run build` and `npm run lint` exit 0; the build output still lists all **24** detail routes as prerendered.

### 10.3 Admin isolation (automated, part of `check-content`) — P2

> Items in §§10.3–10.5 are prefixed (**A**/**T**/**E**) rather than continuing the numbering above, because §10.1 and §10.2 each restart at 1 and a bare number would be ambiguous across five subsections.

Cheap mechanical assertions that the admin stays invisible — these catch the regression where someone "helpfully" adds a nav link:

- **A1. No inbound links** — grep the built output (or `src/components/Header.tsx`, `Footer.tsx`, and all public pages) for the admin path segment: zero matches outside `src/app/studio/**`, `src/lib/studio/**`, and `src/proxy.ts`.
- **A2. Not in `sitemap.xml`, `llms.txt`, or `llms-full.txt`** — assert the admin path appears in none of them.
- **A3. Not in `robots.txt`** — assert the admin path is *absent* (§6.5.1: listing it would publish it). **This assertion is inverted from the usual instinct and must carry an inline comment explaining why**, or a future maintainer will "fix" it.
- **A4. `noindex` is actually served** — request `/studio`, `/studio/signed-out` and `/api/studio/auth/login` and assert each response carries `X-Robots-Tag: noindex, nofollow`. This is the control that replaces the robots.txt entry, so it is the one that must be verified rather than assumed — **and after review M5 it is the *only* control on `/api/studio/*`**, since the nine per-bot rules in `src/app/robots.ts:22` carry `allow: "/"` with no disallow and therefore override the generic `disallow: "/api/"` for Googlebot and the AI crawlers. Include `/studio/signed-out` explicitly: it is exempt from the proxy's 404 (§6.5.3) and is the one admin URL a crawler can actually reach.

### 10.4 Auth and escaping tests (`node --test`, no new packages) — P2

The one place this plan adds real automated tests, because it is the one place a silent failure means unauthorized write access to the live site. `node:test` + `node:assert` are built in; wired as `npm run test:auth` and run in `prebuild` alongside `check:content`.

**Review M1 — "zero dependencies" is true only if the code is arranged for it.** v2 pointed `node --test` at `src/lib/studio/session.ts` and `google.ts`. That does not run: `node --test` cannot load `.ts` (Node 22 needs `--experimental-strip-types`), and type stripping does **not** resolve this repo's `@/*` alias from `tsconfig.json` — Node's resolver never reads `tsconfig`. Add that `package.json` pins no `engines.node` and `.nvmrc` does not exist (§3.6), and `prebuild` becomes a deploy that breaks on a day nobody touched it. Three ways out; **this plan takes (a)**:

| | Approach | Cost |
|---|---|---|
| **(a) chosen** | Auth core as plain `.mjs` with **relative** imports; `.ts` files are typed re-exports (§7.1). Tests import the `.mjs` directly | Two files per module; the "no new packages" claim survives intact |
| (b) | Add `tsx` or `esbuild` as a devDependency | One more package, and the §2 no-new-deps posture is abandoned by drift rather than decision |
| (c) | Pin `engines.node` + `--experimental-strip-types`, ban `@/*` inside `src/lib/studio/**` | Depends on an experimental flag for a security gate; the alias ban is the same discipline as (a) with worse ergonomics |

Whichever the implementer touches, **`engines.node` gets pinned in P1 regardless** — that is not optional once `prebuild` runs Node scripts. And the rule that makes (a) work is worth stating on its own: **no `@/*` import may appear in any `.mjs` under `src/lib/studio/` or `scripts/`.**

**Session cookie**
- **T1.** A valid signed cookie verifies; a payload tampered by one byte fails.
- **T2.** A cookie with a valid payload but a signature made with a *different* secret fails.
- **T3.** An expired `exp` fails even with a valid signature.
- **T4.** A cookie with the signature section stripped, empty, or `null`-ish fails — there must be no "unsigned ⇒ trusted" path.

**Allowlist — the highest-value tests here**
- **T5. `ADMIN_ALLOWED_EMAILS` unset ⇒ every email is rejected.** Fail closed.
- **T6. `ADMIN_ALLOWED_EMAILS=""` (empty string) ⇒ every email is rejected.** The specific bug this plan is most likely to ship.
- **T7.** Case and whitespace are normalized (`" Editor@Lanshore.com "` matches `editor@lanshore.com`).
- **T8.** A near-miss does not match: `editor@lanshore.com.attacker.com`, `editor@lanshore.co`, `xeditor@lanshore.com`.
- **T9.** `email_verified: false` is rejected even when the email is on the allowlist.
- **T10.** With `ADMIN_ALLOWED_DOMAIN` set, an allowlisted email outside the domain is still rejected (the two conditions are AND, not OR).

**`id_token` verification**
- **T11.** Wrong `aud`, wrong `iss`, past `exp`, and mismatched `nonce` are each rejected (table-driven, using a locally generated RSA key rather than a live Google token).
- **T12.** A token with `alg: none` or a symmetric `alg` is rejected — never trust the header's algorithm.

**Route protection**
- **T13.** `requireAdmin()` throws with no cookie, with a forged cookie, and with a valid cookie whose email has since been removed from the allowlist (proves the per-call re-check, §6.5.3).
- **T14.** Manual: `curl` each `/api/studio/*` route with no cookie → no write occurs and no useful error body is returned.

**Content escaping** (not auth, but the same "editor input is now untrusted" boundary — §6.5.6)
- **T15.** `toJsonLd()` (`src/lib/schema.ts:343-350`) escapes `</script>`, `<`, `>`, `&`, U+2028 and U+2029, so a title containing `</script><img onerror=…>` cannot break out of the JSON-LD sink. This function is pre-existing and correct; the test exists to stop it being "simplified" now that its input is editor-controlled.
- **T16.** The Markdown renderer emits raw HTML in the body as **text**, not markup (guards against a future `rehype-raw`).

### 10.5 Admin end-to-end (manual, P3, owner-driven)

- **E1.** Sign in with an allowlisted Google account → dashboard renders. Sign in with a non-allowlisted one → bare 403, no chrome, no hint about what account would work.
- **E2.** Hit `/studio` signed out → **404**, not a login redirect (§6.5.3).
- **E3.** Create a draft post → **exactly one** commit appears on `main`, containing the content file *and* the `SLUGS.lock.json` entry together (§6.5.4), with the **editor's** name/email as author; production `/blog`, `/sitemap.xml`, and the direct URL all show no trace of it (404). Two commits here means the atomic-write requirement was not implemented and every publish will emit a spurious deploy-failure email.
- **E4.** Publish it → deploy succeeds; page + sitemap + `/resources` card update; `dateModified` is what the editor set; the preview pane matched the published render.
- **E5.** Two-tab conflict: open the same item twice, publish from tab A, then publish from tab B → **409 handled as a reload prompt**, not a clobber and not a stack trace.
- **E6.** Upload a white-paper PDF → **one** commit carrying the PDF, the JSON record and the ledger entry; after the deploy, **fetch the gate on the deployed URL** (not locally) and confirm `POST /api/whitepaper` returns `{ok:true,url}` and the PDF downloads — this is the E-case that proves review B2's tracing fix on a brand-new file; HubSpot receives the submission with the right `whitepaper_requested`.
- **E7.** Deliberately break an edit (clear a required field via the API, bypassing client validation) → deploy fails, **production still serves the previous content**, failure notification arrives.
- **E8.** Remove the tester from `ADMIN_ALLOWED_EMAILS`, redeploy → their existing session 404s on the next request.
- **E9.** Sign out → cookie cleared; the back button does not restore an authenticated view.
- **E10.** *(new in v3, review B3)* **Signed out, open the bookmarked entry URL `/studio/signed-out` → the "Sign in with Google" button renders**, and the whole flow completes from there. Then confirm the exemption is not over-broad: `/studio/signed-out-x` and `/studio/signed-out/anything` still 404. v2's proxy rule 404'd the sign-in page itself, so there was no way into the admin at all.
- **E11.** *(new in v3, review B1)* Walk the ledger through every button on a scratch item: **save draft → publish → unpublish → re-publish**, and confirm **each one deploys green**. Then try to unpublish one of the 18 items that a live 301 points at (e.g. `commission-architecture-redesign`) and confirm the admin **refuses before committing** with an explanation, rather than letting the build catch it. Under v2's rule, three of those four buttons failed the deploy.

### 10.6 Not covered (stated, not hidden)

No unit tests for React components, no visual regression, no accessibility automation, and **no tests for the editor UI, the GitHub write layer, or the ledger-mutation logic** — those are covered only by the manual §10.5 pass. That is a real gap and worth naming precisely: the atomic-commit path (§6.5.4) and the per-button ledger semantics (§6.6) are the two things v3 added in response to review B1, and **E3 and E11 are their only verification.** The pure rule-checking half *is* covered, because `scripts/lib/content-rules.mjs` is plain `.mjs` that `node --test` can already load — if the implementer wants cheap insurance beyond E11, unit-testing L1–L4 costs almost nothing. The `node --test` addition is scoped to auth logic deliberately; if the owner wants a real safety net for the rest, adding a runner and a CI job is a separate decision. **Also not covered:** a penetration test of the admin. `/security-review` on the P2 diff is a code review, not an assessment.

---

## 11. Open questions (owner decisions — do not silently choose)

**A. Who actually edits?** (blocks nothing, changes the polish budget) — If the editor is Doug/marketing, the recommendation stands as written. If it turns out a developer will keep editing and the ask was really "faster publishing", the honest answer is that almost nothing needs to change. If **three or more** people will edit concurrently with review workflows, revisit the Sanity path now rather than later.

**B. Which editor UI?** — ✅ **RESOLVED 2026-08-26: build it in-app.** Not Pages CMS, Keystatic, or Tina. Rationale: sign-in on company Google identities, no third-party product holding repo write access, full control of the editing surface. Design in §6.5. The comparison of the three rejected tools is kept in §15 as the record of what was weighed.

**C. Is one build per publish acceptable?** — ✅ **RESOLVED 2026-08-26: yes.** Publish commits to `main` and Vercel rebuilds (~1–3 min). The public site keeps zero runtime data dependencies. §12 stays an appendix, not a plan.

**D. Markdown body vs. keeping the `blocks[]` model?** — ✅ **RESOLVED: Markdown** (+3 small deps), with a live preview pane in the admin (§6.5.5). *v3 note: the conversion is not lossless by default — see §8's escaping rules and round-trip assertion (review M2).*

**E. Which HubSpot subscription is actually on portal 6603479?** `docs/plans/hubspot-expansion.md:6` says "Starter" without naming the hub. If it is the Starter Customer Platform, a Content Hub Starter blog exists (1 blog, 100 posts) — still irrelevant for case studies/white papers, which need Pro-tier HubDB. Worth a 2-minute in-portal check (**Settings → Account → Subscriptions**, and whether **Content → Blog** is present) so the answer in §1 is confirmed rather than inferred.

**F. Should white papers eventually move to HubSpot?** They are lead magnets, and HubSpot is structurally the right home for gated-asset + lead-nurture. *Recommendation: no, not now* — the lead capture **already** runs through HubSpot forms; only the catalog metadata lives in the repo, and the current design lets the site serve the PDF same-origin with a server-side allowlist. Revisit only if marketing wants per-asset nurture sequences that need the asset itself in HubSpot Files.

**G. What is the final admin path?** (blocks nothing in P1; needed before P2) — `/studio` is the placeholder. **Should not be `/admin`.** Owner picks; it is unlisted but not secret (§2, §6.5.1).

**H. Who gets a Google OAuth client, and in which Google Cloud project?** (needed before P2) — Creating the OAuth client requires access to a Google Cloud project owned by Lanshore, plus the consent screen configured as **Internal** if the Workspace allows it (Internal restricts sign-in to the Workspace domain at Google's own layer — a genuine second gate, unlike the `hd` param). Confirm whether lanshore.com is a Google Workspace domain; if it is, use Internal and note it as defense in depth on top of the allowlist.

**I. Who owns secret rotation?** (needed before P3 ships) — The `GITHUB_TOKEN` expires and the site's publishing silently breaks when it does. Name a person and a date, and record both in `docs/CONTENT-EDITING.md` (§9).

**ADR:** Two decisions here are exactly the "why did we do it this way?" question someone will ask in a year, and both are now answered — record them with the `adr` skill when P1 starts: **(C)** repo-native content + rebuild-per-publish rather than a hosted CMS, and **(B)** an in-app admin with hand-rolled Google OAuth rather than an off-the-shelf CMS or `next-auth`. The second is the one a future maintainer will most want justified, because "we wrote our own auth" reads as a red flag without the scoping argument in §6.5.2.

**Reconciliation with existing plans:** this plan **does not contradict** `docs/plans/hubspot-expansion.md:44,48` (no HubSpot CMS, content stays file-based) — it keeps content in the repo and only adds an editor. It **amends** that plan's Phase 5 in one place (`hubspotValue` defaulting + the optional dropdown→text property change, §7.4). It is **additive** to `docs/plans/geo-audit.md`: no crawler, schema, or `llms.txt` behavior changes; §10.2 exists specifically to prove that.

---

## 12. Appendix — the hosted-CMS design, if Decision C flips

Specified so the fork is a decision, not a research project. **Out of scope for the work packages below.**

- **CMS:** Sanity. Free plan: 10,000 documents, 20 seats (Administrator/Viewer roles only), 1M CDN requests/mo, **public datasets only**; Growth **$15/seat/mo** adds private datasets and more roles ([sanity.io/pricing](https://www.sanity.io/pricing), read 2026-08-13). *Note:* on a public dataset, unpublished drafts are readable by anyone with the project ID — if draft confidentiality matters, budget for Growth. (Expected behavior; verify before relying on it.)
- **Fetch layer:** `src/lib/cms/client.ts` + typed mappers producing the *same* `BlogPost`/`CaseStudy`/`WhitePaper` shapes so `schema.ts` and the pages stay untouched.
- **Caching:** no `cacheComponents` in this repo, so use the current model — `fetch(..., { next: { tags: ["blog"], revalidate: 3600 } })` or `unstable_cache(..., { tags })`, with `generateStaticParams` still enumerating slugs (`node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration.md:236-374`).
- **Webhook:** `src/app/api/revalidate/route.ts` — POST, verifies a shared secret/HMAC from `SANITY_WEBHOOK_SECRET` in constant time, rejects unsigned requests with 401, then calls `revalidateTag("blog"|"case-studies"|"white-papers")`. Never accept a path from the request body unvalidated.
- **Draft/preview:** `src/app/api/draft/route.ts` using async `draftMode().enable()` (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/draft-mode.md`), reading drafts with `SANITY_API_READ_TOKEN`; production reads published only.
- **Build resilience (the requirement that bites):** wrap every build-time fetch so that a non-200/timeout falls back to the last successfully fetched snapshot committed under `content/.cache/`, and **fail the build** if a collection would render empty. Never let a CMS 500 produce an empty `/blog`.
- **Images:** add `cdn.sanity.io` to `next.config.ts` `images.remotePatterns:173-175`.
- **Effort:** roughly 3× this plan's P1, plus ongoing vendor cost and a runtime dependency.

---

## 13. Work packages

> **One implementer handles one package, end to end** — its code, its checks, and the docs it implies. **Three packages in v2** (v1 had two; the admin split the editor package in half): P1 is the content migration and is verifiable entirely on its own; P2 is the auth boundary, which must be built and security-reviewed **before** any write path exists to attach to it; P3 is the editor and the GitHub write layer. Splitting P1 per content type would triple the context cost for one shared loader and one golden-diff run. **Do not merge P3 before P2 is reviewed** — that ordering is the whole safety argument: there is never a moment when a write endpoint exists without a working gate in front of it.

### Package 1 — Repo-native content source (migration, loaders, renderer, validator)

Prerequisites: all met. Open Questions **C** and **D** are resolved (§11). This package has no admin code in it and can start immediately. **v3 grew its scope** — review B2, M2, M3 and M6 all land here.

- [ ] Capture the **golden baseline** on a clean `main`: `npm run build && npm run start`, save the **24** detail routes + every `/industries/<slug>` + `/blog`, `/case-studies`, `/resources`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt` to the scratchpad. Do this **first** — it cannot be recreated later.
- [ ] Add `gray-matter`, `react-markdown`, `remark-gfm` to `dependencies`; **pin `engines.node`** (review M1); note the deviation from the repo's no-new-deps norm in the PR description.
- [ ] Write `scripts/lib/content-rules.mjs` — plain `.mjs`, no TypeScript, no `@/*`: field validation plus ledger rules L1–L4 (§6.6). Everything else imports this; nothing reimplements it.
- [ ] Write `scripts/migrate-content.mjs` (run once as `node --experimental-strip-types …`, §8): reads the current `BLOG_POSTS`/`CASE_STUDIES`/`WHITE_PAPERS` and emits `content/blog/*.md`, `content/case-studies/*.json`, `content/white-papers/*.json`, seeding `featured`/`summary` for the five posts in `src/app/resources/page.tsx:24-62`. **Implement §8's escaping table and the round-trip assertion before generating anything** — the ten `1. `–`5. ` paragraphs are the reason (review M2). Run it; commit the generated content.
- [ ] Write `src/lib/content/loadContent.ts` (fs read at module scope, front-matter parse, slug from filename, **unconditional `draft` filtering** per §6.3, throw-on-invalid validation, `mentionsGartner` derivation per §6.8).
- [ ] Rewrite `src/lib/blog.ts`, `src/lib/caseStudies.ts`, `src/lib/whitePapers.ts` on top of it, **preserving every exported name and type**; keep the white-paper path assertions (`src/lib/whitePapers.ts:24-32`) and add per-study optional `dateModified` (falling back to `UPDATED.caseStudies`) plus optional `hubspotValue` defaulting to slug.
- [ ] **Add `outputFileTracingIncludes` to `next.config.ts`** for `/api/whitepaper` (§6.2). *Review BLOCKER B2 — without this the build is green and every gated download 500s in production.*
- [ ] Add `src/components/Markdown.tsx` (`react-markdown` + `remark-gfm`, explicit component map reproducing the block classes at `src/app/blog/[slug]/page.tsx:116-145` **and the anchor attributes at `:47-52`**, default `urlTransform` kept, **no `rehype-raw`**); replace `groupBlocks`/`linkify` usage in the blog detail page.
- [ ] **Replace `GARTNER_PATHS`' `JSON.stringify` heuristic in `src/components/Footer.tsx:23` with `p.mentionsGartner`** (§6.8). *Review M3 — the trademark obligation in `src/lib/site.ts:12-21` currently rides on `blocks[]` being part of the serialized object, and this package removes `blocks[]`.*
- [ ] Rewire `src/app/resources/page.tsx:24-62` to derive its blog list from `BLOG_POSTS`; update `src/app/case-studies/[slug]/page.tsx:50` for the optional per-study date; update `src/app/sitemap.ts:46-49` for the same, **and `:25,27,28` to derive the three index `lastmod` values from content** (§6.7); delete the now-unread `UPDATED.blogIndex`.
- [ ] Verify `src/components/CaseStudyGrid.tsx` and `src/components/WhitePaperGate.tsx` still import **types only**.
- [ ] Add `content/SLUGS.lock.json` (24 slugs + empty `retired[]`) and `scripts/check-content.mjs` implementing §10.1.1–9; wire `"check:content"` and `"prebuild": "npm run check:content"` in `package.json`. **P2 extends `prebuild` to chain `test:auth` — it must not overwrite this one** (review m2).
- [ ] Run the full §10.2 golden diff; resolve every difference or justify it in writing. Expect **zero** intentional diffs: §6.7's index dates and §6.8's case-insensitive matching were both verified to compute to today's values.
- **Ships with:** `scripts/check-content.mjs` (§10.1 cases 1–9), the migration round-trip assertion, and the golden-diff evidence (route-by-route markup diff, sitemap diff, footer/Gartner check, one Rich Results Test result for a post and a case study).
- **Verify:** `npm run check:content && npm run build && npm run lint` — all exit 0; golden diff clean; all **24** detail routes still listed as prerendered in the build output; every legacy URL in `next.config.ts:7-78` resolves to a 200. **Plus one check that cannot be run locally: deploy a preview and confirm `POST /api/whitepaper` returns `{ok:true,url}` and the PDF downloads** (§10.2.6). A local pass proves nothing about B2.

### Package 2 — The auth boundary (no editor, no write path)

Prerequisites: Open Questions **G** (final path) and **H** (Google OAuth client) answered. Largely independent of P1 and **can be built in parallel**, since it touches no content code — but the two packages **do** collide in two files (review m2): both edit `package.json`'s `prebuild`, and P2 edits `src/proxy.ts`. Whichever lands second must **chain** rather than replace: `"prebuild": "npm run check:content && npm run test:auth"`.

Ships a complete, reviewable security boundary guarding pages that do nothing yet. That is intentional: the gate is verifiable in isolation, and no write endpoint exists until P3.

- [ ] Owner creates the Google OAuth client (consent screen **Internal** if lanshore.com is a Workspace domain — §11 H) and registers both redirect URIs (§7.3). Set all six vars in Vercel; add names to `.env.example`.
- [ ] `src/lib/studio/google.mjs` (+ `.ts` typed re-export) — auth URL builder, code exchange, JWKS fetch + `kid` cache, full `id_token` verification (§6.5.2 steps 5-7). Reject `alg: none` and symmetric algorithms explicitly. Build `redirect_uri` from the `SITE_URL` constant, **never from a request header** (§6.5.2 step 3, review m5). **No `@/*` imports in the `.mjs`** (review M1).
- [ ] `src/lib/studio/session.mjs` (+ `.ts` wrapper carrying `requireAdmin()`, which needs `next/headers`) — cookie sign/verify via `crypto.subtle` (never `===` on signatures), **per-call** allowlist re-check, and the fail-closed config guard (§6.5.3).
- [ ] The three `/api/studio/auth/*` route handlers (§6.5.1), including the `state`/`nonce` cookie with `SameSite=Lax` (§6.5.2 step 2 — `Strict` breaks the callback).
- [ ] `src/app/studio/layout.tsx` (gate + `robots: {index:false,follow:false}` + admin-only chrome, **not** the public Header/Footer) and `src/app/studio/signed-out/page.tsx`. A placeholder dashboard is fine.
- [ ] `src/proxy.ts` — optimistic check → 404 for `/studio/*` **except the four exempt paths in §6.5.3, compared by exact equality, not prefix**; `X-Robots-Tag: noindex, nofollow` on `/studio/*` and `/api/studio/*`. *Review BLOCKER B3 — v2's rule 404'd `/studio/signed-out`, leaving no way to sign in at all.* **Leave the WordPress-410 and host-canonicalization logic (`:27-41`) untouched** and re-verify both still work.
- [ ] Add `node --test` + `npm run test:auth`; write §10.4 T1–T16 against the `.mjs` modules. Chain into `prebuild` **after** `check:content`, do not replace it.
- [ ] Confirm §10.3 A1–A4 pass, including the inverted robots.txt assertion and A4's `/studio/signed-out` case.
- **Ships with:** `npm run test:auth` green (§10.4), §10.5 E1–E2, **E10** and E8–E9 run manually, and a written note of which auth steps were verified against which test.
- **Verify:** `npm run test:auth && npm run build && npm run lint` exit 0 — that is the machine-checkable gate. **Additionally, and not substituting for it: run `/security-review` on this diff and resolve every finding before merge.** *Review m3 — `/security-review` is an assistant-driven review, not a shell command; record its outcome as a signed-off checklist artifact so "we ran it" is auditable. §10.6 already concedes it is a code review, not a penetration test.*

### Package 3 — Editor UI, GitHub write layer, and owner onboarding

Prerequisites: **P1 and P2 both merged.** Requires owner actions (GitHub token, Vercel notifications, HubSpot property) an implementer cannot complete alone.

- [ ] Owner creates the fine-grained PAT (single repo, Contents read+write), sets `GITHUB_TOKEN`/`GITHUB_REPO`/`GITHUB_BRANCH`, and **records the expiry date** (§11 I).
- [ ] `src/lib/studio/github.ts` — `getFile`/`listDir` plus **`commitFiles()` over the Git Data API: one atomic commit per editor action** (§6.5.4), two-level conflict detection (`sha` compare → precise 409 message; ref `PATCH` with `force: false` → race), commit authorship from the session identity, 401/403 → "publishing unavailable". *This reverses v2's "not worth it for 25 items" — the ledger makes every action multi-file, and with one-file-per-commit **every** publish would emit a failed deploy followed by a successful one.*
- [ ] `src/lib/studio/validate.ts` — a **typed re-export of `scripts/lib/content-rules.mjs`** (built in P1), not a second implementation. *Review M1: v2 said "shared by import, not by copy", but a `.mjs` build script cannot import a `.ts` module — so the shared code lives on the `.mjs` side and TypeScript wraps it, not the other way round.*
- [ ] Editor routes and forms for all three collections (§6.5.1, §6.5.5): structured fields, `pillar` as a `<select>`, repeatable `results[]`/`stack[]`/`faq[]` rows, slug create-once-then-read-only, `dateModified` defaulting to today.
- [ ] Markdown body editor with a **live preview pane using the same `<Markdown>` component as the public page** (§6.5.5) — this is what makes §6.3's no-preview-deployment rule work.
- [ ] PDF upload: `application/pdf` check plus `%PDF-` magic-byte sniff, **4 MB cap** (measured: the five current papers are 297–696 KB, so the Git Data API blob fallback v2 carried is dropped — review m4), `<slug>.pdf` normalization. The PDF, the JSON record and the ledger entry go in **one commit**.
- [ ] **Ledger maintenance and the button semantics in §6.6** — Save draft registers the slug in the same commit; Publish/Unpublish leave the ledger alone; Delete removes a never-published slug and **refuses** for a published one, offering Unpublish and explaining that removing a live URL needs a paired 301 from a developer. Unpublish is **blocked in the UI** when the slug is one of the 18 live 301 destinations (rule L4). *Review BLOCKER B1 — in v2 three of these four buttons failed the build.*
- [ ] Wire the pre-flight check: the admin runs `content-rules.mjs` **before** committing, so a ledger or field violation is an inline form error, never a Vercel failure email (§6.6).
- [ ] Enable Vercel deploy-failure notifications to the editor and to Israel; confirm a failed build leaves production serving the previous deployment.
- [ ] HubSpot: switch `whitepaper_requested` to free text (or pre-create option values) so a new white paper needs no portal work; note the outcome as an amendment in `docs/plans/hubspot-expansion.md` Phase 5.
- [ ] Write `docs/CONTENT-EDITING.md`: sign in, add/edit/unpublish a post, add a case study (with the `pillar` enum explained), upload a white paper, the `dateModified` rule ("bump on substance, not restyle" — mirroring `src/lib/contentDates.ts:1-14`), drafts, what happens after Publish and how long it takes, how to tell a deploy failed and what to do, that slug renames require a developer, **why Unpublish is the tool for "take it down" and Delete is refused for anything that was ever published (§6.6)**, that the admin does not work on preview URLs, and **the GitHub token expiry date and who rotates it**.
- [ ] Run §10.5 **E1–E11** end-to-end with the **owner** driving, not the implementer. E11 (the full ledger walk) and E6 (white-paper upload against the deployed URL) are the two that would have caught v2's blockers.
- **Ships with:** the §10.5 evidence (the resulting commits showing the editor as author **and each editor action as exactly one commit**, a two-tab 409 screenshot, a HubSpot test submission with the correct `whitepaper_requested`, and the failed-deploy notification) and `docs/CONTENT-EDITING.md`.
- **Verify:** owner publishes a real post end-to-end without developer assistance, **and then unpublishes and re-publishes it, with all three deploys green**; `npm run check:content && npm run test:auth && npm run build && npm run lint` all green on `main` afterwards. Run `/security-review` on the write layer and record the outcome as an artifact (review m3).

---

## 14. How would this fail to ship?

- **Golden diff is skipped.** Without the before-capture on `main`, "did the migration change any rendered character?" becomes unanswerable and the GEO posture is taken on faith. P1's first step is not optional.
- **B2 is "verified" locally.** `next start` reads the repo working tree, so the white-paper route passes locally whether or not `outputFileTracingIncludes` exists. The only check that means anything is a **deployed preview** (§10.2.6, §13 P1 verify). A green local run is the single most likely way this ships broken, because it looks exactly like a pass.
- **The ledger check gets "simplified" back to reading `BLOG_POSTS`.** §10.1.1 reads files on disk on purpose; sourcing it from the draft-filtered arrays is what made v2 fail the build on Publish, Unpublish and Delete. It will look like an obvious tidy-up to someone who has not read §6.6.
- **The atomic-commit requirement gets dropped for "just use the Contents API, it's simpler".** It is simpler, and it makes every editor action emit a failed deploy followed by a successful one, because no ordering of content-file-then-ledger leaves a valid intermediate state (§6.5.4).
- **`GARTNER_PATHS` is left alone** because `Footer.tsx` is not obviously part of a content migration. It is: the trademark obligation in `src/lib/site.ts:12-21` currently depends on `blocks[]` being inside `JSON.stringify(post)`, and P1 deletes `blocks[]` (§6.8). Nothing throws when this breaks.
- **The Markdown escaping is skipped** because "the migration is scripted, so it's exact". Scripted prevents typos, not reinterpretation — ten paragraphs begin with `1. ` and become list items (§8). The round-trip assertion is what makes this self-enforcing; without it the golden diff is the only net, and only if someone reads it carefully.
- **P3 merges before P2 is security-reviewed.** This is the ordering that keeps a write path from ever existing without a reviewed gate in front of it. If schedule pressure makes someone want to combine them, the answer is to ship P2 alone and let the admin sit there doing nothing for a week.
- **The auth gets "simplified" during implementation.** Skipping the `state` check, decoding the `id_token` without verifying its signature, or treating Google's `hd` as a domain guarantee are each a complete bypass, and each looks like a harmless shortcut in a diff. §6.5.2 is a checklist for exactly this reason; §10.4 is what catches it.
- **`ADMIN_ALLOWED_EMAILS` ends up meaning "allow all" when empty.** Named twice on purpose (§6.5.2 step 9, §9) and tested twice (§10.4 T5–T6). It is the single most likely serious bug in this plan.
- **Someone adds the admin path to `robots.txt`** because omitting it looks like an oversight. It is not — it would publish the URL (§6.5.1). §10.3 A3 asserts the absence and carries the explanation inline.
- **Dependency creep.** If Markdown rendering starts pulling in `rehype-raw`, a sanitizer, and a typography plugin, stop — the component map is the whole point. Same for auth: if `next-auth`, a JWT library, or a cookie library appears in the P2 diff, the scoping argument in §6.5.2 has been abandoned and the decision should be re-made explicitly rather than by drift.
- **Scope creep into other content types.** Services/industries/glossary stay in `src/lib/`. If the owner wants those editable too, that is a follow-up using the identical pattern.
- **Scope creep into "real" user management.** Roles, invitations, a user table, or a second auth provider mean this design has outgrown its assumptions (§2). Re-plan rather than extend.

---

## 15. Sources (all verified 2026-08-13 unless labeled)

**Vercel**
- [Vercel CMS Integrations](https://vercel.com/docs/integrations/cms) — CMS support is third-party integrations (Contentful, Sanity, Sitecore XM Cloud, …); env import, Edit Mode, Draft Mode, deploy-from-CMS.
- [Vercel Marketplace — CMS category](https://vercel.com/marketplace/category/cms) — all listed CMS products are external/third-party.
- [Vercel Edit Mode / Content Link](https://vercel.com/docs/edit-mode) — Content Link available on Pro and Enterprise plans; supported CMS list.

**HubSpot**
- [KB — Create and publish blog posts](https://knowledge.hubspot.com/blog/create-and-publish-blog-posts) — blog tool supported on "all products and plans".
- [CMS Blog Posts API](https://developers.hubspot.com/docs/reference/api/cms/blogs/blog-posts) — `GET /cms/v3/blogs/posts`, `/{postId}`, `/draft`, `push-live`; requires the `content` scope; no tier stated in the docs.
- [HubDB developer docs](https://developers.hubspot.com/docs/cms/data/hubdb) — CMS/Content Hub **Professional or Enterprise** to use HubDB data in pages; Marketing Hub Enterprise for programmable email; external access via the HubDB API.
- [Content Hub pricing](https://www.hubspot.com/pricing/content) — Free $0; Starter $7/seat/mo; Professional $450/mo (3 seats); Enterprise $1,500/mo (5 seats); HubDB and serverless functions excluded from Free/Starter; Free/Starter = 1 blog, 100 posts, HubSpot branding.
- [KB — Create and edit custom objects](https://knowledge.hubspot.com/object-settings/create-custom-objects) — custom objects are **Enterprise-only** across all hubs.

**Google OAuth / OpenID Connect (for §6.5.2 — verify each against current docs at implementation time)**
- Google Identity — *Using OAuth 2.0 for Web Server Applications* (`developers.google.com/identity/protocols/oauth2/web-server`) — authorization-code flow, `state`, `redirect_uri` registration, token exchange endpoint.
- Google Identity — *OpenID Connect* (`developers.google.com/identity/openid-connect/openid-connect`) — `id_token` claims, the `iss`/`aud`/`exp`/`nonce` validation rules, JWKS at `https://www.googleapis.com/oauth2/v3/certs`, and the note that **`hd` must be verified against the `id_token` claim rather than trusted as a request parameter**.
- **UNVERIFIED this session:** both pages are cited from prior knowledge, not fetched on 2026-08-26. The implementer must read them before writing the callback — this is the one part of the plan where a stale detail is a security bug rather than a rework.

**GitHub API (for §6.5.4 — same caveat)**
- REST — *Repository contents* (`docs.github.com/en/rest/repos/contents`) — `GET`/`PUT`/`DELETE` contents, base64 payload, the `sha` optimistic-lock and its 409, `author`/`committer` fields, size limits.
- REST — *Git database* (blobs → trees → commits → refs, and `PATCH /git/refs` with `force: false`) — **chosen in v3** as the write path, because the slug ledger makes every editor action multi-file (§6.5.4). Confirm the ref-update non-fast-forward semantics before relying on them for conflict detection.
- Fine-grained PAT permissions (`Contents: read and write`) and expiry behavior.
- **UNVERIFIED this session** — confirm the size limit and 409 semantics before relying on the ordering argument in §6.5.4.

**Next.js 16 admin-relevant behavior (bundled docs in this repo — authoritative for the installed version)**
- `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md:29` — Proxy is for "optimistic checks"; **"should not be used as a full session management or authorization solution."** This is the source for §6.5.3's layering.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:223,774` — Middleware was renamed to Proxy in v16.0.0; **Proxy defaults to the Node.js runtime** and the `runtime` config option throws if set. (So `node:crypto` is available in `src/proxy.ts`; the plan still specifies Web Crypto for portability across proxy, route handlers, and tests.)
- `node_modules/next/dist/docs/01-app/02-guides/authentication.md` — the Data Access Layer pattern this design follows (verify in every page and handler, not once at the edge).
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md:80-108` — **read 2026-08-26 for v3.** Output file tracing can "fail to include required files"; `outputFileTracingIncludes` keys are route globs matched against the route path, values are globs resolved from the project root. This is the source for §6.2's fix to review BLOCKER B2.

**Candidate CMS tools — considered and rejected in v2 (Open Question B), retained as the record of what was weighed**
- [Pages CMS](https://pagescms.org/) — MIT, free (hosted at `app.pagescms.org`, also self-hostable/deployable to Vercel), edits Markdown + YAML front matter and media directly in a GitHub repo; some features marked "Soon".
- [Thinkmill/keystatic README](https://github.com/Thinkmill/keystatic) — MIT; "Things are experimental at the moment"; Markdown/YAML/JSON, no DB, connects directly to GitHub; built for Next.js/Remix/Astro.
- [TinaCMS pricing](https://tina.io/pricing) — Free $0 (2 users); Team $24/mo (3 users); Team Plus $41/mo (editorial workflow); Business $249/mo; cloud-hosted.
- [Sanity pricing](https://www.sanity.io/pricing) — Free: 10,000 documents, 20 seats (Administrator/Viewer roles), 1M CDN requests/mo, public datasets only; Growth $15/seat/mo adds private datasets.
- [Storyblok pricing](https://www.storyblok.com/pricing) — Starter free: 1 seat, 1 space, 100k API requests/mo; Growth $99/mo (5 seats).
- **Contentful — UNVERIFIED this session:** `contentful.com/pricing` returned HTTP 429. Third-party summaries put the first paid tier around $300/mo+; treat as unverified and re-check before citing to the owner.

**Next.js 16.2.10 (bundled docs in this repo — authoritative for the installed version)**
- `node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration.md` — ISR, `export const revalidate`, `generateStaticParams`, `revalidatePath`/`revalidateTag` from Route Handlers, "not supported for static export", stale-on-error behavior.
- `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` / `09-revalidating.md` — Cache Components (`use cache`, `cacheLife`, `cacheTag`, `updateTag`) apply only when `cacheComponents: true`, which this repo does **not** set.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/draft-mode.md` — async `draftMode()`, `__prerender_bypass` cookie.

**Verified in-repo on 2026-08-26 during the v3 review pass** (these were assertions in v2; they are now measurements):

- **14** case studies in `src/lib/caseStudies.ts`, **13** unique destination slugs in `CASE_STUDY_REDIRECTS`, **5** posts, **5** white papers → **24** items, not 25.
- **10** `p` blocks in `src/lib/blog.ts` begin with an ordered-list marker (`1. `–`5. `); exactly **1** contains any of `* _ [ ] |`; **0** contain a backtick.
- All **5** posts carry `dateModified: 2026-07-11`; `UPDATED.blogIndex` = `2026-07-11`, `UPDATED.caseStudies` = `2026-07-08`, `UPDATED.resources` = `2026-07-15` — so §6.7's derived index dates are byte-identical today.
- **3** posts mention Gartner; case-sensitive and case-insensitive matching select the same 3, so §6.8 introduces no day-one diff.
- The five white-paper PDFs are **297 KB – 696 KB**.
- `src/app/robots.ts:22` emits nine per-bot `allow: "/"` rules with no `disallow`, so the generic `disallow: "/api/"` at `:21` does not bind them.
- Exactly **one** runtime (non-page) consumer of the three loaders exists: `src/app/api/whitepaper/route.ts:3`.
- No `engines.node`, no `.nvmrc`, no `vercel.json`, no `.github/`.

**Estimates explicitly not verified:** Vercel build duration for this project (~1–3 min is an estimate — measure `npm run build` locally); the claim that Sanity public datasets expose unpublished drafts (expected behavior, verify before relying on it); GitHub's ref-update and Contents-API semantics cited above (unfetched this session — see the caveat in that block).

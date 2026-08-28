# Intent — studio-editor-write-path (Package 3)

## Problem

P1 put the content in files. P2 put a gate in front of `/studio`. Neither made anything editable — the dashboard is a placeholder and there is no write path.

P3 is the package that actually answers the owner's original request:

> *"We want to update Blogs, Case Studies and White Papers without having to do git commits and redeploy on Vercel."*

An editor signs in, edits in a browser form, presses Publish, and the app commits the content file **and** the slug ledger to `main` in **one atomic commit** through the GitHub Git Data API. Vercel rebuilds. The editor never touches git, GitHub, or Vercel.

## Done-criteria

**The write path**

- [ ] Saving a draft produces **exactly one** commit containing the content file **and** the `SLUGS.lock.json` entry. Two commits means the atomic requirement was not implemented and every publish emits a spurious deploy-failure email.
- [ ] The commit's author is the **signed-in editor's** name and email, so `git log` answers "who published this?" with no audit table.
- [ ] Commit message is generated: `content(blog): update "<title>" [studio]`.
- [ ] Editing an item that changed underneath you produces a **precise reload prompt**, not a clobber and not a stack trace.
- [ ] A branch that moves between read and write is caught by `force: false` and retried once.

**The four buttons (source plan §6.6)**

- [ ] **Save draft** — file written `draft: true`; slug appended to the live list **in the same commit**.
- [ ] **Publish** — `draft: false`; ledger unchanged.
- [ ] **Unpublish** — back to `draft: true`; ledger unchanged; **blocked in the UI** when the slug is one of the 18 live 301 destinations.
- [ ] **Delete** — allowed for a never-published item (slug removed from the ledger); **refused** for one that has been published, with an explanation offering Unpublish instead.
- [ ] Every button leaves the repo in a state `check:content` accepts. Under the v2 design three of these four failed the build.

**Validation happens before the commit, not after**

- [ ] A field or ledger violation is an **inline form error**; no commit is attempted. An editor must never learn about it from a Vercel failure email.
- [ ] Validation calls `scripts/lib/content-rules.mjs`. No rule is reimplemented.

**The editor UI**

- [ ] Blog form with a `<textarea>` body and a **side-by-side live preview rendering through the same `<Markdown>` component the public page uses** — this is what makes preview deployments unnecessary.
- [ ] Case-study form with `pillar` as a `<select>` over the 4-value enum, never free text, plus repeatable `results[]` / `stack[]`.
- [ ] White-paper form with PDF upload: `application/pdf` **and** `%PDF-` magic-byte sniff, **4 MB** cap, filename normalised to `<slug>.pdf`.
- [ ] Slug is free to set on create (validated, collision-checked) and **read-only forever after**, with inline text saying renames need a developer because they require a paired 301.
- [ ] Typing stays client-side; keystrokes never generate commits.

**Security**

- [ ] Every write route calls `requireAdminRoute()` as its **first statement**, before reading the body.
- [ ] No write route is reachable without a valid session.

**Documentation**

- [ ] `docs/CONTENT-EDITING.md` written for a non-developer, covering the `GITHUB_TOKEN` expiry date and who rotates it.

## Non-goals

- **No third-party CMS.** Settled upstream.
- **No rich-text editor.** Plain `<textarea>` plus live preview; no new dependencies.
- **No visual page builder**, no layout control. Editors edit content.
- **No editing of anything outside the three collections.** Services, pillars, industries, glossary and `contentDates.ts` stay developer-owned.
- **No slug renames.** They require a paired 301; the UI explains this rather than enabling it.
- **No real commits to the repository during implementation** — owner decision A2 below.
- **No new npm packages.**

## Constraints

- **Target branch is `main`**, which now contains P1+P2 (merged `1fa4346`).
- **Unit tests only; the write path must never contact GitHub during development.** The client takes an injectable `fetch`, mirroring `createJwksCache` (`google.mjs:131`).
- Anything to be tested lives in `.mjs` with **no `@/*` imports**.
- `requireAdminRoute()` is currently **uncalled and untested** (`02-survey.md` S9). P3 is its first caller and must not treat it as a proven control.
- The Contents API is sufficient for the PDFs (largest is 696 KB); the Git Data API blob fallback is dropped.

## Assumptions

- **A1 — GitHub's Git Data API behaves as §6.5.4 describes.** `UNVERIFIED` — external, and the owner has deferred real API calls. Unit tests will pin *our* payloads and *our* handling of documented responses; they cannot prove GitHub accepts them.
- **A2 — Owner decision, 2026-08-27:** verification is **unit tests only, no real commits**. The true end-to-end (source plan E3, E5, E6, E11) remains owner-run on a deployment.
- **A3 — Owner decision, 2026-08-27:** P3 targets `main`, and P1+P2 were merged first to make that coherent.
- **A4 — Nobody has completed a real Google sign-in yet.** P2's gate is code-reviewed and unit-tested but never exercised in anger. P3 builds a write path behind it. **P3 must not be merged until that sign-in succeeds** — carried from the source plan's "do not merge P3 before P2 is reviewed".
- **A5 — The source plan contradicts itself on the unauthenticated response.** §6.5.3 specifies **404** (which P2 shipped, and on which the cloaking rationale depends); §10.5 E1 says "bare 403". Treating **404 as correct** and E1 as stale. Flagged rather than silently reconciled.
- **A6 — "Was this ever published?" is not answerable from current state** (`02-survey.md` S6). The design must add a durable signal or the Delete rule cannot be enforced as specified.

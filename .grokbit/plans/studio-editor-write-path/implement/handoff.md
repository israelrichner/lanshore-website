# Handoff — studio-editor-write-path (P3)

`hand_back_cycle: 0` · `snapshot: none`

## What this is

The editor and the write path. An editor signs in, edits in a browser form, presses Publish, and the app commits the content file **and** the slug ledger to `main` in one atomic commit. Vercel rebuilds. No git, no GitHub, no Vercel.

**This completes the owner's original request.** P1 put the content in files, P2 put a gate in front, P3 makes it editable.

## Tasks

**12 of 12 done. 0 blocked. 0 counting deviations of 3.**

## Verification

| Check | Result |
|---|---|
| `npm run build` (clean) | green — all five gates |
| `npx tsc --noEmit` / `npm run lint` | exit 0, zero warnings |
| Test suite | **107 pass, 0 fail** |
| P2 proxy baseline | 16/16, 0 unexpected |
| Admin-only field leak | none — `draft`/`publishedOnce` absent from public output |
| Public semantics vs P1 golden | visible text **0**, JSON-LD **0**, anchors **0** differences across 56 captures |
| `sitemap.xml` / `robots.txt` / `llms.txt` / `llms-full.txt` | raw byte-identical |

## What a test pass should look at hard

1. **The write path has never contacted GitHub.** By owner decision (A2). 14 tests pin the commit payload and 10 pin the ledger operations against a fake, but **nothing proves GitHub accepts our requests.** Source plan **E3** is the check that matters: save a draft and confirm **exactly one** commit appears on `main` carrying the content file *and* `SLUGS.lock.json`. Two commits means the atomic requirement did not land.
2. **No form has ever been rendered in a browser.** No headless browser here. Five editor surfaces — dashboard, blog, case study, white paper, and the shared shell — verified only by types, lint, build and unit tests on the logic beneath them.
3. **`publishedOnce` is load-bearing and new.** It is the only thing standing between an editor and permanently deleting a once-live URL. T0 strips it from public records; T4 proves publish→unpublish→delete is refused. Worth attacking.
4. **The PDF path is untested end to end.** `pdf-check.mjs` has 9 tests, but no actual PDF has been uploaded through the route to GitHub. E6 covers it.
5. **Two-tab conflict handling** is unit-tested but never seen in a browser (E5).

## Deviations

**0 counting, 7 recorded.** Two worth reading:

- **D3** — the golden-diff normalizer was missing generated-metadata-image hashes. Survived three wrong explanations before a worktree rebuild of the golden commit proved the hash is environment-derived.
- **D7** — T11's "zero new differences" is **not literally met**. All 56 captures carry one extra `<script>` tag: **+147 bytes**, measured against a rebuild of pre-P3 `main`. No studio code on public pages, no admin identifiers in any client chunk, and nothing a reader or crawler sees changed. Accepted with numbers, not waved through.

## Still open for the owner

- **A9 — `docs/CONTENT-EDITING.md` ships with two visible placeholders**: the `GITHUB_TOKEN` expiry date and who rotates it. Only you have them. The failure mode is publishing silently stopping, about a year out.
- **A8** — HubSpot `whitepaper_requested` is still a dropdown; a brand-new white paper needs one portal step until it becomes free text.
- **A2/A1** — E3, E5, E6 and E11 remain owner-run. E3 is the highest-value one.
- **A7** — no React component tests, consistent with §10.6.

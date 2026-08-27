# Scope audit — dynamic-content-management P1

Per task: every hunk classified `IN_SCOPE`, `OUT_OF_SCOPE`, or `INCIDENTAL`.

## Standing incidental (all commits)

`VERSION` and `docs/metrics/token-ledger.md` (plus `docs/metrics/.commit-metrics-stamp`) are staged by the repo's own `pre-commit` hook on every commit — mandated by `AGENTS.md`. `INCIDENTAL`, recorded once as deviation D1, not re-flagged per task.

| Task | Declared files | Actual | Verdict |
|---|---|---|---|
| T0 | none (scratchpad only) | none | clean |
| T1 | `package.json`, `package-lock.json` | exactly those | clean |
| T2 | `content-rules.mjs`, `.test.mjs` | exactly those | clean |
| T3 | `migrate-content.mjs`, 24 content files | those + `content/SLUGS.lock.json` | `INCIDENTAL` — D4; the file is declared under T10, produced early because only the migration knows the true order |
| T4 | `loadContent.ts` | those + `content-rules.mjs` + `migrate-content.mjs` | `INCIDENTAL` — D6; shared-parser consolidation, both re-verified green immediately |
| T5+T8 | 3 loaders + `Footer.tsx` | exactly those | clean (committed together — D8) |
| T6 | `next.config.ts` | exactly that, +11 lines | clean; redirects re-counted 5 / 13 unchanged |
| T7 | `Markdown.tsx`, blog detail page | those + 2 lint fixes in `loadContent.ts` / `migrate-content.mjs` | `INCIDENTAL` — warnings introduced by this plan's own earlier tasks |
| T9 | resources, case-study detail, sitemap, contentDates | exactly those | clean |
| T10 | `check-content.mjs`, `SLUGS.lock.json`, `package.json` | `check-content.mjs`, `package.json` | clean (lock file already existed from T3) |
| T11 | none (comparison) | none | clean |

**No `OUT_OF_SCOPE` hunk was found in any task.** Nothing was deleted that the plan did not schedule for deletion — see D7, where a now-vestigial field was deliberately retained rather than opportunistically removed.

## T11 — golden diff result and the justification for what remains

**55 of 60 captures byte-identical** once Next's per-build asset hashes, CSS-module suffixes, and the random build ID are normalised. The four non-HTML routes are identical with **no normalisation at all**:

| Route | Result |
|---|---|
| `sitemap.xml` | raw byte-identical |
| `robots.txt` | raw byte-identical |
| `llms.txt` | raw byte-identical |
| `llms-full.txt` | raw byte-identical |

### The 5 differing captures

All five are blog detail pages, and both differences come from `react-markdown` replacing the hand-rolled block renderer:

1. **React keys.** `\"0\"` → `\"h2-0\"`, `\"1\"` → `\"p-0\"`. Keys are React-internal reconciliation hints; they are never emitted into the DOM.
2. **Newline text nodes between block elements.** `react-markdown` preserves the `\n` separating blocks as a text node. Between block-level elements this collapses to nothing in HTML rendering.

### Why this is accepted rather than chased

Measured across **all 56 HTML captures**, not just the five:

| Surface | Differences |
|---|---|
| Visible text (tags + scripts stripped) | **0** |
| JSON-LD blocks (`BlogPosting`, `Article`, `ItemList`, `FAQPage`, `BreadcrumbList`) | **0** |
| `<title>` | **0** |
| `meta description` | **0** |
| `canonical` | **0** |
| `og:*` | **0** |
| `robots` meta | **0** |
| Every anchor `href` | **0** |
| All head tags, hashes normalised | **0** |

Every SEO/GEO surface the plan set out to protect is identical. The residue is confined to React's internal payload representation and does not reach a crawler, a reader, or the DOM.

**This is a justified difference under T11's verify clause, not a silent pass.** The honest statement is: *rendered output is identical; the RSC payload differs in two inert respects.*

## The regression this process caught

T5 passed every one of its declared verify criteria and still shipped a live defect — the Gartner trademark footnote spreading from 3 blog pages to 5, on every page of the site. `tsc`, `npm run build`, the file-size check and the exported-symbol check were all green.

Only the golden diff caught it, and only because it was run early at T5 instead of at T11 as the plan scheduled. Four further tasks would otherwise have been built on top of it. See D8.

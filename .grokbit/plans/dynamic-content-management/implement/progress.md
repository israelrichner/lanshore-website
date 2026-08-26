# Progress — dynamic-content-management P1

The session's memory. If the process dies, this is what knows where things stand.

| Task | State | Commit | Note |
|---|---|---|---|
| T0 — golden baseline | **done** | (no repo files) | 60 files captured: 56 HTML + sitemap.xml + robots/llms/llms-full. Verified >=30 HTML. |
| T1 — deps + engines pin | pending | | dependency gate (Loop I4) required first |
| T2 — content-rules.mjs | pending | | |
| T3 — migrate-content.mjs + 24 files | pending | | |
| T4 — loadContent.ts | pending | | |
| T5 — rewrite 3 loaders | pending | | |
| T6 — outputFileTracingIncludes | pending | | |
| T7 — Markdown.tsx + blog detail | pending | | |
| T8 — Footer mentionsGartner | pending | | |
| T9 — resources/sitemap/dates | pending | | |
| T10 — SLUGS.lock + check-content | pending | | |
| T11 — golden diff | pending | | |

## T0 — done

- **verify:** 56 `.html` captures (needed >= 30); `sitemap.xml` 9224 B, `robots.txt` 394 B, `llms.txt` 6267 B, `llms-full.txt` 24217 B — all non-empty. **PASS**
- Route counts from the sitemap match the survey exactly: blog **5**, case-studies **14**, industries **6**; 56 sitemap URLs total.
- Captured from `npm start` on the untouched tree, build green, before any edit.
- Golden dir: `C:/Users/israe/AppData/Local/Temp/claude/C--Users-israe-Projects-lanshore-web/6a245150-5817-46da-8382-a45356e2fdf7/scratchpad/golden`
- Capture script kept at `../scratchpad/capture.mjs` so T11 re-runs it identically against a fresh server.

## Open assumptions bearing on remaining tasks

- **A3** — T6 cannot be truly verified locally; its verify proves config presence only.
- **A4** — T7's autolink behavior vs. old `linkify` is unproven until T11.
- **A5** — T9's derived index dates are asserted by the source plan, not yet computed.

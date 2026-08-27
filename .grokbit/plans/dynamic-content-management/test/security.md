# Security — dynamic-content-management P1

**Date:** 2026-08-27 · **Scope:** `dbfd6b1..HEAD` (11 commits, 64 files, +6467/−1519)

## Verdict: no CRITICAL, no HIGH. Two INFO items.

## CRITICAL

**None.**

## HIGH

**None.**

## MEDIUM

**None.**

## Checks performed

### Secrets in the diff or staged files — CLEAN

Pattern scan for API keys, tokens, private keys, `ghp_`/`github_pat_`/`xox*`/`sk-`/`AKIA` prefixes. Every hit was **prose in planning Markdown** discussing the *word* "secrets" (e.g. "P2/P3 need owner-supplied secrets"). No credential material.

No `.env`, `.pem`, `.key` or credential-shaped file is committed. `.gitignore` covers `.env*`. The repo's local `.env` remains untracked.

**This change introduces no new env vars** — the set read by the built code is unchanged.

### Injection / dangerous sinks — CLEAN

No `dangerouslySetInnerHTML`, `eval`, `new Function`, `child_process`, or `innerHTML` introduced. The only grep hit for `rehype-raw` is a comment stating it is deliberately *not* used.

### XSS through the new Markdown renderer — TESTED, INERT

This is the most security-relevant change: a Markdown renderer is introduced that in P3 will render **editor-supplied** input. Verified empirically by rendering hostile inputs through the same configuration as `src/components/Markdown.tsx` (`remark-gfm`, no `rehype-raw`, default `urlTransform`):

| Input | Output | Verdict |
|---|---|---|
| `<script>alert(1)</script>` | `&lt;script&gt;…` | inert — entity-escaped |
| `<img src=x onerror="alert(1)">` | `&lt;img …&gt;` | inert — entity-escaped |
| `<iframe src="https://evil.example">` | `&lt;iframe …&gt;` | inert — entity-escaped |
| `<a href="…" onclick="alert(1)">` | `&lt;a …&gt;` | inert — entity-escaped |
| `<svg/onload=alert(1)>` | `&lt;svg/onload…&gt;` | inert — entity-escaped |
| `[x](javascript:alert(1))` | `<a href="">` | scheme **stripped** by default `urlTransform` |
| `[x](data:text/html;base64,…)` | `<a href="">` | scheme **stripped** |
| `![x](javascript:alert(1))` | `<img alt="x"/>` — no `src` | scheme **stripped**; empty element only |

**All eight inert.** No live tag, no event-handler attribute, no dangerous URL scheme survived.

*Method note, for honesty:* the first two detector passes reported false positives — they regex-matched `onerror=` / `onclick=` **inside already-escaped text**, and flagged the legitimate `<img>` that markdown image syntax creates. The corrected detector distinguishes real elements from entity-encoded characters. The finding is no vulnerability; the earlier "LIVE" lines were a bug in the probe, not in the code.

**Standing requirement for P3:** this posture holds only while `rehype-raw` stays out and `urlTransform` stays at its default. Both are load-bearing security controls, not style choices, and are commented as such in `Markdown.tsx`.

### Path traversal via white-paper `file` — DEFENDED IN DEPTH

`file` is returned to the browser as a download URL, so a bad value is a same-origin escape rather than a cosmetic bug. Three independent controls:

1. `content-rules.mjs` requires `file` to equal `/whitepapers/<slug>.pdf` **exactly** — tested against `https://evil.example/x.pdf`, `//evil.example/x.pdf`, `/whitepapers/../../etc/passwd`, `/uploads/….pdf`, all rejected.
2. `slug` derives from the **filename** and must match `/^[a-z0-9][a-z0-9-]*$/`, so `..` cannot enter through a filename.
3. `src/lib/whitePapers.ts` retains its original module-load assertions, which throw and fail the build.

Live probe: unknown paper → `400`, valid paper → the expected same-origin path.

### New endpoints / authn / authz — NONE ADDED

No route handler, middleware or proxy file was added or modified. `src/proxy.ts` untouched. P1 adds no auth surface; that is P2's scope and is not present.

### Filesystem reads — SAFE

`loadContent.ts` reads `path.join(process.cwd(), "content")` at module scope. No user input reaches a path. Directory listing is filtered by extension and slug-validated.

### Dependencies added this session

`gray-matter` 4.0.3, `react-markdown` 10.1.0, `remark-gfm` 4.0.1 — all MIT, all registry-verified (not hallucinated names), weekly downloads 9.0M / 33.1M / 38.5M.

`npm audit` reports **6 pre-existing high-severity advisories** (`next`, `nanoid`, `brace-expansion`, `postcss`, `sharp`). **None introduced by this change** — verified by checking the pre-change lockfile: the flagged `js-yaml` range (4.0.0–4.3.0) is hit by `4.3.0` via **eslint**, already present before this session.

## INFO-1 — `gray-matter` pulls an end-of-life `js-yaml` 3.x

`gray-matter@4.0.3` depends on `js-yaml@3.15.2`. That is **outside** the range npm flags (4.0.0–4.3.0), so it does not appear in `npm audit`, but 3.x is unmaintained and the advisory text for the `!!omap` quadratic-CPU issue notes the fix was *not backported*.

**Exposure here is low:** the YAML parsed is front matter in repo-owned files, at build time, not attacker-controlled input on a request path. `gray-matter` was last published 2023-07 — mature rather than abandoned, at 9M weekly downloads.

**Revisit at P3**, when front matter becomes editor-supplied. Still authenticated-allowlist input parsed at build time, not anonymous input, so the risk stays bounded — but the assumption should be re-stated rather than inherited silently.

## INFO-2 — `NEXT_PUBLIC_GA_TRACKING` is undeclared in `.env.example`

Read by the built code, absent from `.env.example`. **Pre-existing** — it arrived with the GA4 commit on `preview/faq-agentic-spm`, not from this change. Not a defect of this work; noted because the env-parity check surfaced it and silently dropping it would be the omission this phase exists to prevent.

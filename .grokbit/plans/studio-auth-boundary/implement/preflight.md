# Preflight — studio-auth-boundary (P2)

Run once, 2026-08-27, before any code edit.

## Entry conditions

| # | Condition | State |
|---|---|---|
| 1 | `plan.md` exists, approval ticked | **YES** — ticked by owner 2026-08-27 |
| 2 | Working tree clean | **YES** — `snapshot: none` for this session |
| 3 | Preflight passes | **YES** — see below |
| 4 | `test/baseline.md` exists for non-`none` baselines | **YES** — committed `97ab444`, validated 16/16 |

Condition 4 is the one P1 failed. It is satisfied here, so P2's verify will not run in reduced mode.

## Version control

| Check | State |
|---|---|
| git installed, inside a repo | YES |
| identity | `Israel Richner <israel.richner@gmail.com>` |
| branch | `feat/content-migration-p1` (pushed, 12 commits ahead of `preview`) |
| `.gitignore` covers secrets | YES — `.env*`, `node_modules`, `/.next/`, `/out/` |

**`snapshot: none`.** The tree was clean at preflight, so no dirty-tree stash was taken for this session and Step 6 has nothing to restore.

**Separate, still-outstanding:** `stash@{0}` from the P1 session holds `.grok/`/`.claude/`/`AGENTS.md`/`fixtures/` scaffolding belonging to `preview/faq-agentic-spm`. It is **not** this session's snapshot and must not be popped here. Restore with `git checkout preview/faq-agentic-spm && git stash pop`.

## Runtime and dependencies

| Item | State |
|---|---|
| Node | v22.20.0 (satisfies `engines.node >=20.9.0`, pinned in P1) |
| npm | 10.9.3 |
| `node_modules` | installed, no lockfile drift observed |
| Monorepo | No — single package at repo root |

**P2 adds no dependencies.** The auth core is plain `.mjs`; `node --test` is a Node builtin. No dependency gate (Loop I4) should fire during this plan — if one does, that is itself a deviation.

## Test suite state

**Not "no suite" any more** — P1 established one. It is narrow but real:

| Command | Result now |
|---|---|
| `npm run test:rules` | **30 pass, 0 fail** |
| `npm run check:content` | **OK** — blog 5, caseStudies 14, whitePapers 5; 5 + 13 redirect destinations guarded |
| `npm run lint` | exit 0, zero warnings (P1 close-out) |
| `npm run build` | green (P1 close-out) |

## Pre-existing failures

**None.** Any red from here is mine.

## Baseline on record

`test/baseline/proxy-behaviour.mjs` — 16 rows, validated exit 0 against this exact tree:

- 6 retired-WordPress 410 rows — **MUST NOT CHANGE**
- 4 host-canonicalization rows — **MUST NOT CHANGE** (`lanshore.com` → header absent; non-canonical → `noindex, nofollow`)
- 6 admin-surface rows — expected to change in P2, recorded so the change is deliberate

Replay needs a running server on :3000.

## Ports / external services

`npx next start` binds **:3000**, used by T7/T8/T12 verifies. No external service is needed to build. Google's OAuth endpoints are needed only for a real sign-in, which is **out of scope for every task here** — `01-intent.md` A2 records that the tests prove our verifier rejects bad tokens, not that it accepts Google's real ones.

## Commit hook

`.git/hooks/pre-commit` bumps `VERSION` and appends to `docs/metrics/token-ledger.md`, staging both, on every commit. Python 3.11.9 present. Same standing incidental as P1 — recorded once in `deviations.md` as D1, not re-flagged per task.

## Note carried from baseline mode

Two verify commands in `plan.md` (T8, T11) were corrected **before** implementation because baseline measurement proved them unrunnable. Both corrections are recorded in `test/baseline.md` § Plan corrections applied. Nothing was built at the time, so this is not plan-editing-to-match-the-build.

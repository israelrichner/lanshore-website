# Preflight — dynamic-content-management P1

Run once, 2026-08-26, before any code edit.

## Version control

| Check | State |
|---|---|
| git installed | YES |
| inside a repository | YES |
| `user.name` / `user.email` | `Israel Richner` / `israel.richner@gmail.com` — configured |
| working branch | `feat/content-migration-p1`, cut from `preview/faq-agentic-spm` @ `dbfd6b1` |
| `.gitignore` covers secrets/debris | YES — `node_modules`, `.env*`, `/.next/`, `/out/` |

**Base branch is NOT `main`.** The source plan said to baseline on clean `main`; that is a defect in the plan (survey S0). Owner confirmed the preview branch as the base.

## Dirty-tree snapshot

Entry condition 2 was satisfied **dirty** (51 uncommitted changes). Snapshot taken **before** the first Write:

```
stash@{0}  On feat/content-migration-p1: pre-implement snapshot dynamic-content-management (grok/claude scaffolding only)
```

**This is a SELECTIVE stash, not `git stash push -u` over the whole tree.** A blanket stash would have swept away `docs/plans/dynamic-content-management.md` and its review — both **untracked** — which are this plan's own source documents. Stashed paths were limited to `.grok`, `.claude`, `AGENTS.md`, the two `AGENTS.md.bak-*` files, and `fixtures`.

Deliberately left in the tree: `docs/plans/dynamic-content-management.md`, `docs/plans/dynamic-content-management.review.md`, `.grokbit/`.

**Restore note for Step 6.** The stashed content is scaffolding belonging to `preview/faq-agentic-spm`, and it has **zero overlap with this plan's scope** (no `src/`, `next.config.ts`, `package.json`, `content/`, or `public/` paths). Auto-popping it onto this feature branch would pollute the migration diff with 40+ unrelated `.grok/` files. It will therefore **not** be auto-popped here; the handoff must tell the user to restore it on `preview/faq-agentic-spm`, where it belongs. This is a recorded, deliberate deviation from Step 6's default — the stash is preserved, not dropped.

## Runtime and dependencies

| Item | State |
|---|---|
| Node | v22.20.0 |
| npm | 10.9.3 |
| `engines` declared in `package.json` | **NO** — T1 pins it |
| `node_modules/` | present, 291 entries |
| `package-lock.json` | present (2026-07-08), no drift observed |
| Monorepo? | No — single package at the repo root |

Runtime deps before T1: `lucide-react`, `next` 16.2.10, `react` / `react-dom` 19.2.4.

## Test suite

**There is no test suite configured.** No `test` script in `package.json`; no `*.test.*` file anywhere in the repo.

This is the "no suite configured" state, not "suite green" — a materially worse starting point. Consequences:

- No task can verify via unit tests except T2, which introduces `node --test` (a Node 22 builtin, no new package) for the validation module only.
- `npm run build` is the backstop verify for most tasks.
- **The golden diff (T11) is the only genuine regression detector in this plan.**

Setting up a real test framework is a design decision, out of scope here (source plan §2 non-goals, amended at §10.4).

## Pre-existing failures

**None.** `npm run build` was run on the untouched tree and exited 0, prerendering all routes: 5 `/blog/[slug]`, 14 `/case-studies/[slug]`, 6 `/industries/[slug]`, 9 `/spm/[slug]`.

No pre-existing red to chase. Any build failure from here is mine.

## Ports / external services

`npm start` binds **:3000**. Used by T0 and T11 only; stopped between. No external service is required by the build — the public site has no runtime data dependency (the property this migration must preserve).

## Commit hook

`.git/hooks/pre-commit` is installed (GrokForge metrics gate). On **every** commit it runs `scripts/prepare_commit_metrics.py --from-env --stage`, which bumps `VERSION` and appends to `docs/metrics/token-ledger.md` and **stages both**.

Prerequisites verified present: Python 3.11.9 on PATH, `scripts/prepare_commit_metrics.py` exists.

**Consequence for the scope audit:** every task commit will carry `VERSION` and `docs/metrics/token-ledger.md` beyond its declared `files`. These are `INCIDENTAL` — mechanically required by the repo's own hook, not scope creep. Recorded once in `deviations.md` as D1 so it is not re-flagged on all 12 commits.

## Entry conditions — final state

| # | Condition | State |
|---|---|---|
| 1 | `plan.md` exists, approval ticked | plan.md written; **approval pending** (see below) |
| 2 | Clean tree, or dirty + snapshot | Satisfied dirty; selective snapshot taken |
| 3 | Preflight passes | **YES** — build green, git healthy |
| 4 | Baseline captured for tasks declaring one | **YES** — T0 complete, 60 files |

T0 was run before approval because it is read-only with respect to the repo (it writes only to the scratchpad) and the source plan marks it unrecoverable if deferred. No repo file has been modified at the time of writing.

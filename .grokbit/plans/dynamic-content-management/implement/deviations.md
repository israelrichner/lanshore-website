# Deviations — dynamic-content-management P1

Counting deviations (`counts: yes`) escalate at **3**: stop, hand back to `grokbit-plan`, rerun from Survey.

---

## D1 — Every commit carries `VERSION` + token ledger beyond its declared files

- **counts:** no
- **type:** incidental, mechanically required by the repo
- **found:** preflight
- **detail:** `.git/hooks/pre-commit` runs `scripts/prepare_commit_metrics.py --from-env --stage`, which bumps `VERSION` and appends to `docs/metrics/token-ledger.md`, staging both. Mandated by `AGENTS.md` § "Version & token tracking (every commit)".
- **disposition:** Accepted as `INCIDENTAL` for every task commit in this plan. Recorded once here so the scope audit does not re-flag it on all 12 commits. Not scope creep — it is the repo's own policy, and suppressing it would mean bypassing a hook the project requires.

## D2 — Source plan's base branch instruction is wrong

- **counts:** no
- **type:** plan-specification defect, corrected before implementation
- **found:** survey (S0)
- **detail:** source plan `:831` says baseline on clean `main`. `GARTNER_PATHS` does not exist on `main`, making task `:839` unexecutable there; `main` is 15 commits behind and stale in three plan-scope files.
- **disposition:** Caught at survey time, before any task ran, and resolved by owner decision (base = `preview/faq-agentic-spm`). Recorded because it is a real contradiction between the plan and the tree — but it did not cause a failed task, and it was fixed in the grokbit plan rather than discovered mid-implement. Does not count toward the cap.

## D3 — Step 6 snapshot restore is deliberately deferred, not skipped

- **counts:** no
- **type:** deliberate procedural deviation
- **found:** preflight
- **detail:** Step 6 says pop the dirty-tree stash before invoking `grokbit-test`. Here the stash holds 40+ `.grok/`/`.claude/` scaffolding files belonging to `preview/faq-agentic-spm`, with zero overlap with plan scope. Popping onto `feat/content-migration-p1` would pollute the migration diff.
- **disposition:** Stash **preserved, not dropped**. Handoff must instruct the user to restore it on `preview/faq-agentic-spm`. Revisit if any task turns out to need a stashed file.

---

**Counting total: 0 of 3.**

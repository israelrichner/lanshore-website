# Deviations — studio-editor-write-path (P3)

Counting deviations (`counts: yes`) escalate at **3**.

---

## D1 — Every commit carries `VERSION` + token ledger

- **counts:** no · **type:** incidental, repo policy
- Standing item, same as P1 and P2. Recorded once.

## D2 — T0 needed `package.json`, which it did not declare

- **counts:** no · **type:** undeclared file
- **detail:** T0's test imports `loadContent.ts`, so it needs `--experimental-strip-types` and cannot run under the existing `test:auth` script. Added `test:loaders` and chained it into `prebuild`.
- **disposition:** A test that is not wired into the gate does not protect anything — the whole point of T0 is that a future admin-only field fails the build. `prebuild` now runs `check:content && test:auth && test:loaders && check:admin`.
- **why not counting:** the survey was not wrong; the plan simply did not anticipate a second `node --test` invocation needing a different flag.

## D3 — The golden-diff normalizer was missing generated-metadata-image hashes

- **counts:** no · **type:** verification-tooling defect, found and fixed during T0
- **detail:** T0's parity check reported **6** differences instead of the expected 5, the new one being `__root.html`. The difference was the `og:image` cache-buster (`?cef5e95b…` → `?7421707a…`), length delta exactly 0.
- **investigation, because the obvious conclusions were both wrong:**
  1. Not build noise — the hash is **stable across two consecutive builds** of identical code.
  2. Not T0 — with T0 stashed, the new hash is already present.
  3. Not the merge — `git diff dbfd6b1 1340f19 -- src/` is **empty**.
  4. **Decisive:** rebuilding the *exact commit the golden capture was taken from* (`dbfd6b1`, in an isolated worktree) now yields `7421707a…`, not the `cef5e95b…` the capture contains.
- **conclusion:** the hash is **environment-derived, not content-derived** — it tracks the build manifest, which changed when P1 added three dependencies. Same class as `/_next/static/` hashes and the build ID.
- **disposition:** added to the normalizer with the evidence in a comment. Re-verified: back to 55/60, exactly the 5 blog pages already justified in P1's R1.
- **why this matters beyond P3:** every future parity check inherits this. Had it been waved through as "probably noise", the normalizer would have stayed wrong and a *real* difference could hide behind the same assumption later.

---

**Counting total: 0 of 3.**

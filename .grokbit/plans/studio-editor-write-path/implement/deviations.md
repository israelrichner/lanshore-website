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

## D4 — T6 required an undeclared file: `src/lib/studio/apply-action.ts`

- **counts:** no · **type:** undeclared file
- **detail:** T6's declared files are the two route handlers. Both need the same sequence — read ledger and on-disk state from GitHub at head, run the ledger operation, run pre-flight, commit or refuse. Inlining it would duplicate roughly 80 lines across two files, and a divergence between them would mean one action validates differently from another.
- **disposition:** one orchestrator, `apply-action.ts`. It is the **only** place that performs I/O for a write, so there is exactly one path a change can take to the repo. The pure pieces it composes (`ledger-ops.mjs`, `commit-payload.mjs`, `validate.ts`) stay separately tested.
- **notable behaviour it adds:** for publish/unpublish/delete the record is re-read **from head** rather than trusted from the browser, so a stale tab cannot resurrect old field values — or, worse, submit a cleared `publishedOnce` and unlock a Delete that should be refused.
- **why not counting:** decomposition detail the plan did not foresee, resolved additively inside the package's own directory. The survey was not wrong about anything.

## D5 — TypeScript could not narrow the ledger-op union on truthiness

- **counts:** no · **type:** incidental, resolved in-place
- **detail:** `if (op.refusal) return ...` failed to narrow, because the union is discriminated on a **nullable string** and an empty string is falsy — so TypeScript cannot prove the non-refusal branch. Three `possibly null` errors followed.
- **disposition:** narrowed on `!== null` instead, with the reason in a comment. The alternative — non-null assertions at each use — would have silenced the checker exactly where a real null would matter most.

## D6 — the A1 allowlist widened from 6 to 7, and the check is what forced the decision

- **counts:** no · **type:** the guard working as designed
- **detail:** T9's build failed `check:admin`. Three new files — `CaseStudyForm.tsx`, `EditorShell.tsx`, `WhitePaperForm.tsx` — reference `/studio` from `src/components/studio/`, which was not an allowlisted path.
- **the sequence matters, and it is the one P2's comment asked for:** the check fired first; each file was then confirmed to be admin-only client UI imported by **zero** public pages; only then was the directory added and the count moved to 7. The assertion exists to force exactly that decision rather than to be edited around, and the reasoning is now written into the script beside the number.
- **why not counting:** a new admin directory is a legitimate widening, categorically identical to the existing `src/app/studio/**` and `src/lib/studio/**` entries. A stray nav link from a public page would still fail, which is the property being protected.

---

**Counting total: 0 of 3.**

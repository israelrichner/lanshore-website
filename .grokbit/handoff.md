# Grokbit session handoff

Most recent session only. Not a running log.

**Slug:** `studio-auth-boundary` (Package 2)
**Phase reached:** implement complete (12/12), ready for `grokbit-test` verify
**Branch:** `feat/content-migration-p1` — P2 stacks on P1, which is pushed but unmerged
**Date:** 2026-08-27

## Scope

The `/studio` authentication gate: Google OAuth, email allowlist, stateless signed cookie, optimistic proxy 404 over a `requireAdmin()` boundary. **No editor UI, no GitHub write path** — that ordering is deliberate, so a write endpoint never exists without a reviewed gate in front of it.

**The owner's original ask remains undelivered.** Updating a blog post still needs a developer. That is P3.

Prior: `dynamic-content-management` (P1) — complete, SHIP WITH CAVEATS.

## Blocked tasks

None.

## Open items

- **A1** — the 8 Vercel env vars are unverifiable from the repo (no CLI). The design fails closed, so a typo'd name yields a 404 indistinguishable from correct behaviour. First real sign-in is the only validation.
- **A2** — Google's live endpoints unexercised. 63 tests prove the verifier rejects bad tokens; only a real sign-in proves it accepts a genuine one.
- **A4** — is `lanshore.com` a Google Workspace domain? If so the consent screen should be **Internal**. Affects setup only, but switching later may force re-consent.
- **B2 (from P1)** — the gated white-paper download still needs exercising on a Vercel preview.
- **A7** — the golden capture used for parity lives in an ephemeral scratchpad. Promoting `capture.mjs`/`compare.mjs` into the repo is an open scope decision.
- **P1 stash** — `stash@{0}` holds scaffolding belonging to `preview/faq-agentic-spm`. Restore there, not on the feature branch.

## If planning resumes here

Three defects were found in the source plan during P1/P2 and corrected in the grokbit plans, not in `docs/plans/dynamic-content-management.md`. Check whether that document still carries them:

1. It says to baseline on clean `main`, but `GARTNER_PATHS` does not exist there.
2. It never specifies how content ordering survives the move to files (now in `SLUGS.lock.json`).
3. Its task `:857` requires `/studio` to omit the public Header/Footer, which App Router cannot do without route groups.

And two inside P2's own plan: the A1 allowlist count (5 vs the real 6), and T6's layout structure, which would have 404'd the sign-in page.

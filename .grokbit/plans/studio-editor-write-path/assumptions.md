# Assumptions — studio-editor-write-path (P3)

## A1 — GitHub's Git Data API behaves as §6.5.4 describes — UNVERIFIED

External to this repo, and the owner has deferred real API calls (A2). The unit tests pin **our** request payloads and **our** handling of documented response shapes. They cannot prove GitHub accepts those payloads, or that a `PATCH` with `force: false` rejects exactly when we expect.

**Closes when:** source plan **E3** — an editor saves a draft on a deployment and exactly one commit appears on `main` carrying both the content file and the ledger entry.

**Two commits there means the atomic requirement was not implemented**, and every publish will emit a failure email followed by a success email.

## A2 — Verification is unit tests only, no real commits — OWNER DECISION, 2026-08-27

Nothing in this package contacts GitHub during implementation. The write path is exercised entirely through an injected fake `fetch`.

**Consequence, stated plainly:** the end-to-end behaviour of the write path is **unverified** when P3's implementation completes. Source plan **E3, E5, E6, E11** remain owner-run on a deployment. Source plan §10.6 already named this as the project's largest coverage gap; this plan narrows it (the commit payload and ledger mutation become pure and tested) but does not close it.

## A3 — P3 targets `main` — OWNER DECISION, 2026-08-27

P1+P2 were merged to `main` (`1fa4346`) first, so the branch the admin writes to can actually render what it receives.

## A4 — Nobody has completed a real Google sign-in — OPEN, AND IT GATES THE MERGE

P2's gate is code-reviewed, unit-tested across nine access-control states, and has **never been used**. P3 builds a write path to `main` behind it.

**P3 must not merge until a real sign-in succeeds.** This is the source plan's own rule — *"Do not merge P3 before P2 is reviewed — that ordering is the whole safety argument: there is never a moment when a write endpoint exists without a working gate in front of it."*

Now that P1+P2 are live on `main`, this is testable immediately at `https://lanshore.com/studio/signed-out`.

## A5 — The source plan contradicts itself on the unauthenticated response — RESOLVED AS 404

§6.5.3 specifies **404**, and the whole cloaking rationale depends on it. §10.5 **E1** says "bare 403".

P2 shipped 404. Treating **404 as correct and E1 as stale.** Flagged rather than silently reconciled, because whoever runs E1 will otherwise report a failure that is not one.

## A6 — `publishedOnce` is a new field on a byte-parity-critical path — MITIGATED, VERIFY AT T11

Adding it is what makes §6.6's Delete rule enforceable (`03-design.md` Fork 3). It is also exactly the shape of P1's `mentionsGartner` regression: a new field flowing somewhere nobody traced.

Verified mechanism (`04-review.md` B1): `loadCaseStudies` strips only `draft`; `/case-studies` passes whole records to a `"use client"` grid; the RSC payload demonstrably carries every field.

**Mitigated** by T0's shared admin-only strip, landing **before** any writer exists. **Proven** by T11's parity check, not before.

## A7 — No React component tests — ACCEPTED, consistent with §10.6

The editor forms are covered only by build, lint, types, and the owner's manual pass. No visual regression, no accessibility automation.

The forms are where an editor's time is spent, so this is a real gap — it is accepted because the alternative is introducing a component-test framework, which is a separate decision the source plan explicitly declines.

## A8 — HubSpot `whitepaper_requested` is still a dropdown — OWNER ACTION, not blocking

Source plan §7.4 / `:877`: until the property becomes free text (or option values are pre-created), adding a **new** white paper needs one 2-minute portal step. Editing existing ones is unaffected.

Not a code change either way — `src/app/api/whitepaper/route.ts` already sends whatever the registry holds. Recorded in `docs/CONTENT-EDITING.md` so the editor is not surprised.

## A9 — `GITHUB_TOKEN` expiry owner and date — OPEN, and the clock has been running since it was created

Source plan Open Question **I**. The token exists (owner-confirmed in Vercel). Nothing here knows when it expires.

The failure mode is the nasty kind: **publishing silently stops working**, at an arbitrary future date, for someone who was not part of this conversation. T10 requires the date and the responsible person in `docs/CONTENT-EDITING.md`; only the owner can supply them.

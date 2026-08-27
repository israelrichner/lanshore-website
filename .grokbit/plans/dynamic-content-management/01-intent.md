# Intent — dynamic-content-management (Package 1 only)

**Source plan:** `docs/plans/dynamic-content-management.md` (v3, revised 2026-08-26)
**Scope of THIS grokbit plan:** **Package 1 only** — "Repo-native content source (migration, loaders, renderer, validator)", source plan `:827-843`.

## What the owner asked for

> "We want to update Blogs, Case Studies and White Papers without having to do git commits and redeploy on Vercel."

## Why Package 1 only

Packages 2 and 3 of the source plan are **not implementable in this session** and are deliberately excluded:

- **P2 (auth boundary)** requires the owner to create a Google OAuth client and set six env vars in Vercel (source plan `:853`). Agent cannot create these.
- **P3 (editor UI + write path)** requires a GitHub fine-grained PAT (`:868`), HubSpot portal property changes (`:877`), and owner-driven E2E (`:879`).

P1 is fully self-contained: no secrets, no external accounts, no owner action. It moves content from hand-authored `.ts` modules to repo files (`content/**`) behind unchanged exported APIs, and adds the validator the later packages depend on.

## Success condition

The public site renders **byte-for-byte identically** after the migration (source plan `:843` expects **zero** intentional diffs), with content sourced from `content/**` instead of inline TypeScript arrays, and every exported loader name/type preserved.

## Non-goals for this grokbit plan

Everything in the source plan's §2 non-goals, plus P2 and P3 in their entirety.

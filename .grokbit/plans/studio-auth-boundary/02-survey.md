# Survey — studio-auth-boundary (P2)

Ground truth, read from disk 2026-08-27 on `feat/content-migration-p1` @ `3a26698`. Every claim carries a `path:line`, or is marked `DOES NOT EXIST`.

## S1 — Entities the intent implies

| Entity | State |
|---|---|
| `src/proxy.ts` | EXISTS, 41 lines — the file P2 must extend |
| `src/app/studio/**` | **DOES NOT EXIST** |
| `src/lib/studio/**` | **DOES NOT EXIST** |
| `src/app/api/studio/**` | **DOES NOT EXIST** |
| `SITE_URL` | EXISTS — `src/lib/site.ts:1` = `"https://lanshore.com"` |
| `src/app/robots.ts` | EXISTS, 26 lines |
| Root layout | EXISTS — `src/app/layout.tsx` |
| Env-var guard precedent | EXISTS — `src/lib/hubspot.ts:24-36` (`getFormId`) |
| `toJsonLd` (T15 target) | EXISTS — `src/lib/schema.ts:343-350` |
| `middleware.ts` | **DOES NOT EXIST** — this repo uses Next 16's `proxy.ts` convention |
| Test runner | `node --test` in use since P1; `npm run test:rules` wired |

## S2 — `src/proxy.ts`, in detail (the highest-risk file in P2)

Two existing behaviours that must survive untouched:

1. **Retired-WordPress 410** — `:20-33`. `WORDPRESS_DIRECTORIES` `:17`, `WORDPRESS_FILES` `:18`, matcher `isRetiredWordPressPath` `:20-25`, returns a real `410 Gone` `:29-32`.
2. **Host canonicalization** — `:35-39`. Any host not in `CANONICAL_HOSTS` (`:9`, = `lanshore.com` / `www.lanshore.com`) gets `X-Robots-Tag: noindex, nofollow`.

**The constraint that governs P2's edit:** the file has **no `config.matcher`, deliberately.** The comment at `:14-16` states why — it must run on *every* request for the host check, and adding a matcher "would narrow that too". So P2's `/studio` rules go **inline**, and adding a matcher would silently disable host canonicalization site-wide.

Export shape: `export function proxy(request: NextRequest)` `:27`.

## S3 — The root-layout / admin-chrome conflict (design-forcing)

Source-plan task `:857` requires `src/app/studio/layout.tsx` to render "admin-only chrome, **not** the public Header/Footer". **As specified this is not achievable**, and the reason is structural:

- **No route groups exist.** `src/app/` contains 13 route directories, all direct children, no `(group)` dirs.
- `src/app/layout.tsx` is therefore *the* root layout for every route, and it renders unconditionally at `:71-74`:
  `<Header />`, `<main>{children}</main>`, `<Footer />`, `<MobileContactBar />`.
- In App Router a nested `app/studio/layout.tsx` **nests inside** the root layout. It cannot remove ancestor chrome.

**And the root layout injects more than chrome** (`:66-79`):

| Injected | Line | Consequence on `/studio` under nesting |
|---|---|---|
| `<HubSpotLoader />` | `:75-76` | **Admin sessions tracked in HubSpot** |
| `<GoogleAnalytics />` | `:77-78` | **Admin sessions tracked in GA4** |
| `organizationSchema`, `webSiteSchema`, `localBusinessSchemas` JSON-LD | `:66-70` | Marketing structured data on an admin page |
| `<link rel="alternate" href="/llms.txt">` ×2 | `:62-65` | Answer-engine hints on an admin page |

So this is not a cosmetic question. Under nesting, an editor's admin activity flows into analytics and marketing automation.

**Options and their real costs** (Design will decide; recorded here as survey fact):

- **Accept nesting.** Zero risk, contradicts `:857`, and accepts the GA/HubSpot tracking above.
- **Route groups.** Requires deleting `src/app/layout.tsx` and moving **all 13 route dirs** into `src/app/(public)/`, plus a new `(studio)/` root layout. Large diff; P1's byte-identical golden parity would need re-proving; root-level metadata routes (`robots.ts`, `sitemap.ts`, `opengraph-image`) need their placement re-checked.
- **`headers()` in the root layout to branch on pathname — RULED OUT.** Calling `headers()` in a root layout makes the whole tree dynamic, destroying the static prerendering of all 56 routes that P1 exists to preserve.

## S4 — `robots.ts` and the M5 override (affects check A3/A4)

`src/app/robots.ts:18-26`:

```
rules: [
  { userAgent: "*", allow: "/", disallow: "/api/" },        // :21
  ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),  // :22
]
```

`AI_CRAWLERS` `:6-16` is 9 agents including **Googlebot**. **M5 CONFIRMED against source:** those 9 rules carry `allow: "/"` and **no `disallow`**. robots.txt is most-specific-wins per user agent, so for Googlebot and the AI crawlers the generic `disallow: "/api/"` does not apply.

**Consequence:** `X-Robots-Tag: noindex, nofollow` is the *only* control keeping `/api/studio/*` out of those crawlers' indexes. Check A4 is therefore load-bearing, not belt-and-braces.

Check A3 requires the admin path to be **absent** from robots.txt (listing it publishes it). That assertion is inverted from instinct and the plan mandates an inline comment so a future maintainer does not "fix" it.

## S5 — Conventions observed

- **Env guard precedent is permissive, and P2 must not copy it.** `getFormId` (`src/lib/hubspot.ts:24-36`) returns `undefined` when unset; `src/app/api/whitepaper/route.ts:23-33` logs and 503s. P2 must **fail closed** instead (source plan §6.5.3) because it guards writes.
- **Route handlers:** `export async function POST(request: Request)` returning `NextResponse.json(...)` — `src/app/api/whitepaper/route.ts:5-9`.
- **`.mjs` + typed `.ts` re-export** is already the established pattern from P1: `scripts/lib/content-rules.mjs` consumed by `src/lib/content/loadContent.ts:29-33` via a **relative** path.
- **Hard rule inherited from §10.4(a):** no `@/*` import may appear in any `.mjs` under `src/lib/studio/` or `scripts/`. Node's resolver never reads `tsconfig.json`.
- Tests: `node --test`, no framework. `npm run test:rules` exists.

## S6 — P1 dependency (why P2 must branch off P1, not `preview`)

`package.json` after P1:

```
"check:content": "node --experimental-strip-types scripts/check-content.mjs",
"test:rules":    "node --test scripts/lib/content-rules.test.mjs",
"prebuild":      "npm run check:content"
```

P2 must **add** `test:auth` to `prebuild`, not replace it (source plan review m2). That chain only exists on the P1 branch, so P2 branches from `feat/content-migration-p1` (pushed, unmerged, 12 commits). Inferred from the repo — not asked.

## S7 — Supersession

| Item | Callers | Note |
|---|---|---|
| `src/proxy.ts` request flow | every request | **Extended, not replaced.** Both existing behaviours must survive. |
| `getFormId` permissive pattern | 4 form kinds | **Not reused** by P2 — deliberately superseded *for admin config only*; the HubSpot callers keep it. |
| `robots.ts` rules | 1 | **Left alone.** A3 requires the admin path stay absent. |
| T16 (Markdown renders raw HTML as text) | — | **Already verified in P1's test phase** — 8 hostile inputs, all inert (`dynamic-content-management/test/security.md`). P2's T16 becomes a committed regression test of an already-established property. |

**Net-additive check:** this plan is almost entirely additive, and that is a legitimate conclusion, not an accident — P2 introduces a new surface (`/studio`, `/api/studio`) where nothing existed. The one non-additive item is the `proxy.ts` edit, and it is an extension with two protected incumbents.

## S8 — Survey shortcuts disclosed

- Caller counts above are from `grep` over `src/`, not a full call-graph.
- Google's OAuth/JWKS behaviour is **not** verified from this repo — it is external. Every claim about Google's endpoints comes from the source plan §6.5.2 and must be treated as `UNVERIFIED` until exercised against a real deployment.

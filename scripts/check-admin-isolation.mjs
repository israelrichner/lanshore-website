/**
 * Admin isolation gate — source plan §10.3 checks A1, A2, A3.
 *
 *   node scripts/check-admin-isolation.mjs
 *
 * Cheap mechanical assertions that the admin stays invisible. These exist to
 * catch the regression where someone "helpfully" adds a nav link, or lists
 * the admin path in robots.txt believing that hides it.
 *
 * A4 (the noindex header is actually served) is NOT here — it needs a running
 * server and lives in the live verification step.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const ADMIN_SEGMENT = "/studio";

/**
 * A1 allowlist — full paths and directory prefixes, NEVER a bare glob.
 *
 * The count is asserted below. That is the point: widening this list is then
 * a visible diff that someone has to justify, rather than a quiet edit that
 * silently disables the check. If you are here because the count assertion
 * failed, that is the check working — decide whether the new file genuinely
 * belongs, do not just increment the number.
 */
const A1_ALLOWED = [
  "src/app/studio/",             // the admin pages themselves
  "src/app/api/studio/",         // the OAuth route handlers
  "src/lib/studio/",             // auth core, typed wrappers, tracker gate
  "src/proxy.ts",                // the optimistic 404 gate
  "src/components/GoogleAnalytics.tsx", // path-gates itself off the admin
  "src/components/HubSpotLoader.tsx",   // path-gates itself off the admin
];
const A1_EXPECTED_COUNT = 6;

const errors = [];

/* --- A1: no inbound references outside the allowlist -------------------- */

if (A1_ALLOWED.length !== A1_EXPECTED_COUNT) {
  errors.push(
    `A1: the allowlist has ${A1_ALLOWED.length} entries, expected ${A1_EXPECTED_COUNT}. ` +
      `Widening it disables the check that catches a stray nav link — justify the change, do not just bump the number.`
  );
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|mjs|js|jsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const allowed = (r) => A1_ALLOWED.some((a) => (a.endsWith("/") ? r.startsWith(a) : r === a));

for (const file of walk(path.join(ROOT, "src"))) {
  const r = rel(file);
  if (allowed(r)) continue;
  if (fs.readFileSync(file, "utf8").includes(ADMIN_SEGMENT)) {
    errors.push(
      `A1 ${r}: references "${ADMIN_SEGMENT}" but is not in the allowlist. ` +
        `If this is a link to the admin from a public surface, remove it — the admin is unlinked by design.`
    );
  }
}

/* --- A2: absent from the discovery surfaces ---------------------------- */

const A2_SOURCES = [
  "src/app/sitemap.ts",
  "src/app/llms.txt/route.ts",
  "src/app/llms-full.txt/route.ts",
];
for (const r of A2_SOURCES) {
  const p = path.join(ROOT, r);
  if (!fs.existsSync(p)) {
    errors.push(`A2 ${r}: expected this file to exist`);
    continue;
  }
  if (fs.readFileSync(p, "utf8").includes(ADMIN_SEGMENT)) {
    errors.push(`A2 ${r}: must not reference "${ADMIN_SEGMENT}" — it would advertise the admin to crawlers`);
  }
}

/* --- A3: absent from robots.txt ---------------------------------------- *
 *
 * READ THIS BEFORE "FIXING" IT. This assertion is INVERTED from the usual
 * instinct. The admin path must be ABSENT from robots.txt, not listed as
 * Disallow.
 *
 * robots.txt is public. Adding `Disallow: /studio` publishes the exact
 * location of the admin to anyone who reads it, including the scanners it is
 * meant to hide from — while doing nothing to stop them, since Disallow is
 * advisory.
 *
 * The control that actually works is the `X-Robots-Tag: noindex, nofollow`
 * header set in src/proxy.ts, checked live as A4. That header is the ONLY
 * control on /api/studio/*: the nine per-bot rules in src/app/robots.ts
 * carry `allow: "/"` with no disallow, which overrides the generic
 * `disallow: "/api/"` for Googlebot and the AI crawlers.
 */
const robotsSrc = path.join(ROOT, "src/app/robots.ts");
if (!fs.existsSync(robotsSrc)) {
  errors.push("A3 src/app/robots.ts: expected this file to exist");
} else if (fs.readFileSync(robotsSrc, "utf8").includes(ADMIN_SEGMENT)) {
  errors.push(
    `A3 src/app/robots.ts: must NOT mention "${ADMIN_SEGMENT}". robots.txt is public — ` +
      `listing the admin there publishes its location while doing nothing to hide it. ` +
      `The real control is the X-Robots-Tag header in src/proxy.ts.`
  );
}

/* --- report ------------------------------------------------------------ */

if (errors.length) {
  console.error(`check:admin FAILED — ${errors.length} problem(s)\n`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

console.log(
  `check:admin OK — A1 allowlist ${A1_ALLOWED.length} paths, A2 ${A2_SOURCES.length} discovery surfaces clean, A3 robots.txt clean`
);

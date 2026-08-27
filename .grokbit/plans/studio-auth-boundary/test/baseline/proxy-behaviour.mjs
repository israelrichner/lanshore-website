/**
 * Characterization test — src/proxy.ts behaviour BEFORE P2.
 *
 * Originally captured 2026-08-27 @ 1eeeef0 before any P2 task landed.
 * REGENERATED 2026-08-27 after P2 shipped (grokbit-test Step 7): the six
 * admin rows now carry their post-P2 values, taken from test/results.md's
 * Step 1 table rather than re-observed, so this file keeps describing the
 * reality that is actually live. All 16 rows are now MUST-NOT-CHANGE.
 *
 * RUN WITHOUT ADMIN ENV VARS. Two rows are fail-closed values that differ
 * when the admin is configured; their notes say so.
 *
 * Why this exists: P2's T7 makes `proxy()` async so it can verify a session
 * HMAC with crypto.subtle. That changes the return type for EVERY request to
 * the site, not just /studio — the retired-WordPress 410 and the host
 * canonicalization both flow through the same function. This file is what
 * proves those two survived.
 *
 * Usage (server must already be running):
 *   npx next start &
 *   node .grokbit/plans/studio-auth-boundary/test/baseline/proxy-behaviour.mjs
 *
 * Exit 0 = behaviour matches the recorded baseline.
 * Exit 1 = something changed. That is a finding, not necessarily a bug —
 *          classify it INTENDED / REGRESSION / UNKNOWN in test/results.md.
 */

import http from "node:http";

const HOST = process.env.BASE_HOST ?? "localhost";
const PORT = Number(process.env.BASE_PORT ?? 3000);

/* Raw node:http, NOT fetch. Node's fetch (undici) silently ignores a `Host`
   header override, so every request would carry `Host: localhost:3000` and
   the canonical-host rows below would measure the wrong thing. This was
   caught by running the baseline against the unmodified tree and seeing
   MUST-NOT-CHANGE rows fail. */
function request(path, hostHeader) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: HOST, port: PORT, path, method: "GET", headers: hostHeader ? { Host: hostHeader } : {} },
      (res) => {
        res.resume();
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers }));
      }
    );
    req.on("error", reject);
    req.end();
  });
}

/* Recorded baseline. Rows marked CHANGES-IN-P2 are expected to differ after
   implementation and are listed so the change is deliberate and visible,
   rather than discovered. */
const CASES = [
  // --- retired WordPress surface: must be untouched by P2 ---
  { path: "/wp-login.php", host: null, status: 410, note: "MUST NOT CHANGE" },
  { path: "/xmlrpc.php", host: null, status: 410, note: "MUST NOT CHANGE" },
  { path: "/wp-admin/x", host: null, status: 410, note: "MUST NOT CHANGE" },
  { path: "/wp-content/y", host: null, status: 410, note: "MUST NOT CHANGE" },
  { path: "/wp-includes/z", host: null, status: 410, note: "MUST NOT CHANGE" },
  { path: "/wp-json/v2", host: null, status: 410, note: "MUST NOT CHANGE" },

  // --- host canonicalization: must be untouched by P2 ---
  { path: "/", host: "lanshore.com", status: 200, robots: null, note: "MUST NOT CHANGE — canonical host gets NO header" },
  { path: "/", host: "www.lanshore.com", status: 200, robots: null, note: "MUST NOT CHANGE" },
  { path: "/", host: "preview.vercel.app", status: 200, robots: "noindex, nofollow", note: "MUST NOT CHANGE" },
  { path: "/", host: "localhost:3000", status: 200, robots: "noindex, nofollow", note: "MUST NOT CHANGE — localhost is non-canonical" },

  // --- the admin surface: REGENERATED after P2 shipped (Step 7 retirement).
  //     Values are those recorded in test/results.md Step 1, not re-observed.
  //     Each was classified INTENDED with a citation into 03-design.md, and
  //     each is now MUST-NOT-CHANGE for P3 and beyond. ---
  { path: "/studio", host: "lanshore.com", status: 404, robots: "noindex, nofollow", note: "MUST NOT CHANGE - gated: 404 from the proxy, indistinguishable from a missing page" },
  { path: "/studio/signed-out", host: "lanshore.com", status: 200, robots: "noindex, nofollow", note: "MUST NOT CHANGE - the sign-in entry point; 404 here is blocker B3" },
  { path: "/studio/signed-out-and-then-something", host: "lanshore.com", status: 404, robots: "noindex, nofollow", note: "MUST NOT CHANGE - proves the exempt list is exact-match, not prefix" },
  { path: "/api/studio/auth/login", host: "lanshore.com", status: 404, robots: "noindex, nofollow", note: "MUST NOT CHANGE *WHEN UNCONFIGURED* - fail-closed. With admin env set this is 307 to Google; run this file without admin env or expect this row to differ" },
  { path: "/api/studio/auth/callback", host: "lanshore.com", status: 404, robots: "noindex, nofollow", note: "MUST NOT CHANGE *WHEN UNCONFIGURED* - fail-closed, same caveat as login" },
  { path: "/api/studio/auth/logout", host: "lanshore.com", status: 405, robots: "noindex, nofollow", note: "MUST NOT CHANGE - 405 on GET: logout is POST-only by design" },
];

let failed = 0;
let changed = 0;

for (const c of CASES) {
  const res = await request(c.path, c.host);
  const robots = res.headers["x-robots-tag"] ?? null;

  const statusOk = res.status === c.status;
  const robotsOk = c.robots === undefined || (robots ?? null) === c.robots;
  const ok = statusOk && robotsOk;

  const expectedToChange = c.note.startsWith("CHANGES-IN-P2");
  if (!ok) {
    if (expectedToChange) changed++;
    else failed++;
  }

  const label = `${c.path}${c.host ? `  [Host: ${c.host}]` : ""}`;
  console.log(
    `${ok ? "  ok  " : expectedToChange ? " CHG  " : " FAIL "}${label.padEnd(52)} ` +
      `status=${res.status}${statusOk ? "" : ` (baseline ${c.status})`}` +
      (c.robots !== undefined ? `  x-robots=${robots ?? "<absent>"}${robotsOk ? "" : ` (baseline ${c.robots ?? "<absent>"})`}` : "")
  );
}

console.log();
console.log(`baseline cases: ${CASES.length}`);
console.log(`changed as expected by P2: ${changed}`);
console.log(`UNEXPECTED changes (regressions): ${failed}`);

if (failed) {
  console.error("\nA MUST-NOT-CHANGE row moved. That is a regression in proxy.ts.");
  process.exit(1);
}
process.exit(0);

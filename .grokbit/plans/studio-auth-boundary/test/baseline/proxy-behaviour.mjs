/**
 * Characterization test — src/proxy.ts behaviour BEFORE P2.
 *
 * Captured 2026-08-27 on feat/content-migration-p1 @ 1eeeef0, before any P2
 * task landed. Records what the proxy does *now*, not what it should do.
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

  // --- the admin surface, which does not exist yet ---
  { path: "/studio", host: "lanshore.com", status: 404, robots: null, note: "CHANGES-IN-P2: still 404, but from the proxy gate rather than a missing route" },
  { path: "/studio/signed-out", host: "lanshore.com", status: 404, robots: null, note: "CHANGES-IN-P2: becomes 200 + noindex" },
  { path: "/studio/signed-out-and-then-something", host: "lanshore.com", status: 404, robots: null, note: "CHANGES-IN-P2: must STAY 404 — proves exact-match, not prefix" },
  { path: "/api/studio/auth/login", host: "lanshore.com", status: 404, robots: null, note: "CHANGES-IN-P2: becomes a redirect to Google + noindex" },
  { path: "/api/studio/auth/callback", host: "lanshore.com", status: 404, robots: null, note: "CHANGES-IN-P2" },
  { path: "/api/studio/auth/logout", host: "lanshore.com", status: 404, robots: null, note: "CHANGES-IN-P2" },
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

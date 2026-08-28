/**
 * Characterization test — which record fields reach the PUBLIC output.
 *
 * Captured 2026-08-27 on feat/studio-editor-p3 @ c9c3d63, before any P3 task
 * landed. Records what the site does now, not what it should do.
 *
 * Why this exists: P3 adds a `publishedOnce` flag so Delete can be refused
 * for an item that was ever published. That flag is editorial state and must
 * never reach a reader — but the path it would take is wide open today:
 *
 *   loadCaseStudies (loadContent.ts:172-185) strips ONLY `draft` and spreads
 *   every other key into the record  ->  /case-studies passes whole records
 *   to <CaseStudyGrid>, a "use client" component  ->  every field is
 *   serialised into the RSC payload.
 *
 * Measured below: all 11 real fields are present, including `legacyUrl` and
 * `whatWeDid`, neither of which is rendered anywhere. So an unstripped
 * `publishedOnce` would change /case-studies bytes on the first Publish and
 * break the byte-parity P1 spent its entire verification budget on.
 *
 * This is the same shape as P1's mentionsGartner regression.
 *
 * Usage (server must already be running):
 *   npx next start &
 *   node .grokbit/plans/studio-editor-write-path/test/baseline/public-field-leak.mjs
 */

import http from "node:http";

const HOST = process.env.BASE_HOST ?? "localhost";
const PORT = Number(process.env.BASE_PORT ?? 3000);

/* Raw node:http, not fetch: undici silently ignores a Host header override,
   and the canonical host matters for what the page emits. Learned the hard
   way in P2's baseline. */
function get(path, hostHeader = "lanshore.com") {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: HOST, port: PORT, path, method: "GET", headers: { Host: hostHeader } },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (d) => (body += d));
        res.on("end", () => resolve(body));
      }
    );
    req.on("error", reject);
    req.end();
  });
}

/* Fields that legitimately appear in the payload today. */
const PUBLIC_FIELDS = [
  "slug", "title", "client", "industry", "pillar",
  "outcome", "challenge", "whatWeDid", "results", "stack", "legacyUrl",
];

/* Editorial state. MUST NOT ever appear. `draft` is 0 today only because no
   content file sets it; that is not the same as being stripped, which is
   exactly what T0 fixes. */
const ADMIN_ONLY_FIELDS = ["draft", "publishedOnce"];

const html = await get("/case-studies");
const count = (f) => (html.match(new RegExp(`\\\\"${f}\\\\"`, "g")) ?? []).length;

let failed = 0;

console.log("public fields (expected present — this is the leak surface):");
for (const f of PUBLIC_FIELDS) {
  const n = count(f);
  if (n === 0) {
    console.log(`  MISSING ${f} — payload shape changed; re-derive this baseline`);
    failed++;
  } else {
    console.log(`  ok      ${f} (${n})`);
  }
}

console.log("\nadmin-only fields (MUST be absent from public output):");
for (const f of ADMIN_ONLY_FIELDS) {
  const n = count(f);
  if (n > 0) {
    console.log(`  LEAK    ${f} appears ${n} time(s) in the public payload`);
    failed++;
  } else {
    console.log(`  ok      ${f} absent`);
  }
}

console.log();
if (failed) {
  console.error(`${failed} problem(s). An admin-only field in the public payload is a parity break.`);
  process.exit(1);
}
console.log("public payload carries no editorial state");
process.exit(0);

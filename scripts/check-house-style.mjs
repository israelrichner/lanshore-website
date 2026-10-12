/**
 * House-style gate over the prerendered HTML: no em dashes and no
 * proof-point markers in anything a visitor or crawler reads. Rules and
 * scope: scripts/lib/house-style.mjs.
 *
 * The marker scan is the backstop for copy that no content-rules validator or
 * module-load check sees: spmPlatforms.ts and TSX pages.
 *
 * Run after `npm run build`. Reads no network and no browser.
 */
import fs from "node:fs";
import path from "node:path";
import { walkHtml, routeOf, requireBuild, APP_DIR } from "./lib/build-output.mjs";
import { findInHtml, findProofMarkersInHtml, EM_DASH, PROOF_MARKER_RE } from "./lib/house-style.mjs";

requireBuild("check:house-style");

const files = walkHtml();
if (files.length === 0) {
  console.error("check:house-style: found no prerendered HTML. The build layout changed; this gate is checking nothing.");
  process.exit(1);
}

const errors = [];
const markers = [];
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  for (const hit of findInHtml(html)) {
    errors.push(`${routeOf(file)} [${hit.kind}] ${hit.text}`);
  }
  for (const hit of findProofMarkersInHtml(html)) {
    markers.push(`${routeOf(file)} [${hit.kind}] ${hit.text}`);
  }
}

/* /llms.txt and /llms-full.txt are text routes, built as .body files rather
   than .html, and they are written for exactly the readers this rule is for. */
for (const name of ["llms.txt.body", "llms-full.txt.body"]) {
  const file = path.join(APP_DIR, name);
  if (!fs.existsSync(file)) {
    errors.push(`/${name.replace(/\.body$/, "")}: not found in build output; the gate cannot check it`);
    continue;
  }
  const route = `/${name.replace(/\.body$/, "")}`;
  const whole = fs.readFileSync(file, "utf8");
  const before = markers.length;
  whole.split("\n").forEach((line, i) => {
    if (line.includes(EM_DASH)) errors.push(`${route} line ${i + 1}: ${line.trim().slice(0, 80)}`);
    if (PROOF_MARKER_RE.test(line)) markers.push(`${route} line ${i + 1}: ${line.trim().slice(0, 80)}`);
  });
  /* A marker that wraps across a line break matches in no single line. */
  if (markers.length === before && PROOF_MARKER_RE.test(whole)) {
    markers.push(`${route}: a proof-point marker that spans a line break`);
  }
}

if (errors.length) {
  console.error(`check:house-style FAILED: ${errors.length} em dash(es) in published output:\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error("\nUse a comma, colon, parentheses, or a new sentence instead.");
}
if (markers.length) {
  if (errors.length) console.error("");
  console.error(`check:house-style FAILED: ${markers.length} proof-point marker(s) in published output:\n`);
  for (const m of markers) console.error(`  ${m}`);
  console.error(
    "\nA placeholder claim cannot ship. Rewrite the copy so it is true without the proof point, " +
      "and log the proposed proof point in the round's owner review file (docs/owner-review/)."
  );
}
if (errors.length || markers.length) process.exit(1);
console.log(
  `check:house-style OK: ${files.length} prerendered routes + llms.txt + llms-full.txt, ` +
    `no em dashes and no proof-point markers in published output`
);

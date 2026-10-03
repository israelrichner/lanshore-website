/**
 * House-style gate over the prerendered HTML: no em dashes in anything a
 * visitor or crawler reads. Rules and scope: scripts/lib/house-style.mjs.
 *
 * Run after `npm run build`. Reads no network and no browser.
 */
import fs from "node:fs";
import path from "node:path";
import { walkHtml, routeOf, requireBuild, APP_DIR } from "./lib/build-output.mjs";
import { findInHtml, EM_DASH } from "./lib/house-style.mjs";

requireBuild("check:house-style");

const files = walkHtml();
if (files.length === 0) {
  console.error("check:house-style: found no prerendered HTML. The build layout changed; this gate is checking nothing.");
  process.exit(1);
}

const errors = [];
for (const file of files) {
  for (const hit of findInHtml(fs.readFileSync(file, "utf8"))) {
    errors.push(`${routeOf(file)} [${hit.kind}] ${hit.text}`);
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
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (line.includes(EM_DASH)) errors.push(`/${name.replace(/\.body$/, "")} line ${i + 1}: ${line.trim().slice(0, 80)}`);
  });
}

if (errors.length) {
  console.error(`check:house-style FAILED: ${errors.length} em dash(es) in published output:\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error("\nUse a comma, colon, parentheses, or a new sentence instead.");
  process.exit(1);
}
console.log(`check:house-style OK: ${files.length} prerendered routes + llms.txt + llms-full.txt, no em dashes in published output`);

/**
 * Schema mirror gate over the prerendered HTML.
 *
 * Fails the build when a page's FAQPage or HowTo JSON-LD says something the
 * page itself does not show. Rules and rationale: scripts/lib/schema-mirror.mjs.
 *
 * Reads build output rather than content files because FAQs come from three
 * places (blog front matter, src/lib/spmPlatforms.ts, page components), and
 * only the rendered page is common to all of them.
 *
 * Run after `npm run build`. Reads no network and no browser.
 */
import fs from "node:fs";
import { walkHtml, routeOf, requireBuild } from "./lib/build-output.mjs";
import { checkPage, extractJsonLd, nodesOfType } from "./lib/schema-mirror.mjs";

requireBuild("check:schema-mirror");

const files = walkHtml();
const errors = [];
let checkedNodes = 0;
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const { blocks } = extractJsonLd(html);
  checkedNodes += nodesOfType(blocks, "FAQPage").length + nodesOfType(blocks, "HowTo").length;
  errors.push(...checkPage(html, routeOf(file)));
}

/* A gate that inspected nothing must not report OK. The site has carried
   FAQPage markup since launch, so zero found means the build layout or the
   JSON-LD tag format changed under this script, not that the site is clean. */
if (files.length === 0 || checkedNodes === 0) {
  errors.push(
    `M9: inspected ${files.length} pages and ${checkedNodes} FAQPage/HowTo nodes. ` +
      `Expected both to be non-zero; the check is no longer seeing the site.`
  );
}

if (errors.length) {
  console.error(`check:schema-mirror FAILED: ${errors.length} problem(s):\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(
  `check:schema-mirror OK: ${files.length} prerendered routes, ${checkedNodes} FAQPage/HowTo nodes mirror visible content`
);

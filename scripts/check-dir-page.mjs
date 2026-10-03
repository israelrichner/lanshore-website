/**
 * Texas DIR contract page gate (DIR-CPO-5160).
 *
 * The contract lets DIR cancel it if the vendor webpage is missing any
 * required element, and from July to October 2026 the page silently did not
 * exist: the site migration redirected /dir-ai to the home page and nothing
 * noticed until DIR's compliance review did. This gate makes that a build
 * failure instead.
 *
 * Checks the built output: /dir-ai prerenders (and is not a redirect), and
 * carries every element of Appendix A 7.2 and contract section 7.
 */
import fs from "node:fs";
import path from "node:path";
import { APP_DIR, requireBuild } from "./lib/build-output.mjs";

requireBuild("check:dir-page");

const errors = [];
const file = path.join(APP_DIR, "dir-ai.html");

const manifest = path.join(process.cwd(), ".next", "routes-manifest.json");
if (fs.existsSync(manifest)) {
  const routes = JSON.parse(fs.readFileSync(manifest, "utf8"));
  const redirected = (routes.redirects || []).filter((r) => /^\/dir-ai(\/|\(|$)/.test(r.source));
  if (redirected.length) errors.push(`/dir-ai is redirected (${redirected.map((r) => r.source).join(", ")}); it must serve the contract page`);
}

if (!fs.existsSync(file)) {
  errors.push("/dir-ai did not prerender: the DIR contract page is missing");
} else {
  const html = fs.readFileSync(file, "utf8");
  const need = [
    ["contract number DIR-CPO-5160", html.includes("DIR-CPO-5160")],
    ["link to the contract's DIR webpage", html.includes('href="https://dir.texas.gov/contracts/dir-cpo-5160"')],
    ["link to DIR Cooperative Contracts", html.includes('href="https://dir.texas.gov/cooperative-contracts"')],
    ["products and services section", html.includes('id="products"')],
    ["pricing section with DIR discounts", html.includes('id="pricing"') && html.includes("%")],
    ["quote and purchase order instructions", html.includes('id="ordering"')],
    ["contact section", html.includes('id="contact"')],
    ["contact telephone number", /href="tel:[0-9+]{10,}"/.test(html)],
    ["contact email", /href="mailto:[^"@]+@[^"]+"/.test(html)],
    ["warranty policy", html.includes('id="warranty"')],
    ["return policy", html.includes('id="returns"')],
  ];
  for (const [label, ok] of need) if (!ok) errors.push(`missing ${label}`);

  /* DIR Vendor Press Release Guidelines. */
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ");
  for (const bad of [/\bthe DIR\b/i, /partner(ship)? with DIR/i, /approved vendor/i]) {
    if (bad.test(text)) errors.push(`uses wording DIR asks vendors not to use: ${bad}`);
  }
}

if (errors.length) {
  console.error(`check:dir-page FAILED: the Texas DIR contract page (DIR-CPO-5160) is not compliant:\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error("\nThe contract allows DIR to cancel it over these. See src/lib/dirContract.ts.");
  process.exit(1);
}
console.log("check:dir-page OK: /dir-ai carries every required DIR contract element");

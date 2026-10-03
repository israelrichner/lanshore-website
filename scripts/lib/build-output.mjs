/**
 * The prerendered HTML a `next build` leaves behind, shared by every postbuild
 * gate (check-headings, check-schema-mirror) so they agree on which files
 * count as pages and how a file maps back to a route.
 */
import fs from "node:fs";
import path from "node:path";

export const APP_DIR = path.join(process.cwd(), ".next", "server", "app");

export function walkHtml(dir = APP_DIR) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkHtml(full));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** Route path from a prerendered file path, for human-readable errors. */
export function routeOf(file) {
  const rel = path.relative(APP_DIR, file).replace(/\\/g, "/");
  const route = `/${rel.replace(/\.html$/, "")}`;
  return route === "/index" ? "/" : route;
}

/** Exit with a clear message when there is no build to check. */
export function requireBuild(gate) {
  if (!fs.existsSync(APP_DIR)) {
    console.error(`${gate}: no build output at ${APP_DIR}. Run \`npm run build\` first.`);
    process.exit(1);
  }
}

import test from "node:test";
import assert from "node:assert/strict";
import { checkPdf, MAX_PDF_BYTES, base64Size, registryFilePath, storedPdfPath, missingPdfProblem, PDF_DIR } from "./pdf-check.mjs";

const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
const ok = (over = {}) => ({ type: "application/pdf", size: 500_000, head: PDF_MAGIC, ...over });

test("a real PDF passes", () => {
  assert.equal(checkPdf(ok()), null);
});

test("a non-PDF content type is rejected", () => {
  for (const type of ["image/png", "text/plain", "application/octet-stream", ""]) {
    assert.match(checkPdf(ok({ type })), /not a PDF/);
  }
});

test("a renamed file is rejected even though it CLAIMS to be a PDF", () => {
  /* The important case. A browser reports whatever the OS associates with
     the extension, so declaring application/pdf proves nothing — only the
     bytes do. */
  assert.match(checkPdf(ok({ head: [0x89, 0x50, 0x4e, 0x47, 0x0d] })), /does not look like a PDF inside/); // PNG
  assert.match(checkPdf(ok({ head: [0x50, 0x4b, 0x03, 0x04, 0x00] })), /does not look like a PDF inside/); // ZIP
});

test("a truncated header is rejected rather than read past the end", () => {
  assert.match(checkPdf(ok({ head: [0x25, 0x50] })), /does not look like a PDF inside/);
  assert.match(checkPdf(ok({ head: [] })), /does not look like a PDF inside/);
});

test("size limits", () => {
  assert.equal(checkPdf(ok({ size: MAX_PDF_BYTES })), null, "exactly at the limit is allowed");
  assert.match(checkPdf(ok({ size: MAX_PDF_BYTES + 1 })), /limit is 4 MB/);
  assert.match(checkPdf(ok({ size: 0 })), /empty/);
});

test("the message tells the editor the actual size, not just 'too large'", () => {
  assert.match(checkPdf(ok({ size: 6.5 * 1024 * 1024 })), /6\.5 MB/);
});

test("the base64 leg is ~33% larger, and 4 MB stays under Vercel's outbound reality", () => {
  /* Documents the second limit the cap is chosen against. */
  const inflated = base64Size(MAX_PDF_BYTES);
  assert.ok(inflated > MAX_PDF_BYTES * 1.3 && inflated < MAX_PDF_BYTES * 1.4);
});

test("the stored filename is derived from the slug, never the upload", () => {
  /* whitePapers.ts throws unless `file` equals exactly this, so the editor's
     original filename is discarded rather than sanitised. */
  assert.equal(registryFilePath("death-of-commissions"), "/whitepapers/death-of-commissions.pdf");
  assert.equal(storedPdfPath("death-of-commissions"), "public/whitepapers/death-of-commissions.pdf");
});

test("a missing file is reported, not crashed on", () => {
  assert.match(checkPdf(undefined), /No file/);
});

/* --- the build gate's PDF rule, run before the studio commits ---------- */

test("missing PDF at head is refused with a clear message (the 2026-09-29 failure)", () => {
  const p = missingPdfProblem("best-sales-performance-management-software", ["death-of-commissions.pdf"]);
  assert.match(p, /not on the site yet/);
  assert.match(p, /public\/whitepapers\/best-sales-performance-management-software\.pdf/);
  assert.match(p, /Nothing was saved/);
});

test("PDF present at head passes", () => {
  assert.equal(missingPdfProblem("death-of-commissions", ["x.pdf", "death-of-commissions.pdf"]), null);
});

test("a PDF written by the same commit passes", () => {
  assert.equal(missingPdfProblem("new-paper", [], ["public/whitepapers/new-paper.pdf"]), null);
});

test("near-miss names do not count: exact <slug>.pdf only", () => {
  for (const names of [["new-paper.PDF"], ["new-paper"], ["new-paper.pdf.bak"], ["old-new-paper.pdf"]]) {
    assert.ok(missingPdfProblem("new-paper", names), names.join());
  }
  assert.ok(missingPdfProblem("new-paper", [], ["public/whitepapers/other.pdf", "content/white-papers/new-paper.json"]));
});

test("PDF_DIR agrees with storedPdfPath", () => {
  assert.equal(storedPdfPath("a"), `${PDF_DIR}/a.pdf`);
});

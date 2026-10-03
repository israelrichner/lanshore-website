/**
 * PDF upload constraints — source plan §6.5.4.
 *
 * Pure and shared by both sides on purpose: the browser runs it so the editor
 * sees a clear message instead of an opaque 413, and the server runs it
 * because client-side validation is a convenience, never a control.
 *
 * TWO DIFFERENT LIMITS are in play and they are easy to conflate:
 *
 *   - Inbound: the multipart request carrying the file is bounded by Vercel's
 *     ~4.5 MB body cap. This is the binding constraint on upload.
 *   - Outbound: the payload we then send to GitHub is base64, inflating about
 *     33% — a 4 MB file becomes roughly 5.3 MB on that leg.
 *
 * The 4 MB cap below sits under the inbound limit with room to spare. It is
 * comfortable today: the five current papers are 297-696 KB, the largest
 * about 15% of the ceiling even after inflation. Revisit only if a future
 * paper approaches it.
 */

export const MAX_PDF_BYTES = 4 * 1024 * 1024;

/** Roughly what the base64 of a file this size costs on the GitHub leg. */
export function base64Size(bytes) {
  return Math.ceil(bytes / 3) * 4;
}

/**
 * Returns a human-readable problem, or null when the file is acceptable.
 *
 * @param {{type?: string, size?: number, head?: Uint8Array|number[]}} file
 *        `head` is the first five bytes.
 */
export function checkPdf(file) {
  if (!file) return "No file was selected.";

  if (file.type !== "application/pdf") {
    return "That file is not a PDF. Please choose a .pdf file.";
  }

  /* Sniff the magic bytes rather than trusting the declared type. A browser
     reports whatever the OS associates with the extension, so a renamed file
     arrives claiming to be a PDF. The loader assertion in whitePapers.ts is
     the backstop, but a failed deploy is a far worse way to learn this than
     a message in the form. */
  const head = Array.from(file.head ?? []);
  const magic = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
  if (head.length < 5 || magic.some((b, i) => head[i] !== b)) {
    return "That file does not look like a PDF inside, even though it is named like one. Please re-export it.";
  }

  if (typeof file.size !== "number" || file.size <= 0) {
    return "That file appears to be empty.";
  }
  if (file.size > MAX_PDF_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return `That PDF is ${mb} MB. The limit is 4 MB — please compress it and try again.`;
  }

  return null;
}

/**
 * Normalise the stored filename to `<slug>.pdf`.
 *
 * The registry requires `file` to equal exactly `/whitepapers/<slug>.pdf`
 * (whitePapers.ts throws otherwise), so the editor's original filename is
 * discarded rather than sanitised — there is nothing to preserve, and
 * accepting it would create a second thing that can disagree with the slug.
 */
export function storedPdfPath(slug) {
  return `public/whitepapers/${slug}.pdf`;
}

export function registryFilePath(slug) {
  return `/whitepapers/${slug}.pdf`;
}

/** Directory the PDFs live in, relative to the repo root. */
export const PDF_DIR = "public/whitepapers";

/**
 * The build gate's "every registered white paper has its PDF" rule
 * (scripts/check-content.mjs), evaluated against the repo at head BEFORE the
 * studio commits.
 *
 * Why this exists: on 2026-09-29 the studio saved and then published a new
 * white paper whose PDF was not in the repo (the studio does not upload PDFs
 * yet — the form only checks the file locally). Both commits, c76939c and
 * bf48471, failed the production build at check:content. The rule applies to
 * drafts too, because check:content reads drafts from disk.
 *
 * @param {string} slug
 * @param {string[]} pdfNamesAtHead  file names listed in public/whitepapers at head
 * @param {string[]} [pathsInCommit] paths the same commit will write (a future upload)
 * @returns {string|null} a problem for the editor, or null when the PDF is there
 */
export function missingPdfProblem(slug, pdfNamesAtHead, pathsInCommit = []) {
  const stored = storedPdfPath(slug);
  if (pathsInCommit.includes(stored)) return null;
  if (pdfNamesAtHead.includes(`${slug}.pdf`)) return null;
  return (
    `The PDF for this white paper is not on the site yet (${stored}). ` +
    `Uploading PDFs from the studio is not available yet — ask a developer to add the file, then save again. ` +
    `Nothing was saved, so the live site is unaffected.`
  );
}

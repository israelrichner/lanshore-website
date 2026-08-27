/**
 * JSON-LD serialisation for a <script> sink.
 *
 * Extracted from src/lib/schema.ts into a plain `.mjs` so `node --test` can
 * exercise it. It could not be tested where it was: schema.ts imports
 * "./site" without a file extension, which bare Node ESM cannot resolve
 * (test/baseline.md T11). Same root cause that made blog.ts unimportable
 * during P1.
 *
 * This is ONE implementation, re-exported by schema.ts — not a copy.
 *
 * The output is fed to dangerouslySetInnerHTML in src/components/JsonLd.tsx,
 * so a string able to emit a literal closing script tag escapes the sink and
 * executes. The escapes below are valid JSON, so consumers still parse the
 * exact original strings.
 *
 * DO NOT "simplify" this to a bare JSON.stringify. Its input is now partly
 * editor-controlled (post titles, case-study fields), and the test beside
 * this file exists to make that regression fail the build.
 */

/* U+2028 LINE SEPARATOR and U+2029 PARAGRAPH SEPARATOR are valid inside a
   JSON string but are line terminators in JavaScript source, so a script
   sink containing one raw breaks the parse.

   Built with String.fromCharCode rather than written literally, and matched
   with split/join rather than a regex, on purpose: a raw U+2028 inside a
   regex literal is itself a line terminator and a syntax error, and several
   editors and pipelines silently normalise the escape sequence back into the
   raw character. Keeping the source pure ASCII removes the whole class of
   problem. */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

export function toJsonLd(schema) {
  return (
    JSON.stringify(schema)
      /* The replacement is the SIX-CHARACTER TEXT, e.g. backslash-u-0-0-3-c,
         which in a JS string literal is written with a doubled backslash.
         Writing a single backslash would replace "<" with "<" — a no-op that
         reads as correct. The test asserts on the emitted text for this
         reason. */
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .split(LINE_SEPARATOR)
      .join("\\u2028")
      .split(PARAGRAPH_SEPARATOR)
      .join("\\u2029")
  );
}

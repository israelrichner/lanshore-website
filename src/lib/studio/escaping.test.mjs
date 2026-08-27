/**
 * Content-escaping regression tests — source plan §10.4 T15 and T16.
 *
 * NEITHER TEST EXISTS TO FIND A BUG. Both properties already hold today.
 * They exist so that a future "simplification" of the JSON-LD escaper, or a
 * future `rehype-raw` added to the Markdown renderer, FAILS THE BUILD instead
 * of silently opening an injection path.
 *
 * They live here rather than beside the code because they belong to the same
 * boundary P2 establishes: with an editor UI arriving in P3, post titles and
 * case-study fields stop being developer-authored and become untrusted input.
 *
 * If you are deleting one of these as redundant, that is the moment it was
 * written for. Don't.
 *
 * Run: node --test src/lib/studio/escaping.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toJsonLd } from "../jsonld-escape.mjs";

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);
const CLOSING_SCRIPT = "</" + "script>";

/* ------------------------------------------------------------------ *
 * T15 — the JSON-LD sink
 *
 * Output goes to dangerouslySetInnerHTML in src/components/JsonLd.tsx, so a
 * value able to emit a literal closing script tag escapes the sink entirely.
 * ------------------------------------------------------------------ */

test("T15: a title cannot break out of the JSON-LD script sink", () => {
  const hostile = `${CLOSING_SCRIPT}<img src=x onerror=alert(1)>`;
  const out = toJsonLd({ "@type": "BlogPosting", headline: hostile });

  assert.ok(!/<\/script>/i.test(out), "a literal closing script tag survived — the sink is escapable");
  assert.ok(!out.includes("<"), "a raw < survived");
  assert.ok(!out.includes(">"), "a raw > survived");
});

test("T15: escapes <, > and & as text, not as the characters they denote", () => {
  const out = toJsonLd({ t: "<&>" });
  /* Built by concatenation so this assertion cannot itself be normalised
     into the raw characters by an editor or a pipeline. */
  const bs = String.fromCharCode(92);
  assert.ok(out.includes(`${bs}u003c`), "expected the six-character text for <");
  assert.ok(out.includes(`${bs}u003e`), "expected the six-character text for >");
  assert.ok(out.includes(`${bs}u0026`), "expected the six-character text for &");
});

test("T15: escapes U+2028 and U+2029, which are line terminators in JS source", () => {
  const out = toJsonLd({ t: `a${LS}b${PS}c` });
  assert.ok(!out.includes(LS), "raw U+2028 survived — it would break the inline script parse");
  assert.ok(!out.includes(PS), "raw U+2029 survived");
});

test("T15: the escaped output is still valid JSON carrying the original string", () => {
  /* The escapes must be lossless: a consumer parsing the JSON-LD has to see
     exactly what the editor typed, or the schema data is silently corrupted. */
  const original = `${CLOSING_SCRIPT}<b>&amp;</b>${LS}tail`;
  const parsed = JSON.parse(toJsonLd({ t: original }));
  assert.equal(parsed.t, original);
});

/* ------------------------------------------------------------------ *
 * T16 — the Markdown renderer
 *
 * Same configuration as src/components/Markdown.tsx: remark-gfm, NO
 * rehype-raw, default urlTransform.
 * ------------------------------------------------------------------ */

function render(markdown) {
  return renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
        components: {
          a: ({ href, children }) =>
            React.createElement("a", { href, target: "_blank", rel: "noopener noreferrer" }, children),
        },
      },
      markdown
    )
  );
}

test("T16: raw HTML in a post body renders as TEXT, not markup", () => {
  for (const hostile of [
    "<script>alert(1)</script>",
    '<img src=x onerror="alert(1)">',
    '<iframe src="https://evil.example"></iframe>',
    "<svg/onload=alert(1)>",
    '<a href="https://ok.example" onclick="alert(1)">x</a>',
  ]) {
    const html = render(hostile);
    /* A live injection means a REAL element or handler reached the DOM.
       Entity-escaped text (&lt;img ... onerror=&quot;) is inert — it renders
       as visible characters. So look for real tags and real handlers, not
       for substrings that also appear inside escaped text. */
    assert.ok(!/<\s*(script|iframe|svg|object|embed)\b/i.test(html), `live element from: ${hostile}`);
    assert.ok(!/<[^>]+\s on\w+\s*=/i.test(html), `live event handler from: ${hostile}`);
    assert.ok(html.includes("&lt;"), `expected escaping, got: ${html}`);
  }
});

test("T16: dangerous URL schemes are stripped from links", () => {
  for (const hostile of ["[x](javascript:alert(1))", "[x](data:text/html;base64,PHNjcmlwdD4=)"]) {
    const html = render(hostile);
    assert.ok(!/href\s*=\s*"(javascript|data):/i.test(html), `dangerous scheme survived: ${hostile}`);
  }
});

test("T16: ordinary Markdown still renders normally", () => {
  /* Without this, the assertions above could pass on a renderer that emits
     nothing at all. */
  const html = render("## Heading\n\nSome **bold** text and a [link](https://lanshore.com).");
  assert.ok(html.includes("<h2"), "heading should render");
  assert.ok(html.includes("<strong>"), "bold should render");
  assert.ok(html.includes('href="https://lanshore.com"'), "safe link should render");
});

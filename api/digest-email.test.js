import test from "node:test";
import assert from "node:assert/strict";
import { buildDigestHtml } from "./digest-email.js";

test("digest email template escapes unsafe text and keeps line breaks", () => {
  const html = buildDigestHtml({
    title: "MIA <Daily>",
    body: "Line 1\n<script>alert(1)</script>",
  });

  assert.match(html, /MIA &lt;Daily&gt;/);
  assert.match(html, /Line 1<br \/>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
});

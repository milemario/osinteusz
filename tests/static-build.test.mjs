import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

test("the production build is a self-contained static site", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /OSINTeusz 2/);
  assert.doesNotMatch(html, /(?:src|href)="\/(?!\/)/, "asset URLs must not be root-relative");

  for (const name of ["odysseus-profile.png", "argos-photo.png", "ithaca-selfie.png"]) {
    const file = await stat(new URL(`../dist/assets/${name}`, import.meta.url));
    assert.ok(file.size > 0, `${name} should be copied into dist/assets`);
  }
});

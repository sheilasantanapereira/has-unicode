"use strict"
const tap = require('tap');
const requireInject = require('require-inject');

tap.test("Windows", function (t) {
  const hasUnicode = requireInject("../index.js", {
    os: { type: function () { return "Windows_NT" } }
  });
  t.equal(hasUnicode(), false, "Windows is assumed NOT to be unicode aware");
  t.end();
});

tap.test("Unix Env", function (t) {
  const hasUnicode = requireInject("../index.js", {
    os: { type: function () { return "Linux" } },
    process: {
      env: {
        LC_ALL: null,
        LC_CTYPE: null,
        LANG: null
      }
    }
  });

  function test3(LC_ALL, LC_CTYPE, LANG, expected, comment) {
    const env = process.env;
    if (LC_ALL) env.LC_ALL = LC_ALL; else delete env.LC_ALL;
    if (LC_CTYPE) env.LC_CTYPE = LC_CTYPE; else delete env.LC_CTYPE;
    if (LANG) env.LANG = LANG; else delete env.LANG;
    t.equal(hasUnicode(), expected, comment);
  }

  test3(null, null, "en_US.UTF-8", true, "Linux with a UTF-8 language");
  test3("en_US.UTF-8", null, null, true, "Linux with UTF-8 locale");
  test3(null, null, null, false, "Linux with no locale setting at all");

  t.end();
});
var assert = require("assert");
var chai = require("chai"),
  expect = chai.expect;

import { parseHTML } from "../src/parser";

describe("parse html:", () => {
  it("<a></a>", function () {
    let tree = parseHTML("<a></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href="//time.geekbang.org" />', function () {
    let tree = parseHTML('<a href="//time.geekbang.org"/>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
    expect(tree.children[0].attributes[0].name).to.equal("href");
    expect(tree.children[0].attributes[0].value).to.equal(
      "//time.geekbang.org"
    );
    expect(tree.children[0].attributes[1].name).to.equal("isSelfClosing");
    expect(tree.children[0].attributes[1].value).to.be.true;
  });

  it('<a href="//time.geekbang.org" target="_blank"/>', function () {
    let tree = parseHTML('<a href="//time.geekbang.org" target="_blank"/>');
    expect(tree.children[0].attributes.length).to.equal(3);
  });

  it("<input type=text />", function () {
    let tree = parseHTML("<input type=text />");
    expect(tree.children[0]).to.have.all.keys(["type", "content"]);
    expect(tree.children[0].type).to.equal("text");
  });

  it("<p style='color:red;'>A red paragraph.</p>", function () {
    let tree = parseHTML("<p style='color:red;'>A red paragraph.</p>");
    expect(tree.children[0].children[0].type).to.equal("text");
    expect(tree.children[0].children[0].content).to.equal("A red paragraph.");
    expect(tree.children[0].attributes[0].name).to.equal("style");
    expect(tree.children[0].attributes[0].value).to.equal("color:red;");
  });

  it("<my-Tag myAttribute=true>My tag with customized attribute</my-Tag>", function () {
    let tree = parseHTML("<my-Tag myAttribute=true>My tag</my-Tag>");
    assert.equal(tree.children[0].tagName, "my-Tag");
    expect(tree.children[0].attributes[0].name).to.equal("myAttribute");
    expect(tree.children[0].attributes[0].value).to.equal("true");
  });

  it("<a href />", function () {
    let tree = parseHTML("<a href />");
    expect(tree.children[0].attributes[0].name).to.equal("isSelfClosing");
    expect(tree.children[0].attributes[0].value).to.be.true;
    expect(tree.children[0].attributes.length).to.equal(1);
  });

  it("<a href></a>", function () {
    let tree = parseHTML("<a href></a>");
    expect(tree.children[0].attributes[0].name).to.equal("href");
    expect(tree.children[0].attributes[0].value).to.be.empty;
  });

  it("<a href=  'a'></a>", function () {
    let tree = parseHTML("<a href=  'a'></a>");
    expect(tree.children[0].attributes[0].name).to.equal("href");
    expect(tree.children[0].attributes[0].value).to.equal("a");
  });
  it("<a href=a/>", function () {
    let tree = parseHTML("<a href=a/>");
    expect(tree.children[0].attributes[0].name).to.equal("href");
    expect(tree.children[0].attributes[0].value).to.equal("a");
  });

  it("<p/>", function () {
    let tree = parseHTML("<p/>");
    expect(tree.children[0].attributes[0].name).to.equal("isSelfClosing");
    expect(tree.children[0].attributes[0].value).to.be.true;
  });

  it("<start></end>", function () {
    expect(function () {
      parseHTML("<start></end>");
    }).to.throw("Tag start end doesn't match");
  });

  it("<*myTag></*myTag>", function () {
    expect(function () {
      parseHTML("<*myTag></*myTag>");
    }).to.throw(
      "HTML elements all have names that only use characters in the range 0–9, a–z and A–Z."
    );
  });
});

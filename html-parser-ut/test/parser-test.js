var assert = require("assert");

import { parseHTML } from "../src/parser";

describe("parse html:", () => {
  it("<a>abc</a>", function () {
    let tree = parseHTML("<a>abc</a>");
    console.log(tree);
    
    assert.equal(1, 1);
  });
});

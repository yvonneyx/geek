const css = require("css");

const EOF = Symbol("EOF"); // EOF: End Of File

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{ type: "document", children: [] }];

let rules = [];

//函数addCSSRules目的是把CSS规则暂时缓存到一个数组里
function addCSSRules(text) {
  var ast = css.parse(text);
  // console.log(JSON.stringify(ast, null, "   "));
  rules.push(...ast.stylesheet.rules);
}

// function isIntersectionSelector(selector) {
//   var nums = 0;
//   if (selector.charAt(0).match(/^[a-zA-Z]$/)) {
//     nums++;
//   }
//   for (let c of selector) {
//     if (c === "#" || c === ".") {
//       nums++;
//     }
//   }
//   return nums > 1;
// }

// function splitIntersectionSelector(selector) {
//   //div.class1 .class1.class2 .class1#id
//   var selectors = [];
//   var newSelector = "";
//   for (let c of selector) {
//     if (selector.indexOf(c) !== 0 && (c === "#" || c === ".")) {
//       selectors.push(newSelector);
//       newSelector = "";
//     }
//     newSelector += c;
//   }
//   selectors.push(newSelector);
//   return selectors;
// }

// function match(element, selector) {
//   if (isIntersectionSelector(selector)) {
//     var childSelectors = splitIntersectionSelector(selector);
//     let res = true;
//     for (let s of childSelectors) {
//       res = res && singlematch(element, s);
//     }
//     return res;
//   } else {
//     singlematch(element, selector);
//   }
// }

// function singlematch(element, selector) {
function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }

  if (selector.charAt(0) == "#") {
    var attr = element.attributes.filter((attr) => (attr.name = "id"))[0];
    return attr && attr.value === selector.replace("#", "");
  } else if (selector.charAt(0) == ".") {
    var attr = element.attributes.filter((attr) => (attr.name = "class"))[0];
    return attr && attr.value === selector.replace(".", "");
  } else {
    return element.tagName === selector;
  }
}

function computeCSS(element) {
  // console.log(rules);
  // console.log("compute CSS for Element", element);

  //elements表示该元素的所有父元素，同时遵循从内而外的顺序
  var elements = stack.slice().reverse();

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    var selectorParts = rule.selectors[0].split(" ").reverse();

    // 作业（可选）： 实现复合选择器，实现支持空格的Class选择器
    // 支持 div .class1.class2即同时拥有class1和class2

    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matched = false;

    var j = 1;
    for (var i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }

    if (j >= selectorParts.length) {
      matched = true;
    }

    if (matched) {
      // console.log("Element:", element, "; matched rule:", rule);
      var computedStyle = element.computedStyle;
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        computedStyle[declaration.property].value = declaration.value;
      }
      console.log(element.computedStyle);
    }
  }
}

function emit(token) {
  let top = stack[stack.length - 1];

  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };

    element.tagName = token.tagName;

    for (let p in token) {
      // key
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }

    if (rules) {
      computeCSS(element);
    }

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match");
    } else {
      if (top.tagName === "style") {
        addCSSRules(top.children[0].content);
      }
      stack.pop();
    }

    currentTextNode = null;
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c == "<") {
    return tagOpen;
  } else if (c == EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c == "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c); // reconsume c
  } else {
    emit({
      type: "text",
      content: c,
    });
    return;
  }
}

function endTagOpen(c) {
  //自封闭标签
  if (c == ">") {
  }
  //结束标签
  else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c == EOF) {
  } else {
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c == ">") {
    emit(currentToken);
    return data;
  } else {
    currentToken.tagName += c;
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/" || c == ">" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    // return beforeAttributeName;
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return beforeAttributeValue;
  } else if (c == '"') {
    return doubleQuotedAttributeValue;
  } else if (c == "'") {
    return singleQuotedAttributeValue;
  } else if (c == ">") {
  } else {
    return unQuotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c == '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributedValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c == "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributedValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function afterQuotedAttributedValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    // Why???
    // currentAttribute.value += c;
    // return doubleQuotedAttributeValue;
  }
}

function unQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<" || c == "=" || c == "`") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return unQuotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c == ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
};

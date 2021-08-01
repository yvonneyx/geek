// 第一层数组表示“或”，同一数组表示“与”

let syntax = {
  Program: [["StatementList", "EOF"]],
  StatementList: [["Statement"], ["StatementList", "Statement"]],
  Statement: [
    ["ExpressionStatement"],
    ["IfStatement"],
    ["VariableDeclaration"],
    ["FunctionDeclaration"],
  ],
  IfStatement: [["if", "(", "Expression", ")", "Statement"]],
  VariableDeclaration: [
    ["var", "Identifier", ";"],
    ["let", "Identifier", ";"],
  ],
  FunctionDeclaration: [
    ["function", "Identifier", "(", ")", "{", "StatementList", "}"],
  ],
  ExpressionStatement: [["Expression", ";"]],
  Expression: [["AdditiveExpression"]],
  AdditiveExpression: [
    ["MultiplicativeExpression"],
    ["AdditiveExpression", "+", "MultiplicativeExpression"],
    ["AdditiveExpression", "-", "MultiplicativeExpression"],
  ],
  MultiplicativeExpression: [
    ["UnaryExpression"],
    ["MultiplicativeExpression", "*", "UnaryExpression"],
    ["MultiplicativeExpression", "/", "UnaryExpression"],
  ],
  UnaryExpression: [
    ["PrimaryExpression"],
    ["+", "PrimaryExpression"],
    ["-", "PrimaryExpression"],
    ["typeof", "PrimaryExpression"],
  ],
  PrimaryExpression: [["(", "Expression", ")"], ["Literal"], ["Identifier"]],
  Literal: [["Number"]],
};

// 避免死循环，利用回环来实现无限状态机
let hash = {};

// 第一层closure
function closure(state) {
  hash[JSON.stringify(state)] = state;
  let queue = [];
  for (let symbol in state) {
    queue.push(symbol);
  }
  while (queue.length) {
    let symbol = queue.shift();
    // console.log(symbol);
    if (syntax[symbol]) {
      for (let rule of syntax[symbol]) {
        if (!state[rule[0]]) queue.push(rule[0]);
        let current = state;
        for (let part of rule) {
          if (!current[part]) current[part] = {};
          current = current[part]; //下移一格
        }
        current.$isRuleEnd = true;
      }
    }
  }
  for (let symbol in state) {
    if (hash[JSON.stringify(state[symbol])]) {
      state[symbol] = hash[JSON.stringify(state[symbol])];
    } else {
      closure(state[symbol]);
    }
  }
}

let end = {
  $isEnd: true,
};

let start = {
  // Program: end,
  IfStatement: end,
};

closure(start);

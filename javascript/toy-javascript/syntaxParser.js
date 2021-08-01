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

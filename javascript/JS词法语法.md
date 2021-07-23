# 定义产生式

- 符号（Symbol）
  - 定义的语法结构名称
- 终结符（Terminal Symbol）与非终结符（Non-Terminal Symbol）
  - 终结符：不是由其它符号定义的符号，也就是说，它不会出现在产生时左边
  - 非终结符：由其它符号经过“与”，“或”等逻辑组成的符号
- 语言定义
  - 语言可以有一个非终结符和它的产生式来定义
- 语法树
  - 把一段具体的语言的文本，根据产生式以树形结构来表示出来

# 产生式的写法

## EBNF（BNF 的进阶版）

- 中文 ::= { 句子 }
- 句子 ::= 主语 谓语 [宾语]
- 主语 ::= 代词 ｜ 名词 ｜ 名词性短语
- 代词 ::= "你" | "我" | "他"

> - 不强制加尖括号
> - 大括号表示可以重复多次
> - 方括号表示可以省略

## JavaScript 标准

```

```

# 产生式的练习

1. 外星语言：某外星人采用二进制交流。他们的语言只有“叽咕”和“咕叽”两种词。外星人每说完一句，会说“啪”。

```js
// BNF
<外星语言> ::= { <外星句> }
<外星句> ::= { "叽咕" | "咕叽" } 啪
```

2. 数学语言四则运算，只允许 10 以内整数的加减乘除

```js
<四则运算表达式> ::= <加法算式>
<加法算式> ::= ( <加法算式> ( "+" | "-" ) <乘法算式> ) | <乘法算式>
<乘法算式> ::= ( <乘法算式> ( "*" | "/" ) <数字> ) | <数字>
<数字> ::= { "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" }

// 大括号 {...} 内包含的为可重复0至无数次的项
```

3. 四则运算，允许整数

```js
<四则运算表达式> ::= <加法算式>
<加法算式> ::= ( <加法算式> ( "+" | "-" ) <乘法算式> ) | <乘法算式>
<乘法算式> ::= ( <乘法算式> ( "*" | "/" ) <数字> ) | <数字>
<数字> ::= { "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" }{ "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" }
```

> {...}：重复，0 或 任意次重复；示例：AB ::= "a" {"b"}，表示 AB 是由 一个 a 后面跟上任意数量（包括 0 个）个 b 组成，如 a、a b、a bb、a bbb

4. 四则运算，允许小数

```js
<四则运算表达式> ::= <加法算式>
<加法算式> ::= ( <加法算式> ( "+" | "-" ) <乘法算式> ) | <乘法算式>
<乘法算式> ::= ( <乘法算式> ( "*" | "/" ) <数字> ) | <数字>
<数字> ::= { "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" }{ "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" } . {"0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" }
```

5. 四则运算，允许括号

```js
// ( 3 + 5 ) * 8
<四则运算表达式> ::= <加法算式>
<加法算式> ::= ["("] <加法算式> [")"] ( "+" | "-") <乘法算式> | <乘法算式>
<乘法算式> ::= ( ["("] <乘法算式> [")"] ( "*" | "/" ) <数字> ) | <数字>
<数字> ::= { "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" }{ "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" } . {"0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" }
```

# 乔姆斯基谱系

```
- 3型 正则文法
	- <A> ::= <A>?
	> 只允许左递归，即只能在左边加东西
- 2型 上下文无关文法
	- <A> ::= ?
- 1型 上下文相关文法
	- ?<A>? ::= ?<B>?  -- CDA -> CXYA
- 0型 无限制文法
	- ?::=?
```

# 词法和语法

- 词法：正则文法（3 型）
  - 空白
  - 换行
  - 注释
  - Token（一个有效的词）
- 语法：上下文无关文法（2 型）
  - 语法树

```
// 词法基本框架
InputElement ::= WhiteSpace | LineTerminator | Comment | Token

WhiteSpace ::= " " 半角空格 | "	 " 全角空格| ....

LineTerminator ::= "\n" | "\r" | ...

Comment ::= SingleComment | MultipleComment
SingleComment ::= "/" "/" <any>*
MultipleComment ::= "/" "*" ([^*] | "*" [^/])* "*" "/"

Token ::= Literal | Keywords | Identifier | Punctuator
Literal ::= NumericLiteral | StringLiteral | BooleanLiteral | NullListeral
Keywords ::= "if" | "else" | "for" | "function" | ...
Punctuator ::= "+" | "-" | "*" | "/" | "{" | "}" | ...

// 语法基本框架
Program ::= Statement+

Statement ::= ExpressionStatement | IfStatement
			| ForStatement | WhileStatement
			| VariableDeclaration | FunctionDeclaration | ClassDeclaration
			| BreakStatement | ContinueStatement | ReturnStatement | ThrowStatement
			| TryStatement | Block

IfStatement ::= "if" "(" Expression ")" Statement

Block ::= "{" Statement "}"

TryStatement ::= "try" "{" Statement "}" catch "(" Statement ")" "{" Statement+ "}"


ExpressionStatement ::= Expression ";"

Expression ::= AdditiveExpression

AdditiveExpression ::= MultiplicativeExpression
			| AdditiveExpression ("+" | "-") MultiplicativeExpression

MultiplicativeExpression ::= UnaryExpression
			| MultiplicativeExpression ("*" | "/") UnaryExpression

UnaryExpression ::= PrimaryExpression
			| ("+" | "-" | "typeof") PrimaryExpression

PrimaryExpression ::= "(" Expression ")" | Literal | Identifer

UnaryExpression 单目运算
PrimaryExpression 下一层级表达式
```

> 思考题：什么属于 JavaScript？

# 换行符和回车符

“回车”，告诉打字机把打印头定位在左边界，不卷动滚筒；另一个叫做“换行”，告诉打字机把滚筒卷一格，不改变水平位置。

- 回车 \r 本义是光标重新回到本行开头，r 的英文 return，控制字符可以写成 CR，即 Carriage Return

- 换行 \n 本义是光标往下一行（不一定到下一行行首），n 的英文 newline，控制字符可以写成 LF，即 Line Feed

> **JS 的七大类型**：数字，字符串，布尔类型，对象，Symbol，undefined 和 NULL

# JavaScript 中 for of 和 for in 的区别？

1. 推荐在循环对象属性的时候，使用 for...in,在遍历数组的时候的时候使用 for...of。
2. for...in 循环出的是 key，for...of 循环出的是 value
3. 注意，for...of 是 ES6 新引入的特性。修复了 ES5 引入的 for...in 的不足
4. for...of 不能循环普通的对象，需要通过和 Object.keys()搭配使用

# JavaScript 中的 Var，Let 和 Const 的区别

https://chinese.freecodecamp.org/news/javascript-var-let-and-const/

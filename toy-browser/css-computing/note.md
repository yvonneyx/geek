
# CSS computing

```jsx
const css = require('css');

let rules = []; // 全局变量
```

## 第一步：收集css规则

- 遇到style标签时，我们把CSS规则保存起来 `addCSSRules`
- 这里我们调用了CSS Parser 来分析CSS规则
- 这里我们必须要仔细的研究此库来分析CSS规则的样式

> 语法糖 `ast.stylesheet.rules: *[declaration], *[selectors]`

## 第二步：添加调用

- 当我们创建一个元素后，立即计算CSS —— `computeCSS` 在startTag验证时调用
- 理论上个当我们分析一个元素时， 所有css规则已经收集完毕
- 在真实的浏览器中，可能遇到写在body的style标签，需要从新计算css的情况，这里我们忽略

## 第三步：获取父元素序列

```jsx
function computeCSS(element){
	var elements = stack.slice().reverse();
	// slice(): 当没有参数时代表将栈复制一遍，避免污染
}
```
- 在computeCSS函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
- 我们从上一步骤的stack，可以获取本元素的所有父元素
- 因为我们首先获得的是 “当前元素” 所以我们获得和计算父元素的匹配顺讯是**从内向外**

> `div div #myid` div不知道匹配哪个元素，而#myid一定匹配当前元素。所以我们一定检查最后一个选择器是否匹配。

## 第四步：选择器与元素的匹配(只考虑简单选择器情况)

- 选择器也要从当前元素向外排列 —— 与当前元素的父元素排列顺序一致
- 复杂选择器拆成针对单个元素的选择器，用**双重循环**匹配父元素队列

## 第五步：计算选择器与元素的匹配

```jsx
/* .a className选择器
#a id选择器
div tagName选择器
div.a#a */

//每个元素都要和所有的rules进行匹配
function match(element, selector){

	// selector.chatAt(0) == '#'
	// selector.chatAt(0) == '.'
	// selector
}
```

- 根据选择器的类型和元素属性，计算是否与当前元素匹配
- 这里仅仅只实现了三种基本选择器，实际的浏览器中要处理复合选择器

> 作业（可选）： 实现复合选择器，实现支持空格的Class选择器

## 第六步：生成computed属性

- 一旦选择匹配，就应用选择器到元素上，形成computeStyle

## 第七步：specificity的计算逻辑

```
div div #id

[0,     1,    0,     2]
inline  id    class  tag

div #my #id
[0,     2,    0,     1]
```

- CSS规则根据**specificity**和后来优先规则覆盖
- specificity是一个四元组，越左边权重越高
- 一个CSS规则的specificity根据包含的简单选择器相加而成

> 作业（可选）： 函数`specificity()`实现复合选择器

> 问题： CSS重新计算的过程此处我们忽略了，但是真实的浏览器此时发生了什么？
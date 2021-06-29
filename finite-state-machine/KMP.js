// 用状态机处理完全未知的 pattern

// 以W="ABCDABD"，S="ABC ABCDAB ABCDABCDABDE"为例说明查找过程。查找过程同时使用两个循环变量m和i：
// m代表主文字符串S内匹配字符串W的当前查找位置，
// i代表匹配字符串W当前做比较的字符位置。

var W = "ABCDABD";
var S = "ABC ABCDAB ABCDABCDABDE";

function match(w, s) {
  let state = start;
  let i = 0;
  for (let m = 0; m < s.length; m++) {
    state = state(w, s, m, i);
  }
  return state === end;
}

function start(w, s, m, i) {
  if (w[i] === s[m]) {
    return next(w, s, m, i);
  } else {
    i = 0;
    return start;
  }
}

function end() {
  return end;
}

function next(w, s, m, i) {
  if (s[m + i] === w[i]) {
    if (i === w.length - 1) {
      console.log(m);
      return end;
    }
    return next(w, s, m, ++i);
  } else {
    return start(w, s, m, i);
  }
}

console.log(match(W, S));

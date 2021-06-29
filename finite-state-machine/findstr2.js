// 使用状态机完成”abababx”的处理。
function findstr2(string) {
  let state = start;
  for (let c of string) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  return c === "a" ? foundA1 : start;
}

function end(c) {
  return end;
}

function foundA1(c) {
  return c === "b" ? foundB1 : start(c);
}

function foundB1(c) {
  return c === "a" ? foundA2 : start(c);
}

function foundA2(c) {
  return c === "b" ? foundB2 : start(c);
}

function foundB2(c) {
  return c === "a" ? foundA3 : start(c);
}

function foundA3(c) {
  return c === "b" ? foundB3 : start(c);
}

function foundB3(c) {
  return c === "x" ? end : foundB2(c);
}

console.log(findstr2("ababababababx"));

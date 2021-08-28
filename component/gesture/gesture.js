let element = document.documentElement;

element.addEventListener("mousedown", (event) => {
  start(event);
  let mousemove = (event) => {
    // console.log(event.clientX, event.clientY);
    move(event);
  };
  let mouseup = (event) => {
    end(event);
    element.removeEventListener("mousemove", mousemove);
    element.removeEventListener("mouseup", mouseup);
  };
  element.addEventListener("mousemove", mousemove);
  element.addEventListener("mouseup", mouseup);
});

// touch系列一旦start就会触发move，一定是触发在同一个元素上
// touchstart是多点触发
element.addEventListener("touchstart", (event) => {
  for (let touch of event.changedTouches) {
    // console.log("touchstart", touch.clientX, touch.clientY);
    start(touch);
  }
});
element.addEventListener("touchmove", (event) => {
  for (let touch of event.changedTouches) {
    // console.log("touchmove", touch.clientX, touch.clientY);
    move(touch);
  }
});
element.addEventListener("touchend", (event) => {
  for (let touch of event.changedTouches) {
    // console.log("touchend", touch.clientX, touch.clientY);
    end(touch);
  }
});
// touchcancel异常退出
element.addEventListener("touchcancel", (event) => {
  for (let touch of event.changedTouches) {
    // console.log("touchcancel", touch.clientX, touch.clientY);
    cancel(touch);
  }
});

let start = (point) => {
  console.log("start");
};
let move = (point) => {
  console.log("move");
};
let end = (point) => {
  console.log("end");
};
let cancel = (point) => {
  console.log("cancel");
};

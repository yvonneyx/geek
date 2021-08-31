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

let handler;
let startX, startY;
let isPan = false;
let isTap = true;

let start = (point) => {
  console.log("start");
  startX = point.clientX;
  startY = point.clientY;

  isTap = true;
  isPan = false;
  isPress = false;

  handler = setTimeout(() => {
    console.log("pressstart");
    isTap = false;
    isPan = false;
    isPress = true;
    handler = null;
  }, 500);
};
let move = (point) => {
  let dx = startX - point.clientX,
    dy = startY - point.clientY;

  if (!isPan && dx ** 2 + dy ** 2 > 100) {
    isTap = false;
    isPan = true;
    isPress = false;
    console.log("panstart");
    clearTimeout(handler);
  }

  if (isPan) {
    console.log("pan");
  }
};
let end = (point) => {
  if (isTap) {
    console.log("pan");
  }
  if (isPan) {
    console.log("panend");
  }
  if (isPress) {
    console.log("pressend");
  }
  console.log("end");
};
let cancel = (point) => {
  clearInterval(handler);
  console.log("cancel");
};

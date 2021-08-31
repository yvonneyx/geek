let element = document.documentElement;

let isListeningMouse = false;

element.addEventListener("mousedown", (event) => {
  let context = Object.create(null);
  contexts.set("mouse" + (1 << event.button), context);
  start(event, context);

  let mousemove = (event) => {
    // console.log(event.clientX, event.clientY);
    let button = 1;

    while (button <= event.buttons) {
      if (button & event.buttons) {
        // order of buttons & button property is not same
        let key;
        if (button === 2) {
          key = 4;
        } else if (button === 4) {
          key = 2;
        } else {
          key = button;
        }

        let context = contexts.get("mouse" + key);
        move(event, context);
      }
      button = button << 1;
    }
  };

  let mouseup = (event) => {
    let context = contexts.get("mouse" + (1 << event.button));
    end(event, context);
    contexts.delete(context);

    if (event.buttons === 0) {
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
      isListeningMouse = false;
    }
  };

  if (!isListeningMouse) {
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
    isListeningMouse = true;
  }
});

let contexts = new Map();
// touch系列一旦start就会触发move，一定是触发在同一个元素上
// touchstart是多点触发
element.addEventListener("touchstart", (event) => {
  for (let touch of event.changedTouches) {
    // console.log("touchstart", touch.clientX, touch.clientY);
    let context = Object.create(null);
    contexts.set(touch.identifier, context);
    start(touch, context);
  }
});
element.addEventListener("touchmove", (event) => {
  for (let touch of event.changedTouches) {
    // console.log("touchmove", touch.clientX, touch.clientY);
    let context = contexts.get(touch.identifier);
    move(touch, context);
  }
});
element.addEventListener("touchend", (event) => {
  for (let touch of event.changedTouches) {
    // console.log("touchend", touch.clientX, touch.clientY);
    let context = contexts.get(touch.identifier);
    end(touch, context);
    contexts.delete(context);
  }
});
// touchcancel异常退出
element.addEventListener("touchcancel", (event) => {
  for (let touch of event.changedTouches) {
    // console.log("touchcancel", touch.clientX, touch.clientY);
    let context = contexts.get(touch.identifier);
    cancel(touch, context);
    contexts.delete(context);
  }
});

let handler;
let startX, startY;
let isPan = false,
  isTap = true,
  isPress = false;

let start = (point, context) => {
  console.log("start");
  context.startX = point.clientX;
  context.startY = point.clientY;

  context.isTap = true;
  context.isPan = false;
  context.isPress = false;

  context.handler = setTimeout(() => {
    console.log("pressstart");
    context.isTap = false;
    context.isPan = false;
    context.isPress = true;
    context.handler = null;
  }, 500);
};

let move = (point, context) => {
  let dx = context.startX - point.clientX,
    dy = context.startY - point.clientY;

  if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
    context.isTap = false;
    context.isPan = true;
    context.isPress = false;
    console.log("panstart");
    clearTimeout(context.handler);
  }

  if (context.isPan) {
    console.log("pan");
  }
};

let end = (point, context) => {
  if (context.isTap) {
    // console.log("tap");
    dispatch("tap", {});
    clearInterval(context.handler);
  }
  if (context.isPan) {
    console.log("panend");
  }
  if (context.isPress) {
    console.log("pressend");
  }
  console.log("end");
};

let cancel = (point, context) => {
  clearInterval(context.handler);
  console.log("cancel");
};

function dispatch(type, properties) {
  let event = new Event(type);
  console.log(event);
  for (let name in properties) {
    event[name] = properties[name];
  }
  element.dispatchEvent(event)
}

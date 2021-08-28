/* setInterval(() => {}, 16);

let tick = () => {
  setTimeout(tick, 16);
}; 

// requestAnimationFrame: 申请浏览器在执行下一帧时执行代码
// 自重复时间线的实现
let tick = () => {
  requestAnimationFrame(tick);
};
*/

// 此处用Symbol的原因：即使执行了多遍tick但值不同，具有唯一性
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animation");
const START_TIME = Symbol("start-time");

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  start() {
    let startTime = Date.now();
    this[TICK] = () => {
      let now = Date.now();
      for (let animation of this[ANIMATIONS]) {
        let t;
        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime;
        } else {
          t = now - this[START_TIME].get(animation);
        }
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        animation.receive(t);
      }
      requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }

  //   set rate() {}
  //   get rate() {}

  pause() {}
  resume() {}

  reset() {}

  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }

  remove() {}
}

export class Animation {
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    delay,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
    this.delay = delay;
  }

  receive(time) {
    let range = this.endValue - this.startValue;

    this.object[this.property] =
      this.startValue + (range * time) / this.duration;
  }
}

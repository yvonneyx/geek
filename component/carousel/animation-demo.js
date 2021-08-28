import { Timeline, Animation } from "./animation.js";

let tl = new Timeline();
tl.start();
tl.add(
  new Animation(
    {
      set a(v) {
        console.log(v);
      },
    },
    "a",
    0,
    100,
    1000,
    null
  )
);

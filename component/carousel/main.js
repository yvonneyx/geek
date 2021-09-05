import { Component, createElement } from "./framework.js";
import { Carousel } from "./carousel.js";
import { Timeline, Animation } from "./animation.js";

let images = [
  {
    img:
      "https://images.pexels.com/photos/8678811/pexels-photo-8678811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
    url: "https://u.geekbang.org/lesson/159",
  },
  {
    img:
      "https://images.pexels.com/photos/5847383/pexels-photo-5847383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
    url: "https://u.geekbang.org/lesson/159",
  },
  {
    img:
      "https://images.pexels.com/photos/6626710/pexels-photo-6626710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
    url: "https://u.geekbang.org/lesson/159",
  },
  {
    img:
      "https://images.pexels.com/photos/3632966/pexels-photo-3632966.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
    url: "https://u.geekbang.org/lesson/159",
  },
  {
    img:
      "https://images.pexels.com/photos/4376212/pexels-photo-4376212.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
    url: "https://u.geekbang.org/lesson/159",
  },
];

let a = (
  <Carousel
    src={images}
    onChange={(event) => {
      console.log(event.detail.position);
    }}
    onClick={(event) => {
      window.location.href = event.detail.data.url;
    }}
  />
);
a.mountTo(document.body);

// let tl = new Timeline();
// window.tl = tl;
// window.animation = new Animation(
//   {
//     set a(v) {
//       console.log(v);
//     },
//   },
//   "a",
//   0,
//   100,
//   1000,
//   null
// );
// tl.start();

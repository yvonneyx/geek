import { Component, createElement } from "./framework.js";
import { Carousel } from "./carousel.js";
import { Timeline, Animation } from "./animation.js";

let images = [
  "https://images.pexels.com/photos/8678811/pexels-photo-8678811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
  "https://images.pexels.com/photos/5847383/pexels-photo-5847383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
  "https://images.pexels.com/photos/6626710/pexels-photo-6626710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
  "https://images.pexels.com/photos/3632966/pexels-photo-3632966.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
  "https://images.pexels.com/photos/4376212/pexels-photo-4376212.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=0",
];

let a = <Carousel src={images} />;
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

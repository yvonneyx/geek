import { Component, createElement } from "./framework.js";
import { Carousel } from "./Carousel.js";
import { Button } from "./Button.js";
import { List } from "./List.js";

let images = [
  {
    img:
      "https://images.pexels.com/photos/8678811/pexels-photo-8678811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
    url: "https://u.geekbang.org/lesson/159",
    title: "Geek1",
  },
  {
    img:
      "https://images.pexels.com/photos/5847383/pexels-photo-5847383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
    url: "https://u.geekbang.org/lesson/159",
    title: "Geek2",
  },
  {
    img:
      "https://images.pexels.com/photos/6626710/pexels-photo-6626710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
    url: "https://u.geekbang.org/lesson/159",
    title: "Geek3",
  },
  {
    img:
      "https://images.pexels.com/photos/3632966/pexels-photo-3632966.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
    url: "https://u.geekbang.org/lesson/159",
    title: "Geek4",
  },
  {
    img:
      "https://images.pexels.com/photos/4376212/pexels-photo-4376212.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
    url: "https://u.geekbang.org/lesson/159",
    title: "Geek5",
  },
];

/*
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
*/

// let a = <Button>content</Button>;

let a = (
  <List data={images}>
    {(record) => {
      return (
        <div>
          <img src={record.img} />
          <a href={record.url}>{record.title}</a>
        </div>
      );
    }}
  </List>
);
a.mountTo(document.body);

/*
let tl = new Timeline();
window.tl = tl;
window.animation = new Animation(
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
);
tl.start();
*/

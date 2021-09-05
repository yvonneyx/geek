import { Component } from "./framework.js";
import { enableGesture } from "./encapGesture.js";
import { Timeline, Animation } from "./animation.js";
import { ease, easeIn, easeOut, easeInOut, linear } from "./ease.js";

export class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }

    enableGesture(this.root);

    let timeline = new Timeline();
    timeline.start();

    let children = this.root.children;

    let position = 0;

    let nextPicStopHandler = null;

    let t = 0;
    let ax = 0; // 由动画产生的位移量

    this.root.addEventListener("start", (event) => {
      timeline.pause();
      clearInterval(nextPicStopHandler);

      let offsetWidth = this.root.offsetWidth;
      let progress = (Date.now() - t) / 500;
      ax = ease(progress) * offsetWidth - offsetWidth;
    });

    this.root.addEventListener("pan", (event) => {
      let offsetWidth = this.root.offsetWidth;

      let x = event.clientX - event.startX - ax;
      let current = position - (x - (x % offsetWidth)) / offsetWidth;

      for (let offset of [-2, -1, 0, 1, 2]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;
        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(${
          -pos * offsetWidth + offset * offsetWidth + (x % offsetWidth)
        }px)`;
      }
    });

    this.root.addEventListener("end", (event) => {
      timeline.reset();
      timeline.start();
      nextPicStopHandler = setInterval(nextPicture, 3000);

      let offsetWidth = this.root.offsetWidth;
      let x = event.clientX - event.startX - ax;
      let current = position - (x - (x % offsetWidth)) / offsetWidth;

      let direction = Math.round((x % offsetWidth) / offsetWidth);

      if (event.isFlick) {
        if (event.velocity < 0) {
          direction = Math.ceil((x % offsetWidth) / offsetWidth);
        } else {
          direction = Math.floor((x % offsetWidth) / offsetWidth);
        }
      }

      for (let offset of [-2, -1, 0, 1, 2]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        children[pos].style.transition = "none";
        timeline.add(
          new Animation(
            children[pos].style,
            "transform",
            -pos * offsetWidth + offset * offsetWidth + (x % offsetWidth),
            -pos * offsetWidth + offset * offsetWidth + direction * offsetWidth,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }

      position = position - (x - (x % offsetWidth)) / offsetWidth - direction;
      position =
        ((position % children.length) + children.length) % children.length;
    });

    let nextPicture = () => {
      let nextIndex = (position + 1) % children.length;
      let offsetWidth = this.root.offsetWidth;

      let current = children[position];
      let next = children[nextIndex];

      t = Date.now();

      let currentAnimation = new Animation(
        current.style,
        "transform",
        -position * offsetWidth,
        -offsetWidth - position * offsetWidth,
        500,
        0,
        ease,
        (v) => `translateX(${v}px)`
      );

      let nextAnimation = new Animation(
        next.style,
        "transform",
        offsetWidth - nextIndex * offsetWidth,
        -nextIndex * offsetWidth,
        500,
        0,
        ease,
        (v) => `translateX(${v}px)`
      );

      timeline.add(currentAnimation);
      timeline.add(nextAnimation);

      position = nextIndex;
    };

    nextPicStopHandler = setInterval(nextPicture, 3000);

    /* 鼠标操作轮播

    let position = 0;

    this.root.addEventListener("mousedown", (event) => {
      let offsetWidth = this.root.offsetWidth;
      let children = this.root.children;
      let startX = event.clientX;

      let move = (event) => {
        let x = event.clientX - startX;

        let current = position - (x - (x % offsetWidth)) / offsetWidth;

        for (let offset of [-2, -1, 0, 1, 2]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = "none";
          children[pos].style.transform = `translateX(${
            -pos * offsetWidth + offset * offsetWidth + (x % offsetWidth)
          }px)`;
        }
      };

      let up = (event) => {
        let x = event.clientX - startX;
        position = position - Math.round(x / offsetWidth);

        for (let offset of [
          0,
          -Math.sign(
            Math.round(x / offsetWidth) - x + (offsetWidth / 2) * Math.sign(x)
          ),
        ]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = "";
          children[pos].style.transform = `translateX(${
            -pos * offsetWidth + offset * offsetWidth
          }px)`;
        }
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });
    */

    /* 自动轮播
	  
	  let currentIndex = 0;
  
	  setInterval(() => {
		let children = this.root.children;
		let nextIndex = (currentIndex + 1) % children.length;
  
		let current = children[currentIndex];
		let next = children[nextIndex];
  
		next.style.transition = "none";
		next.style.transform = `translateX(${100 - nextIndex * 100}%)`;
  
		setTimeout(() => {
		  next.style.transition = "ease .5s";
		  current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
		  next.style.transform = `translateX(${-nextIndex * 100}%)`;
  
		  currentIndex = nextIndex;
		}, 16);
	  }, 1500); */

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

import { Component, STATE, ATTRIBUTE, createElement } from "./framework.js";
import { enableGesture } from "./encapGesture.js";
import { Timeline, Animation } from "./animation.js";
import { ease } from "./ease.js";

export { STATE, ATTRIBUTE } from "./framework.js";

export class Carousel extends Component {
  constructor() {
    super();
  }

  appendChild(child) {
    this.template = child;
  }

  render() {
    /*
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let record of this[ATTRIBUTE].data) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record.img})`;
      this.root.appendChild(child);
    }
    */

    this.children = this[ATTRIBUTE].data.map(this.template);
    this.root = (<div class="carousel">{this.children}</div>).render();

    enableGesture(this.root);

    let timeline = new Timeline();
    timeline.start();

    let children = this.root.children;

    this[STATE].position = 0;

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

    this.root.addEventListener("tap", (event) => {
      this.triggerEvent("click", {
        data: this[ATTRIBUTE].data[this[STATE].position],
        position: this[STATE].position,
      });
    });

    this.root.addEventListener("pan", (event) => {
      let offsetWidth = this.root.offsetWidth;

      let x = event.clientX - event.startX - ax;
      let current =
        this[STATE].position - (x - (x % offsetWidth)) / offsetWidth;

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
      let current =
        this[STATE].position - (x - (x % offsetWidth)) / offsetWidth;

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

      this[STATE].position =
        this[STATE].position -
        (x - (x % offsetWidth)) / offsetWidth -
        direction;
      this[STATE].position =
        ((this[STATE].position % children.length) + children.length) %
        children.length;
      this.triggerEvent("change", { position: this[STATE].position });
    });

    let nextPicture = () => {
      let nextIndex = (this[STATE].position + 1) % children.length;
      let offsetWidth = this.root.offsetWidth;

      let current = children[this[STATE].position];
      let next = children[nextIndex];

      t = Date.now();

      let currentAnimation = new Animation(
        current.style,
        "transform",
        -this[STATE].position * offsetWidth,
        -offsetWidth - this[STATE].position * offsetWidth,
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

      this[STATE].position = nextIndex;
      this.triggerEvent("change", { position: this[STATE].position });
    };

    // nextPicStopHandler = setInterval(nextPicture, 3000);

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
}

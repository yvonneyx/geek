import { Component, createElement } from "./framework.js";

class Carousel extends Component {
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

    // 鼠标操作轮播

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

let images = [
  "https://images.pexels.com/photos/8678811/pexels-photo-8678811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
  "https://images.pexels.com/photos/5847383/pexels-photo-5847383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
  "https://images.pexels.com/photos/6626710/pexels-photo-6626710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
  "https://images.pexels.com/photos/3632966/pexels-photo-3632966.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=630",
  "https://images.pexels.com/photos/4376212/pexels-photo-4376212.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=375&w=0",
];

let a = <Carousel src={images} />;

a.mountTo(document.body);

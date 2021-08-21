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
      console.log("mousedown");
      let offsetWidth = this.root.offsetWidth;
      let children = this.root.children;
      let startX = event.clientX;

      let move = (event) => {
        let x = event.clientX - startX;
 
        for (let child of children) {
          child.style.transition = "none";
          child.style.transform = `translateX(${
            -position * offsetWidth + x
          }px)`;
        }
      };

      let up = (event) => {
        console.log("mouseup");
        let x = event.clientX - startX;
        position = position - Math.round(x / 375);

        for (let child of children) {
          child.style.transition = "";
          child.style.transform = `translateX(${-position * offsetWidth}px)`;
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

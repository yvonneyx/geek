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
    for (let record of this.attributes.src) {
      let child = document.createElement("img");
      child.src = record;
      this.root.appendChild(child);
    }
    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

let images = [
  "https://images.pexels.com/photos/8678811/pexels-photo-8678811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/5847383/pexels-photo-5847383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/6626710/pexels-photo-6626710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/3632966/pexels-photo-3632966.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/4376212/pexels-photo-4376212.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
];

let a = <Carousel src={images} />;

a.mountTo(document.body);

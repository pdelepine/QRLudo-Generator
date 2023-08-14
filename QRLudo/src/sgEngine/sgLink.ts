import { SGDot } from "./sgDot";
import { SGNode } from "./sgNode";
import { MyP5 } from "./sketch";

interface SGLink {
  node1: SGNode;
  node1Dot: SGDot;
  node2: SGNode;
  node2Dot: SGDot;
  flags: { hover: boolean; dragging: boolean };
  type: "static" | "dynamic";
}
/** Cette classe représente un lien entre 2 SGNode de l'interface du serious game fait avec p5.js */
class SGLink implements SGLink {
  /**
   *
   * @param {SGNode} fromNode1
   * @param {SGNode} toNode2
   */
  constructor(
    fromNode1: SGNode,
    node1Dot: SGDot | null,
    toNode2: SGNode,
    node2Dot: SGDot | null
  ) {
    this.node1 = fromNode1;
    this.node1Dot = node1Dot || fromNode1.exitDots[0];
    this.node2 = toNode2;
    this.node2Dot = node2Dot || toNode2.entryDot;
    this.flags = {
      hover: false,
      dragging: false,
    };
  }

  /** Type can be 'static' or 'dynamic' */
  setType(type: "static" | "dynamic") {
    this.type = type;
  }

  /** Draw the link */
  display(myP5: MyP5) {
    if (this.type === "dynamic") {
      this.node2.x = (myP5.mouseX - myP5.translateX) / myP5.zoom;
      this.node2.y = (myP5.mouseY - myP5.translateY) / myP5.zoom;
    }
    if (this.isMouseHover(myP5)) {
      this.flags.hover = true;
    } else {
      this.flags.hover = false;
    }
    this.displayLine(myP5);
    this.displayArrowHead(myP5);
  }

  displayLine(myP5: MyP5) {
    myP5.push();
    myP5.stroke(0);
    myP5.strokeWeight(2);
    if (this.flags.hover) {
      myP5.stroke(200, 0, 0);
      myP5.strokeWeight(3);
    }
    if (this.flags.dragging) {
      myP5.fill(100, 255, 255);
    }
    const x1 = this.node1Dot.getPositionX();
    const y1 = this.node1Dot.getPositionY();
    const x2 = this.node2Dot.getPositionX();
    const y2 = this.node2Dot.getPositionY();
    myP5.line(x1, y1, x2, y2);
    myP5.pop();
  }

  displayArrowHead(myP5: MyP5) {
    const nearestPt = this.#cast(myP5);
    if (nearestPt) {
      myP5.push();
      myP5.strokeWeight(5);
      if (this.flags.hover) {
        myP5.stroke(200, 0, 0);
        myP5.strokeWeight(8);
      }

      if (this.type === "dynamic") {
        myP5.translate(
          (nearestPt.x - myP5.translateX) / myP5.zoom,
          (nearestPt.y - myP5.translateY) / myP5.zoom
        );
      } else {
        myP5.translate(nearestPt.x, nearestPt.y);
      }

      const x = this.node2Dot.getPositionX() - this.node1Dot.getPositionX();
      const y = this.node2Dot.getPositionY() - this.node1Dot.getPositionY();
      const dir = myP5.createVector(x, y);
      myP5.rotate(dir.heading());
      myP5.triangle(-15, -2, -15, 2, -7, 0);
      myP5.pop();
    }
  }

  /** Testing if the mouse is hovering the link */
  isMouseHover(myP5: MyP5) {
    const x1 = this.node1Dot.getPositionX() * myP5.zoom;
    const y1 = this.node1Dot.getPositionY() * myP5.zoom;
    const x2 = this.node2Dot.getPositionX() * myP5.zoom;
    const y2 = this.node2Dot.getPositionY() * myP5.zoom;

    const d1 = myP5.dist(
      x1,
      y1,
      myP5.mouseX - myP5.translateX,
      myP5.mouseY - myP5.translateY
    );
    const d2 = myP5.dist(
      x2,
      y2,
      myP5.mouseX - myP5.translateX,
      myP5.mouseY - myP5.translateY
    );

    if (this.node1Dot.isMouseHover(myP5) || this.node2Dot.isMouseHover(myP5))
      return false;

    const length = myP5.dist(x1, y1, x2, y2);

    const cond1 = d1 + d2 - 0.5 <= length;
    const cond2 = d1 + d2 + 0.5 >= length;

    return cond1 && cond2;
  }

  pressed(myP5: MyP5) {
    if (this.isMouseHover(myP5)) {
    }
  }

  /**
   *
   * @returns the intersection point between node2Dot and a ray cast from node1Dot
   */
  #cast(myP5: MyP5) {
    let vector1 = myP5.createVector(
      this.node2Dot.getPositionX() - this.node1Dot.getPositionX(),
      this.node2Dot.getPositionY() - this.node1Dot.getPositionY()
    );
    /** We substract the dot radius from the vector length  */
    let vecLength = vector1.mag();
    let newvecLength = vecLength - this.node2Dot.d / 2;
    /** We set the new length of the vector */
    vector1.setMag(newvecLength);
    /** We substract the starting point of the vector from the coordinate to get the intersection point */
    let vector2 = myP5.createVector(
      vector1.x + this.node1Dot.getPositionX(),
      vector1.y + this.node1Dot.getPositionY()
    );

    if (this.type === "dynamic") {
      return myP5.createVector(myP5.mouseX, myP5.mouseY);
    } else {
      return vector2;
    }
  }

  toJson() {
    return { from: this.node1.name, to: this.node2.name };
  }
}

export { SGLink };

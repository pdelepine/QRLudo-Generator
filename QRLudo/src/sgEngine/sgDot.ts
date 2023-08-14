import p5 from "p5";
import { SGNode } from "./sgNode";
import { MyP5 } from "./sketch";

interface SGDot {
  nodeToAttach: SGNode;
  x: number;
  y: number;
  d: number;
  color: number[];
  isExitDotOfQuestionNode: boolean;
  id_answer: number;
}

class SGDot {
  /**
   *
   * @param {*} nodeToAttach , the SGNode this Dot is attach to
   * @param {*} x , x coordinates relative to the nodeToAttach
   * @param {*} y , y coordinates relative to the nodeToAttach
   */
  constructor(
    nodeToAttach: SGNode,
    x: number,
    y: number,
    color: number[],
    isExitDotOfQuestionNode: boolean,
    id_answer = 0
  ) {
    this.nodeToAttach = nodeToAttach;
    this.x = x;
    this.y = y;
    this.d = 20;
    this.color = color;
    this.isExitDotOfQuestionNode = isExitDotOfQuestionNode;
    this.id_answer = id_answer;
  }
  setPositionX(newX: number) {
    this.x = newX;
  }

  setIdAnswer(newId: number) {
    this.id_answer = newId;
  }

  getPositionX() {
    return this.nodeToAttach.x + this.x;
  }

  getPositionY() {
    return this.nodeToAttach.y + this.y;
  }

  display(myP5: MyP5) {
    myP5.push();
    if (this.isMouseHover(myP5)) {
      if (this.isExitDotOfQuestionNode) {
        myP5.push();
        myP5.strokeWeight(5);
        myP5.textSize(15);
        if (this.nodeToAttach.answers[this.id_answer] == "") {
          myP5.rect(
            this.nodeToAttach.x + this.x,
            this.nodeToAttach.y + this.y - 40,
            14 * (myP5.textSize() / 2) + 12,
            30,
            10
          );
          myP5.text(
            "pas de réponse",
            this.nodeToAttach.x + this.x + 7,
            this.nodeToAttach.y + this.y - 21
          );
        } else {
          let dotText = "";
          // La réponse peut être un string simple ou un objet {name:, id:}
          if (typeof this.nodeToAttach.answers[this.id_answer] === "string") {
            if (this.nodeToAttach.answers[this.id_answer] == "") {
              dotText = "pas de réponse";
            } else {
              dotText = this.nodeToAttach.answers[this.id_answer];
            }
            dotText = this.nodeToAttach.answers[this.id_answer];
          } else {
            if (this.nodeToAttach.answers[this.id_answer].name == "") {
              dotText = "pas de réponse";
            } else {
              dotText = this.nodeToAttach.answers[this.id_answer].name;
            }
          }

          myP5.rect(
            this.nodeToAttach.x + this.x,
            this.nodeToAttach.y + this.y - 40,
            myP5.textWidth(dotText) + 12,
            30,
            10
          );
          myP5.text(
            dotText,
            this.nodeToAttach.x + this.x + 7,
            this.nodeToAttach.y + this.y - 21
          );
        }
        myP5.pop();
      }
      myP5.fill(150, 150, 250);
    } else {
      myP5.fill(this.color[0], this.color[1], this.color[2]);
    }
    myP5.circle(
      this.nodeToAttach.x + this.x,
      this.nodeToAttach.y + this.y,
      this.d
    );
    myP5.pop();
  }

  isMouseHover(myP5: MyP5) {
    const distMouse = myP5.dist(
      (this.nodeToAttach.x + this.x) * myP5.zoom,
      (this.nodeToAttach.y + this.y) * myP5.zoom,
      myP5.mouseX - myP5.translateX,
      myP5.mouseY - myP5.translateY
    );
    return distMouse <= (this.d * myP5.zoom) / 2;
  }
}

export { SGDot };

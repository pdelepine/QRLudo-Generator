
class SGDot {
	/**
	 * 
	 * @param {*} nodeToAttach , the SGNode this Dot is attach to
	 * @param {*} x , x coordinates relative to the nodeToAttach
	 * @param {*} y , y coordinates relative to the nodeToAttach
	 */
	constructor(nodeToAttach, x, y, color, isExitDotOfQuestionNode, id_answer = 0) {
		this.nodeToAttach = nodeToAttach;
		this.x = x;
		this.y = y;
		this.d = 20;
		this.color = new Array(color);
		this.isExitDotOfQuestionNode = isExitDotOfQuestionNode;
		this.id_answer=id_answer;
	}
	setPositionX(newX) {
		this.x = newX;
	}

	setIdAnswer(newId){
		this.id_answer = newId;
	}

	getPositionX() {
		return this.nodeToAttach.x + this.x;
	}

	getPositionY() {
		return this.nodeToAttach.y + this.y;
	}

	display() {
		myP5.push();
		if (this.isMouseHover()) {
			if(this.isExitDotOfQuestionNode){
				myP5.push();
				myP5.strokeWeight(5);
				myP5.textSize(15);
				if(this.nodeToAttach.answers[this.id_answer] == ""){
					myP5.rect(this.nodeToAttach.x + this.x,this.nodeToAttach.y + this.y - 40, 14 * (myP5.textSize() / 2) + 12, 30, 10);
					myP5.text("pas de réponse", this.nodeToAttach.x + this.x + 7, this.nodeToAttach.y + this.y - 21);
				}
				else {
					console.log(myP5.textWidth(this.nodeToAttach.answers[this.id_answer]));
					myP5.rect(this.nodeToAttach.x + this.x,this.nodeToAttach.y + this.y - 40, myP5.textWidth(this.nodeToAttach.answers[this.id_answer]) + 12, 30, 10);
					myP5.text(this.nodeToAttach.answers[this.id_answer], this.nodeToAttach.x + this.x + 7, this.nodeToAttach.y + this.y - 21);
				}
				myP5.pop();
			}
			myP5.fill(150, 150, 250);
		} else {
			myP5.fill(this.color[0], this.color[1], this.color[2]);
		}
		myP5.circle(this.nodeToAttach.x + this.x, this.nodeToAttach.y + this.y, this.d);
		myP5.pop();
	}

	isMouseHover() {
		const distMouse = myP5.dist((this.nodeToAttach.x + this.x) * myP5.zoom, (this.nodeToAttach.y + this.y) * myP5.zoom, myP5.mouseX - myP5.translateX, myP5.mouseY - myP5.translateY);
		return (distMouse <= (this.d * myP5.zoom) / 2);
	}
}

module.exports = {
	SGDot
};
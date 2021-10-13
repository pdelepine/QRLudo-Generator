
class SGDot {
	/**
	 * 
	 * @param {*} nodeToAttach , the SGNode this Dot is attach to
	 * @param {*} x , x coordinates relative to the nodeToAttach
	 * @param {*} y , y coordinates relative to the nodeToAttach
	 */
	constructor(nodeToAttach, x, y) {
		this.nodeToAttach = nodeToAttach;
		this.x = x;
		this.y = y;
		this.d = 20;
	}

	getPositionX() {
		return this.nodeToAttach.x + this.x;
	}

	getPositionY() {
		return this.nodeToAttach.y + this.y;
	}

	display() {
		myP5.push();
		if(this.isMouseHover()) {
			myP5.fill(150, 150, 250);
		} else {
			myP5.fill(0, 0, 255);
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
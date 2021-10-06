/** Cette classe représente un Noeud de question dans l'iterface du serious game fait avec p5.js */
class SGNode {
	/**
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @param {number} w : width
	 * @param {number} h : height
	 */
	constructor(x, y, w, h) {
		this.dragging = false;
		this.rollover = false;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.offsetX = 0;
		this.offsetY = 0;
	}

	setName(name) { this.name = name }

	/** Testing if the mouse is hovering the link */
	isMouseHover() {
		const cond1 = myP5.mouseX - myP5.translateX > this.x * myP5.zoom;
		const cond2 = myP5.mouseX - myP5.translateX < this.x * myP5.zoom + this.w * myP5.zoom;
		const cond3 = myP5.mouseY - myP5.translateY > this.y * myP5.zoom;
		const cond4 = myP5.mouseY - myP5.translateY < this.y * myP5.zoom + this.h * myP5.zoom;

		return (cond1 && cond2 && cond3 && cond4);
	}

	/** Updating SGNode coordinates */
	update() {
		if (this.dragging) {
			console.log(`x * zoom ${this.x * myP5.zoom}`);
			console.log(`Deplacement X ${myP5.mouseX - myP5.translateX + this.offsetX}`);
			this.x = ((myP5.mouseX - myP5.translateX)  + this.offsetX ) / myP5.zoom;
			this.y = ((myP5.mouseY - myP5.translateY) + this.offsetY) / myP5.zoom;
			console.log(`-- Offset x ${this.offsetX} y ${this.offsetY}`);
			console.log(`-- Node x ${this.x} y ${this.y}`);
		}
	}

	/** Draw the node */
	display() {
		myP5.push();
		myP5.stroke(0);
		if (this.dragging)
			myP5.fill(80);
		else if (this.isMouseHover())
			myP5.fill(100);
		else
			myP5.fill(175);
		myP5.rect(this.x, this.y, this.w, this.h, 5, 5);
		myP5.fill(0);
		myP5.noStroke();
		myP5.text("Question :", this.x + 20, this.y + 20);
		myP5.pop();
	}

	/** When SGNode pressed, begin dragging */
	pressed() {
		if (this.isMouseHover()) {
			this.dragging = true;
			this.offsetX = this.x * myP5.zoom - (myP5.mouseX - myP5.translateX);
			this.offsetY = this.y * myP5.zoom - (myP5.mouseY - myP5.translateY);
			return true;
		}
	}

	/** When SGNode released, stop dragging */
	released() {
		this.dragging = false;
	}

	createLink(callback) {
		if (this.isMouseHover()) {
			let newLink = new SGLink(this, new SGNode(myP5.mouseX, myP5.mouseY, 0, 0));
			newLink.type = 'dynamic';
			callback(newLink);
		}
	}
}

module.exports = {
	SGNode
};
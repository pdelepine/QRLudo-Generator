/** Cette classe représente un Noeud de question dans l'iterface du serious game fait avec p5.js */
class SGTextNode extends SGNode {
	/**
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @param {number} w : width
	 * @param {number} h : height
	 */
	constructor(x, y, w, h) {
		super(x, y, w, h);
	}

	/** Draw the node */
	display() {
		myP5.push();
		myP5.stroke('#91abe1');
		myP5.strokeWeight(4);
		if (this.dragging)
			myP5.fill(80);
		else if (this.isMouseHover())
			myP5.fill(100);
		else
			myP5.fill(235);
		myP5.rect(this.x, this.y, this.w, this.h);
		myP5.fill(0);
		myP5.noStroke();
		myP5.pop();
	}

}

module.exports = {
	SGTextNode
};
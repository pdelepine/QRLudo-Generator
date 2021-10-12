/** Cette classe représente un lien entre 2 SGNode de l'interface du serious game fait avec p5.js */
class SGLink {
	/**
	 * 
	 * @param {SGNode} fromNode1 
	 * @param {SGNode} toNode2 
	 */
	constructor(fromNode1, node1Dot, toNode2, node2Dot) {
		this.node1 = fromNode1;
		this.node1Dot = node1Dot;
		this.node2 = toNode2;
		this.node2Dot = node2Dot;
		this.flags = {
			hover: false,
			dragging: false
		};
	}

	/** Type can be 'static' or 'dynamic' */
	setType(type) {
		this.type = type;
	}

	/** Draw the link */
	display() {
		if(this.type === 'dynamic') {
			this.node2.x = (myP5.mouseX - myP5.translateX) / myP5.zoom;
			this.node2.y = (myP5.mouseY - myP5.translateY) / myP5.zoom;
		}
		if(this.isMouseHover()) {
			this.flags.hover = true;
		} else {
			this.flags.hover = false;
		}
		this.displayLine();
		this.displayArrowHead();
	}

	displayLine() {
		myP5.push();
		myP5.stroke(0);
		myP5.strokeWeight(2);
		if(this.flags.hover) {
			myP5.stroke(200, 0, 0);
			myP5.strokeWeight(3);
		}
		if(this.flags.dragging) {
			fill(100, 255, 255);
		}
		const x1 = this.node1Dot.getPositionX();
		const y1 = this.node1Dot.getPositionY();
		const x2 = this.node2Dot.getPositionX();
		const y2 = this.node2Dot.getPositionY();
		myP5.line(x1, y1, x2, y2);
		myP5.pop();
	}

	displayArrowHead(){
		const nearestPt = this.#cast();
		if(nearestPt){
			myP5.push();
			myP5.strokeWeight(5);
			if(this.flags.hover) {
				myP5.stroke(200, 0, 0);
				myP5.strokeWeight(8);
			}
			
			if(this.type === 'dynamic') {
				myP5.translate(nearestPt.x - myP5.translateX, nearestPt.y - myP5.translateY);
			} else {
				myP5.translate(nearestPt.x, nearestPt.y);
			}
			
			const x = this.node2Dot.getPositionX() - this.node1Dot.getPositionX();
			const y = this.node2Dot.getPositionY() - this.node1Dot.getPositionY();
			const dir = myP5.createVector(x,y);
			myP5.rotate(dir.heading());
			myP5.triangle(-15, -2, -15, 2, -7, 0);
			myP5.pop();
		}
	}

	/** Testing if the mouse is hovering the link */
	isMouseHover() {
		const x1 = this.node1Dot.getPositionX() * myP5.zoom;
		const y1 = this.node1Dot.getPositionY() * myP5.zoom;
		const x2 = this.node2Dot.getPositionX() * myP5.zoom;
		const y2 = this.node2Dot.getPositionY() * myP5.zoom;

		const d1 = myP5.dist(x1, y1, myP5.mouseX - myP5.translateX, myP5.mouseY - myP5.translateY);
		const d2 = myP5.dist(x2, y2, myP5.mouseX - myP5.translateX, myP5.mouseY - myP5.translateY);

		if(this.node1Dot.isMouseHover() || this.node2Dot.isMouseHover()) return false;

		const length = myP5.dist(x1, y1, x2, y2);

		const cond1 = (d1 + d2) - 0.5 <= length;
		const cond2 = (d1 + d2) + 0.5 >= length;

		return cond1 && cond2;
	}

	pressed() {
		if(this.isMouseHover()){
			
		}
	}

	/**
	 * 
	 * @returns the intersection point between node2Dot and a ray cast from node1Dot
	 */
	#cast() {

		let vector1 = myP5.createVector(this.node2Dot.getPositionX() - this.node1Dot.getPositionX(), this.node2Dot.getPositionY() - this.node1Dot.getPositionY());
		/** We substract the dot radius from the vector length  */
		let vecLength = vector1.mag();
		let newvecLength = vecLength - this.node2Dot.d / 2;
		/** We set the new length of the vector */
		vector1.setMag(newvecLength);
		/** We substract the starting point of the vector from the coordinate to get the intersection point */
		let vector2 = myP5.createVector(vector1.x + this.node1Dot.getPositionX(), vector1.y + this.node1Dot.getPositionY());

		if(this.type === 'dynamic') {
			return myP5.createVector(myP5.mouseX, myP5.mouseY);
		} else {
			return vector2;
		}		
	}

	toJson(){
		return { from: this.node1.name, to: this.node2.name };
	}
}

module.exports = {
	SGLink
};
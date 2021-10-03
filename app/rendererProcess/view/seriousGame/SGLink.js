class SGLink {
	/**
	 * 
	 * @param {SGNode} fromNode1 
	 * @param {SGNode} toNode2 
	 */
	constructor(fromNode1, toNode2) {
		this.node1 = fromNode1;
		this.node2 = toNode2;
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
			this.node2.x = (mouseX - translateX) / zoom;
			this.node2.y = (mouseY - translateY) / zoom;
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
		push();
		stroke(0);
		strokeWeight(2);
		if(this.flags.hover) {
			stroke(200, 0, 0);
			strokeWeight(3);
		}
		if(this.flags.dragging) {
			fill(100, 255, 255);
		}
		const x1 = this.node1.x + (this.node1.w / 2);
		const y1 = this.node1.y + (this.node1.h / 2);
		const x2 = this.node2.x + (this.node2.w / 2);
		const y2 = this.node2.y + (this.node2.h / 2);
		line(x1, y1, x2, y2);
		pop();
	}

	displayArrowHead(){
		const nearestPt = this.#cast();
		if(nearestPt){
			push();
			strokeWeight(5);
			if(this.flags.hover) {
				stroke(200, 0, 0);
				strokeWeight(8);
			}
			
			translate(nearestPt.x, nearestPt.y);
			const x = (this.node2.x + (this.node2.w / 2)) - (this.node1.x + (this.node1.w / 2));
			const y = (this.node2.y + (this.node2.h / 2)) - (this.node1.y + (this.node1.h / 2));
			const dir = createVector(x,y);
			rotate(dir.heading());
			triangle(-15, -2, -15, 2, -7, 0);
			pop();
		}
	}

	/** Testing if the mouse is hovering the link */
	isMouseHover() {
		const x1 = (this.node1.x + (this.node1.w / 2)) * zoom;
		const y1 = (this.node1.y + (this.node1.h / 2)) * zoom;
		const x2 = (this.node2.x + (this.node2.w / 2)) * zoom;
		const y2 = (this.node2.y + (this.node2.h / 2)) * zoom;

		const d1 = dist(x1, y1, mouseX - translateX, mouseY - translateY);
		const d2 = dist(x2, y2, mouseX - translateX, mouseY - translateY);

		if(this.node1.isMouseHover() || this.node2.isMouseHover()) return false;

		const length = dist(x1, y1,	x2, y2);

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
	 * @returns the intersection point between node2 and a ray cast from node1
	 */
	#cast() {
		/** Array of intersection point */
		let arrayPt = [];

		/** Left Wall of node2 */
		let x1 = this.node2.x;
		let y1 = this.node2.y;
		let x2 = this.node2.x;
		let y2 = this.node2.y + this.node2.h;

		let x3 = this.node1.x + (this.node1.w / 2);
		let y3 = this.node1.y + (this.node1.h / 2);
		let x4 = this.node2.x + (this.node2.w / 2);
		let y4 = this.node2.y + (this.node2.h / 2);

		let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if(den == 0) return;

		let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		let u = - ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
		if(t > 0 && t < 1 && u > 0) {
			const pt = createVector();
			pt.x = x1 + t * (x2 - x1);
			pt.y = y1 + t * (y2 - y1);
			arrayPt.push(pt);
		}

		/** Right Wall of node2 */
		x1 = this.node2.x + this.node2.w;
		y1 = this.node2.y;
		x2 = this.node2.x + this.node2.w;
		y2 = this.node2.y + this.node2.h;


		den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if(den == 0) return;

		t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		u = - ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
		if(t > 0 && t < 1 && u > 0) {
			const pt = createVector();
			pt.x = x1 + t * (x2 - x1);
			pt.y = y1 + t * (y2 - y1);
			arrayPt.push(pt);
		}

		/** Top Wall of node2 */
		x1 = this.node2.x;
		y1 = this.node2.y;
		x2 = this.node2.x + this.node2.w;
		y2 = this.node2.y;

		den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if(den == 0) return;

		t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		u = - ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
		if(t > 0 && t < 1 && u > 0) {
			const pt = createVector();
			pt.x = x1 + t * (x2 - x1);
			pt.y = y1 + t * (y2 - y1);
			arrayPt.push(pt);
		}

		/** Bottom Wall of node2 */
		x1 = this.node2.x;
		y1 = this.node2.y + this.node2.h;
		x2 = this.node2.x + this.node2.w;
		y2 = this.node2.y + this.node2.h;

		den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if(den == 0) return;

		t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		u = - ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
		if(t > 0 && t < 1 && u > 0) {
			const pt = createVector();
			pt.x = x1 + t * (x2 - x1);
			pt.y = y1 + t * (y2 - y1);
			arrayPt.push(pt);
		}

		let min = 100000;
		let nearestPt = null;
		for(let pt of arrayPt){
			const ptDist = dist(x3, y3, pt.x, pt.y);
			if(ptDist < min){
				min = ptDist;
				nearestPt = pt;
			} 
		}

		return nearestPt;
	}

	toJson(){
		return { from: this.node1.name, to: this.node2.name };
	}
}
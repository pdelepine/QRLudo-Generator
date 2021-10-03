class SGNode {
	/**
	 * 
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
		return (mouseX - translateX > this.x * zoom && mouseX - translateX < this.x * zoom + this.w * zoom && mouseY > this.y * zoom && mouseY < this.y * zoom + this.h * zoom);
	}

	/** Updating SGNode coordinates */
	update() {
		if (this.dragging) {
			console.log(`x * zoom ${this.x * zoom}`);
			if (mouseX - translateX + this.offsetX < 0) {
				this.x = 0;
			} else {
				this.x = ((mouseX - translateX)  + this.offsetX ) / zoom;
			}
			this.y = (mouseY + this.offsetY) / zoom;
			console.log(`-- Offset x ${this.offsetX} y ${this.offsetY}`);
			console.log(`-- Node x ${this.x} y ${this.y}`);
		}
	}

	/** Draw the node */
	display() {
		push();
		stroke(0);
		if (this.dragging)
			fill(80);
		else if (this.isMouseHover())
			fill(100);
		else
			fill(175);
		rect(this.x, this.y, this.w, this.h, 5, 5);
		fill(0);
		noStroke();
		text("Question :", this.x + 20, this.y + 20);
		pop();
	}

	/** When SGNode pressed, begin dragging */
	pressed() {
		if (this.isMouseHover()) {
			this.dragging = true;
			this.offsetX = this.x * zoom - (mouseX - translateX);
			this.offsetY = this.y * zoom - mouseY;
			return true;
		}
	}

	/** When SGNode released, stop dragging */
	released() {
		this.dragging = false;
	}

	createLink(callback) {
		if (this.isMouseHover()) {
			let newLink = new SGLink(this, new SGNode(mouseX, mouseY, 0, 0));
			newLink.type = 'dynamic';
			callback(newLink);
		}
	}
}
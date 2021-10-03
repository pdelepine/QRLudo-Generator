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
		return (mouseX - translateX > this.x && mouseX - translateX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h);
	}

	/** Updating SGNode coordinates */
	update() {
		if (this.dragging) {
			if (mouseX + this.offsetX < 0) {
				this.x = 0;
			} else {
				this.x = mouseX + this.offsetX;
			}
			this.y = mouseY + this.offsetY;
			console.log(`Node x ${this.x} y ${this.y}`);
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
			this.offsetX = this.x - mouseX;
			this.offsetY = this.y - mouseY;
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
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
		this.clicked = false;
		this.questionZone = null;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.offsetX = 0;
		this.offsetY = 0;
		this.entryDot = new SGDot(this, this.w / 2, 0, [139, 186, 71]);
		this.exitDots = [new SGDot(this, this.w / 2, this.h, [231, 10, 2])];
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
			//console.log(`x * zoom ${this.x * myP5.zoom}`);
			//console.log(`Deplacement X ${myP5.mouseX - myP5.translateX + this.offsetX}`);
			this.x = ((myP5.mouseX - myP5.translateX) + this.offsetX) / myP5.zoom;
			this.y = ((myP5.mouseY - myP5.translateY) + this.offsetY) / myP5.zoom;
			//console.log(`-- Offset x ${this.offsetX} y ${this.offsetY}`);
			//console.log(`-- Node x ${this.x} y ${this.y}`);
		}
	}

	/** Draw the node */
	display() {
		myP5.push();
		myP5.stroke(0);
		if (this.dragging || this.clicked)
			myP5.fill(80);
		if (this.clicked)
			myP5.strokeWeight(10);
		else if (this.isMouseHover())
			myP5.fill(100);
		else
			myP5.fill(235);
		myP5.rect(this.x, this.y, this.w, this.h, 5, 5);
		myP5.fill(0);
		myP5.noStroke();
		myP5.text("Question :", this.x + 20, this.y + 20);
		myP5.pop();
	}

	displayDot() {
		this.entryDot.display();
		for (let n of this.exitDots) {
			n.display();
		}
	}

	/** When SGNode pressed, begin dragging */
	pressed() {

		if (myP5.mouseX != myP5.lastClickX || myP5.mouseY != myP5.lastClickY) {
			/** Vérifie si notre clic correspond aux coordonnées du dernier clic et indique que la zone Question n'a pas été réinitialisée si c'est un nouveau clic */
			myP5.setPreviousNodeErased(false);
			myP5.setLastClick(myP5.mouseX, myP5.mouseY);
		}
		if (this.isMouseHover() && !this.isMouseHoveringDots()) {
			this.dragging = true;
			this.clicked = true;
			this.offsetX = this.x * myP5.zoom - (myP5.mouseX - myP5.translateX);
			this.offsetY = this.y * myP5.zoom - (myP5.mouseY - myP5.translateY);
			/** On réinitialise la zone Question et affiche les valeurs de notre Node actuellement cliqué */
			this.emptyQuestionZone();
			this.displayQuestionZone();
		}
		else {

			if (myP5.hoveringCanvas) {
				/** Vérifie si on clique sur le Canvas mais en dehors de notre Node et réinitialise la zone QUestion si celle ci ne l'est pas */
				if (this.clicked) {
					this.clicked = false;
					if (!myP5.previousNodeErased) {
						this.emptyQuestionZone();
					}
				}
			}
		}

	}

	displayQuestionZone() {
	}

	emptyQuestionZone() {
		/** Efface la zone Question */
		myP5.setPreviousNodeErased(true);
		let displayQZone = document.getElementById('displayQuestionZone');
		if (null != displayQZone) displayQZone.remove();
	}

	/** When SGNode released, stop dragging */
	released() {
		this.dragging = false;
	}

	createLink(callback) {
		if (this.isMouseHoveringDots() && !this.entryDot.isMouseHover()) {
			let endNode = new SGNode(myP5.mouseX, myP5.mouseY, 0, 0);
			let newLink = new SGLink(this, this.getDotHovering(), endNode, endNode.entryDot);
			newLink.type = 'dynamic';
			callback(newLink);
		}
	}

	/** Return true if the mouse is hovering one of the node's dot */
	isMouseHoveringDots() {
		if (this.entryDot.isMouseHover()) {
			return true;
		}
		for (let dot of this.exitDots) {
			if (dot.isMouseHover()) {
				return true;
			}
		}
		return false;
	}

	isMouseHoveringExitDots() {
		for (let dot of this.exitDots) {
			if (dot.isMouseHover()) {
				return true;
			}
		}
		return false;
	}

	/** Return the dot of the node which the mouse is hovering */
	getDotHovering() {
		if (this.entryDot.isMouseHover()) {
			return this.entryDot;
		}
		for (let dot of this.exitDots) {
			if (dot.isMouseHover()) {
				return dot;
			}
		}
	}
}

module.exports = {
	SGNode
};
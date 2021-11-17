/** Cette classe représente un Noeud de question dans l'iterface du serious game fait avec p5.js */
class SGQuestionNode extends SGNode {
	/**
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @param {number} w : width
	 * @param {number} h : height
	 */
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.entryDot = new SGDot(this, this.w / 2, - this.h, [139, 186, 71]);
		this.exitDots = [new SGDot(this, this.w / 2, 0, [231, 10, 2])];
		this.question = "";
		this.answers = [""];
		this.btn_add_answer = null;
		this.btn_save_modification = null;
		this.btn_add_audio = null;
		this.btn_discard_modification = null;
	}

	isMouseHover() {
		/** From https://blackpawn.com/texts/pointinpoly/ */

		/** Compute vectors */
		let v0 = myP5.createVector((this.x + this.w - this.x) * myP5.zoom, (this.y - this.y) * myP5.zoom);
		let v1 = myP5.createVector((this.x + this.w / 2 - this.x) * myP5.zoom, (this.y - this.h - this.y) * myP5.zoom);
		let v2 = myP5.createVector(myP5.mouseX - myP5.translateX - this.x * myP5.zoom, myP5.mouseY - myP5.translateY - this.y * myP5.zoom);

		/** Compute dot products */
		let dot00 = v0.dot(v0);
		let dot01 = v0.dot(v1);
		let dot02 = v0.dot(v2);
		let dot11 = v1.dot(v1);
		let dot12 = v1.dot(v2);

		/** Compute barycentric coordinates */
		let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
		let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

		return (u >= 0) && (v >= 0) && (u + v < 1);
	}

	displayQuestionZone() {
		const self = this;
		this.questionZone = myP5.createDiv();
		this.questionZone.id('displayQuestionZone')
		this.questionZone.parent("seriousGameZoneQuestions");

		let txt_question = myP5.createP("Question :");
		txt_question.parent('displayQuestionZone');
		let input_question = myP5.createInput(this.question);
		input_question.id('input_node_question');
		input_question.parent('displayQuestionZone');

		this.btn_add_audio = myP5.createButton('Ajouter de l\'audio');
		this.btn_add_audio.mousePressed(() => { SGQuestionNode.addAudio(self); });
		this.btn_add_audio.parent('displayQuestionZone');


		let txt_answers = myP5.createP("Réponses :");
		txt_answers.parent('displayQuestionZone');
		let id_answer = 0;
		for (let answer of this.answers) {
			id_answer += 1;
			let input_answer = myP5.createInput(answer);
			input_answer.id('input_node_answer' + id_answer);
			input_answer.parent('displayQuestionZone');
		}

		this.btn_add_answer = myP5.createButton("Ajouter une réponse");
		this.btn_add_answer.mousePressed(() => { SGQuestionNode.addAnswer(self); });
		this.btn_add_answer.parent('displayQuestionZone');

		this.btn_discard_modification = myP5.createButton("Annuler Modification");
		this.btn_discard_modification.mousePressed(() => { SGQuestionNode.discardModification(self); });
		this.btn_discard_modification.parent('displayQuestionZone');

		this.btn_save_modification = myP5.createButton("Appliquer Modification");
		this.btn_save_modification.mousePressed(() => { SGQuestionNode.saveModification(self); });
		this.btn_save_modification.parent('displayQuestionZone');

	}

	static addAnswer(self) {
		SGQuestionNode.saveModification(self);
		let nb_answers = self.answers.length;
		if (nb_answers < 5) {
			self.answers.push("");
			nb_answers = self.answers.length;
			self.emptyQuestionZone();
			self.displayQuestionZone();
			for (var id_answer = 0; id_answer < nb_answers - 1; id_answer++) {
				self.exitDots[id_answer].setPositionX((id_answer + 1) * self.w / (nb_answers + 1));
			}
			self.exitDots.push(new SGDot(self, (nb_answers) * self.w / (nb_answers + 1), 0, [231, 10, 2]));
			self.displayDot();
		}

	}

	static discardModification(self) {
		self.emptyQuestionZone();
		self.displayQuestionZone();
	}

	static addAudio(self) {

	}

	static saveModification(self) {
		self.question = document.getElementById('input_node_question').value;
		for (var id_answer = 0; id_answer < self.answers.length; id_answer++) {
			self.answers[id_answer] = document.getElementById('input_node_answer' + (id_answer + 1)).value;
		}
	}

	/** Draw the node */
	display() {
		myP5.push();
		myP5.stroke('#005700');
		myP5.strokeWeight(4);
		if (this.dragging || this.clicked)
			myP5.fill(80);
		if (this.clicked)
			myP5.strokeWeight(6);
		else if (this.isMouseHover())
			myP5.fill(100);
		else
			myP5.fill(235);
		myP5.triangle(this.x, this.y, this.x + this.w, this.y, this.x + this.w / 2, this.y - this.h);
		myP5.fill(0);
		myP5.noStroke();
		myP5.pop();
	}

}

module.exports = {
	SGQuestionNode
};
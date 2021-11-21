const { toLinuxArchString } = require("builder-util");

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
		this.name = "";
		this.question = "";
		this.answers = [""];
		this.btn_add_answer = null;
		this.btn_save_modification = null;
		this.btn_add_audio = null;
		this.btn_discard_modification = null;
		this.btn_delete_answer1 = null;
		this.btn_delete_answer2 = null;
		this.btn_delete_answer3 = null;
		this.btn_delete_answer4 = null;
		this.btn_delete_answer5 = null;
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

		/** Create a zone where the user can define the settings of a Question Node */
		this.questionZone = myP5.createDiv();
		this.questionZone.id('displayQuestionZone')
		this.questionZone.class('question');
		this.questionZone.parent("seriousGameZoneQuestions");

		/** Create an input related to the question title */
		let txt_Title = myP5.createElement('label', "Nom de la question :");
		txt_Title.class('question-intro-label');
		txt_Title.parent('displayQuestionZone');
		let input_name = myP5.createInput(this.name);
		input_name.id('input_node_name');
		input_name.parent('displayQuestionZone');

		/** Create an input related to the question itself */
		let txt_question = myP5.createElement('label', "Question :");
		txt_question.class('control-label');
		txt_question.parent('displayQuestionZone');
		let input_question = myP5.createInput(this.question);
		input_question.id('input_node_question');
		input_question.parent('displayQuestionZone');

		/** Create the button to add an audio file */
		this.btn_add_audio = myP5.createButton('Ajouter de l\'audio');
		this.btn_add_audio.class('btn btn-outline-success btn-unique-xl');
		this.btn_add_audio.id('btn_add_audio');
		this.btn_add_audio.mousePressed(() => { SGQuestionNode.addAudio(self); });
		this.btn_add_audio.parent('displayQuestionZone');

		let txt_answers = myP5.createElement('label', "Réponses :");
		txt_answers.class('control-label');
		txt_answers.parent('displayQuestionZone');

		/** Create the different answers of the question */
		let nb_answers = this.answers.length;
		let input_answer = myP5.createInput(this.answers[0]);
		input_answer.id('input_node_answer1');
		input_answer.parent('displayQuestionZone');
		this.btn_delete_answer1 = myP5.createButton("Supprimer Reponse " + 1);
		this.btn_delete_answer1.mousePressed(() => { SGQuestionNode.deleteAnswer(self, 0); });
		this.btn_delete_answer1.class('btn btn-outline-success btn-unique-xl');
		this.btn_delete_answer1.parent('displayQuestionZone');
		if (nb_answers >= 2) {
			let input_answer = myP5.createInput(this.answers[1]);
			input_answer.id('input_node_answer2');
			input_answer.parent('displayQuestionZone');
			this.btn_delete_answer2 = myP5.createButton("Supprimer Reponse " + 2);
			this.btn_delete_answer2.mousePressed(() => { SGQuestionNode.deleteAnswer(self, 1); });
			this.btn_delete_answer2.class('btn btn-outline-success btn-unique-xl');
			this.btn_delete_answer2.parent('displayQuestionZone');
			if (nb_answers >= 3) {
				let input_answer = myP5.createInput(this.answers[2]);
				input_answer.id('input_node_answer3');
				input_answer.parent('displayQuestionZone');
				this.btn_delete_answer3 = myP5.createButton("Supprimer Reponse " + 3);
				this.btn_delete_answer3.mousePressed(() => { SGQuestionNode.deleteAnswer(self, 2); });
				this.btn_delete_answer3.class('btn btn-outline-success btn-unique-xl');
				this.btn_delete_answer3.parent('displayQuestionZone');
				if (nb_answers >= 4) {
					let input_answer = myP5.createInput(this.answers[3]);
					input_answer.id('input_node_answer4');
					input_answer.parent('displayQuestionZone');
					this.btn_delete_answer4 = myP5.createButton("Supprimer Reponse " + 4);
					this.btn_delete_answer4.mousePressed(() => { SGQuestionNode.deleteAnswer(self, 3); });
					this.btn_delete_answer4.class('btn btn-outline-success btn-unique-xl');
					this.btn_delete_answer4.parent('displayQuestionZone');
					if (nb_answers >= 5) {
						let input_answer = myP5.createInput(this.answers[4]);
						input_answer.id('input_node_answer5');
						input_answer.parent('displayQuestionZone');
						this.btn_delete_answer5 = myP5.createButton("Supprimer Reponse " + 5);
						this.btn_delete_answer5.mousePressed(() => { SGQuestionNode.deleteAnswer(self, 4); });
						this.btn_delete_answer5.class('btn btn-outline-success btn-unique-xl');
						this.btn_delete_answer5.parent('displayQuestionZone');
					}
				}
			}
		}

		/*
		// FIRST IMPLEMENTATION not working : the mousePressed seems to affect all the buttons and when we press any of them, the last answer is deleted
		// Code to remove after Pierre Yves finish the review
		let id_answer = 0;
		for (let answer of this.answers) {
			id_answer += 1;
			let input_answer = myP5.createInput(answer);
			input_answer.id('input_node_answer' + id_answer);
			input_answer.parent('displayQuestionZone');

			let btn_delete_answer = myP5.createButton("Supprimer Reponse " + id_answer);
			btn_delete_answer.mousePressed(() => { SGQuestionNode.deleteAnswer(self, id_answer - 1); });
			btn_delete_answer.parent('displayQuestionZone');
			this.btn_delete_answer_array.push(btn_delete_answer);
		}
		*/

		/** Create a button to add an answer */
		this.btn_add_answer = myP5.createButton("Ajouter une réponse");
		this.btn_add_answer.mousePressed(() => { SGQuestionNode.addAnswer(self); });
		this.btn_add_answer.class('btn btn-outline-success btn-unique-xl');
		this.btn_add_answer.parent('displayQuestionZone');

		/** Create a button to discard all modifications */
		this.btn_discard_modification = myP5.createButton("Annuler Modification");
		this.btn_discard_modification.mousePressed(() => { SGQuestionNode.discardModification(self); });
		this.btn_discard_modification.class('btn btn-outline-success btn-unique-xl');
		this.btn_discard_modification.parent('displayQuestionZone');

		/** Create a button to save all the modifications */
		this.btn_save_modification = myP5.createButton("Appliquer Modification");
		this.btn_save_modification.mousePressed(() => { SGQuestionNode.saveModification(self); });
		this.btn_save_modification.class('btn btn-outline-success btn-unique-xl');
		this.btn_save_modification.parent('displayQuestionZone');

	}

	static addAnswer(self) {
		/** Add an answer to the question Node */
		SGQuestionNode.saveModification(self);
		let nb_answers = self.answers.length;
		/** A Question Node can't have more than 5 answers */
		if (nb_answers < 5) {
			self.answers.push("");
			nb_answers = self.answers.length;
			self.emptyQuestionZone();
			self.displayQuestionZone();
			/** Update the exit nodes positions */
			for (var id_answer = 0; id_answer < nb_answers - 1; id_answer++) {
				self.exitDots[id_answer].setPositionX((id_answer + 1) * self.w / (nb_answers + 1));
			}
			self.exitDots.push(new SGDot(self, (nb_answers) * self.w / (nb_answers + 1), 0, [231, 10, 2]));
			self.displayDot();
		}

	}

	static deleteAnswer(self, indice) {
		/** Delete an answer */
		SGQuestionNode.saveModification(self);
		let nb_answers = self.answers.length - 1;
		if (nb_answers >= 1) {
			self.answers.splice(indice, 1);
			self.exitDots.splice(indice, 1);
			self.emptyQuestionZone();
			self.displayQuestionZone();
			/** Update the positions of the exit nodes */
			for (var id_answer = 0; id_answer < nb_answers; id_answer++) {
				self.exitDots[id_answer].setPositionX((id_answer + 1) * self.w / (nb_answers + 1));
			}
			self.displayDot();
		}
	}

	static discardModification(self) {
		/** Discard all modifications : delete the div and create it again with previous values */
		self.emptyQuestionZone();
		self.displayQuestionZone();
	}

	static addAudio(self) {
		/** Add an audio file */
	}

	static saveModification(self) {
		/** Save all modifications into the class attributes */
		self.name = document.getElementById('input_node_name').value;
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
		myP5.textSize(20);
		myP5.textFont('Helvetica');
		myP5.text(this.name, this.x + this.w / 2 - 5.7 * this.name.length, this.y - this.h / 3);
		myP5.pop();
	}

}

module.exports = {
	SGQuestionNode
};
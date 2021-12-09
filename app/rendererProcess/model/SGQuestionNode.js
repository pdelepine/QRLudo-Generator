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
		this.entryDot = new SGDot(this, this.w / 2, - this.h, [139, 186, 71],false);
		this.exitDots = [new SGDot(this, this.w / 2, 0, [231, 10, 2],true)];
		this.name = "";
		this.url = "";
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

		// Création du div de la zone
		this.questionZone = myP5.createDiv();
		this.questionZone.id('displayQuestionZone')
		this.questionZone.class('question');
		this.questionZone.parent("seriousGameZoneQuestions");

		// Partie nom de la forme
		let txt_Title = myP5.createElement('label', "Nom de la question :");
		txt_Title.class('question-intro-label');
		txt_Title.parent('displayQuestionZone');
		let input_name = myP5.createInput(this.name);
		input_name.id('input_node_name');
		input_name.parent('displayQuestionZone');

		// Partie question
		let txt_question = myP5.createElement('label', "Question :");
		txt_question.class('control-label');
		txt_question.parent('displayQuestionZone');
		let input_question = myP5.createInput(this.question);
		input_question.id('input_node_question');
		input_question.parent('displayQuestionZone');

		// Ajout de l'audio
		this.btn_add_audio = myP5.createButton('Ajouter de l\'audio');
		this.btn_add_audio.class('btn btn-outline-success btn-unique-xl');
		this.btn_add_audio.id('btn_add_audio');
		this.btn_add_audio.attribute('data-target', '#listeMusic');
		this.btn_add_audio.attribute('data-toggle', 'modal');
		this.btn_add_audio.mousePressed(() => { SGQuestionNode.addAudio(self); });
		this.btn_add_audio.parent('displayQuestionZone');

		// Partie réponses
		let txt_answers = myP5.createElement('label', "Réponses :");
		txt_answers.class('control-label');
		txt_answers.parent('displayQuestionZone');

		// Ajout des réponses (Champ texte et Bouton de suppression)
		for (let i = 0; i < this.answers.length; i++) {
			let input_answer = myP5.createInput(this.answers[i]);
			input_answer.id('input_node_answer_' + (i + 1));
			input_answer.parent('displayQuestionZone');

			let btn_delete_answer = myP5.createButton("Supprimer Reponse " + (i + 1));
			btn_delete_answer.class('btn btn-outline-success btn-unique-xl');
			btn_delete_answer.id('btn_delete_answer_' + (i + 1));
			btn_delete_answer.mousePressed(() => SGQuestionNode.deleteAnswer(self, i));
			btn_delete_answer.parent('displayQuestionZone');

		}

		if (this.answers.length < 5) {
			this.btn_add_answer = myP5.createButton("Ajouter une réponse");
			this.btn_add_answer.class('btn btn-outline-success btn-unique-xl');
			this.btn_add_answer.mousePressed(() => { SGQuestionNode.addAnswer(self); });
			this.btn_add_answer.parent('displayQuestionZone');
		}


		this.btn_discard_modification = myP5.createButton("Annuler Modification");
		this.btn_discard_modification.class('btn btn-outline-success btn-unique-xl');
		this.btn_discard_modification.mousePressed(() => { SGQuestionNode.discardModification(self); });
		this.btn_discard_modification.parent('displayQuestionZone');

		this.btn_save_modification = myP5.createButton("Appliquer Modification");
		this.btn_save_modification.class('btn btn-outline-success btn-unique-xl');
		this.btn_save_modification.mousePressed(() => { SGQuestionNode.saveModification(self); });
		this.btn_save_modification.parent('displayQuestionZone');

	}

	/**
	 * Ajoute un champ réponse dans la zone d'affichage, une réponse vide dans la liste answers de self et replace les exitDot
	 * @param {SGQuestionNode} self, l'instance SGQuestionNode qui s'affiche dans la zone
	 */
	static addAnswer(self) {
		SGQuestionNode.saveModification(self);

		if (self.answers.length < 5) {
			self.answers.push("");
			self.emptyQuestionZone();
			self.displayQuestionZone();
			for (var id_answer = 0; id_answer < self.answers.length - 1; id_answer++) {
				self.exitDots[id_answer].setPositionX((id_answer + 1) * self.w / (self.answers.length + 1));
			}
			self.exitDots.push(new SGDot(self, (self.answers.length) * self.w / (self.answers.length + 1), 0, [231, 10, 2], true, self.exitDots.length));
			self.displayDot();
		}
	}
	/**
	 * Supprime une réponse de la zone Question ainsi que les ExitDot
	 * @param {SGQuestionNode} self , l'instance SGQuestionNode qui s'affiche dans la zone 
	 * @param {integer} indice , l'indice de la réponse dans la liste answers de self
	 */
	static deleteAnswer(self, indice) {
		// Sauvegarde des modifications en cours avant de supprimer la réponse
		SGQuestionNode.saveModification(self);

		if (self.answers.length >= 1) {
			self.answers.splice(indice, 1);
			self.exitDots.splice(indice, 1);
			self.emptyQuestionZone();
			self.displayQuestionZone();
			for (var id_answer = 0; id_answer < self.answers.length; id_answer++) {
				self.exitDots[id_answer].setPositionX((id_answer + 1) * self.w / (self.answers.length + 1));
				// on actualise l'id des exitDots
				self.exitDots[id_answer].setIdAnswer(id_answer);
			}
			self.displayDot();
		} else {
			logger.error("Essai de supprimer une réponse alors qu'il n'y en a aucune");
		}
	}

	static discardModification(self) {
		/** Discard all modifications : delete the div and create it again with previous values */
		document.getElementById('input_node_name').value = self.name;
		document.getElementById('input_node_question').value = self.question;
		for (var id_answer = 0; id_answer < self.answers.length; id_answer++) {
			document.getElementById('input_node_answer_' + (id_answer + 1)).value = self.answers[id_answer];
		}
	}

	static addAudio(self) {
		/** Add an audio file */
		myP5.setLastNodeClickedType("question");
	}

	static saveModification(self) {
		/** Save all modifications into the class attributes */
		self.name = document.getElementById('input_node_name').value;
		self.question = document.getElementById('input_node_question').value;
		
		// Gere la sauvegarde des modifications si jamais un fichier audio est ajouté
		if (document.getElementById('input_node_question').name != null) {
			if(self.question.substring(self.question.length - 3, self.question.length) == "mp3")
				self.url = document.getElementById('input_node_question').name;
		}
		for (var id_answer = 0; id_answer < self.answers.length; id_answer++) {
			self.answers[id_answer] = document.getElementById('input_node_answer_' + (id_answer + 1)).value;
		}
	}

	saveAudioModification() {
		/** Fonction appelée quand un fichier audio est ajouté */
		const self = this;
		SGQuestionNode.saveModification(self);
	}

	/** Draw the node */
	display() {
		myP5.push();
		myP5.stroke('#005700');
		myP5.strokeWeight(4);
		if (this.dragging || this.clicked)
			myP5.fill(80);
		if (this.clicked)
			myP5.strokeWeight(10);
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
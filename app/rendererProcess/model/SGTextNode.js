/** Cette classe représente un Noeud de question dans l'interface du serious game fait avec p5.js */
class SGTextNode extends SGNode {
	/**
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @param {number} w : width
	 * @param {number} h : height
	 */


	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.name = "";
		this.url = "";
		this.description = "";
		this.btn_save_modification = null;
		this.btn_add_audio = null;
		this.btn_discard_modification = null;
		this.containError = false;
	}

	displayQuestionZone() {
		const self = this;

		/** Create a zone where the user can define the settings of a Text Node */
		this.questionZone = myP5.createDiv();
		this.questionZone.id('displayQuestionZone')
		this.questionZone.class('question');
		this.questionZone.parent("seriousGameZoneQuestions");

		/** Create an input related to the node title/name */

		// Si champ vide on met le champ en rouge
		if(this.containError && this.name == ""){
			let txt_Title = myP5.createElement('label', "Nom de la forme :");
			txt_Title.class('question-intro-label');
			txt_Title.parent('displayQuestionZone');
			let input_name = myP5.createInput(this.name);
			input_name.id('input_node_name');
			input_name.parent('displayQuestionZone');
			input_name.style('border: 2px solid red');
		}
		else {
			let txt_Title = myP5.createElement('label', "Nom de la forme :");
			txt_Title.class('question-intro-label');
			txt_Title.parent('displayQuestionZone');
			let input_name = myP5.createInput(this.name);
			input_name.id('input_node_name');
			input_name.parent('displayQuestionZone');
		}

		/** Create an input related to the text to play (audio) */

		// Si champ vide on met le champ en rouge
		if(this.containError && this.description == ""){
			let txt_Description = myP5.createElement('label', "Champ texte à lire :");
			txt_Description.class('question-intro-label');
			txt_Description.parent('displayQuestionZone');
			let input_description = myP5.createInput(this.description);
			input_description.id('input_node_description');
			input_description.parent('displayQuestionZone');
			input_description.style('border: 1px solid red');
		}
		else {
			let txt_Description = myP5.createElement('label', "Champ texte à lire :");
			txt_Description.class('question-intro-label');
			txt_Description.parent('displayQuestionZone');
			let input_description = myP5.createInput(this.description);
			input_description.id('input_node_description');
			input_description.parent('displayQuestionZone');
		}

		/** Create the button to add an audio file */
		this.btn_add_audio = myP5.createButton('Ajouter de l\'audio');
		this.btn_add_audio.mousePressed(() => { SGTextNode.addAudio(self); });
		this.btn_add_audio.attribute('data-target', '#listeMusic');
		this.btn_add_audio.attribute('data-toggle', 'modal');
		this.btn_add_audio.class('btn btn-outline-success btn-unique-xl');
		this.btn_add_audio.parent('displayQuestionZone');

		/** Create a button to discard all modifications */
		this.btn_discard_modification = myP5.createButton("Annuler Modification");
		this.btn_discard_modification.mousePressed(() => { SGTextNode.discardModification(self); });
		this.btn_discard_modification.class('btn btn-outline-success btn-unique-xl');
		this.btn_discard_modification.parent('displayQuestionZone');

		/** Create a button to save all the modifications */
		this.btn_save_modification = myP5.createButton("Appliquer Modification");
		this.btn_save_modification.mousePressed(() => { SGTextNode.saveModification(self); });
		this.btn_save_modification.class('btn btn-outline-success btn-unique-xl');
		this.btn_save_modification.parent('displayQuestionZone');

	}

	static discardModification(self) {
		/** Discard all modifications : delete the div and create it again with previous values */
		self.emptyQuestionZone();
		self.displayQuestionZone();
	}

	static addAudio(self) {
		/** Add an audio file */
		myP5.setLastNodeClickedType("text");
	}

	static saveModification(self) {
		/** Save all modifications into the class attributes */
		self.name = document.getElementById('input_node_name').value;
		self.description = document.getElementById('input_node_description').value;

		// Gere la sauvegarde des modifications si jamais un fichier audio est ajouté
		if (document.getElementById('input_node_description').name != null) {
			if(self.description.substring(self.description.length - 3, self.description.length) == "mp3")
				self.url = document.getElementById('input_node_description').name;
		}
		if(self.name != "" && self.description != "")
			self.containError = false;
	}

	saveAudioModification() {
		/** Fonction appelée quand un fichier audio est ajouté */
		const self = this;
		SGTextNode.saveModification(self);
	}

	/** Draw the node */
	display() {
		myP5.push();
		myP5.stroke('#91abe1');
		myP5.strokeWeight(4);
		if (this.dragging || this.clicked)
			myP5.fill(80);
		if (this.clicked)
			myP5.strokeWeight(10);
		else if (this.isMouseHover())
			myP5.fill(100);
		else if(this.containError) {
			myP5.stroke('red')
			myP5.fill(235);
		}
		else
			myP5.fill(235);
		if(this.name != ""){
			this.w = myP5.textWidth(this.name) * 2;
			this.entryDot.setPositionX(this.w / 2);
			this.exitDots[0].setPositionX(this.w / 2);
		}
		myP5.rect(this.x, this.y, this.w, this.h);
		myP5.fill(0);
		myP5.noStroke();
		myP5.textSize(20);
		myP5.textFont('Helvetica');
		myP5.text(this.name, this.x + this.w / 2 - (myP5.textWidth(this.name) / 2), this.y + this.h / 1.8);
		myP5.pop();
	}

}



module.exports = {
	SGTextNode
};
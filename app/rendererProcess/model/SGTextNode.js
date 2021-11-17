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
		this.name="";
		this.description="";
		this.btn_save_modification=null;
		this.btn_add_audio=null;
		this.btn_discard_modification=null;
		
	}

	displayQuestionZone() {
		const self=this;
		this.questionZone=myP5.createDiv();
		this.questionZone.id('displayQuestionZone')
		this.questionZone.parent("seriousGameZoneQuestions");

		let txt_Title=myP5.createP("Nom de la forme :");
		txt_Title.parent('displayQuestionZone');
		let input_name=myP5.createInput(this.name);
		input_name.id('input_node_name');
		input_name.parent('displayQuestionZone');

		let txt_Description=myP5.createP("Champ texte à lire :");
		txt_Description.parent('displayQuestionZone');
		let input_description=myP5.createInput(this.description);
		input_description.id('input_node_description');
		input_description.parent('displayQuestionZone');

		this.btn_add_audio=myP5.createButton('Ajouter de l\'audio');
		this.btn_add_audio.mousePressed(() => {SGTextNode.addAudio(self);});
		this.btn_add_audio.parent('displayQuestionZone');

		this.btn_discard_modification=myP5.createButton("Annuler Modification");
		this.btn_discard_modification.mousePressed(() => {SGTextNode.discardModification(self);});
		this.btn_discard_modification.parent('displayQuestionZone');
		this.btn_save_modification=myP5.createButton("Appliquer Modification");
		this.btn_save_modification.mousePressed(() => {SGTextNode.saveModification(self);});
		this.btn_save_modification.parent('displayQuestionZone');

	}

	static discardModification(self){
		self.emptyQuestionZone();
		self.displayQuestionZone();
	}
	
	static addAudio(self){
	
	}
	
	static saveModification(self){
		self.name=document.getElementById('input_node_name').value;
		self.description=document.getElementById('input_node_description').value;
	}

	/** Draw the node */
	display() {
		myP5.push();
		myP5.stroke('#91abe1');
		myP5.strokeWeight(4);
		if (this.dragging||this.clicked)
			myP5.fill(80);
			if (this.clicked)
				myP5.strokeWeight(6);
		else if (this.isMouseHover())
			myP5.fill(100);
		else
			myP5.fill(235);
		myP5.rect(this.x, this.y, this.w, this.h);
		myP5.fill(0);
		myP5.noStroke();
		myP5.textSize(20);
		myP5.textFont('Helvetica');
		myP5.text(this.name,this.x+this.w/2-5*this.name.length,this.y+this.h/2);
		myP5.pop();
	}

}



module.exports = {
	SGTextNode
};
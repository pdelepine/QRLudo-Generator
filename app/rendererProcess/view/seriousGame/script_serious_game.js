
var sketch = function (p) {
	/** Déclaration de variables du dessin */
	/** Récupération du div parent du dessin / canvas */
	p.parentDiv = document.getElementById("seriousGameDiagram").getBoundingClientRect();
	/** Paramètre gérant le zoom du dessin */
	p.zoom = 1;
	/** Liste des noeuds du diagramme */
	p.nodeArray = [];
	/** Liste des liens du diagramme */
	p.linkArray = [];
	/** Variable pour savoir si la palette est afficher ou chacher */
	p.palette = true;
	/** Le bouton pour cacher la palette */
	p.buttonHidePalette;
	/** Le bouton pour afficher la palette */
	p.buttonShowPalette;
	/** Le bouton de création de question */
	p.buttonCreateQuestion;
	/** Le bouton de création de champ de texte */
	p.buttonCreateTextNode;
	/** Le slider qui permet de zoomer et de dézoomer */
	p.sliderZoom;
	/** Variable pour savoir si on utilise le slider ou non */
	p.sliderNotPressed = true;
	/** Paramètre gérant la translation du canvas sur l'axe des x */
	p.translateX = 0;
	/** Paramètre gérant la translation du canvas sur l'axe des y */
	p.translateY = 0;
	/** Paramètre gérant le offset de la translation du canvas sur l'axe des x */
	p.diagramOffsetX = 0;
	/** Paramètre gérant le offset de la translation du canvas sur l'axe des y */
	p.diagramOffsetY = 0;
	/** Paramètre du translate x initial du canvas */
	p.initX = 150;
	/** Paramètre du translate y initial du canvas */
	p.initY = 0;
	/** Paramètre du canvas */
	p.seriousGameCanvas;
	/** État pour la création de noeud suivant la souris */
	p.hoveringNode = false;

	p.creatingNodeType = null;

	p.creatingLink = false;
	/** Etat pour le passage au dessus du Canvas */
	p.hoveringCanvas = false;
	/** Permet de vérifier si la zone Question du précédent Node cliqué a été effacée */
	p.previousNodeErased = true;
	/** Coordonnées du dernier clic pour gérer la réinitialisation de la zone Question */
	p.lastClickX = 0;
	p.lastClickY = 0;

	p.lastNodeClickedType = "";

	p.setLastNodeClickedType = function (type) {
		p.lastNodeClickedType = type;
	}

	p.setLastClick = function (x, y) {
		/** Modifie les coordonnées du dernier clic */
		p.lastClickX = x;
		p.lastClickY = y;
	}

	p.setPreviousNodeErased = function (boolean) {
		/** Modifie l'état du booléen previousNodeErased */
		p.previousNodeErased = boolean;
	}

	/* P5Js part */
	/** Setup of the canvas */
	p.setup = function () {
		p.seriousGameCanvas = p.createCanvas(p.parentDiv.width, p.parentDiv.height);
		p.seriousGameCanvas.parent("seriousGameDiagram");
		p.frameRate(30);

		/** Modifie l'état de hoveringCanvas pour savoir si oui ou non le curseur de la souris survole le Canvas du Serious Game */
		p.seriousGameCanvas.mouseOver(() => { p.hoveringCanvas = true; });
		p.seriousGameCanvas.mouseOut(() => { p.hoveringCanvas = false; });

		p.translateX = p.initX;
		p.translateY = p.initY;

		/** First & Second Node integration */
		let node1 = new SGTextNode(100, 100, 100, 80);
		let node2 = new SGQuestionNode(200, 200, 100, 80);
		p.nodeArray.push(node1);
		p.nodeArray.push(node2);
		/** Link creation between the to Node */
		let link1 = new SGLink(node1, node1.exitDots[0], node2, node2.entryDot);
		link1.type = 'static';
		p.linkArray.push(link1);

		/** Declaration of Button to hide the palette */
		p.buttonHidePalette = p.createButton('<');
		p.buttonHidePalette.position(155, 115);
		p.buttonHidePalette.mousePressed(p.hidePalette);
		p.buttonHidePalette.parent("seriousGameDiagram");

		/** Declaration of Button to show the palette */
		p.buttonShowPalette = p.createButton('>');
		p.buttonShowPalette.position(5, 115);
		p.buttonShowPalette.mousePressed(p.hidePalette);
		p.buttonShowPalette.parent("seriousGameDiagram");
		p.buttonShowPalette.hide();

		/** Declaration of Button to create Node */
		p.buttonCreateQuestion = p.createButton('Créer une question');
		p.buttonCreateQuestion.position(20, 150);
		p.buttonCreateQuestion.mousePressed(p.createQuestionNode);
		p.buttonCreateQuestion.size(115);
		p.buttonCreateQuestion.parent("seriousGameDiagram");

		/** Declaration of button to create TextNode */
		p.buttonCreateTextNode = p.createButton('Créer un champ texte');
		p.buttonCreateTextNode.position(20, 220);
		p.buttonCreateTextNode.mousePressed(p.createTextNode);
		p.buttonCreateTextNode.size(115);
		p.buttonCreateTextNode.parent("seriousGameDiagram");

		/** Declaration of slider Zoom */
		p.sliderZoom = p.createSlider(1, 200, (p.zoom) * 100);
		p.sliderZoom.parent("seriousGameDiagram");
	}

	/** Event loop */
	p.draw = function () {
		p.background("#e1f1ff");
		/*console.log(`Mouse x ${mouseX} y ${mouseY}`);
		console.log(`Zoom ${p.zoom}`);*/

		p.push();
		p.moveDiagram();
		//console.log(`translate x ${p.translateX} y ${p.translateY}`);
		p.translate(p.translateX, p.translateY);
		p.scale(p.zoom);
		p.nodeArray.forEach(n => n.update());
		p.nodeArray.forEach(n => n.display());
		p.linkArray.forEach(l => l.display());
		p.nodeArray.forEach(n => n.displayDot());

		p.pop();
		p.displayCreateNode();
		if (p.palette) {
			p.drawPalette();
		}

		// Drawing the canvas borders
		p.push();
		p.noFill();
		p.strokeWeight(4);
		p.rect(0, 0, p.parentDiv.width, p.parentDiv.height);
		p.pop();


		p.sliderZoom.position((p.width) - 170, (p.height) + 90); //positionnemnt du slider en bas à droite 
		p.sliderZoom.input(() => {
			p.sliderNotPressed = false; //met à faux quand on utilise le slider
			p.zoom = (p.sliderZoom.value() / 100); //change la valeur de p.zoom en fonction de la valeur du slider
			console.log(`Zoom ${p.zoom}`);
		});
		p.sliderZoom.mouseReleased(() => { p.sliderNotPressed = true; }); //remet à vrai quand on arrête d'utiliser le slider
		p.sliderZoom.value((p.zoom) * 100); //change la valeur du slider si on zoome ou dézoome avec la molette de la souris
		p.push();
		p.fill(28, 62, 180);
		p.textAlign(p.RIGHT);
		p.text(p.sliderZoom.value() + "%", (p.width) - 8, (p.height) - 8); //affiche le pourcentage de zoom auquel on est actuellement
		p.pop();
	}

	/** Fonction de dessin de la palette de bouton de création  */
	p.drawPalette = function () {
		p.push();
		p.fill('#677798');
		p.rect(0, 0, 150, p.parentDiv.height);
		p.fill(0);
		p.textSize(20);
		p.textFont('Helvetica');
		p.text("Palette", 45, 25);
		p.pop();
	}

	/** Fonction qui permet de créer un noeud */
	p.createQuestionNode = function () {
		p.hoveringNode = true;
		p.creatingNodeType = 'questionNode';
		/*
		const x1 = (p.parentDiv.width / 2) / p.zoom - p.translateX / p.zoom;
		const x2 = (p.parentDiv.height / 2) / p.zoom - p.translateY / p.zoom;
		let newNode = new SGNode(x1, x2, 100, 80);
		p.nodeArray.push(newNode);*/
	}

	p.createTextNode = function () {
		p.hoveringNode = true;
		p.creatingNodeType = 'textNode';
		/*
		const x1 = (p.parentDiv.width / 2) / p.zoom - p.translateX / p.zoom;
		const x2 = (p.parentDiv.height / 2) / p.zoom - p.translateY / p.zoom;
		let newNode = new SGNode(x1, x2, 100, 80);
		p.nodeArray.push(newNode);*/
	}

	/** Fonction qui dessine le curseur pour la création des noeuds */
	p.displayCreateNode = function () {
		if (p.hoveringNode) {
			p.push();
			p.noFill();
			p.strokeWeight(1);
			p.line(p.mouseX, p.mouseY - 5, p.mouseX, p.mouseY + 5);
			p.line(p.mouseX - 5, p.mouseY, p.mouseX + 5, p.mouseY);
			p.fill(255);
			p.rect(p.mouseX + 10, p.mouseY - 10, 170, 20, 10);
			p.fill(0);
			p.text("Ajouter l'élément à cet endroit", p.mouseX + 15, p.mouseY + 5);
			p.pop();
		}
	}

	/** Fonction qui gère le déplacement du dessin avec un clic gauche */
	p.moveDiagram = function () {
		if (p.mouseIsPressed && p.mouseButton === p.LEFT && p.sliderNotPressed) {
			if (p.mouseX < p.width && p.mouseX > 0 && p.mouseY < p.height && p.mouseY > 0) {
				let mouseIsOnNodes = p.nodeArray.filter(n => n.isMouseHover() || n.dragging);
				let mouseIsOnLinks = p.linkArray.filter(l => l.isMouseHover());
				if (mouseIsOnNodes.length + mouseIsOnLinks.length === 0) {
					p.translateX = p.initX + (p.mouseX - p.diagramOffsetX);
					p.translateY = p.initY + (p.mouseY - p.diagramOffsetY);
				}
			}
		}
	}

	/** Fonction appelé lors d'un appuie d'un bouton de la souris */
	p.mousePressed = function () {

		if (p.mouseButton === p.LEFT) {
			p.initX = p.translateX;
			p.initY = p.translateY;
			p.diagramOffsetX = p.mouseX;
			p.diagramOffsetY = p.mouseY;
			/** Search first node of the array which hovered by the mouse and push it to last position to become the last drawn and be dragged
				 * Will also trigger the dragging of the node
				*/
			for (let n of p.nodeArray) {
				if (n.pressed()) {
					p.nodeArray = p.nodeArray.filter(removeNode => removeNode != n);
					p.nodeArray.push(n);
					return;
				}
			}
			/** If pressed a link, delete this link */
			for (let i = 0; i < p.linkArray.length; i++) {
				if (p.linkArray[i].isMouseHover()) {
					p.linkArray.splice(i, 1);
					return;
				}
			}

			/** Create Node if mouse not hovering something and hoveringNode = true and not on the palette */
			if (p.hoveringNode && p.mouseX > 150) {
				let mouseIsOnNodes = p.nodeArray.filter(n => n.isMouseHover() || n.dragging);
				let mouseIsOnLinks = p.linkArray.filter(l => l.isMouseHover());
				if (mouseIsOnNodes.length + mouseIsOnLinks.length === 0) {
					switch (p.creatingNodeType) {
						case 'questionNode':
							let newNode1 = new SGQuestionNode((p.mouseX - p.translateX) / p.zoom, (p.mouseY - p.translateY) / p.zoom, 100, 80);
							p.nodeArray.push(newNode1);
							break;
						case 'textNode':
							let newNode2 = new SGTextNode((p.mouseX - p.translateX) / p.zoom, (p.mouseY - p.translateY) / p.zoom, 100, 80);
							p.nodeArray.push(newNode2);
							break;
						default:
					}

					p.hoveringNode = false;
				}
			}
		}
		if (p.mouseButton === p.RIGHT) {
			/** Create Link from node with Mouse Hovering 
			 * The link will follow the mouse until the button is released on an
			 */
			if (!p.creatingLink) {
				p.nodeArray.forEach(n => n.createLink(function (link) {
					p.creatingLink = true;
					p.linkArray.push(link);
				}));
			}
		}
	}

	/** Fonction appelée lors d'un relachement d'un bouton de la souris */
	p.mouseReleased = function () {
		/** Release the drag effect on nodes */
		p.nodeArray.forEach(n => n.released());

		if (p.mouseButton === p.RIGHT) {
			/** Stop the dynamic link if the mouse is hovering a node */
			p.linkArray.forEach(function (l) {
				if (l.type === 'dynamic') {
					p.nodeArray.forEach(function (n) {
						if (n.isMouseHoveringDots() && !n.isMouseHoveringExitDots()) {
							l.node2 = n;
							l.node2Dot = n.getDotHovering();
							l.type = 'static';
							p.creatingLink = false;
						}
					});
				}
			});
		}
	}

	/** Fonction appelée lors d'un scroll de la souris */
	p.mouseWheel = function (event) {
		p.zoom += (event.delta / 500);
		if (p.zoom <= 0) p.zoom = 0.1;
		console.log(`Zoom ${p.zoom}`);
	}

	/** Fonction appelée lorsqu'une touche est appuyée */
	p.keyPressed = function () {

		/** Appuie sur la touche "Suppr" */
		if (p.keyCode === p.DELETE) {

			/** If a node if hovered by the mouse, delete him and all the link attach to him  */
			for (let i = 0; i < p.nodeArray.length; i++) {
				if (p.nodeArray[i].isMouseHover()) {
					p.linkArray = p.linkArray.filter(function (l) {
						return !(l.node1 === p.nodeArray[i] || l.node2 === p.nodeArray[i]);
					});
					p.nodeArray.splice(i, 1);
					return;
				}
			}
		}
	}

	/** Fonction appelée lorsque le bouton buttonHidePalette ou le bouton buttonShowPalette est appuyé */
	p.hidePalette = function () {
		if (p.palette) {
			p.palette = false;
			p.buttonHidePalette.hide();
			p.buttonShowPalette.show();
			p.buttonCreateQuestion.hide();
			p.buttonCreateTextNode.hide();
		}
		else {
			p.palette = true;
			p.buttonHidePalette.show();
			p.buttonShowPalette.hide();
			p.buttonCreateQuestion.show();
			p.buttonCreateTextNode.show();
		}
	}

	p.windowResized = function () {
		p.parentDiv = document.getElementById("seriousGameDiagram").getBoundingClientRect();
		console.log(p.parentDiv.width + " " + p.parentDiv.height);
		p.resizeCanvas(p.parentDiv.width, p.parentDiv.height);
	}

	$("#generateSG").on('click', function () {
		qr = generateJson();
		facade = new FacadeController();
		if(showError()) {
			facade.genererQRCode(document.getElementById("qrView"),qr);
			logger.info(`Génération de QR Code de SeriousGame ${JSON.stringify(projet.qrcode)}`);
		}
	})


	/** une fonction pour generer le Json de SG en utilisant les p.nodeArray et p.linkArray*/
	function generateJson(){
		let questionNodes = [];
		let textNodes = [];
		let textNodesJson = [];
		let questionNodesJson = [];

		//mettre les questionNodes dans un array et les textNodes dans un autre 
		for (i=0 ; i < p.nodeArray.length ; ++i){
			if (p.nodeArray[i] instanceof SGTextNode) {
				textNodes.push(p.nodeArray[i]);
			} else {
				questionNodes.push(p.nodeArray[i]);
			}
		}

		// traitement de textNodes
		for (i=0 ; i < textNodes.length ; ++i){
			let name = textNodes[i].name;
			let text = textNodes[i].description;
			let exitLink = "";
			for (z = 0 ; z <p.linkArray.length ; ++z){
				if (textNodes[i].exitDots[0].getPositionX() == p.linkArray[z].node1Dot.getPositionX() && textNodes[i].exitDots[0].getPositionY()==p.linkArray[z].node1Dot.getPositionY()){
					next_node = p.linkArray[z].node2;
					if(next_node instanceof SGQuestionNode)
						exitLink = p.linkArray[z].node2.name;
					else
						exitLink = p.linkArray[z].node2.name;
					break;
				}
			}
			let textObject;
			if(text.substring(text.length - 3, text.length) == "mp3")
				textObject = {
					type: "music",
					name: text,
					url: textNodes[i].url
				}
			else {
				textObject = {
					type: "text",
					text: text
				}
			}
			let textNode = new TextNode(name, textObject, exitLink);
			textNodesJson.push(textNode);
		}

		// traitement de questionNodes
		for (i=0 ; i < questionNodes.length ; ++i){
			let name = questionNodes[i].name;
			let textQuestion = questionNodes[i].question;
			let reponses = [];

			for (j = 0 ; j < questionNodes[i].answers.length; ++j){
				let text = questionNodes[i].answers[j];
				let exitLink = "";
				for (z = 0 ; z <p.linkArray.length ; ++z){
					if (questionNodes[i].exitDots[j].getPositionX()==p.linkArray[z].node1Dot.getPositionX() && questionNodes[i].exitDots[j].getPositionY()==p.linkArray[z].node1Dot.getPositionY()){
						next_node = p.linkArray[z].node2;
					}
					exitLink = p.linkArray[z].node2.name;
				}
				let reponse = {
					text: text,
					exitLink: exitLink
				}
				reponses.push(reponse);
			}

			let textQuestionObject;
			if(textQuestion.substring(textQuestion.length - 3, textQuestion.length) == "mp3")
				textQuestionObject = {
					type: "music",
					name: textQuestion,
					url: questionNodes[i].url
				}
			else {
				textQuestionObject = {
					type: "text",
					text: textQuestion
				}
			}
			
			let questionNode = new QuestionNode(name, textQuestionObject, reponses);
			questionNodesJson.push(questionNode);
		}
		
		projet = new ProjetSeriousGame(textNodesJson, questionNodesJson);
		return projet;
	}

	/** Fonction pour vérifier que l'histoire est correcte */
	function showError(){
		let textNodes = [];
		let questionNodes = [];

		//mettre les questionNodes dans un array et les textNodes dans un autre 
		for (i=0 ; i < p.nodeArray.length ; ++i){
			if (p.nodeArray[i] instanceof SGTextNode) {
				textNodes.push(p.nodeArray[i]);
			} else {
				questionNodes.push(p.nodeArray[i]);
			}
		}

		let nbStartNode = 0; // Nombre de noeud d'introduction

		// On regarde s'il y a un noeud texte qui est un noeud de départ
		for(i = 0; i < textNodes.length; ++i){
			entryDot = textNodes[i].entryDot;
			let x = entryDot.getPositionX();
			let y = entryDot.getPositionY();
			let found = false;

			console.log("textNode X: " + x + " textNode Y: " + y);

			for(j = 0; j < p.linkArray.length; ++j){
				let linkX = p.linkArray[j].node2Dot.getPositionX();
				let linkY = p.linkArray[j].node2Dot.getPositionY();

				console.log("link X: " + linkX + " link Y: " + linkY);

				if(linkX == x && linkY == y){
					found = true;
				}
			}

			if(!found)
				++nbStartNode;
		}

		// On regarde s'il y a un noeud question qui est un noeud de départ
		for(i = 0; i < questionNodes.length; ++i){
			entryDot = questionNodes[i].entryDot;
			let x = entryDot.getPositionX();
			let y = entryDot.getPositionY();
			let found = false;

			console.log("questionNode X: " + x + " questionNode Y: " + y);

			for(j = 0; j < p.linkArray.length; ++j){
				let linkX = p.linkArray[j].node2Dot.getPositionX();
				let linkY = p.linkArray[j].node2Dot.getPositionY();

				console.log("link X: " + linkX + " link Y: " + linkY);

				if(linkX == x && linkY == y){
					found = true;
				}
			}

			if(!found)
				++nbStartNode;
		}

		// Il ne peut y avoir qu'un seul noeud de départ
		if(nbStartNode == 0){
			messageInfos("Attention aucun noeud de départ n'est présent", "danger");
			logger.error("Attention aucun noeud de départ n'est présents");
			return false;
		}
		else if(nbStartNode > 1){
			messageInfos("Attention plusieurs noeuds de départ sont présents", "danger");
			logger.error("Attention plusieurs noeuds de départ sont présents");
			return false;
		}

		let nbEndNode = 0; // Nombre de noeud d'introduction

		// On regarde s'il y a un noeud texte qui est un noeud de fin
		for(i = 0; i < textNodes.length; ++i){
			exitDot = textNodes[i].exitDots[0];
			let x = exitDot.getPositionX();
			let y = exitDot.getPositionY();
			let found = false;

			console.log("textNode X: " + x + " textNode Y: " + y);

			for(j = 0; j < p.linkArray.length; ++j){
				let linkX = p.linkArray[j].node1Dot.getPositionX();
				let linkY = p.linkArray[j].node1Dot.getPositionY();

				console.log("link X: " + linkX + " link Y: " + linkY);

				if(linkX == x && linkY == y){
					found = true;
				}
			}

			if(!found)
				++nbEndNode;
		}

		// On regarde s'il y a un noeud question qui est un noeud de fin
		for(i = 0; i < questionNodes.length; ++i){
			exitDot = questionNodes[i].exitDots[0];
			let x = exitDot.getPositionX();
			let y = exitDot.getPositionY();
			let found = false;

			console.log("questionNode X: " + x + " questionNode Y: " + y);

			for(j = 0; j < p.linkArray.length; ++j){
				let linkX = p.linkArray[j].node1Dot.getPositionX();
				let linkY = p.linkArray[j].node1Dot.getPositionY();

				console.log("link X: " + linkX + " link Y: " + linkY);

				if(linkX == x && linkY == y){
					found = true;
				}
			}

			if(!found) {
				messageInfos("Attention l'histoire se finit par une question", "danger");
				logger.error("Attention l'histoire se finit par une question");
				return false;
			}
		}

		// Il ne peut y avoir qu'un seul noeud de fin
		if(nbEndNode == 0){
			messageInfos("Attention aucun noeud de fin n'est présent", "danger");
			logger.error("Attention aucun noeud de fin n'est présent");
			return false;
		}
		else if(nbEndNode > 1){
			messageInfos("Attention plusieurs noeuds de fin sont présents", "danger");
			logger.error("Attention plusieurs noeuds de fin sont présents");
			return false;
		}
		
		return true;
	}
	
}

if (typeof myP5 === 'undefined') {
	var myP5 = new p5(sketch);
} else {
	myP5.remove();
	myP5 = new p5(sketch);
}

/** Fonction pour ajouter un fichier audio */
function getMusicFromUrl() {
	/** Check internet connection*/
	logger.info('Test de la connexion internet');
	if (!navigator.onLine) {
		logger.error(`L'application ne peut pas télécharger de fichier audio sans une liaison à internet. Veuillez vérifier votre connexion internet`);
		alert("L'application ne peut pas télécharger de fichier audio sans une liaison à internet. Veuillez vérifier votre connexion internet");
		setTimeout(function () { $('#musicUrl').val(''); }, 1);//obliger de mettre un setTimeout pour que le champ texte se vide
	} else {
		logger.info('L\'application est bien connectée à internet');
		let modal = $('#listeMusic').find('div.modal-body.scrollbar-success');
		let loader = document.createElement('div');
		let errorMsg = document.createElement('label');

		const {
			clipboard
		} = require('electron');

		let url = clipboard.readText();
		let xhr = new XMLHttpRequest();

		Music.getDownloadLink(url, link => {
			if (link == null) {
				showError(modal, errorMsg);
				return
			}

			try {
				xhr.open('GET', link, true);
			} catch (e) {
				showError(modal, errorMsg);
			}
			xhr.responseType = 'blob';
			xhr.onload = function (e) {

				if (this.status == 200) {
					let blob = this.response; // get binary data as a response
					let contentType = xhr.getResponseHeader("content-type");
					console.log(contentType);

					if (contentType == 'audio/mpeg' || contentType == 'audio/mp3') {
						// get filename
						let filename = xhr.getResponseHeader("content-disposition").split(";")[1];
						filename = filename.replace('filename="', '');
						filename = filename.replace('.mp3"', '.mp3');

						// save file in folder projet/download
						let fileReader = new FileReader();
						fileReader.onload = function () {
							fs.writeFileSync(`${temp}/Download/${filename}`, Buffer(new Uint8Array(this.result)));

							$(loader, errorMsg).remove();
							$('#closeModalListeMusic').on('click',); // close modal add music
						};
						fileReader.readAsArrayBuffer(blob);

						ajouterChampSon(filename, link);
					} else {
						showError(modal, errorMsg, "Le fichier n'est pas un fichier audio");
					}
				} else {
					// request failed
					showError(modal, errorMsg);
				}
			};

			xhr.onloadstart = function (e) {
				console.log('load start');
				$(loader).addClass('loader');
				$(modal).find('.errorLoader').remove();
				$(modal).prepend(loader); // show loader when request progress
			};

			xhr.onerror = function (e) {
				showError(modal, errorMsg);
			};

			xhr.send();
		});
	}
}

/** Fonction pour ajouter au bon endroit le fichier audio */
function ajouterChampSon(nom, url) {
	let id_input = "";
	if (myP5.lastNodeClickedType == "question") {
		id_input = "input_node_question";
	}
	else {
		if (myP5.lastNodeClickedType == "text") {
			id_input = "input_node_description";
		}
	}
	document.getElementById(id_input).value = nom;
	document.getElementById(id_input).name = url;
	for (let i = 0; i < myP5.nodeArray.length; i++) {
		if (myP5.nodeArray[i].clicked) {
			myP5.nodeArray[i].saveAudioModification();
		}
	}
}

function showError(modal, errorMsg, message = "Veuillez coller un lien de fichier téléchargeable. Reportez vous à la rubrique Info pour plus d'informations.") {
	console.log('error ');
	$(modal).find('.loader').remove();
	$(errorMsg).text(message);
	$(errorMsg).css('color', '#f35b6a');
	$(errorMsg).addClass('errorLoader');
	$(modal).prepend(errorMsg); // add error message
}

//fonction appeler pour réinitialiser le sérious game
function deleteGame(){
	myP5.remove();
	myP5 = new p5(sketch);
	logger.info("Réinitialisation de la page Sérious Game");
}

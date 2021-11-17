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

	p.hoveringCanvas = false;

	/* P5Js part */
	/** Setup of the canvas */
	p.setup = function () {
		p.seriousGameCanvas = p.createCanvas(p.parentDiv.width, p.parentDiv.height);
		p.seriousGameCanvas.parent("seriousGameDiagram");
		p.frameRate(30);

		p.seriousGameCanvas.mouseOver(()=>{p.hoveringCanvas=true;});
		p.seriousGameCanvas.mouseOut(()=>{p.hoveringCanvas=false;});

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
    if(p.palette){
			p.drawPalette();
		}

		// Drawing the canvas borders
		p.push();
		p.noFill();
		p.strokeWeight(4);
		p.rect(0, 0, p.parentDiv.width, p.parentDiv.height);
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
		if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
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
						if (n.isMouseHoveringDots()) {
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

}

if (typeof myP5 === 'undefined') {
	var myP5 = new p5(sketch);
} else {
	myP5.remove();
	myP5 = new p5(sketch);
}

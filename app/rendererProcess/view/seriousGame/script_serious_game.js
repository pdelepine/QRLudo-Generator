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

	/** Variable pour savoir si la palette est affichée ou cachée */
	p.palette = true;
	/** Variable sur la taille de la palette */
	p.paletteWidth = 70;

	/** Le bouton de création de question QCM */
	p.buttonCreateQuestionQCM;

	/** Le bouton de création de question QO*/
	p.buttonCreateQuestionQO;

	/** Le bouton de création de question QR*/
	p.buttonCreateQuestionQR;

	/** Le bouton de création de champ de texte */
	p.buttonCreateTextNode;

	/** Le bouton de création de liens */
	p.buttonCreateLink;

	/** Le bouton de duplication de node */
	p.buttonDuplicateNode;

	/** Le bouton pour activer la suppression des formes et liens */
	p.buttonEraser;

	/** Le bouton pour activer sélection de formes */
	p.buttonMouseSelection;

	/** Le bouton pour activer le délacement du dessin*/
	p.buttonMouseDisplacement;

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
	p.initX = p.paletteWidth;

	/** Paramètre du translate y initial du canvas */
	p.initY = 0;

	/** Paramètre du canvas, la zone qui contient tout le diagramme */
	p.seriousGameCanvas;

	/** État pour la création de noeud suivant la souris */
	p.hoveringNode = false;

	/** Type de node qui va être créé, valeur parmi p.NodeType */
	p.creatingNodeType = null;

	/** Un enum sur les différents type de node */
	p.NodeType = Object.freeze({
		TextNode: Symbol('textNode'),
		QCMNode: Symbol('qcmNode'),
		QONode: Symbol('qoNode'),
		QRNode: Symbol('qrNode')
	});

	/** Booléen de contrôle pour la création des liens */
	p.creatingLink = false;

	/** Etat pour le passage au dessus du Canvas */
	p.hoveringCanvas = false;

	/** Permet de vérifier si la zone Question du précédent Node cliqué a été effacée */
	p.previousNodeErased = true;

	/** Coordonnées du dernier clic pour gérer la réinitialisation de la zone Question */
	p.lastClickX = 0;
	p.lastClickY = 0;

	/** Booléen de contrôle de l'action de la souris
	 * true = déplacement du diagramme
	 * false = sélection
	 */
	p.isMovingDiagram = false;

	/** Booléen de contrôle de l'action de suppression */
	p.isErasing = false;

	/** Booléen de contrôle de la duplication de node */
	p.isDuplicating = false;

	/** Un enum sur les différents états du curseur */
	p.CursorState = Object.freeze({
		SELECTION: Symbol("selection"),
		DISPLACEMENT: Symbol("displacement"),
		CREATENODE: Symbol("createnode"),
		CREATELINK: Symbol("createlink"),
		ERASING: Symbol("erasing"),
		DUPLICATING: Symbol("duplicating")
	});

	/** Mutateur des coordonnées du dernier click */
	p.lastNodeClickedType = "";

	p.setLastNodeClickedType = function (type) {
		p.lastNodeClickedType = type;
	}

	/** Modifie les coordonnées du dernier clic */
	p.setLastClick = function (x, y) {
		p.lastClickX = x;
		p.lastClickY = y;
	}

	/** Mutateur du booléen de contrôle pour savoir si la zone de description d'un node a été effacée */
	p.setPreviousNodeErased = function (boolean) {
		/** Modifie l'état du booléen previousNodeErased */
		p.previousNodeErased = boolean;
	}

	/* P5Js part */
	/** Initialisation du diagramme */
	p.setup = function () {
		p.seriousGameCanvas = p.createCanvas(p.parentDiv.width, p.parentDiv.height);
		p.seriousGameCanvas.parent("seriousGameDiagram");
		p.frameRate(30);

		/** Modifie l'état de hoveringCanvas pour savoir si oui ou non le curseur de la souris survole le Canvas du Serious Game */
		p.seriousGameCanvas.mouseOver(() => { p.hoveringCanvas = true; });
		p.seriousGameCanvas.mouseOut(() => { p.hoveringCanvas = false; });

		p.translateX = p.initX;
		p.translateY = p.initY;

		/** Déclaration du bouton de création de TextNode */
		p.buttonCreateTextNode = p.createButton('T');
		p.buttonCreateTextNode.position(15, - p.seriousGameCanvas.height, 'relative');
		p.buttonCreateTextNode.mousePressed(() => { p.createNode(p.NodeType.TextNode); p.switchButtonState(p.CursorState.CREATENODE); p.getCursor(); });
		p.buttonCreateTextNode.size(40);
		p.buttonCreateTextNode.attribute('title', 'Créer un texte');
		p.buttonCreateTextNode.style('font-family', '"Times New Roman", Times, serif');
		p.buttonCreateTextNode.style('font-weight', 'bold');
		p.buttonCreateTextNode.parent("seriousGameDiagram");

		/** Déclaration du bouton de création de QuestionNode */
		p.buttonCreateQuestionQCM = p.createButton('');
		p.buttonCreateQuestionQCM.id('btn-create-QCM');
		p.buttonCreateQuestionQCM.position(- 25, -p.seriousGameCanvas.height + 40, 'relative');
		p.buttonCreateQuestionQCM.mousePressed(() => { p.createNode(p.NodeType.QCMNode); p.switchButtonState(p.CursorState.CREATENODE); p.getCursor(); });
		p.buttonCreateQuestionQCM.size(40);
		p.buttonCreateQuestionQCM.attribute('title', 'Créer une question QCM');
		p.buttonCreateQuestionQCM.parent("seriousGameDiagram");
		/** L'icône pour le bouton de création de QuestionNode */
		p.iconQCM = p.createElement('i');
		p.iconQCM.class('fa fa-list');
		p.iconQCM.parent('btn-create-QCM');
		p.iconQCM.style('color', '#000000');
		p.iconQCM.size(20);

		/** Déclaration du bouton de création de QuestionQONode */
		p.buttonCreateQuestionQO = p.createButton('');
		p.buttonCreateQuestionQO.id('btn-create-QO');
		p.buttonCreateQuestionQO.position(- 65, -p.seriousGameCanvas.height + 80, 'relative');
		p.buttonCreateQuestionQO.mousePressed(() => { p.createNode(p.NodeType.QONode); p.switchButtonState(p.CursorState.CREATENODE); p.getCursor(); });
		p.buttonCreateQuestionQO.size(40);
		p.buttonCreateQuestionQO.attribute('title', 'Créer une question ouverte');
		p.buttonCreateQuestionQO.parent("seriousGameDiagram");
		/** L'icône pour le bouton de création de QuestionQONode */
		p.iconQO = p.createElement('i');
		p.iconQO.class('fa fa-microphone');
		p.iconQO.parent('btn-create-QO');
		p.iconQO.style('color', '#000000');
		p.iconQO.size(20);

		/** Déclaration du bouton de création de QuestionQRNode */
		p.buttonCreateQuestionQR = p.createButton('');
		p.buttonCreateQuestionQR.id('btn-create-QR');
		p.buttonCreateQuestionQR.position(- 105, -p.seriousGameCanvas.height + 120, 'relative');
		p.buttonCreateQuestionQR.mousePressed(() => { p.createNode(p.NodeType.QRNode); p.switchButtonState(p.CursorState.CREATENODE); p.getCursor(); });
		p.buttonCreateQuestionQR.size(40);
		p.buttonCreateQuestionQR.attribute('title', 'Créer une question QR code');
		p.buttonCreateQuestionQR.parent("seriousGameDiagram");
		/** L'icône pour le bouton de création de QuestionQRNode */
		p.iconQR = p.createElement('i');
		p.iconQR.class('fa fa-qrcode');
		p.iconQR.parent('btn-create-QR');
		p.iconQR.style('color', '#000000');
		p.iconQR.size(20);

		/** Déclaration du bouton de création de lien */
		p.buttonCreateLink = p.createButton('');
		p.buttonCreateLink.id('btn-create-link');
		p.buttonCreateLink.position(- 145, - p.seriousGameCanvas.height + 180, 'relative');
		p.buttonCreateLink.size(40);
		p.buttonCreateLink.attribute('title', 'Créer un lien');
		p.buttonCreateLink.mousePressed(() => { p.creatingLink = !p.creatingLink; p.switchButtonState(p.CursorState.CREATELINK); p.getCursor(); })
		p.buttonCreateLink.parent('seriousGameDiagram');
		/** L'icône pour le bouton de création de lien */
		p.iconLink = p.createElement('i');
		p.iconLink.class('fa fa-arrow-right');
		p.iconLink.parent('btn-create-link');
		p.iconLink.style('color', '#000000');
		p.iconLink.size(20);

		/** Déclaration du bouton de duplication */
		p.buttonDuplicateNode = p.createButton('');
		p.buttonDuplicateNode.id('btn-copy');
		p.buttonDuplicateNode.position(- 185, - p.seriousGameCanvas.height + 240, 'relative');
		p.buttonDuplicateNode.size(40);
		p.buttonDuplicateNode.attribute('title', 'Dupliquer');
		p.buttonDuplicateNode.mousePressed(() => { p.isDuplicating = !p.isDuplicating; p.switchButtonState(p.CursorState.DUPLICATING); p.getCursor(); });
		p.buttonDuplicateNode.parent('seriousGameDiagram');
		/** L'icône pour le bouton de duplication */
		p.iconDuplicate = p.createElement('i');
		p.iconDuplicate.class('fa fa-copy');
		p.iconDuplicate.parent('btn-copy');
		p.iconDuplicate.style('color', '#000000');
		p.iconDuplicate.size(20);

		/** Déclaration du bouton de suppression */
		p.buttonEraser = p.createButton('');
		p.buttonEraser.id('btn-eraser');
		p.buttonEraser.position(- 225, - p.seriousGameCanvas.height + 280, 'relative');
		p.buttonEraser.size(40);
		p.buttonEraser.attribute('title', 'Supprimer');
		p.buttonEraser.mousePressed(() => { p.isErasing = !p.isErasing; p.switchButtonState(p.CursorState.ERASING); p.getCursor(); });
		p.buttonEraser.parent('seriousGameDiagram');
		/** L'icône pour le bouton de suppression */
		p.iconEraser = p.createElement('i');
		p.iconEraser.class('fa fa-eraser');
		p.iconEraser.parent('btn-eraser');
		p.iconEraser.style('color', '#000000');
		p.iconEraser.size(20);

		/** Déclaration du bouton de sélection */
		p.buttonMouseSelection = p.createButton('');
		p.buttonMouseSelection.id('btn-mouse-selection');
		p.buttonMouseSelection.position(-265, - p.seriousGameCanvas.height + 340, 'relative');
		p.buttonMouseSelection.size(40);
		p.buttonMouseSelection.attribute('title', 'Outil de sélection');
		p.buttonMouseSelection.mousePressed(() => { p.isMovingDiagram = false; p.switchButtonState(p.CursorState.SELECTION); p.getCursor(); });
		p.buttonMouseSelection.parent('seriousGameDiagram');
		/** L'icône pour le bouton de sélection */
		p.iconMouseSelection = p.createElement('i');
		p.iconMouseSelection.class('fa fa-mouse-pointer');
		p.iconMouseSelection.parent('btn-mouse-selection');
		p.iconMouseSelection.style('color', '#000000');
		p.iconMouseSelection.size(20);

		/** Déclaration du bouton de déplacement */
		p.buttonMouseDisplacement = p.createButton('');
		p.buttonMouseDisplacement.id('btn-mouse-displacement');
		p.buttonMouseDisplacement.position(-305, - p.seriousGameCanvas.height + 380, 'relative');
		p.buttonMouseDisplacement.size(40);
		p.buttonMouseDisplacement.attribute('title', 'Outil de déplacement du dessin');
		p.buttonMouseDisplacement.mousePressed(() => { p.isMovingDiagram = true; p.getCursor(); p.switchButtonState(p.CursorState.DISPLACEMENT); });
		p.buttonMouseDisplacement.parent('seriousGameDiagram');
		/** L'icône pour le bouton de déplacement */
		p.iconMouseDisplacement = p.createElement('i');
		p.iconMouseDisplacement.class('fa fa-arrows-alt');
		p.iconMouseDisplacement.parent('btn-mouse-displacement');
		p.iconMouseDisplacement.style('color', '#000000');
		p.iconMouseDisplacement.size(20);

		/** Déclaration du slider du zoom*/
		p.sliderZoom = p.createSlider(1, 200, (p.zoom) * 100);
		p.sliderZoom.input(() => {
			p.sliderNotPressed = false; 									//met à faux quand on utilise le slider
			p.zoom = (p.sliderZoom.value() / 100); 							//change la valeur de p.zoom en fonction de la valeur du slider
		});
		p.sliderZoom.mouseReleased(() => { p.sliderNotPressed = true; }); 	//remet à vrai quand on arrête d'utiliser le slider
		p.sliderZoom.parent("seriousGameDiagram");
		// Positionnemnt du slider en bas à droite
		p.sliderZoom.position(p.seriousGameCanvas.position().x + p.seriousGameCanvas.size().width - 170, p.seriousGameCanvas.position().y + p.seriousGameCanvas.size().height - 20);

	}

	/** La boucle de dessin */
	p.draw = function () {
		// On dessine la couleur du fond
		p.background("#e1f1ff");

		p.push();
		// Déplacement du diagramme lorsque que l'état est activé
		if (p.isMovingDiagram) p.moveDiagram();
		//console.log(`translate x ${p.translateX} y ${p.translateY}`);
		p.translate(p.translateX, p.translateY);

		// On gère le zoom du diagramme
		p.scale(p.zoom);

		// On update la position des nodes
		p.nodeArray.forEach(n => n.update());

		// On affiche les nodes
		p.nodeArray.forEach(n => n.display());

		// On affiche les liens
		p.linkArray.forEach(l => l.display());

		// On affiche les dot des nodes
		p.nodeArray.forEach(n => n.displayDot());
		p.pop();

		// On dessine l'encadré lors de la création de node
		p.displayCreateNode();

		// On dessine le rectangle de la palette
		if (p.palette) {
			p.drawPalette();
		}

		// On dessine les bordures du diagram
		p.push();
		p.noFill();
		p.strokeWeight(4);
		p.rect(0, 0, p.parentDiv.width, p.parentDiv.height);
		p.pop();

		// Change la valeur du slider si on zoome ou dézoome avec la molette de la souris
		p.sliderZoom.value((p.zoom) * 100);

		p.push();
		p.fill(28, 62, 180);
		p.textAlign(p.RIGHT);
		// Affiche le pourcentage de zoom auquel on est actuellement
		p.text(p.sliderZoom.value() + "%", (p.width) - 8, (p.height) - 8);
		p.sliderZoom.position(p.seriousGameCanvas.position().x + p.seriousGameCanvas.size().width - 170, p.seriousGameCanvas.position().y + p.seriousGameCanvas.size().height - 20);
		p.pop();

		// Ajustement de la couleur des boutons
		p.highlightButtons();
	}

	/** Fonction de dessin de la palette de bouton de création  */
	p.drawPalette = function () {
		p.push();
		p.fill('#677798');
		p.rect(0, 0, p.paletteWidth, p.parentDiv.height);
		p.fill(0);
		p.textSize(20);
		p.textFont('Helvetica');
		//p.text("Palette", 45, 25);
		p.pop();
	}

	/**
	 * Fonction qui déclenche la création de node
	 * @param {p.NodeType} nodeType Le type de node qui va être créé
	 */
	p.createNode = function (nodeType) {
		p.hoveringNode = !p.hoveringNode;
		p.creatingNodeType = nodeType;
	}

	/** Fonction qui dessine l'encadré pour la création des noeuds */
	p.displayCreateNode = function () {
		if (p.hoveringNode) {
			p.push();
			p.strokeWeight(1);
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

			/** Mode suppression */
			if (p.isErasing) {
				/** Le premier lien survolé est supprimé */
				for (let i = 0; i < p.linkArray.length; i++) {
					if (p.linkArray[i].isMouseHover()) {
						p.linkArray.splice(i, 1);
						SetProgressBar(myP5.generateJson());
						return;
					}
				}

				/** Le premier node survolé par la souris est supprimé ainsi que tous liens attachés à lui */
				for (let i = 0; i < p.nodeArray.length; i++) {
					if (p.nodeArray[i].isMouseHover()) {
						p.linkArray = p.linkArray.filter(function (l) {
							return !(l.node1 === p.nodeArray[i] || l.node2 === p.nodeArray[i]);
						});
						p.nodeArray.splice(i, 1);
						SetProgressBar(myP5.generateJson());
						return;
					}
				}
			} else {
				/** Recherche le premier node survolé par la souris et la pousse à la fin de la liste nodeArray
				 * pour qu'il soit dessiné en dernier
				 * Active aussi l'effet de drag sur le node
				*/
				for (let n of p.nodeArray) {
					if (n.pressed()) {
						p.nodeArray = p.nodeArray.filter(removeNode => removeNode != n);
						p.nodeArray.push(n);
						break;
					}
				}
			}

			/**
			 * Mode création de lien dynamique depuis l'exitDot qui est survolé par la souris
			 * Ce lien sera attaché à la souris jusqu'à ce qu'on relâche le clic droit sur un entryDot où annule la création de lien
			 */
			if (p.creatingLink) {
				p.nodeArray.forEach(n => n.createLink(function (link) {
					let exitDotAlreadyLinked = false;
					p.linkArray.forEach(l => { if (l.node1Dot === link.node1Dot) exitDotAlreadyLinked = true; });
					if (!exitDotAlreadyLinked) {
						p.creatingLink = true;
						p.linkArray.push(link);
						SetProgressBar(myP5.generateJson());
					}
				}));

				// Suppression du lien dynamique si on clique sur aucun node
				let isHoverNode = false;
				p.nodeArray.forEach(n => {
					if (n.isMouseHover() || n.isMouseHoveringDots()) isHoverNode = true;
				});
				if (!isHoverNode) {
					// Annule la création des liens dynamiques
					p.linkArray = p.linkArray.filter(l => (l.type !== 'dynamic'));
				}
			} else {
				// Annule la création des liens dynamiques
				p.linkArray = p.linkArray.filter(l => (l.type !== 'dynamic'));
			}

			/** Mode création de node si la souris ne survole rien (node, link or palette) et que le booléen de création de node `hoveringNode`= true */
			if (p.hoveringNode && p.mouseX > p.paletteWidth) {
				let mouseIsOnNodes = p.nodeArray.filter(n => n.isMouseHover() || n.dragging);
				let mouseIsOnLinks = p.linkArray.filter(l => l.isMouseHover());
				if (mouseIsOnNodes.length + mouseIsOnLinks.length === 0) {
					switch (p.creatingNodeType) {
						case p.NodeType.TextNode:
							p.nodeArray.push(new SGTextNode((p.mouseX - p.translateX) / p.zoom, (p.mouseY - p.translateY) / p.zoom, 100, 80));
							break;

						case p.NodeType.QCMNode:
							p.nodeArray.push(new SGQuestionQCMNode((p.mouseX - p.translateX) / p.zoom, (p.mouseY - p.translateY) / p.zoom, 100, 80));
							break;

						case p.NodeType.QONode:
							p.nodeArray.push(new SGQuestionQONode((p.mouseX - p.translateX) / p.zoom, (p.mouseY - p.translateY) / p.zoom, 100, 80));
							break;

						case p.NodeType.QRNode:
							p.nodeArray.push(new SGQuestionQRNode((p.mouseX - p.translateX) / p.zoom, (p.mouseY - p.translateY) / p.zoom, 100, 80));
							break;

						default:
							logger.error(`script_serious_game | Type de node inconnu`);
					}
					SetProgressBar(myP5.generateJson());
					p.hoveringNode = false;
					p.switchButtonState(p.CursorState.SELECTION);
					p.getCursor();
				}
			}

			/** Mode duplication de node */
			if (p.isDuplicating) {
				p.nodeArray.forEach(n => {
					if (n.isMouseHover() || n.isMouseHoveringDots()) {
						let newNode = n.clone();
						newNode.x += 10;
						newNode.y += 10;

						p.nodeArray.push(newNode);
						return;
					}
				});
			}

			/** Si clique sur aucun node à l'intérieur du canvas, on enlève l'état clicked des node */
			for (i = 0; i < p.nodeArray.length; ++i) {
				if (!p.nodeArray[i].isMouseHover() && p.hoveringCanvas)
					p.nodeArray[i].clicked = false;
			}
		}
		if (p.mouseButton === p.RIGHT) {
			/** Crée un lien dynamique depuis l'exitDot qui est survolé par la souris
			 * Ce lien sera attaché à la souris jusqu'à ce qu'on relâche le clic droit sur un entryDot où annule la création de lien
			 */
			if (!p.creatingLink) {
				p.nodeArray.forEach(n => n.createLink(function (link) {
					let exitDotAlreadyLinked = false;
					p.linkArray.forEach(l => { if (l.node1Dot === link.node1Dot) exitDotAlreadyLinked = true; });
					if (!exitDotAlreadyLinked) {
						p.creatingLink = true;
						p.linkArray.push(link);
						SetProgressBar(myP5.generateJson());
					}
				}));
			}
		}
	}

	/** Fonction appelée lors d'un relachement d'un bouton de la souris */
	p.mouseReleased = function () {
		/** Enlève l'effet de traîne sur les nodes */
		p.nodeArray.forEach(n => n.released());

		if (p.mouseButton === p.RIGHT || (p.mouseButton === p.LEFT && p.creatingLink)) {
			/** Arrête les liens dynamiques si la souris survole un node lors d'un clic gauche|droit */
			p.linkArray.forEach(function (l) {
				if (l.type === 'dynamic') {
					p.nodeArray.forEach(function (n) {
						if (n.isMouseHoveringDots() && !n.isMouseHoveringExitDots()) {
							l.node2 = n;
							l.node2Dot = n.getDotHovering();
							l.type = 'static';
							//p.creatingLink = false;
							p.getCursor();
						}
					});
				}
			});
		}
	}

	/** Fonction appelée lors d'un scroll de la souris */
	p.mouseWheel = function (event) {
		if (p.hoveringCanvas) {
			p.zoom += (event.delta / 500);
			if (p.zoom <= 0) p.zoom = 0.1;
		}
	}

	/** Fonction appelée lorsqu'une touche est appuyée */
	p.keyPressed = function () {

		/** Appuie sur la touche "Suppr" */
		if (p.keyCode === p.DELETE) {

			/** Si un node est survolé par la souris, on le supprime ainsi que tous les liens auxquels il est relié */
			for (let i = 0; i < p.nodeArray.length; i++) {
				if (p.nodeArray[i].isMouseHover()) {
					p.linkArray = p.linkArray.filter(function (l) {
						return !(l.node1 === p.nodeArray[i] || l.node2 === p.nodeArray[i]);
					});
					p.nodeArray.splice(i, 1);
					SetProgressBar(myP5.generateJson());
					return;
				}
			}
		}
	}

	/** Fonction qui redimensionne le diagramme selon la taille de la fenêtre */
	p.windowResized = function () {
		p.parentDiv = document.getElementById("seriousGameDiagram").getBoundingClientRect();
		p.resizeCanvas(p.parentDiv.width, p.parentDiv.height);
	}

	/** Transforme le curseur selon l'état activé */
	p.getCursor = function () {
		if (p.isErasing) {
			p.cursor("not-allowed");
		} else if (p.creatingLink) {
			p.cursor('e-resize');
		} else if (p.hoveringNode) {
			p.cursor(p.CROSS);
		} else if (p.isDuplicating) {
			p.cursor('copy');
		} else if (p.isMovingDiagram) {
			p.cursor(p.MOVE);
		} else {
			p.cursor(p.ARROW);
		}
	}

	/** Change la couleur des boutons selon leur état associé  */
	p.highlightButtons = function () {

		// Bouton pour effacer
		if (p.isErasing) {
			p.buttonEraser.addClass('bg-success');
		} else {
			p.buttonEraser.removeClass('bg-success');
		}

		// Boutons pour la sélection ou déplacement avec la souris
		if (p.isMovingDiagram) {
			p.buttonMouseSelection.removeClass('bg-success');
			p.buttonMouseDisplacement.addClass('bg-success');
		} else {
			p.buttonMouseSelection.addClass('bg-success');
			p.buttonMouseDisplacement.removeClass('bg-success');
		}

		// Boutons pour créer les questions et les textes
		if (p.hoveringNode) {
			switch (p.creatingNodeType) {
				case p.NodeType.TextNode:
					p.buttonCreateQuestionQCM.removeClass('bg-success');
					p.buttonCreateQuestionQO.removeClass('bg-success');
					p.buttonCreateQuestionQR.removeClass('bg-success');
					p.buttonCreateTextNode.addClass('bg-success');
					break;

				case p.NodeType.QCMNode:
					p.buttonCreateQuestionQCM.addClass('bg-success');
					p.buttonCreateQuestionQO.removeClass('bg-success');
					p.buttonCreateQuestionQR.removeClass('bg-success');
					p.buttonCreateTextNode.removeClass('bg-success');
					break;

				case p.NodeType.QONode:
					p.buttonCreateQuestionQCM.removeClass('bg-success');
					p.buttonCreateQuestionQO.addClass('bg-success');
					p.buttonCreateQuestionQR.removeClass('bg-success');
					p.buttonCreateTextNode.removeClass('bg-success');
					break;

				case p.NodeType.QRNode:
					p.buttonCreateQuestionQCM.removeClass('bg-success');
					p.buttonCreateQuestionQO.removeClass('bg-success');
					p.buttonCreateQuestionQR.addClass('bg-success');
					p.buttonCreateTextNode.removeClass('bg-success');
					break;

				default:
					logger.error(`script_serious_game | Type de node inconnu`);
			}
		} else {
			p.buttonCreateQuestionQCM.removeClass('bg-success');
			p.buttonCreateQuestionQO.removeClass('bg-success');
			p.buttonCreateQuestionQR.removeClass('bg-success');
			p.buttonCreateTextNode.removeClass('bg-success');
		}

		// Bouton pour créer les liens
		if (p.creatingLink) {
			p.buttonCreateLink.addClass('bg-success');
		} else {
			p.buttonCreateLink.removeClass('bg-success');
		}

		// Bouton pour dupliquer un node
		if (p.isDuplicating) {
			p.buttonDuplicateNode.addClass('bg-success');
		} else {
			p.buttonDuplicateNode.removeClass('bg-success');
		}
	}

	/**
	 * Désactiver les actions de la souris différentes de celle du state
	 * @param {p.CursorState} state qui est activé, tous les autres seront désactivés
	 */
	p.switchButtonState = function (state) {
		switch (state) {
			case p.CursorState.CREATENODE:
				p.creatingLink = false;
				p.isErasing = false;
				p.isMovingDiagram = false;
				p.isDuplicating = false;
				break;
			case p.CursorState.CREATELINK:
				p.hoveringNode = false;
				p.isErasing = false;
				p.isMovingDiagram = false;
				p.isDuplicating = false;
				break;
			case p.CursorState.SELECTION:
				p.hoveringNode = false;
				p.isErasing = false;
				p.creatingLink = false;
				p.isDuplicating = false;
				break;
			case p.CursorState.DISPLACEMENT:
				p.hoveringNode = false;
				p.isErasing = false;
				p.creatingLink = false;
				p.isDuplicating = false;
				break;
			case p.CursorState.ERASING:
				p.hoveringNode = false;
				p.creatingLink = false;
				p.isMovingDiagram = false;
				p.isDuplicating = false;
				break;
			case p.CursorState.DUPLICATING:
				p.isErasing = false;
				p.hoveringNode = false;
				p.creatingLink = false;
				p.isMovingDiagram = false;
				break;
			default:
				logger.error('Serious Game | unknown button state ' + state);
		}
	}

	/**
	 * Une fonction qui retourne le projet de SG contenant le JSON en utilisant les p.nodeArray et p.linkArray
	 * @returns {ProjetSeriousGame}
	*/
	p.generateJson = function () {
		let questionNodes = [];
		let textNodes = [];
		let textNodesJson = [];
		let questionNodesJson = [];

		// mettre les questionNodes dans un array et les textNodes dans un autre
		for (i = 0; i < p.nodeArray.length; ++i) {
			if (p.nodeArray[i] instanceof SGTextNode) {
				textNodes.push(p.nodeArray[i]);
			} else {
				questionNodes.push(p.nodeArray[i]);
			}
		}

		// traitement de textNodes
		for (i = 0; i < textNodes.length; ++i) {
			let name = textNodes[i].name;
			let text = textNodes[i].description;
			let exitLink = "";
			for (z = 0; z < p.linkArray.length; ++z) {
				if (textNodes[i].exitDots[0].getPositionX() == p.linkArray[z].node1Dot.getPositionX() && textNodes[i].exitDots[0].getPositionY() == p.linkArray[z].node1Dot.getPositionY()) {
					next_node = p.linkArray[z].node2;
					if (next_node instanceof SGQuestionQCMNode)
						exitLink = p.linkArray[z].node2.name;
					else
						exitLink = p.linkArray[z].node2.name;
					break;
				}
			}
			let textObject;
			// On regarde s'il s'agit d'un audio
			if (text.substring(text.length - 3, text.length) == "mp3")
				textObject = {
					type: "M",
					name: text,
					url: textNodes[i].url
				}
			else {
				textObject = {
					type: "T",
					txt: text
				}
			}
			let textNode = new TextNode(name, textObject, exitLink);
			textNodesJson.push(textNode);
		}

		// traitement de questionNodes
		for (i = 0; i < questionNodes.length; ++i) {
			let name = questionNodes[i].name;
			let textQuestion = questionNodes[i].question;

			if (questionNodes[i] instanceof SGQuestionQCMNode) {
				typeNode = 'M';
			} else if (questionNodes[i] instanceof SGQuestionQRNode) {
				typeNode = 'Q';
			} else {
				typeNode = 'O';
			}

			let reponses = [];

			for (j = 0; j < questionNodes[i].answers.length; ++j) {

				let exitLink = "";
				for (z = 0; z < p.linkArray.length; ++z) {
					if (questionNodes[i].exitDots[j].getPositionX() == p.linkArray[z].node1Dot.getPositionX() && questionNodes[i].exitDots[j].getPositionY() == p.linkArray[z].node1Dot.getPositionY()) {
						next_node = p.linkArray[z].node2;
						exitLink = next_node.name;
					}
				}

				let reponse;
				if (typeNode === 'Q') {
					reponse = {
						txt: questionNodes[i].answers[j].id,
						ext: exitLink
					}
				} else {
					reponse = {
						txt: questionNodes[i].answers[j],
						ext: exitLink
					}
				}

				reponses.push(reponse);
			}

			let textQuestionObject;
			// On regarde s'il s'agit d'un audio
			if (textQuestion.substring(textQuestion.length - 3, textQuestion.length) == "mp3")
				textQuestionObject = {
					type: "M",
					name: textQuestion,
					url: questionNodes[i].url
				}
			else {
				textQuestionObject = {
					type: "T",
					txt: textQuestion
				}
			}

			let questionNode = new QuestionNode(name, typeNode, textQuestionObject, reponses);
			questionNodesJson.push(questionNode);
		}

		projet = new ProjetSeriousGame(textNodesJson, questionNodesJson);
		return projet;
	}

	/** Fonction pour vérifier que l'histoire est correcte et ques tous les champs sont remplis*/
	p.checkCorrectGeneration = function () {
		let textNodes = [];
		let questionNodes = [];

		let errorNodes = [];

		// Boucle pour mettre les questionNodes dans un array et les textNodes dans un autre
		for (i = 0; i < p.nodeArray.length; ++i) {
			if (p.nodeArray[i] instanceof SGTextNode) {
				// On récupère les noeuds textes avec des champs vides
				if (p.nodeArray[i].name == "" || p.nodeArray[i].description == "") {
					p.nodeArray[i].containError = true;
					errorNodes.push(p.nodeArray[i]);
				}
				else {
					textNodes.push(p.nodeArray[i]);
					p.nodeArray[i].containError = false;
				}
			} else {
				// On récupère les noeuds questions avec des champs vides
				if (p.nodeArray[i].name == "" || p.nodeArray[i].question == "") {
					p.nodeArray[i].containError = true;
					errorNodes.push(p.nodeArray[i]);
				}
				else {
					questionNodes.push(p.nodeArray[i]);
					p.nodeArray[i].containError = false;
				}
				// Test si aucune réponse
				if (p.nodeArray[i].answers.length === 0 && !p.nodeArray[i].containError) {
					p.nodeArray[i].containError = true;
					errorNodes.push(p.nodeArray[i]);

				}
				// Test si réponses vides
				for (j = 0; j < p.nodeArray[i].answers.length; ++j) {
					if (typeof p.nodeArray[i].answers[j] === "string") {
						if (p.nodeArray[i].answers[j] == "" && !p.nodeArray[i].containError) {
							p.nodeArray[i].containError = true;
							errorNodes.push(p.nodeArray[i]);
						}
					} else {
						if ((p.nodeArray[i].answers[j].name == "" || p.nodeArray[i].answers[j].id == "") && !p.nodeArray[i].containError) {
							p.nodeArray[i].containError = true;
							errorNodes.push(p.nodeArray[i]);
						}
					}
				}
			}
		}

		if (errorNodes.length > 0) {
			messageInfos("Attention un ou plusieurs noeuds possèdent des champs vides", "danger");
			logger.error("Attention un ou plusieurs noeuds possèdent des champs vides");
			return false;
		}

		//---- Gestion du noeud de départ ----//

		let nbStartNode = 0; // Nombre de noeud d'introduction

		// On regarde s'il y a un noeud texte qui est un noeud de départ
		for (i = 0; i < textNodes.length; ++i) {
			entryDot = textNodes[i].entryDot;
			let x = entryDot.getPositionX();
			let y = entryDot.getPositionY();
			let found = false; // Booléen pour savoir si on a trouvé un lien avec le noeud courant

			for (j = 0; j < p.linkArray.length; ++j) {
				let linkX = p.linkArray[j].node2Dot.getPositionX();
				let linkY = p.linkArray[j].node2Dot.getPositionY();

				if (linkX == x && linkY == y) {
					found = true;
				}
			}

			if (!found) {
				++nbStartNode;
			}
		}

		// On regarde s'il y a un noeud question qui est un noeud de départ
		for (i = 0; i < questionNodes.length; ++i) {
			entryDot = questionNodes[i].entryDot;
			let x = entryDot.getPositionX();
			let y = entryDot.getPositionY();
			let found = false; // Booléen pour savoir si on a trouvé un lien avec le noeud courant

			for (j = 0; j < p.linkArray.length; ++j) {
				let linkX = p.linkArray[j].node2Dot.getPositionX();
				let linkY = p.linkArray[j].node2Dot.getPositionY();

				if (linkX == x && linkY == y) {
					found = true;
				}
			}

			if (!found) {
				++nbStartNode;
			}
		}

		// Il ne peut y avoir qu'un seul noeud de départ
		if (nbStartNode == 0) {
			messageInfos("Attention aucun noeud de départ n'est présent", "danger");
			logger.error("Attention aucun noeud de départ n'est présent");
			return false;
		}
		else if (nbStartNode > 1) {
			messageInfos("Attention plusieurs noeuds de départ sont présents", "danger");
			logger.error("Attention plusieurs noeuds de départ sont présents");
			return false;
		}

		//---- Gestion du noeud de fin ----//

		let nbEndNode = 0; // Nombre de noeud d'introduction

		// On regarde s'il y a un noeud texte qui est un noeud de fin
		for (i = 0; i < textNodes.length; ++i) {
			exitDot = textNodes[i].exitDots[0];
			let x = exitDot.getPositionX();
			let y = exitDot.getPositionY();
			let found = false; // Booléen pour savoir si on a trouvé un lien avec le noeud courant

			for (j = 0; j < p.linkArray.length; ++j) {
				let linkX = p.linkArray[j].node1Dot.getPositionX();
				let linkY = p.linkArray[j].node1Dot.getPositionY();

				if (linkX == x && linkY == y) {
					found = true;
				}
			}

			if (!found)
				++nbEndNode;
		}

		// On regarde s'il y a un noeud question qui est un noeud de fin
		for (i = 0; i < questionNodes.length; ++i) {
			exitDot = questionNodes[i].exitDots[0];
			let x = exitDot.getPositionX();
			let y = exitDot.getPositionY();
			let found = false; // Booléen pour savoir si on a trouvé un lien avec le noeud courant

			for (j = 0; j < p.linkArray.length; ++j) {
				let linkX = p.linkArray[j].node1Dot.getPositionX();
				let linkY = p.linkArray[j].node1Dot.getPositionY();

				if (linkX == x && linkY == y) {
					found = true;
				}
			}

			if (!found) {
				messageInfos("Attention l'histoire se finit par une question", "danger");
				logger.error("Attention l'histoire se finit par une question");
				return false;
			}
		}

		// Il ne peut y avoir qu'un seul noeud de fin
		if (nbEndNode == 0) {
			messageInfos("Attention aucun noeud de fin n'est présent", "danger");
			logger.error("Attention aucun noeud de fin n'est présent");
			return false;
		}
		else if (nbEndNode > 1) {
			messageInfos("Attention plusieurs noeuds de fin sont présents", "danger");
			logger.error("Attention plusieurs noeuds de fin sont présents");
			return false;
		}

		//---- Gestion des réponses ----//

		for (i = 0; i < questionNodes.length; ++i) {
			for (j = 0; j < questionNodes[i].exitDots.length; ++j) {
				let found = false; // Booléen pour savoir si on a trouvé un lien avec le noeud courant
				let x = questionNodes[i].exitDots[j].getPositionX();
				let y = questionNodes[i].exitDots[j].getPositionY();

				for (z = 0; z < p.linkArray.length; ++z) {
					let linkX = p.linkArray[z].node1Dot.getPositionX();
					let linkY = p.linkArray[z].node1Dot.getPositionY();

					if (linkX == x && linkY == y)
						found = true
				}

				if (!found) {
					messageInfos("Attention une réponse n'est pas relié à un noeud", "danger");
					logger.error("Attention une réponse n'est pas relié à un noeud");
					return false;
				}
			}
		}

		//---- Gestion des noeuds avec des noms identiques ----//

		for (i = 0; i < textNodes.length; ++i) {
			let name = textNodes[i].name;
			let found = false;

			for (j = 0; j < textNodes.length; ++j) {
				if (j != i) {
					if (name == textNodes[j].name) {
						if (!found)
							found = true;
						textNodes[j].containError = true;
					}
					else
						textNodes[j].containError = false;
				}
			}

			for (j = 0; j < questionNodes.length; ++j) {
				if (j != i) {
					if (name == questionNodes[j].name) {
						if (!found)
							found = true;
						questionNodes[j].containError = true;
					}
					else
						questionNodes[j].containError = false;
				}
			}

			if (found) {
				textNodes[i].containError = true;
				messageInfos("Attention des noeuds possèdent le même nom", "danger");
				logger.error("Attention des noeuds possèdent le même nom");
				return false;
			}
		}

		for (i = 0; i < questionNodes.length; ++i) {
			let name = questionNodes[i].name;
			let found = false;

			for (j = 0; j < textNodes.length; ++j) {
				if (j != i) {
					if (name == textNodes[j].name) {
						if (!found)
							found = true;
						textNodes[j].containError = true;
					}
					else
						textNodes[j].containError = false;
				}
			}

			for (j = 0; j < questionNodes.length; ++j) {
				if (j != i) {
					if (name == questionNodes[j].name) {
						if (!found)
							found = true;
						questionNodes[j].containError = true;
					}
					else
						questionNodes[j].containError = false;
				}
			}

			if (found) {
				questionNodes[i].containError = true;
				messageInfos("Attention des noeuds possèdent le même nom", "danger");
				logger.error("Attention des noeuds possèdent le même nom");
				return false;
			}
		}

		return true;
	}

	/** Fonction pour créer les métadonnées qui serviront à reconstruire le Serious Game */
	p.generateMetadata = function () {
		// Liste de tri des nodes
		let questionNodes = [];
		let textNodes = [];

		// Liste des nodes convertis en JSON pour les metadonnées
		let questionNodesJSON = [];
		let textNodesJSON = [];

		// Tri des questionNode et des textNodes
		for (let i = 0; i < p.nodeArray.length; ++i) {
			if (p.nodeArray[i] instanceof SGTextNode) {
				textNodes.push(p.nodeArray[i]);
			} else {
				questionNodes.push(p.nodeArray[i]);
			}
		}

		// Traitement de textNodes
		for (let i = 0; i < textNodes.length; ++i) {
			// Le noeud relier à la sorti du textNode
			let exitLink = "";

			for (let z = 0; z < p.linkArray.length; ++z) {
				if (textNodes[i].exitDots[0].getPositionX() == p.linkArray[z].node1Dot.getPositionX() && textNodes[i].exitDots[0].getPositionY() == p.linkArray[z].node1Dot.getPositionY()) {
					next_node = p.linkArray[z].node2;
					exitLink = next_node.name;
					break;
				}
			}

			// Transformation du textNode
			let textNode = {
				name: textNodes[i].name,
				txt: textNodes[i].description,
				url: textNodes[i].url,
				x: textNodes[i].x,
				y: textNodes[i].y,
				ext: exitLink
			}
			textNodesJSON.push(textNode);
		}

		// Traitement de questionNodes
		for (i = 0; i < questionNodes.length; ++i) {
			let listeReponses = [];

			for (j = 0; j < questionNodes[i].answers.length; ++j) {
				let text = questionNodes[i].answers[j];
				let exitLink = "";
				for (z = 0; z < p.linkArray.length; ++z) {
					if (questionNodes[i].exitDots[j].getPositionX() == p.linkArray[z].node1Dot.getPositionX() && questionNodes[i].exitDots[j].getPositionY() == p.linkArray[z].node1Dot.getPositionY()) {
						next_node = p.linkArray[z].node2;
					}
					exitLink = next_node.name;
				}
				let reponse = {
					txt: text,
					ext: exitLink
				}
				listeReponses.push(reponse);
			}

			let typeNode = '';
			if (questionNodes[i] instanceof SGQuestionQCMNode) {
				typeNode = 'M';
			} else if (questionNodes[i] instanceof SGQuestionQRNode) {
				typeNode = 'Q';
			} else {
				typeNode = 'O';
			}

			let questionNode = {
				name: questionNodes[i].name,
				type: typeNode,
				txt: questionNodes[i].question,
				url: questionNodes[i].url,
				rep: listeReponses,
				x: questionNodes[i].x,
				y: questionNodes[i].y
			};

			questionNodesJSON.push(questionNode);
		}

		let qrMetadata = {
			type: 'SeriousGame',
			text_nodes: textNodesJSON,
			question_nodes: questionNodesJSON
		};

		logger.info(`SeriousGame | Metadonnée générées : ${JSON.stringify(qrMetadata)}`);

		return qrMetadata;
	}
}

// Test pour savoir s'il existait déjà un sketch myP5 du SeriousGame
if (typeof myP5 === 'undefined') {
	var myP5 = new p5(sketch);

	SetProgressBar(myP5.generateJson());
} else {
	// On récupère les données de l'ancien sketch
	let metadata = { qrcodeMetaData: myP5.generateMetadata() };

	// On détruit l'ancien sketch
	myP5.remove();

	// On crée un nouveau sketch
	myP5 = new p5(sketch);

	// On reconstruit l'ancien sketch sur le nouveau
	drawQRCodeSeriousGameEnigma(metadata);

	SetProgressBar(myP5.generateJson());
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
							$('#closeModalListeMusic').on('click', e => {
								$('#musicUrl').val('');
								$('#listeMusic').find('.errorLoader').remove();
							});
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
				logger.info(`script_seriousgame.getMusicFromUrl | Début de téléchargement de l'audio`);
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

function supprimerChampSon() {
	let id_input = "";
	if (myP5.lastNodeClickedType == "question") {
		id_input = "input_node_question";
	}
	else {
		if (myP5.lastNodeClickedType == "text") {
			id_input = "input_node_description";
		}
	}
	document.getElementById(id_input).value = "";
	document.getElementById(id_input).name = "";
	$("#" + id_input).removeAttr("disabled")
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
	$("#" + id_input).attr("disabled", "true");
}

function showError(modal, errorMsg, message = "Veuillez coller un lien de fichier téléchargeable. Reportez vous à la rubrique Info pour plus d'informations.") {
	console.trace('error ');
	$(modal).find('.loader').remove();
	$(errorMsg).text(message);
	$(errorMsg).css('color', '#f35b6a');
	$(errorMsg).addClass('errorLoader');
	$(modal).prepend(errorMsg); // add error message
}

//fonction appeler pour réinitialiser le sérious game
function deleteGame() {
	myP5.remove();
	myP5 = new p5(sketch);
	logger.info("Réinitialisation de la page Sérious Game");
}

$("#generateSG").on('click', function () {
	let qr = myP5.generateJson();

	// Ajout métadonnées
	let qrMetaData = myP5.generateMetadata();

	qr.setQrCodeMetadata(qrMetaData);

	facade = new FacadeController();
	if (myP5.checkCorrectGeneration()) {
		facade.genererQRCode(document.getElementById("qrView"), qr);
		logger.info(`Génération de QR Code de SeriousGame ${JSON.stringify(projet.qrcode)}`);
	}
});

/** Permet de sauvegarder l'image du QR code sur l'ordinateur */
$("#saveQRCode").on('click', function () {

	/** Ouvre une fenêtre de dialogue pour que l'utilisateur choisisse où sauvegarder son fichier ainsi que le nom du fichier à sauvegarder
	 * Cela retourne le path du fichier
	 */
	let dir_path = dialog.showSaveDialogSync({
		title: 'Enregistrer une image', properties: ['openFile'], filters: [
			{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] },
			{ name: 'All Files', extensions: ['*'] }
		]
	});
	logger.info(`Serious Game | Le serious Game sera sauvegardé à l'emplacement suivant : ${dir_path}.jpeg`);

	if (dir_path !== undefined) {

		let img = document.querySelector('#qrView img');
		let imgData;

		if (img != null) {
			imgData = img.src.replace(/^data:image\/\w+;base64,/, "");
			let buf = Buffer.from(imgData, 'base64');

			dir_path = dir_path.replace('.jpeg', '');

			fs.writeFile(dir_path + '.jpeg', buf, 'base64', function (err) {
				if (err) {
					logger.error(`Serious Game | Problème sauvegarde de l'image du QR code : ${err}`);
				} else {
					logger.info(`Serious Game | Sauvegarde de l'image réussi : ${dir_path}.jpeg`);
				}
			})
		}
	}
	logger.info("Exportation du QRCode");
});

//pour ouvrir la page info.html quand on clique sur le bouton info du haut
$("#infos-serious-game").on('click', function () {
	remoteElectron.getGlobal('sharedObject').ongletAideActif = 'seriousGame'
	$("#charger-page").load(getNormalizePath(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/aide/info.html")));
});

// Cacher les boutons pour lire les audio
$().ready(function () {
	$("#play-sound-div").hide();
});

/**
 * Update de la bar de progression selon la taille du ProjetSeriousGame passé en paramètre
 * @param {ProjetSeriousGame} projetSeriousGame
 */
function SetProgressBar(projetSeriousGame) {
	//progress bar gestion
	let total = 0;
	let nombreCaratereMAX = 2500;

	let gzippedQR;
	if (projetSeriousGame.getDataString().length.length > 120) {
		JsonCompressor.compress(projetSeriousGame.getDataString(), (e) => gzippedQR = e[0].toString('base64'), []);
		total += gzippedQR.length
	} else {
		total += projetSeriousGame.getDataString().length
	}

	let totalSeted = Math.trunc((total / nombreCaratereMAX) * 10000) / 100;
	//mise ajour des données sur le progress bar
	$("#progressbarId").attr('aria-valuenow', totalSeted);
	$("#progressbarId").attr("style", "width:" + totalSeted + "%");
	$("#progressbarId").text(totalSeted + "%");
}

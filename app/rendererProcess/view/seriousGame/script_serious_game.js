require(root + "/rendererProcess/utils/p5.min.js");
var sketch = function (p) {
	p.parentDiv = document.getElementById("seriousGameDiagram").getBoundingClientRect();
	p.zoom = 1;
	p.nodeArray = [];
	p.linkArray = [];
	p.buttonCreateQuestion;
	p.translateX = 0; p.diagramOffsetX = 0;
	p.translateY = 0; p.diagramOffsetY = 0;
	p.initX = 150;
	p.initY = 0;
	p.seriousGameCanvas;

	/* P5Js part */
	/** Setup of the canvas */
	p.setup = function() {
		p.seriousGameCanvas = p.createCanvas(p.parentDiv.width, p.parentDiv.height);
		p.seriousGameCanvas.parent("seriousGameDiagram");
		p.frameRate(30);

		p.translateX = p.initX;
		p.translateY = p.initY;

		/** First & Second Node integration */
		let node1 = new SGNode(100, 100, 100, 80);
		let node2 = new SGNode(200, 200, 100, 80);
		p.nodeArray.push(node1);
		p.nodeArray.push(node2);
		/** Link creation between the to Node */
		let link1 = new SGLink(node1, node2);
		link1.type = 'static';
		p.linkArray.push(link1);

		/** Declaration of Button to create Node */
		p.buttonCreateQuestion = p.createButton('Create Node');
		p.buttonCreateQuestion.position(20, 150);
		p.buttonCreateQuestion.mousePressed(p.createNode);
		p.buttonCreateQuestion.parent("seriousGameDiagram");
	}

	/** Event loop */
	p.draw = function() {
		p.background("#DAE4E4");
		/*console.log(`Mouse x ${mouseX} y ${mouseY}`);
		console.log(`Zoom ${p.zoom}`);*/

		p.push();
		p.moveDiagram();
		console.log(`translate x ${p.translateX} y ${p.translateY}`);
		p.translate(p.translateX, p.translateY);
		p.scale(p.zoom);
		p.nodeArray.forEach(n => n.update());
		p.linkArray.forEach(l => l.display());
		p.nodeArray.forEach(n => n.display());
		p.pop();
		p.drawPalette();
	}

	p.drawPalette = function() {
		p.push();
		p.fill(200);
		p.rect(0, 0, 150, p.parentDiv.height);
		p.fill(0);
		p.text("Palette", 55, 20);
		p.pop();
	}

	p.createNode = function() {
		const x1 = (p.parentDiv.width / 2) / p.zoom - p.translateX / p.zoom;
		const x2 = (p.parentDiv.height / 2) / p.zoom - p.translateY / p.zoom;
		let newNode = new SGNode(x1, x2, 100, 80);
		p.nodeArray.push(newNode);
	}

	p.moveDiagram = function() {
		let mouseIsOnNodes = p.nodeArray.filter(n => n.isMouseHover() || n.dragging);
		let mouseIsOnLinks = p.linkArray.filter(l => l.isMouseHover());
		if (mouseIsOnNodes.length + mouseIsOnLinks.length === 0) {
			if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
				p.translateX = p.initX + (p.mouseX - p.diagramOffsetX);
				p.translateY = p.initY + (p.mouseY - p.diagramOffsetY);
			}
		}
	}

	p.mousePressed = function() {

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
		}
		if (p.mouseButton === p.RIGHT) {
			/** Create Link from node with Mouse Hovering 
			 * The link will follow the mouse until the button is released on an
			 */
			p.nodeArray.forEach(n => n.createLink(function (link) {
				p.linkArray.push(link);
			}));
		}
	}

	p.mouseReleased = function() {
		/** Release the drag effect on nodes */
		p.nodeArray.forEach(n => n.released());

		if (p.mouseButton === p.RIGHT) {
			/** Stop the dynamic link if the mouse is hovering a node */
			p.linkArray.forEach(function (l) {
				if (l.type === 'dynamic') {
					p.nodeArray.forEach(function (n) {
						if (n.isMouseHover()) {
							l.node2 = n;
							l.type = 'static';
						}
					});
				}
			});
		}
	}

	p.mouseWheel = function(event) {
		p.zoom += (event.delta / 500);
		if (p.zoom <= 0) p.zoom = 0.1;
		console.log(`Zoom ${p.zoom}`);
	}

	p.doubleClicked = function(mouseEvent) {

		if (mouseEvent.button === 0) {

			/** If a node is double left-clicked, delete him and all the link attach to him  */
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
}

if(typeof myP5 === 'undefined') {
	var myP5 = new p5(sketch);
} else {
	myP5.remove();
	myP5 = new p5(sketch);
}
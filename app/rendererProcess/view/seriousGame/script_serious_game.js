
try{
 require(root + "/rendererProcess/utils/p5.min.js");
} catch(err) {
	logger.info('problme p5');
}

var parentDiv = document.getElementById("seriousGameDiagram").getBoundingClientRect();
var zoom = 1;
var nodeArray = [];
var linkArray = [];
var buttonCreateQuestion;
var translateX = 0; var diagramOffsetX = 0;
var translateY = 0; var diagramOffsetY = 0;
var initX = 150;
var initY = 0;

/* P5Js part */
/** Setup of the canvas */
function setup() {
	var seriousGameCanvas = createCanvas(parentDiv.width, parentDiv.height);
	seriousGameCanvas.parent("seriousGameDiagram");
	frameRate(30);

	translateX = initX;
	translateY = initY;

	/** First & Second Node integration */
	let node1 = new SGNode(100, 100, 100, 80);
	let node2 = new SGNode(200, 200, 100, 80);
	nodeArray.push(node1);
	nodeArray.push(node2);
	/** Link creation between the to Node */
	let link1 = new SGLink(node1, node2);
	link1.type = 'static';
	linkArray.push(link1);

	/** Declaration of Button to create Node */
	buttonCreateQuestion = createButton('Create Node');
	buttonCreateQuestion.position(20, 150);
	buttonCreateQuestion.mousePressed(createNode);
	buttonCreateQuestion.parent("seriousGameDiagram");
}

/** Event loop */
function draw() {
	background("#DAE4E4");
	console.log(`Mouse x ${mouseX} y ${mouseY}`);
	console.log(`Zoom ${zoom}`);

	push();
	moveDiagram();
	console.log(`translate x ${translateX} y ${translateY}`);
	translate(translateX, translateY);
	scale(zoom);
	nodeArray.forEach(n => n.update());
	linkArray.forEach(l => l.display());
	nodeArray.forEach(n => n.display());
	pop();
	drawPalette();
}

function drawPalette() {
	push();
	fill(200);
	rect(0, 0, 150, parentDiv.height);
	fill(0);
	text("Palette", 55, 20);
	pop();
}

function createNode() {
	const x1 = (parentDiv.width / 2) / zoom  - translateX / zoom;
	const x2 = (parentDiv.height / 2) / zoom - translateY / zoom;
	let newNode = new SGNode(x1, x2, 100, 80);
	nodeArray.push(newNode);
}

function moveDiagram() {
	let mouseIsOnNodes = nodeArray.filter(n => n.isMouseHover() || n.dragging);
	let mouseIsOnLinks = linkArray.filter(l => l.isMouseHover());
	if(mouseIsOnNodes.length + mouseIsOnLinks.length === 0) {
		if(mouseIsPressed && mouseButton === LEFT) {
			translateX = initX + (mouseX - diagramOffsetX) ;
			translateY = initY + (mouseY - diagramOffsetY) ;
		}
	}
}

function mousePressed() {

	if (mouseButton === LEFT) {
		initX = translateX;
		initY = translateY;
		diagramOffsetX = mouseX;
		diagramOffsetY = mouseY;
		/** Search first node of the array which hovered by the mouse and push it to last position to become the last drawn and be dragged
			 * Will also trigger the dragging of the node
			*/
		for (let n of nodeArray) {
			if (n.pressed()) {
				nodeArray = nodeArray.filter(removeNode => removeNode != n);
				nodeArray.push(n);
				return;
			}
		}
		/** If pressed a link, delete this link */
		for (let i = 0; i < linkArray.length; i++) {
			if (linkArray[i].isMouseHover()) {
				linkArray.splice(i, 1);
				return;
			}
		}
	}
	if (mouseButton === RIGHT) {
		/** Create Link from node with Mouse Hovering 
		 * The link will follow the mouse until the button is released on an
		 */
		nodeArray.forEach(n => n.createLink(function (link) {
			linkArray.push(link);
		}));
	}
}

function mouseReleased() {
	/** Release the drag effect on nodes */
	nodeArray.forEach(n => n.released());

	if (mouseButton === RIGHT) {
		/** Stop the dynamic link if the mouse is hovering a node */
		linkArray.forEach(function (l) {
			if (l.type === 'dynamic') {
				nodeArray.forEach(function (n) {
					if (n.isMouseHover()) {
						l.node2 = n;
						l.type = 'static';
					}
				});
			}
		});
	}
}

function mouseWheel(event) {
	zoom += (event.delta / 500);
	if (zoom <= 0) zoom = 0.1;
	console.log(`Zoom ${zoom}`);
}

function doubleClicked(mouseEvent) {

	if (mouseEvent.button === 0) {

		/** If a node is double left-clicked, delete him and all the link attach to him  */
		for (let i = 0; i < nodeArray.length; i++) {
			if (nodeArray[i].isMouseHover()) {

				linkArray = linkArray.filter(function (l) {
					return !(l.node1 === nodeArray[i] || l.node2 === nodeArray[i]);
				});
				nodeArray.splice(i, 1);
				return;
			}
		}
	}

}
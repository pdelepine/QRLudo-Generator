var parentDiv = document.getElementById("seriousGameDiagram").getBoundingClientRect();

let zoom = 1;
let nodeArray = [];
let linkArray = [];
let buttonCreateQuestion;
/* P5Js part */
/** Setup of the canvas */
function setup() {
	var seriousGameCanvas = createCanvas(parentDiv.width, parentDiv.height);
	seriousGameCanvas.parent("seriousGameDiagram");
	frameRate(30);

	/** First & Second Node integration */
	let node1 = new SGNode(100, 100, 100, 80);
	let node2 = new SGNode(200, 200, 100, 80);
	nodeArray.push(node1);
	nodeArray.push(node2);
	/** Link creation between the to Node */
	let link1 = new SGLink(node1, node2);
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
	palette();
	scale(zoom);

	nodeArray.forEach(n => n.update());

	linkArray.forEach(l => l.display());
	nodeArray.forEach(n => n.display());
}

function palette() {
	push();
	fill(200);
	rect(0, 0, 150, parentDiv.height);
	fill(0);
	text("Palette", 55, 20);
	pop();
}

function createNode() {
	let newNode = new SGNode(parentDiv.width / 2, parentDiv.height / 2, 100, 80);
	nodeArray.push(newNode);
}

function mousePressed() {
	if (mouseButton === LEFT) {
		for(let n of nodeArray) {
			/** The first node of the array is selected and push to last position to become the last drawn */
			if(n.pressed()) {
				nodeArray = nodeArray.filter( removeNode => removeNode != n );
				nodeArray.push(n);
				return;
			}
		}
	}
}

function mouseReleased() {
	nodeArray.forEach(n => n.released());
}

function mouseWheel(event) {
	zoom += (event.delta / 500);
	if (zoom <= 0) zoom = 0.1;
	console.log(`Zoom ${zoom}`);
}

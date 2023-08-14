import p5, { p5InstanceExtensions } from "p5";
import { SGNode } from "./sgNode";
import { SGLink } from "./sgLink";
import { SGQuestionQCMNode } from "./sgQuestionQcmNode";
import { SGQuestionQONode } from "./sgQuestionQoNode";
import { SGTextNode } from "./sgTextNode";
import { SGQuestionQRNode } from "./sgQuestionQrNode";

const sketch = function (p: MyP5) {
  /** Déclaration de variables du dessin */
  /** Récupération du div parent du dessin / canvas */
  let parentDiv = document
    .getElementById("seriousGameDiagram")
    .getBoundingClientRect();

  /** Paramètre gérant le zoom du dessin */
  let zoom = 1;

  /** Liste des noeuds du diagramme */
  let nodeArray: SGNode[] = [];

  /** Liste des liens du diagramme */
  let linkArray: SGLink[] = [];

  /** Variable pour savoir si la palette est affichée ou cachée */
  let palette = true;
  /** Variable sur la taille de la palette */
  let paletteWidth = 70;

  /** Le bouton de création de question QCM */
  let buttonCreateQuestionQCM: p5.Element;

  /** Le bouton de création de question QO*/
  let buttonCreateQuestionQO: p5.Element;

  /** Le bouton de création de question QR*/
  let buttonCreateQuestionQR: p5.Element;

  /** Le bouton de création de champ de texte */
  let buttonCreateTextNode: p5.Element;

  /** Le bouton de création de liens */
  let buttonCreateLink: p5.Element;

  /** Le bouton de duplication de node */
  let buttonDuplicateNode: p5.Element;

  /** Le bouton pour activer la suppression des formes et liens */
  let buttonEraser: p5.Element;

  /** Le bouton pour activer sélection de formes */
  let buttonMouseSelection: p5.Element;

  /** Le bouton pour activer le délacement du dessin*/
  let buttonMouseDisplacement: p5.Element;

  /** Le slider qui permet de zoomer et de dézoomer */
  let sliderZoom: p5.Element;

  /** Variable pour savoir si on utilise le slider ou non */
  let sliderNotPressed = true;

  /** Paramètre gérant la translation du canvas sur l'axe des x */
  let translateX = 0;

  /** Paramètre gérant la translation du canvas sur l'axe des y */
  let translateY = 0;

  /** Paramètre gérant le offset de la translation du canvas sur l'axe des x */
  let diagramOffsetX = 0;

  /** Paramètre gérant le offset de la translation du canvas sur l'axe des y */
  let diagramOffsetY = 0;

  /** Paramètre du translate x initial du canvas */
  let initX = paletteWidth;

  /** Paramètre du translate y initial du canvas */
  let initY = 0;

  /** Paramètre du canvas, la zone qui contient tout le diagramme */
  let seriousGameCanvas: p5.Renderer;

  /** État pour la création de noeud suivant la souris */
  let hoveringNode = false;

  /** Type de node qui va être créé, valeur parmi NodeType */
  let creatingNodeType: symbol | null = null;

  /** Un enum sur les différents type de node */
  let NodeType = Object.freeze({
    TextNode: Symbol("textNode"),
    QCMNode: Symbol("qcmNode"),
    QONode: Symbol("qoNode"),
    QRNode: Symbol("qrNode"),
  });

  /** Booléen de contrôle pour la création des liens */
  let creatingLink = false;

  /** Etat pour le passage au dessus du Canvas */
  let hoveringCanvas = false;

  /** Permet de vérifier si la zone Question du précédent Node cliqué a été effacée */
  let previousNodeErased = true;

  /** Coordonnées du dernier clic pour gérer la réinitialisation de la zone Question */
  let lastClickX = 0;
  let lastClickY = 0;

  /** Booléen de contrôle de l'action de la souris
   * true = déplacement du diagramme
   * false = sélection
   */
  let isMovingDiagram = false;

  /** Booléen de contrôle de l'action de suppression */
  let isErasing = false;

  /** Booléen de contrôle de la duplication de node */
  let isDuplicating = false;

  /** Un enum sur les différents états du curseur */
  let CursorState = Object.freeze({
    SELECTION: Symbol("selection"),
    DISPLACEMENT: Symbol("displacement"),
    CREATENODE: Symbol("createnode"),
    CREATELINK: Symbol("createlink"),
    ERASING: Symbol("erasing"),
    DUPLICATING: Symbol("duplicating"),
  });

  /** Mutateur des coordonnées du dernier click */
  let lastNodeClickedType = "";

  const setLastNodeClickedType = function (type: string) {
    lastNodeClickedType = type;
  };

  /** Modifie les coordonnées du dernier clic */
  const setLastClick = function (x: number, y: number) {
    lastClickX = x;
    lastClickY = y;
  };

  /** Mutateur du booléen de contrôle pour savoir si la zone de description d'un node a été effacée */
  const setPreviousNodeErased = function (boolean: boolean) {
    /** Modifie l'état du booléen previousNodeErased */
    previousNodeErased = boolean;
  };

  /* P5Js part */
  /** Initialisation du diagramme */
  p.setup = function () {
    seriousGameCanvas = p.createCanvas(parentDiv.width, parentDiv.height);
    seriousGameCanvas.parent("seriousGameDiagram");
    p.frameRate(30);

    /** Modifie l'état de hoveringCanvas pour savoir si oui ou non le curseur de la souris survole le Canvas du Serious Game */
    seriousGameCanvas.mouseOver(() => {
      hoveringCanvas = true;
    });
    seriousGameCanvas.mouseOut(() => {
      hoveringCanvas = false;
    });

    translateX = initX;
    translateY = initY;

    /** Déclaration du bouton de création de TextNode */
    buttonCreateTextNode = p.createButton("T");
    buttonCreateTextNode.position(15, -seriousGameCanvas.height, "relative");
    buttonCreateTextNode.mousePressed(() => {
      createNode(NodeType.TextNode);
      switchButtonState(CursorState.CREATENODE);
      getCursor();
    });
    buttonCreateTextNode.size(40);
    buttonCreateTextNode.attribute("title", "Créer un texte");
    buttonCreateTextNode.style(
      "font-family",
      '"Times New Roman", Times, serif'
    );
    buttonCreateTextNode.style("font-weight", "bold");
    buttonCreateTextNode.parent("seriousGameDiagram");

    /** Déclaration du bouton de création de QuestionNode */
    buttonCreateQuestionQCM = p.createButton("");
    buttonCreateQuestionQCM.id("btn-create-QCM");
    buttonCreateQuestionQCM.position(
      -25,
      -seriousGameCanvas.height + 40,
      "relative"
    );
    buttonCreateQuestionQCM.mousePressed(() => {
      createNode(NodeType.QCMNode);
      switchButtonState(CursorState.CREATENODE);
      getCursor();
    });
    buttonCreateQuestionQCM.size(40);
    buttonCreateQuestionQCM.attribute("title", "Créer une question QCM");
    buttonCreateQuestionQCM.parent("seriousGameDiagram");
    /** L'icône pour le bouton de création de QuestionNode */
    let iconQCM = p.createElement("i");
    iconQCM.class("fa fa-list");
    iconQCM.parent("btn-create-QCM");
    iconQCM.style("color", "#000000");
    iconQCM.size(20);

    /** Déclaration du bouton de création de QuestionQONode */
    buttonCreateQuestionQO = p.createButton("");
    buttonCreateQuestionQO.id("btn-create-QO");
    buttonCreateQuestionQO.position(
      -65,
      -seriousGameCanvas.height + 80,
      "relative"
    );
    buttonCreateQuestionQO.mousePressed(() => {
      createNode(NodeType.QONode);
      switchButtonState(CursorState.CREATENODE);
      getCursor();
    });
    buttonCreateQuestionQO.size(40);
    buttonCreateQuestionQO.attribute("title", "Créer une question ouverte");
    buttonCreateQuestionQO.parent("seriousGameDiagram");
    /** L'icône pour le bouton de création de QuestionQONode */
    let iconQO = p.createElement("i");
    iconQO.class("fa fa-microphone");
    iconQO.parent("btn-create-QO");
    iconQO.style("color", "#000000");
    iconQO.size(20);

    /** Déclaration du bouton de création de QuestionQRNode */
    buttonCreateQuestionQR = p.createButton("");
    buttonCreateQuestionQR.id("btn-create-QR");
    buttonCreateQuestionQR.position(
      -105,
      -seriousGameCanvas.height + 120,
      "relative"
    );
    buttonCreateQuestionQR.mousePressed(() => {
      createNode(NodeType.QRNode);
      switchButtonState(CursorState.CREATENODE);
      getCursor();
    });
    buttonCreateQuestionQR.size(40);
    buttonCreateQuestionQR.attribute("title", "Créer une question QR code");
    buttonCreateQuestionQR.parent("seriousGameDiagram");
    /** L'icône pour le bouton de création de QuestionQRNode */
    let iconQR = p.createElement("i");
    iconQR.class("fa fa-qrcode");
    iconQR.parent("btn-create-QR");
    iconQR.style("color", "#000000");
    iconQR.size(20);

    /** Déclaration du bouton de création de lien */
    buttonCreateLink = p.createButton("");
    buttonCreateLink.id("btn-create-link");
    buttonCreateLink.position(
      -145,
      -seriousGameCanvas.height + 180,
      "relative"
    );
    buttonCreateLink.size(40);
    buttonCreateLink.attribute("title", "Créer un lien");
    buttonCreateLink.mousePressed(() => {
      creatingLink = !creatingLink;
      switchButtonState(CursorState.CREATELINK);
      getCursor();
    });
    buttonCreateLink.parent("seriousGameDiagram");
    /** L'icône pour le bouton de création de lien */
    let iconLink = p.createElement("i");
    iconLink.class("fa fa-arrow-right");
    iconLink.parent("btn-create-link");
    iconLink.style("color", "#000000");
    iconLink.size(20);

    /** Déclaration du bouton de duplication */
    buttonDuplicateNode = p.createButton("");
    buttonDuplicateNode.id("btn-copy");
    buttonDuplicateNode.position(
      -185,
      -seriousGameCanvas.height + 240,
      "relative"
    );
    buttonDuplicateNode.size(40);
    buttonDuplicateNode.attribute("title", "Dupliquer");
    buttonDuplicateNode.mousePressed(() => {
      isDuplicating = !isDuplicating;
      switchButtonState(CursorState.DUPLICATING);
      getCursor();
    });
    buttonDuplicateNode.parent("seriousGameDiagram");
    /** L'icône pour le bouton de duplication */
    let iconDuplicate = p.createElement("i");
    iconDuplicate.class("fa fa-copy");
    iconDuplicate.parent("btn-copy");
    iconDuplicate.style("color", "#000000");
    iconDuplicate.size(20);

    /** Déclaration du bouton de suppression */
    buttonEraser = p.createButton("");
    buttonEraser.id("btn-eraser");
    buttonEraser.position(-225, -seriousGameCanvas.height + 280, "relative");
    buttonEraser.size(40);
    buttonEraser.attribute("title", "Supprimer");
    buttonEraser.mousePressed(() => {
      isErasing = !isErasing;
      switchButtonState(CursorState.ERASING);
      getCursor();
    });
    buttonEraser.parent("seriousGameDiagram");
    /** L'icône pour le bouton de suppression */
    let iconEraser = p.createElement("i");
    iconEraser.class("fa fa-eraser");
    iconEraser.parent("btn-eraser");
    iconEraser.style("color", "#000000");
    iconEraser.size(20);

    /** Déclaration du bouton de sélection */
    buttonMouseSelection = p.createButton("");
    buttonMouseSelection.id("btn-mouse-selection");
    buttonMouseSelection.position(
      -265,
      -seriousGameCanvas.height + 340,
      "relative"
    );
    buttonMouseSelection.size(40);
    buttonMouseSelection.attribute("title", "Outil de sélection");
    buttonMouseSelection.mousePressed(() => {
      isMovingDiagram = false;
      switchButtonState(CursorState.SELECTION);
      getCursor();
    });
    buttonMouseSelection.parent("seriousGameDiagram");
    /** L'icône pour le bouton de sélection */
    let iconMouseSelection = p.createElement("i");
    iconMouseSelection.class("fa fa-mouse-pointer");
    iconMouseSelection.parent("btn-mouse-selection");
    iconMouseSelection.style("color", "#000000");
    iconMouseSelection.size(20);

    /** Déclaration du bouton de déplacement */
    buttonMouseDisplacement = p.createButton("");
    buttonMouseDisplacement.id("btn-mouse-displacement");
    buttonMouseDisplacement.position(
      -305,
      -seriousGameCanvas.height + 380,
      "relative"
    );
    buttonMouseDisplacement.size(40);
    buttonMouseDisplacement.attribute(
      "title",
      "Outil de déplacement du dessin"
    );
    buttonMouseDisplacement.mousePressed(() => {
      isMovingDiagram = true;
      getCursor();
      switchButtonState(CursorState.DISPLACEMENT);
    });
    buttonMouseDisplacement.parent("seriousGameDiagram");
    /** L'icône pour le bouton de déplacement */
    let iconMouseDisplacement = p.createElement("i");
    iconMouseDisplacement.class("fa fa-arrows-alt");
    iconMouseDisplacement.parent("btn-mouse-displacement");
    iconMouseDisplacement.style("color", "#000000");
    iconMouseDisplacement.size(20);

    /** Déclaration du slider du zoom*/
    sliderZoom = p.createSlider(1, 200, zoom * 100);
    sliderZoom.input(() => {
      sliderNotPressed = false; //met à faux quand on utilise le slider
      zoom = (sliderZoom.value() as number) / 100; //change la valeur de zoom en fonction de la valeur du slider
    });
    sliderZoom.mouseReleased(() => {
      sliderNotPressed = true;
    }); //remet à vrai quand on arrête d'utiliser le slider
    sliderZoom.parent("seriousGameDiagram");
    // Positionnemnt du slider en bas à droite
    sliderZoom.position(
      seriousGameCanvas.position().x + seriousGameCanvas.size().width - 170,
      seriousGameCanvas.position().y + seriousGameCanvas.size().height - 20
    );
  };

  /** La boucle de dessin */
  p.draw = function () {
    // On dessine la couleur du fond
    p.background("#e1f1ff");

    p.push();
    // Déplacement du diagramme lorsque que l'état est activé
    if (isMovingDiagram) moveDiagram();
    //console.log(`translate x ${translateX} y ${translateY}`);
    p.translate(translateX, translateY);

    // On gère le zoom du diagramme
    p.scale(zoom);

    // On update la position des nodes
    nodeArray.forEach((n: SGNode) => n.update(p));

    // On affiche les nodes
    nodeArray.forEach((n: SGNode) => n.display(p));

    // On affiche les liens
    linkArray.forEach((l: SGLink) => l.display());

    // On affiche les dot des nodes
    nodeArray.forEach((n: SGNode) => n.displayDot(p));
    p.pop();

    // On dessine l'encadré lors de la création de node
    displayCreateNode();

    // On dessine le rectangle de la palette
    if (palette) {
      drawPalette();
    }

    // On dessine les bordures du diagram
    p.push();
    p.noFill();
    p.strokeWeight(4);
    p.rect(0, 0, parentDiv.width, parentDiv.height);
    p.pop();

    // Change la valeur du slider si on zoome ou dézoome avec la molette de la souris
    sliderZoom.value(zoom * 100);

    p.push();
    p.fill(28, 62, 180);
    p.textAlign(p.RIGHT);
    // Affiche le pourcentage de zoom auquel on est actuellement
    p.text(sliderZoom.value() + "%", p.width - 8, p.height - 8);
    sliderZoom.position(
      seriousGameCanvas.position().x + seriousGameCanvas.size().width - 170,
      seriousGameCanvas.position().y + seriousGameCanvas.size().height - 20
    );
    p.pop();

    // Ajustement de la couleur des boutons
    highlightButtons();
  };

  /** Fonction de dessin de la palette de bouton de création  */
  const drawPalette = function () {
    p.push();
    p.fill("#677798");
    p.rect(0, 0, paletteWidth, parentDiv.height);
    p.fill(0);
    p.textSize(20);
    p.textFont("Helvetica");
    //p.text("Palette", 45, 25);
    p.pop();
  };

  /**
   * Fonction qui déclenche la création de node
   * @param {NodeType} nodeType Le type de node qui va être créé
   */
  const createNode = function (nodeType: symbol) {
    hoveringNode = !hoveringNode;
    creatingNodeType = nodeType;
  };

  /** Fonction qui dessine l'encadré pour la création des noeuds */
  const displayCreateNode = function () {
    if (hoveringNode) {
      p.push();
      p.strokeWeight(1);
      p.fill(255);
      p.rect(p.mouseX + 10, p.mouseY - 10, 170, 20, 10);
      p.fill(0);
      p.text("Ajouter l'élément à cet endroit", p.mouseX + 15, p.mouseY + 5);
      p.pop();
    }
  };

  /** Fonction qui gère le déplacement du dessin avec un clic gauche */
  const moveDiagram = function () {
    if (p.mouseIsPressed && p.mouseButton === p.LEFT && sliderNotPressed) {
      if (
        p.mouseX < p.width &&
        p.mouseX > 0 &&
        p.mouseY < p.height &&
        p.mouseY > 0
      ) {
        let mouseIsOnNodes = nodeArray.filter(
          (n: SGNode) => n.isMouseHover(p) || n.dragging
        );
        let mouseIsOnLinks = linkArray.filter((l) => l.isMouseHover());
        if (mouseIsOnNodes.length + mouseIsOnLinks.length === 0) {
          translateX = initX + (p.mouseX - diagramOffsetX);
          translateY = initY + (p.mouseY - diagramOffsetY);
        }
      }
    }
  };

  /** Fonction appelé lors d'un appuie d'un bouton de la souris */
  p.mousePressed = function () {
    if (p.mouseButton === p.LEFT) {
      initX = translateX;
      initY = translateY;
      diagramOffsetX = p.mouseX;
      diagramOffsetY = p.mouseY;

      /** Mode suppression */
      if (isErasing) {
        /** Le premier lien survolé est supprimé */
        for (let i = 0; i < linkArray.length; i++) {
          if (linkArray[i].isMouseHover()) {
            linkArray.splice(i, 1);
            SetProgressBar(generateJson());
            return;
          }
        }

        /** Le premier node survolé par la souris est supprimé ainsi que tous liens attachés à lui */
        for (let i = 0; i < nodeArray.length; i++) {
          if (nodeArray[i].isMouseHover(p)) {
            linkArray = linkArray.filter(function (l) {
              return !(l.node1 === nodeArray[i] || l.node2 === nodeArray[i]);
            });
            nodeArray.splice(i, 1);
            SetProgressBar(generateJson());
            return;
          }
        }
      } else {
        /** Recherche le premier node survolé par la souris et la pousse à la fin de la liste nodeArray
         * pour qu'il soit dessiné en dernier
         * Active aussi l'effet de drag sur le node
         */
        for (let n of nodeArray) {
          if (n.pressed(p)) {
            nodeArray = nodeArray.filter((removeNode) => removeNode != n);
            nodeArray.push(n);
            break;
          }
        }
      }

      /**
       * Mode création de lien dynamique depuis l'exitDot qui est survolé par la souris
       * Ce lien sera attaché à la souris jusqu'à ce qu'on relâche le clic droit sur un entryDot où annule la création de lien
       */
      if (creatingLink) {
        nodeArray.forEach((n) =>
          n.createLink(function (link) {
            let exitDotAlreadyLinked = false;
            linkArray.forEach((l) => {
              if (l.node1Dot === link.node1Dot) exitDotAlreadyLinked = true;
            });
            if (!exitDotAlreadyLinked) {
              creatingLink = true;
              linkArray.push(link);
              SetProgressBar(generateJson());
            }
          }, p)
        );

        // Suppression du lien dynamique si on clique sur aucun node
        let isHoverNode = false;
        nodeArray.forEach((n) => {
          if (n.isMouseHover(p) || n.isMouseHoveringDots(p)) isHoverNode = true;
        });
        if (!isHoverNode) {
          // Annule la création des liens dynamiques
          linkArray = linkArray.filter((l) => l.type !== "dynamic");
        }
      } else {
        // Annule la création des liens dynamiques
        linkArray = linkArray.filter((l) => l.type !== "dynamic");
      }

      /** Mode création de node si la souris ne survole rien (node, link or palette) et que le booléen de création de node `hoveringNode`= true */
      if (hoveringNode && p.mouseX > paletteWidth) {
        let mouseIsOnNodes = nodeArray.filter(
          (n) => n.isMouseHover(p) || n.dragging
        );
        let mouseIsOnLinks = linkArray.filter((l) => l.isMouseHover());
        if (mouseIsOnNodes.length + mouseIsOnLinks.length === 0) {
          switch (creatingNodeType as symbol) {
            case NodeType.TextNode:
              nodeArray.push(
                new SGTextNode(
                  (p.mouseX - translateX) / zoom,
                  (p.mouseY - translateY) / zoom,
                  100,
                  80
                )
              );
              break;

            case NodeType.QCMNode:
              nodeArray.push(
                new SGQuestionQCMNode(
                  (p.mouseX - translateX) / zoom,
                  (p.mouseY - translateY) / zoom,
                  100,
                  80
                )
              );
              break;

            case NodeType.QONode:
              nodeArray.push(
                new SGQuestionQONode(
                  (p.mouseX - translateX) / zoom,
                  (p.mouseY - translateY) / zoom,
                  100,
                  80
                )
              );
              break;

            case NodeType.QRNode:
              nodeArray.push(
                new SGQuestionQRNode(
                  (p.mouseX - translateX) / zoom,
                  (p.mouseY - translateY) / zoom,
                  100,
                  80
                )
              );
              break;

            default:
              logger.error(`script_serious_game | Type de node inconnu`);
          }
          SetProgressBar(generateJson());
          hoveringNode = false;
          switchButtonState(CursorState.SELECTION);
          getCursor();
        }
      }

      /** Mode duplication de node */
      if (isDuplicating) {
        nodeArray.forEach((n) => {
          if (n.isMouseHover(p) || n.isMouseHoveringDots(p)) {
            let newNode = n.clone();
            newNode.x += 10;
            newNode.y += 10;

            nodeArray.push(newNode);
            return;
          }
        });
      }

      /** Si clique sur aucun node à l'intérieur du canvas, on enlève l'état clicked des node */
      for (let i = 0; i < nodeArray.length; ++i) {
        if (!nodeArray[i].isMouseHover(p) && hoveringCanvas)
          nodeArray[i].clicked = false;
      }
    }
    if (p.mouseButton === p.RIGHT) {
      /** Crée un lien dynamique depuis l'exitDot qui est survolé par la souris
       * Ce lien sera attaché à la souris jusqu'à ce qu'on relâche le clic droit sur un entryDot où annule la création de lien
       */
      if (!creatingLink) {
        nodeArray.forEach((n) =>
          n.createLink(function (link) {
            let exitDotAlreadyLinked = false;
            linkArray.forEach((l) => {
              if (l.node1Dot === link.node1Dot) exitDotAlreadyLinked = true;
            });
            if (!exitDotAlreadyLinked) {
              creatingLink = true;
              linkArray.push(link);
              SetProgressBar(generateJson());
            }
          }, p)
        );
      }
    }
  };

  /** Fonction appelée lors d'un relachement d'un bouton de la souris */
  p.mouseReleased = function () {
    /** Enlève l'effet de traîne sur les nodes */
    nodeArray.forEach((n) => n.released());

    if (
      p.mouseButton === p.RIGHT ||
      (p.mouseButton === p.LEFT && creatingLink)
    ) {
      /** Arrête les liens dynamiques si la souris survole un node lors d'un clic gauche|droit */
      linkArray.forEach(function (l) {
        if (l.type === "dynamic") {
          nodeArray.forEach(function (n) {
            if (n.isMouseHoveringDots(p) && !n.isMouseHoveringExitDots(p)) {
              l.node2 = n;
              l.node2Dot = n.getDotHovering(p);
              l.type = "static";
              //creatingLink = false;
              getCursor();
            }
          });
        }
      });
    }
  };

  /** Fonction appelée lors d'un scroll de la souris */
  p.mouseWheel = function (event) {
    if (hoveringCanvas) {
      zoom += event.delta / 500;
      if (zoom <= 0) zoom = 0.1;
    }
  };

  /** Fonction appelée lorsqu'une touche est appuyée */
  p.keyPressed = function () {
    /** Appuie sur la touche "Suppr" */
    if (p.keyCode === p.DELETE) {
      /** Si un node est survolé par la souris, on le supprime ainsi que tous les liens auxquels il est relié */
      for (let i = 0; i < nodeArray.length; i++) {
        if (nodeArray[i].isMouseHover(p)) {
          linkArray = linkArray.filter(function (l) {
            return !(l.node1 === nodeArray[i] || l.node2 === nodeArray[i]);
          });
          nodeArray.splice(i, 1);
          SetProgressBar(generateJson());
          return;
        }
      }
    }
  };

  /** Fonction qui redimensionne le diagramme selon la taille de la fenêtre */
  p.windowResized = function () {
    parentDiv = document
      .getElementById("seriousGameDiagram")
      .getBoundingClientRect();
    p.resizeCanvas(parentDiv.width, parentDiv.height);
  };

  /** Transforme le curseur selon l'état activé */
  const getCursor = function () {
    if (isErasing) {
      p.cursor("not-allowed");
    } else if (creatingLink) {
      p.cursor("e-resize");
    } else if (hoveringNode) {
      p.cursor(p.CROSS);
    } else if (isDuplicating) {
      p.cursor("copy");
    } else if (isMovingDiagram) {
      p.cursor(p.MOVE);
    } else {
      p.cursor(p.ARROW);
    }
  };

  /** Change la couleur des boutons selon leur état associé  */
  const highlightButtons = function () {
    // Bouton pour effacer
    if (isErasing) {
      buttonEraser.addClass("bg-success");
    } else {
      buttonEraser.removeClass("bg-success");
    }

    // Boutons pour la sélection ou déplacement avec la souris
    if (isMovingDiagram) {
      buttonMouseSelection.removeClass("bg-success");
      buttonMouseDisplacement.addClass("bg-success");
    } else {
      buttonMouseSelection.addClass("bg-success");
      buttonMouseDisplacement.removeClass("bg-success");
    }

    // Boutons pour créer les questions et les textes
    if (hoveringNode) {
      switch (creatingNodeType) {
        case NodeType.TextNode:
          buttonCreateQuestionQCM.removeClass("bg-success");
          buttonCreateQuestionQO.removeClass("bg-success");
          buttonCreateQuestionQR.removeClass("bg-success");
          buttonCreateTextNode.addClass("bg-success");
          break;

        case NodeType.QCMNode:
          buttonCreateQuestionQCM.addClass("bg-success");
          buttonCreateQuestionQO.removeClass("bg-success");
          buttonCreateQuestionQR.removeClass("bg-success");
          buttonCreateTextNode.removeClass("bg-success");
          break;

        case NodeType.QONode:
          buttonCreateQuestionQCM.removeClass("bg-success");
          buttonCreateQuestionQO.addClass("bg-success");
          buttonCreateQuestionQR.removeClass("bg-success");
          buttonCreateTextNode.removeClass("bg-success");
          break;

        case NodeType.QRNode:
          buttonCreateQuestionQCM.removeClass("bg-success");
          buttonCreateQuestionQO.removeClass("bg-success");
          buttonCreateQuestionQR.addClass("bg-success");
          buttonCreateTextNode.removeClass("bg-success");
          break;

        default:
          logger.error(`script_serious_game | Type de node inconnu`);
      }
    } else {
      buttonCreateQuestionQCM.removeClass("bg-success");
      buttonCreateQuestionQO.removeClass("bg-success");
      buttonCreateQuestionQR.removeClass("bg-success");
      buttonCreateTextNode.removeClass("bg-success");
    }

    // Bouton pour créer les liens
    if (creatingLink) {
      buttonCreateLink.addClass("bg-success");
    } else {
      buttonCreateLink.removeClass("bg-success");
    }

    // Bouton pour dupliquer un node
    if (isDuplicating) {
      buttonDuplicateNode.addClass("bg-success");
    } else {
      buttonDuplicateNode.removeClass("bg-success");
    }
  };

  /**
   * Désactiver les actions de la souris différentes de celle du state
   * @param {CursorState} state qui est activé, tous les autres seront désactivés
   */
  const switchButtonState = function (state) {
    switch (state) {
      case CursorState.CREATENODE:
        creatingLink = false;
        isErasing = false;
        isMovingDiagram = false;
        isDuplicating = false;
        break;
      case CursorState.CREATELINK:
        hoveringNode = false;
        isErasing = false;
        isMovingDiagram = false;
        isDuplicating = false;
        break;
      case CursorState.SELECTION:
        hoveringNode = false;
        isErasing = false;
        creatingLink = false;
        isDuplicating = false;
        break;
      case CursorState.DISPLACEMENT:
        hoveringNode = false;
        isErasing = false;
        creatingLink = false;
        isDuplicating = false;
        break;
      case CursorState.ERASING:
        hoveringNode = false;
        creatingLink = false;
        isMovingDiagram = false;
        isDuplicating = false;
        break;
      case CursorState.DUPLICATING:
        isErasing = false;
        hoveringNode = false;
        creatingLink = false;
        isMovingDiagram = false;
        break;
      default:
        logger.error("Serious Game | unknown button state " + state);
    }
  };

  /**
   * Une fonction qui retourne le projet de SG contenant le JSON en utilisant les nodeArray et linkArray
   * @returns {ProjetSeriousGame}
   */
  const generateJson = function () {
    let questionNodes = [];
    let textNodes: SGTextNode[] = [];
    let textNodesJson = [];
    let questionNodesJson = [];

    // mettre les questionNodes dans un array et les textNodes dans un autre
    for (let i = 0; i < nodeArray.length; ++i) {
      if (nodeArray[i] instanceof SGTextNode) {
        textNodes.push(nodeArray[i] as SGTextNode);
      } else {
        questionNodes.push(nodeArray[i]);
      }
    }

    // traitement de textNodes
    for (let i = 0; i < textNodes.length; ++i) {
      let name = textNodes[i].name;
      let text = textNodes[i].description;
      let exitLink = "";
      for (let z = 0; z < linkArray.length; ++z) {
        if (
          textNodes[i].exitDots[0].getPositionX() ==
            linkArray[z].node1Dot.getPositionX() &&
          textNodes[i].exitDots[0].getPositionY() ==
            linkArray[z].node1Dot.getPositionY()
        ) {
          let next_node = linkArray[z].node2;
          if (next_node instanceof SGQuestionQCMNode)
            exitLink = linkArray[z].node2.name;
          else exitLink = linkArray[z].node2.name;
          break;
        }
      }
      let textObject;
      // On regarde s'il s'agit d'un audio
      if (text.substring(text.length - 3, text.length) == "mp3")
        textObject = {
          type: "M",
          name: text,
          url: textNodes[i].url,
        };
      else {
        textObject = {
          type: "T",
          txt: text,
        };
      }
      let textNode = new TextNode(name, textObject, exitLink);
      textNodesJson.push(textNode);
    }

    // traitement de questionNodes
    for (let i = 0; i < questionNodes.length; ++i) {
      let name = questionNodes[i].name;
      let textQuestion = questionNodes[i].question;

      if (questionNodes[i] instanceof SGQuestionQCMNode) {
        typeNode = "M";
      } else if (questionNodes[i] instanceof SGQuestionQRNode) {
        typeNode = "Q";
      } else {
        typeNode = "O";
      }

      let reponses = [];

      for (let j = 0; j < questionNodes[i].answers.length; ++j) {
        let exitLink = "";
        for (let z = 0; z < linkArray.length; ++z) {
          if (
            questionNodes[i].exitDots[j].getPositionX() ==
              linkArray[z].node1Dot.getPositionX() &&
            questionNodes[i].exitDots[j].getPositionY() ==
              linkArray[z].node1Dot.getPositionY()
          ) {
            let next_node = linkArray[z].node2;
            exitLink = next_node.name;
          }
        }

        let reponse;
        if (typeNode === "Q") {
          reponse = {
            txt: questionNodes[i].answers[j].id,
            ext: exitLink,
          };
        } else {
          reponse = {
            txt: questionNodes[i].answers[j],
            ext: exitLink,
          };
        }

        reponses.push(reponse);
      }

      let textQuestionObject;
      // On regarde s'il s'agit d'un audio
      if (
        textQuestion.substring(textQuestion.length - 3, textQuestion.length) ==
        "mp3"
      )
        textQuestionObject = {
          type: "M",
          name: textQuestion,
          url: questionNodes[i].url,
        };
      else {
        textQuestionObject = {
          type: "T",
          txt: textQuestion,
        };
      }

      let questionNode = new QuestionNode(
        name,
        typeNode,
        textQuestionObject,
        reponses
      );
      questionNodesJson.push(questionNode);
    }

    projet = new ProjetSeriousGame(textNodesJson, questionNodesJson);
    return projet;
  };

  /** Fonction pour vérifier que l'histoire est correcte et ques tous les champs sont remplis*/
  const checkCorrectGeneration = function () {
    let textNodes = [];
    let questionNodes = [];

    let errorNodes = [];

    // Boucle pour mettre les questionNodes dans un array et les textNodes dans un autre
    for (let i = 0; i < nodeArray.length; ++i) {
      if (nodeArray[i] instanceof SGTextNode) {
        // On récupère les noeuds textes avec des champs vides
        if (nodeArray[i].name == "" || nodeArray[i].description == "") {
          nodeArray[i].containError = true;
          errorNodes.push(nodeArray[i]);
        } else {
          textNodes.push(nodeArray[i]);
          nodeArray[i].containError = false;
        }
      } else {
        // On récupère les noeuds questions avec des champs vides
        if (nodeArray[i].name == "" || nodeArray[i].question == "") {
          nodeArray[i].containError = true;
          errorNodes.push(nodeArray[i]);
        } else {
          questionNodes.push(nodeArray[i]);
          nodeArray[i].containError = false;
        }
        // Test si aucune réponse
        if (nodeArray[i].answers.length === 0 && !nodeArray[i].containError) {
          nodeArray[i].containError = true;
          errorNodes.push(nodeArray[i]);
        }
        // Test si réponses vides
        for (let j = 0; j < nodeArray[i].answers.length; ++j) {
          if (typeof nodeArray[i].answers[j] === "string") {
            if (nodeArray[i].answers[j] == "" && !nodeArray[i].containError) {
              nodeArray[i].containError = true;
              errorNodes.push(nodeArray[i]);
            }
          } else {
            if (
              (nodeArray[i].answers[j].name == "" ||
                nodeArray[i].answers[j].id == "") &&
              !nodeArray[i].containError
            ) {
              nodeArray[i].containError = true;
              errorNodes.push(nodeArray[i]);
            }
          }
        }
      }
    }

    if (errorNodes.length > 0) {
      messageInfos(
        "Attention un ou plusieurs noeuds possèdent des champs vides",
        "danger"
      );
      logger.error(
        "Attention un ou plusieurs noeuds possèdent des champs vides"
      );
      return false;
    }

    //---- Gestion du noeud de départ ----//

    let nbStartNode = 0; // Nombre de noeud d'introduction

    // On regarde s'il y a un noeud texte qui est un noeud de départ
    for (let i = 0; i < textNodes.length; ++i) {
      entryDot = textNodes[i].entryDot;
      let x = entryDot.getPositionX();
      let y = entryDot.getPositionY();
      let found = false; // Booléen pour savoir si on a trouvé un lien avec le noeud courant

      for (let j = 0; j < linkArray.length; ++j) {
        let linkX = linkArray[j].node2Dot.getPositionX();
        let linkY = linkArray[j].node2Dot.getPositionY();

        if (linkX == x && linkY == y) {
          found = true;
        }
      }

      if (!found) {
        ++nbStartNode;
      }
    }

    // On regarde s'il y a un noeud question qui est un noeud de départ
    for (let i = 0; i < questionNodes.length; ++i) {
      entryDot = questionNodes[i].entryDot;
      let x = entryDot.getPositionX();
      let y = entryDot.getPositionY();
      let found = false; // Booléen pour savoir si on a trouvé un lien avec le noeud courant

      for (let j = 0; j < linkArray.length; ++j) {
        let linkX = linkArray[j].node2Dot.getPositionX();
        let linkY = linkArray[j].node2Dot.getPositionY();

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
    } else if (nbStartNode > 1) {
      messageInfos(
        "Attention plusieurs noeuds de départ sont présents",
        "danger"
      );
      logger.error("Attention plusieurs noeuds de départ sont présents");
      return false;
    }

    //---- Gestion du noeud de fin ----//

    let nbEndNode = 0; // Nombre de noeud d'introduction

    // On regarde s'il y a un noeud texte qui est un noeud de fin
    for (let i = 0; i < textNodes.length; ++i) {
      exitDot = textNodes[i].exitDots[0];
      let x = exitDot.getPositionX();
      let y = exitDot.getPositionY();
      let found = false; // Booléen pour savoir si on a trouvé un lien avec le noeud courant

      for (let j = 0; j < linkArray.length; ++j) {
        let linkX = linkArray[j].node1Dot.getPositionX();
        let linkY = linkArray[j].node1Dot.getPositionY();

        if (linkX == x && linkY == y) {
          found = true;
        }
      }

      if (!found) ++nbEndNode;
    }

    // On regarde s'il y a un noeud question qui est un noeud de fin
    for (let i = 0; i < questionNodes.length; ++i) {
      exitDot = questionNodes[i].exitDots[0];
      let x = exitDot.getPositionX();
      let y = exitDot.getPositionY();
      let found = false; // Booléen pour savoir si on a trouvé un lien avec le noeud courant

      for (let j = 0; j < linkArray.length; ++j) {
        let linkX = linkArray[j].node1Dot.getPositionX();
        let linkY = linkArray[j].node1Dot.getPositionY();

        if (linkX == x && linkY == y) {
          found = true;
        }
      }

      if (!found) {
        messageInfos(
          "Attention l'histoire se finit par une question",
          "danger"
        );
        logger.error("Attention l'histoire se finit par une question");
        return false;
      }
    }

    // Il ne peut y avoir qu'un seul noeud de fin
    if (nbEndNode == 0) {
      messageInfos("Attention aucun noeud de fin n'est présent", "danger");
      logger.error("Attention aucun noeud de fin n'est présent");
      return false;
    } else if (nbEndNode > 1) {
      messageInfos("Attention plusieurs noeuds de fin sont présents", "danger");
      logger.error("Attention plusieurs noeuds de fin sont présents");
      return false;
    }

    //---- Gestion des réponses ----//

    for (let i = 0; i < questionNodes.length; ++i) {
      for (let j = 0; j < questionNodes[i].exitDots.length; ++j) {
        let found = false; // Booléen pour savoir si on a trouvé un lien avec le noeud courant
        let x = questionNodes[i].exitDots[j].getPositionX();
        let y = questionNodes[i].exitDots[j].getPositionY();

        for (let z = 0; z < linkArray.length; ++z) {
          let linkX = linkArray[z].node1Dot.getPositionX();
          let linkY = linkArray[z].node1Dot.getPositionY();

          if (linkX == x && linkY == y) found = true;
        }

        if (!found) {
          messageInfos(
            "Attention une réponse n'est pas relié à un noeud",
            "danger"
          );
          logger.error("Attention une réponse n'est pas relié à un noeud");
          return false;
        }
      }
    }

    //---- Gestion des noeuds avec des noms identiques ----//

    for (let i = 0; i < textNodes.length; ++i) {
      let name = textNodes[i].name;
      let found = false;

      for (let j = 0; j < textNodes.length; ++j) {
        if (j != i) {
          if (name == textNodes[j].name) {
            if (!found) found = true;
            textNodes[j].containError = true;
          } else textNodes[j].containError = false;
        }
      }

      for (let j = 0; j < questionNodes.length; ++j) {
        if (j != i) {
          if (name == questionNodes[j].name) {
            if (!found) found = true;
            questionNodes[j].containError = true;
          } else questionNodes[j].containError = false;
        }
      }

      if (found) {
        textNodes[i].containError = true;
        messageInfos("Attention des noeuds possèdent le même nom", "danger");
        logger.error("Attention des noeuds possèdent le même nom");
        return false;
      }
    }

    for (let i = 0; i < questionNodes.length; ++i) {
      let name = questionNodes[i].name;
      let found = false;

      for (let j = 0; j < textNodes.length; ++j) {
        if (j != i) {
          if (name == textNodes[j].name) {
            if (!found) found = true;
            textNodes[j].containError = true;
          } else textNodes[j].containError = false;
        }
      }

      for (let j = 0; j < questionNodes.length; ++j) {
        if (j != i) {
          if (name == questionNodes[j].name) {
            if (!found) found = true;
            questionNodes[j].containError = true;
          } else questionNodes[j].containError = false;
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
  };

  /** Fonction pour créer les métadonnées qui serviront à reconstruire le Serious Game */
  const generateMetadata = function () {
    // Liste de tri des nodes
    let questionNodes = [];
    let textNodes: SGTextNode[] = [];

    // Liste des nodes convertis en JSON pour les metadonnées
    let questionNodesJSON = [];
    let textNodesJSON = [];

    // Tri des questionNode et des textNodes
    for (let i = 0; i < nodeArray.length; ++i) {
      if (nodeArray[i] instanceof SGTextNode) {
        textNodes.push(nodeArray[i] as SGTextNode);
      } else {
        questionNodes.push(nodeArray[i]);
      }
    }

    // Traitement de textNodes
    for (let i = 0; i < textNodes.length; ++i) {
      // Le noeud relier à la sorti du textNode
      let exitLink = "";

      for (let z = 0; z < linkArray.length; ++z) {
        if (
          textNodes[i].exitDots[0].getPositionX() ==
            linkArray[z].node1Dot.getPositionX() &&
          textNodes[i].exitDots[0].getPositionY() ==
            linkArray[z].node1Dot.getPositionY()
        ) {
          let next_node = linkArray[z].node2;
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
        ext: exitLink,
      };
      textNodesJSON.push(textNode);
    }

    // Traitement de questionNodes
    for (let i = 0; i < questionNodes.length; ++i) {
      let listeReponses = [];

      for (let j = 0; j < questionNodes[i].answers.length; ++j) {
        let text = questionNodes[i].answers[j];
        let exitLink = "";
        let next_node;
        for (let z = 0; z < linkArray.length; ++z) {
          if (
            questionNodes[i].exitDots[j].getPositionX() ==
              linkArray[z].node1Dot.getPositionX() &&
            questionNodes[i].exitDots[j].getPositionY() ==
              linkArray[z].node1Dot.getPositionY()
          ) {
            next_node = linkArray[z].node2;
          }
          exitLink = next_node.name;
        }
        let reponse = {
          txt: text,
          ext: exitLink,
        };
        listeReponses.push(reponse);
      }

      let typeNode = "";
      if (questionNodes[i] instanceof SGQuestionQCMNode) {
        typeNode = "M";
      } else if (questionNodes[i] instanceof SGQuestionQRNode) {
        typeNode = "Q";
      } else {
        typeNode = "O";
      }

      let questionNode = {
        name: questionNodes[i].name,
        type: typeNode,
        txt: questionNodes[i].question,
        url: questionNodes[i].url,
        rep: listeReponses,
        x: questionNodes[i].x,
        y: questionNodes[i].y,
      };

      questionNodesJSON.push(questionNode);
    }

    let qrMetadata = {
      type: "SeriousGame",
      text_nodes: textNodesJSON,
      question_nodes: questionNodesJSON,
    };

    logger.info(
      `SeriousGame | Metadonnée générées : ${JSON.stringify(qrMetadata)}`
    );

    return qrMetadata;
  };
};

interface MyP5 extends p5, p5InstanceExtensions {
  drawPalette(): void;
  createNode(nodeType: symbol): void;
  displayCreateNode(): void;
  moveDiagram(): void;
  getCursor(): void;
  generateJson(): void;
  checkCorrectGeneration(): boolean;
  generateMetadata(): object;
  setLastNodeClickedType(nodeType: string): void;
  setLastClick(x: number, y: number): void;
  setPreviousNodeErased(newValue: boolean): void;
  zoom: number;
  nodeArray: SGNode[];
  linkArray: SGLink[];
  palette: boolean;
  paletteWidth: number;
  buttonCreateQuestionQCM: p5.Element;
  buttonCreateQuestionQO: p5.Element;
  buttonCreateQuestionQR: p5.Element;
  buttonCreateTextNode: p5.Element;
  buttonCreateLink: p5.Element;
  buttonDuplicateNode: p5.Element;
  buttonEraser: p5.Element;
  buttonMouseSelection: p5.Element;
  buttonMouseDisplacement: p5.Element;
  sliderZoom: p5.Element;
  sliderNotPressed: boolean;
  translateX: number;
  translateY: number;
  diagramOffsetX: number;
  diagramOffsetY: number;
  initX: number;
  initY: number;
  seriousGameCanvas: p5.Renderer;
  hoveringNode: boolean;
  creatingNodeType: symbol;
  creatingLink: boolean;
  hoveringCanvas: boolean;
  previousNodeErased: boolean;
  lastClickX: number;
  lastClickY: number;
  isMovingDiagram: boolean;
  isErasing: boolean;
  isDuplicating: boolean;
  lastNodeClickedType: string;
}

export type { MyP5 };
export { sketch };

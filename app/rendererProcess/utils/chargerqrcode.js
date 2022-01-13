/**
 * @Date:   2018-12-04T08:24:59+01:00
 * @Last modified by:   louis cuegniet
 * @Last modified time: 25/11/2020
 */

$().ready(function () {
  //require("./js/script_unique.js");

  $('#setImportedFile').on('click', function () {
    var nomfichier = document.getElementById("importedFile").files[0].path;
    importQRCodeImport(nomfichier);
  });
});

/** fonction permettant de charger, importer un qr code */
function importQRCodeImport(filename) {
  logger.info(`Import du fichier <${filename}>`);
  let facade = new FacadeController();
  //facade.importQRCode(filename, drawQRCodeImport);

  let blob = null;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", filename);
  xhr.responseType = "blob"; //force the HTTP response, response-type header to be blob
  xhr.onload = function () {
    blob = xhr.response; //xhr.response is now a blob object
    facade.importQRCode(blob, drawQRCodeImport);
  }
  xhr.send();
}

/** fonction permettant de recréer visuellement un qr code */
function drawQRCodeImport(qrcode) {
  try {
    if (qrcode.getType() == 'unique' || qrcode.getType() == 'xl') {
      logger.info('chargerqrcode.drawQRCodeImport | Import d\'un QR Unique, basculement sur onglet QR Unique');
      $("#charger-page").load(getNormalizePath(root + "/rendererProcess/view/uniqueQr/unique.html"), function () {

        /** restaurer la couleur du qrcode */
        $('input#qrColor').val(qrcode.getColor());
        /** restaurer le nom du qrcode */
        $('input#qrName').val(qrcode.getName());

        store.set(`titreUnique`, qrcode.getName());
        isImportationQRUnique = true;

        $('#preview, #empty').attr('disabled', false);
        drawQRCodeData(qrcode);
        logger.info('chargerqrcode.drawQRCodeImport | Import réussi du QR Unique');
      });
      //TODO Changer ici en multiple quand le type sera bien défini
    } else if (qrcode.getType() == 'ensemble') {
      logger.info('chargerqrcode.drawQRCodeImport | Import d\'un QR Multiple, basculement sur onglet QR Multiple');
      $("#charger-page").load(getNormalizePath(root + "/rendererProcess/view/multipleQr/multiple.html"), function () {
        /** restaurer la couleur du qrcode */
        $('input#qrColor').val(qrcode.getColor());
        /** restaurer le nom du qrcodemultiple */
        $('input#qrName').val(qrcode.getName());

        controllerMultiple.setQRCodeMultiple(qrcode);

        $('#preview, #empty').attr('disabled', false);
        drawQRCodeMultipleUnique(qrcode);
        $('#txtDragAndDrop').remove();
        logger.info('chargerqrcode.drawQRCodeImport | Import réussi du QR Multiple');
      });

    } else if (qrcode.getType() == 'question') {
      logger.info('chargerqrcode.drawQRCodeImport | Import d\'un QR Exercice QR Code, basculement sur onglet QR Exercice QR Code');
      $("#charger-page").load(getNormalizePath(root + "/rendererProcess/view/exerciceQr/exerciceQrCode.html"), function () {
        console.log(qrcode.qrcode);
        if (typeof qrcode.getName() === 'string') {
          $("#newQuestionText").val(qrcode.getName());
        } else {
          audioSource = "Question";
          ajouterChampSon(qrcode.qrcode.text_question.name, qrcode.qrcode.text_question.url);
        }

        if (typeof qrcode.getGoodAnswer() === 'string') {
          $("#newBonneReponseText").val(qrcode.getGoodAnswer());
        } else {
          audioSource = "BonneReponse";
          ajouterChampSon(qrcode.qrcode.text_bonne_reponse.name, qrcode.qrcode.text_bonne_reponse.url);
        }

        if (typeof qrcode.getBadAnswer() === 'string') {
          $("#newMauvaiseReponseText").val(qrcode.getBadAnswer());
        } else {
          audioSource = "MauvaiseReponse";
          ajouterChampSon(qrcode.qrcode.text_mauvaise_reponse.name, qrcode.qrcode.text_mauvaise_reponse.url);
        }

        $("#newNbMinimalBonneReponse").val(qrcode.getMinAnswer());
        logger.info('chargerqrcode.drawQRCodeImport | Import réussi du QR Exercice QR Code');
      });
    } else if (qrcode.getType() == 'ExerciceReconnaissanceVocaleQCM') {
      logger.info('chargerqrcode.drawQRCodeImport | Import d\'un QR Exercice Reconnaissance Vocale QCM, basculement sur onglet QR Exercice Reconnaissance Vocale QCM');
      $("#charger-page").load(getNormalizePath(root + "/rendererProcess/view/exerciceReconnaissanceVocale/exerciceReconnaissanceVocale.html"), function () {

        drawQRCodeDataRecVocale(qrcode);
        store.set("sousOnglet", "qcm");
        logger.info(`chargerqrcode.drawQRCodeImport | Import réussi du QR Exercice Reconnaissance Vocale QCM`);
      });
    } else if (qrcode.getType() == 'ExerciceReconnaissanceVocaleQuestionOuverte') {
      logger.info('chargerqrcode.drawQRCodeImport | Import d\'un QR Exercice Reconnaissance Vocale question ouverte, basculement sur onglet QR Exercice Reconnaissance Vocale question ouverte');

      $("#charger-page").load(getNormalizePath(root + "/rendererProcess/view/exerciceReconnaissanceVocale/exerciceReconnaissanceVocale.html"), function () {

        if (typeof qrcode.getName() === 'string') {
          $("#Question").val(qrcode.getName());
        } else {
          chamgementAudioSource('Question');
          ajouterChampSon(qrcode.getName().name, qrcode.getName().url);
        }

        $("#Bonnereponse").val(qrcode.getReponse());

        if (typeof qrcode.getGoodAnswer() === 'string') {
          $("#MessageBonnereponse").val(qrcode.getGoodAnswer());
        } else {
          chamgementAudioSource('MessageBonnereponse');
          ajouterChampSon(qrcode.getGoodAnswer().name, qrcode.getGoodAnswer().url);
        }

        if (typeof qrcode.getBadAnswer() === 'string') {
          $("#MessageMauvaisereponse").val(qrcode.getBadAnswer().name);
        } else {
          chamgementAudioSource('MessageMauvaisereponse');
          ajouterChampSon(qrcode.getBadAnswer().name, qrcode.getBadAnswer().url);
        }

        store.set("sousOnglet", "question_ouverte");
        logger.info('chargerqrcode.drawQRCodeImport | Import réussi d\'un QR Exercice Reconnaissance Vocale question ouverte');
      });
    } else if (qrcode.getType() == 'SeriousGameScenario') {
      logger.info('chargerqrcode.drawQRCodeImport | Import d\'un QR Serious Game, basculement sur onglet QR Serious Game');

      $("#charger-page").load(getNormalizePath(root + "/rendererProcess/view/seriousGame/seriousGame.html"), function () {
        $("#projectId").val(qrcode.getName());
        $("#textAreaIntro").val(qrcode.getIntro());
        $("#textAreaFin").val(qrcode.getEnd());
        var projet = new ProjetSeriousGame(qrcode.getName(), qrcode.getQuestionQRCode(), qrcode.getQuestionRecoVocale());
        drawQRCodeSeriousGameEnigma(qrcode);

        logger.info('chargerqrcode.drawQRCodeImport | Import réussi du QR Serious Game');
      });
    }
  } catch (e) {
    logger.error(`chargerqrcode.drawQRCodeImport | Problème lors de l'importation du QR code type : ${qrcode.getType()}\n${e}`);
  }
}

/** recréer les input d'un qrcode unique */
function drawQRCodeData(qrcodeObject) {
  logger.info(`chargerqrcode.drawQRCodeData | QRcode unique à charger ${JSON.stringify(qrcodeObject)}`);
  let data = qrcodeObject.getDataAll();

  for (let i = 1; i <= store.get(`numZoneCourante`); i++) {
    store.delete(`zone${i}`);
  }

  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] === "string") {
      ajouterChampLegende(data[i]);
    } else if (typeof data[i] === "object") {
      ajouterChampSon(data[i].name, data[i].url);
    }
  }
  let musics = data.filter(d => d.type == 'music');

  if (musics.length !== 0) {
    restoreSavedMusic(musics);
  }
}

/** recréer les qrcode unique d'un qrcode multiple */
function drawQRCodeMultipleUnique(qrcode) {
  for (var i = 0; i < qrcode.getData().length; i++) {
    let qrJson = qrcode.getData()[i].qrcode;
    let qr = null;

    if (qrJson.type == "unique") {
      qr = new QRCodeUnique(qrJson.name, qrJson.data, qrJson.color);
    }
    else if (qrJson.type == "ensemble") {
      qr = new QRCodeMultipleJson(qrJson.name, qrJson.data, qrJson.color);
    }
    else if (qrJson.type == "question") {
      qr = new QRCodeQuestionReponse(qrJson.name, qrJson.data, qrJson.color);
    }


    genererLigne(qr.getName());
    controllerMultiple.setQRCodeAtomiqueInArray(qr);
  }
  // recuperationQrCodeUnique(qrcode);
}

/**
 * Reconstruit la page de la question à reconnaissance vocale QCM
 * @param {ProjetQCM} qrcode instance de ProjetQCM contenant les donnée du QR code
 */
function drawQRCodeDataRecVocale(qrcode) {
  // Basculement vers l'onglet QCM
  $("#questionOuverteOnglet").removeClass("active");
  $("#onglet-QuesOuverte").removeClass("active");
  $("#questionQCMOnglet").addClass("active");
  $("#onglet-QCM").addClass("active");

  if (qrcode.getQuestions()) {
    // Parcours des questions du projet et ajout des questions sur la page
    for (let i = 0; i < qrcode.getQuestions().length; i++) {
      // Ajout des questions manquantes sur la page. 1 est déjà présente mais vide
      if (i > 0) ajouterNouvelleQuestion(false);

      const question = document.getElementById("textQuestion" + (i + 1));
      if (qrcode.getQuestions()[i].getTextQuestion().type === 'text') {
        question.value = qrcode.getQuestions()[i].getTextQuestion().text;
      } else {
        question.value = qrcode.getQuestions()[i].getTextQuestion().name;
        question.name = qrcode.getQuestions()[i].getTextQuestion().url;
        question.disabled = true;
      }

      // Ajout des réponses de la question
      if (qrcode.getQuestions()[i].getReponses()) {
        for (let j = 0; j < qrcode.getQuestions()[i].getReponses().length; j++) {
          // Ajout des réponses manquantes de la question. 1 est déjà présente mais vide
          if (j > 0) {
            ajouterNouvelleReponse(qrcode.getQuestions()[i].getReponses()[j].getReponse(), qrcode.getQuestions()[i].getReponses()[j].getIsGoodAnswer(), i + 1);
          } else {
            $('#question' + (i + 1) + 'Reponse' + (j + 1)).val(qrcode.getQuestions()[i].getReponses()[j].getReponse());
            $('#gridCheckQuestion' + (i + 1) + 'Reponse' + (j + 1)).prop('checked', qrcode.getQuestions()[i].getReponses()[j].getIsGoodAnswer());
          }
        }
      }
    }
  }

  // Message de bonne réponse, test s'il s'agit d'un texte ou d'un audio
  if (qrcode.getTextBonneReponse().type === 'text') {
    $("#MessageBonnereponseQCM").val(qrcode.getTextBonneReponse().text);
  } else {
    $("#MessageBonnereponseQCM").val(qrcode.getTextBonneReponse().name);
    $("#MessageBonnereponseQCM").attr('name', qrcode.getTextBonneReponse().url);
    $("#MessageBonnereponseQCM").attr('disabled', true);
  }

  // Message de mauvaise réponse, test s'il s'agit d'un texte ou d'un audio
  if (qrcode.getTextMauvaiseReponse().type === 'text') {
    $("#MessageMauvaisereponseQCM").val(qrcode.getTextMauvaiseReponse().text);
  } else {
    $("#MessageMauvaisereponseQCM").val(qrcode.getTextMauvaiseReponse().name);
    $("#MessageMauvaisereponseQCM").attr('name', qrcode.getTextMauvaiseReponse().url);
    $("#MessageMauvaisereponseQCM").attr('disabled', true);
  }
  SetProgressBar('QCM');
  isImportationExerciceRecoVocaleQCM = true;
}

/** recréer les inputs d'un qrcode Scenario Serious Game */
function drawQRCodeSeriousGameEnigma(qrcode) {
  let qrcodeMetadata = qrcode.qrcodeMetaData;
  let textNodes = [];
  let questionNodes = [];
  let linkArray = [];

  // Création SGTextNode
  for (let textNode of qrcodeMetadata.textNodes) {
    let qrTextNode = new SGTextNode(textNode.x, textNode.y, 100, 80);
    qrTextNode.name = textNode.name;
    qrTextNode.url = textNode.url;
    qrTextNode.description = textNode.text;

    textNodes.push(qrTextNode);
  }

  // Création SGQuestionNode
  for (let questionNode of qrcodeMetadata.questionNodes) {
    let qrQuestionNode = new SGQuestionNode(questionNode.x, questionNode.y, 100, 80);
    qrQuestionNode.name = questionNode.name;
    qrQuestionNode.url = questionNode.url;
    qrQuestionNode.question = questionNode.textQuestion;

    for (let i = 0; i < questionNode.reponses.length; i++) {
      // Il y a de base une réponse vide (avec son Dot) dans le questionNode, on utilise la fonction addAnswer pour ajouter une réponse et SGDot
      if (i !== 0) SGQuestionNode.addAnswer(qrQuestionNode);
      qrQuestionNode.answers[i] = questionNode.reponses[i].text;
    }

    questionNodes.push(qrQuestionNode);
  }

  // Création des liens des textNode
  for (let textNode of qrcodeMetadata.textNodes) {
    let next_node = textNode.exitLink;
    if (next_node) {
      // Recherche si lier à un textNode
      textNodes.forEach(n => {
        if (n.name === next_node) {
          textNodes.forEach(n2 => {
            if (n2.name === textNode.name) {
              let link = new SGLink(n2, n2.exitDots[0], n, n.entryDot);
              linkArray.push(link);
            }
          });
        }
      });
      // Recherche si lier à un questionNode
      questionNodes.forEach(n => {
        if (n.name === next_node) {
          textNodes.forEach(n2 => {
            if (n2.name === textNode.name) {
              let link = new SGLink(n2, n2.exitDots[0], n, n.entryDot);
              linkArray.push(link);
            }
          });
        }
      });
    }
  }

  // Création des liens des questionNode
  for (let questionNode of qrcodeMetadata.questionNodes) {
    // On parcourt les réponses du questionNode
    for (let i = 0; i < questionNode.reponses.length; i++) {
      let next_node = questionNode.reponses[i].exitLink;

      if (next_node) {
        // Recherche si la réponse est liée à un textNode
        textNodes.forEach(n => {
          // Si le nom du textNode correspond au Nom du noeud lier à l'exitLink
          if (n.name === next_node) {
            questionNodes.forEach(n2 => {
              if (n2.name === questionNode.name) {
                console.log(`Dot${n2.exitDots[i]}`);
                let link = new SGLink(n2, n2.exitDots[i], n, n.entryDot);
                linkArray.push(link);
              }
            });
          }
        });
        // Recherche si lier à un questionNode
        questionNodes.forEach(n => {
          // Si le nom du questionNode correspond au Nom du noeud lier à l'exitLink
          if (n.name === next_node) {
            questionNodes.forEach(n2 => {
              if (n2.name === questionNode.name) {
                console.log(n2.exitDots[i]);
                let link = new SGLink(n2, n2.exitDots[i], n, n.entryDot);
                linkArray.push(link);
              }
            });
          }
        });
      }
    }
  }

  // Ajout des nodes et link au dessin
  textNodes.forEach(n => myP5.nodeArray.push(n));
  questionNodes.forEach(n => myP5.nodeArray.push(n));
  linkArray.forEach(l => myP5.linkArray.push(l));
}


/** télécharger la musique correspondante et l'enregistrer */
function restoreSavedMusic(data) {
  let loader = document.createElement('div');
  let content = $('.tab-content');

  $(loader).addClass('loader');
  $('.card-body')[0].insertBefore(loader, content[0]); // show loader when request progress
  content.hide();

  let nbMusic = 0;

  for (let music of data) {
    let xhr = new XMLHttpRequest();
    try {
      xhr.open('GET', music.url, true);
    } catch (e) {
      console.log(e);
    }

    xhr.responseType = 'blob';
    xhr.onload = function (e) {

      if (this.status == 200) {
        /** get binary data as a response */
        let blob = this.response;
        let contentType = xhr.getResponseHeader("content-type");

        if (contentType == 'audio/mpeg') {
          /** save file in folder download */
          let fileReader = new FileReader();
          fileReader.onload = function () {
            // fs.writeFileSync(`${temp}/Download/${music.name}`, Buffer(new Uint8Array(this.result)));
            fs.writeFile(`${temp}/Download/${music.name}`, Buffer(new Uint8Array(this.result)), (err) => {
              if (err) throw err;
              console.log('The file has been saved!');
              nbMusic++;
              if (nbMusic == data.length) {
                $(loader).remove();
                content.show();
              }
            });
          };
          fileReader.readAsArrayBuffer(blob);
        } else {
          console.log('restoreSavedMusic : error on download, le fichier n\'existe peut etre plus');
        }
      } else {
        // request failed
        console.log('restoreSavedMusic : error on download, request fails');
      }
    };

    xhr.onerror = function (e) {
      console.log('restoreSavedMusic : error ' + e);
    };

    xhr.send();
  }
}

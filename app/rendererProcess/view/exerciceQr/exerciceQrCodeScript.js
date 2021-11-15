
/**
 * BAH Marouwane
 * 2019
 */
 
var projet = new Projet();

nombre_reponse = 0;

$(document).ready(function () {

  //méthode gérant la continuité
  enregistrement();

  initMessages();

  if (numReponse > 0)
    document.getElementById("ajoutNewReponse").disabled = false;

  //fonction pour ajouter un nouvelle reponse
  $("#validerDataDialog").on('click', function () {
    logger.info('Ajout d\'une réponse');
    let identifiant = $('#newId').val();
    let reponseVocale = $("#newContenuVocal").val();
    let qrColor = $('#qrColor').val();
    let qrData = [];

    document.getElementById("newContenuVocal").value = "";
    document.getElementById("newId").value = "";

    //On verifie qu'il y a une question de créée
    if (projet.getQuestion() == null) {
      return;
    }

    //On verifie que les champs de la réponse ne sont pas vide
    if (identifiant === "" || reponseVocale === "") {
      $("#alertChampManquantError").show();
      setTimeout(function () {
        $('#alertChampManquantError').hide();
      }, 3500);
      return false; // si le champ est vide on sort
    }

    let reponse = {
      type: 'text',
      text: reponseVocale
    };
    qrData.push(reponse);
    var new_rep = new QRCodeUnique(identifiant, qrData, qrColor);
    var new_rep_vocal = reponseVocale;

    //Récuperation des inforamtion de la question pour gérer la continuité
    numReponse++;
    deleteStore('numReponse');
    store.set('numReponse', numReponse);

    deleteStore("reponse" + numReponse);
    store.set("reponse" + numReponse, new_rep.getName());

    deleteStore("data" + numReponse);
    store.set("data" + numReponse, qrData);

    deleteStore("reponseId" + numReponse);
    store.set("reponseId" + numReponse, new_rep.getId());

    deleteStore("reponseColor" + numReponse);
    store.set("reponseColor" + numReponse, qrColor);

    //sortir de la fonction si la reponse existe déjà pour la question
    let existe = false;
    $.each(projet.getReponses(), function (i, val) {
      if (projet.getReponseById(val.getId()).getName() === identifiant) {
        existe = true;
        return;
      }
    });
    if (existe) {
      $("#alertReponseDoublonError").show();
      setTimeout(function () {
        $('#alertReponseDoublonError').hide();
      }, 3500);
      return false;
    }

    //Ajouter au projet et à la question la nouvelle réponse
    projet.addReponse(new_rep);
    //console.log('id='+new_rep.getId() );

    projet.getQuestion().addReponse((new_rep.getId()), new_rep_vocal);
    //console.log(projet.getQuestion());

    addReponseLine(new_rep);

    // console.log(new_rep_vocal);
    console.log(projet.getQuestion());
    console.log("--------------------");
    console.log(projet.getReponses());
    console.log("--------------------");
    console.log(projet.getQuestion().getReponses());

    verifNombreCaractere();
    return true;

  });

  //fonction pour e
  $("#preview").on('click', function () {
    previewQRCodeQuestion();
    $('#qrView').show();
  });




  $("#emptyFields").on('click', function () {
    viderZone();
    logger.info('Réinitialisation du QR Code Exercice');
    verifNombreCaractere();
    $("#cible").empty();                       //  pour vider les Bonnes Reponses!
  })

  function viderZone() {
    // masquage du lecteur de qr code
    $('#qrView').hide();

    //grissage des bouton qui etais grissé de basse
    $('#saveQRCode').attr('disabled', true);
    $("#ajoutNewReponse").attr('disabled', true);
    $("#preview").attr('disabled', true);

    //masquage de la zone bonne reponse
    $("#dropZone").hide();

    //reinitialisation de projet qui contient les questions
    projet = new Projet();
    //affichage du bouton question
    $("#genererQestion").show();

    controllerMultiple = new ControllerMultiple();
    $('#newQuestionText').val('');
    $('#newBonneReponseText').val('');
    $('#newMauvaiseReponseText').val('');
    $('#newNbMinimalBonneReponse').val('');

    $('#newQuestionText').attr('disabled', false);
    $("#newQuestionAudio").attr('disabled', false);
    $("#newBonneReponseText").attr('disabled', false);
    $("#newBonneReponseAudio").attr('disabled', false);
    $("#newMauvaiseReponseText").attr('disabled', false);
    $('#newMauvaiseReponseAudio').attr('disabled', false);
    $('#newNbMinimalBonneReponse').attr('disabled', false);



    deleteStore(`newQuestionText`);

    deleteStore(`newBonneReponseText`);

    deleteStore('newMauvaiseReponseText');

    deleteStore('newNbMinimalBonneReponse');

    for (var i = 1; i < numReponse + 1; i++) {
      deleteStore('reponse' + i);
      deleteStore('' + i);
      deleteStore('reponseId' + i);
      deleteStore('reponseColor' + i);
    }

    deleteStore('numReponse');
    numReponse = 0;
  }
  verifNombreCaractere();
});

// fonction qui ajoute la ligne de la reponse sur la zone prévu a cet effet
function addReponseLine(reponse) {
  if ($('#newNbMinimalBonneReponse').val() <= numReponse) {
    $("#preview").attr("disabled", false);
  }
  txtDragAndDrop.remove();
  var infos_rep = projet.getQuestion().getReponseById(reponse.getId());

  var newRepLine = "<div style='height:35px;' id='" + reponse.getId() + "'>" +
    "<li style='color:black;font-size:14px;'>" +
    "<label>" + reponse.getName() + "&nbsp&nbsp</label>" +
    "<em style='color:gray'>" + reponse.getData(0) + "</em>" +
    "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='deleteReponse(this);verifNombreCaractere();'><i class='fa fa-trash-alt'></i></button>" +
    "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='lireReponse(this);'><i class='fa fa-play'></i></button>" +
    "</li>" +
    "</div>";

  $("#cible").append(newRepLine);
}

$("#genererQestion").on('click', function () {
  $("#ajoutNewReponse").attr('disabled', false);
  let question = document.getElementById('newQuestionText');
  if (question.value.substring(question.value.length - 3, question.value.length) == "mp3") {
    question = {
      type: 'music',
      name: question.value,
      url: question.name
    }
  }
  else{
    question = {
      type: 'text',
      text: question.value
    }
  }
  let bonneReponse = document.getElementById('newBonneReponseText');
  if (bonneReponse.value.substring(bonneReponse.value.length - 3, bonneReponse.value.length) == "mp3") {
    bonneReponse = {
      type: 'music',
      name: bonneReponse.value,
      url: bonneReponse.name
    }
  }
  else{
    bonneReponse = {
      type: 'text',
      text: bonneReponse.value
    }
  }  
  let mauvaiseReponse = document.getElementById('newMauvaiseReponseText');
  if (mauvaiseReponse.value.substring(mauvaiseReponse.value.length - 3, mauvaiseReponse.value.length) == "mp3") {
    mauvaiseReponse = {
      type: 'music',
      name: mauvaiseReponse.value,
      url: mauvaiseReponse.name
    }
  }
  else{
    mauvaiseReponse = {
      type: 'text',
      text: mauvaiseReponse.value
    }
  }
  let nbMinBoneReponse = $('#newNbMinimalBonneReponse').val();
  let qrColor = $('#qrColor').val();

  
  //On verifie si le texte de la question n'est pas vide
  if (question !== "" && bonneReponse !== "" && mauvaiseReponse !== "" && nbMinBoneReponse !== "") {
    let nouvQuestion = new Question(question, bonneReponse, mauvaiseReponse, [], nbMinBoneReponse, qrColor);
    document.getElementById("newMauvaiseReponseText").disabled = true;
    document.getElementById("newQuestionText").disabled = true;
    document.getElementById("newBonneReponseText").disabled = true;
    document.getElementById("newNbMinimalBonneReponse").disabled = true;
    document.getElementById("newQuestionAudio").disabled = true;
    document.getElementById("newBonneReponseAudio").disabled = true;
    document.getElementById("newMauvaiseReponseAudio").disabled = true;

    projet.setQuestion(nouvQuestion);
    logger.info('Création du QR Code Exercice');

    initMessages();
    //affichage de la zone de question
    $("#dropZone").show();

    //on cache le bouton question
    $("#genererQestion").hide();
    verifNombreCaractere();
  } else {
    messageInfos("Veuillez renseigner tous les champs", "danger");
    logger.error("Des champs sont vides! ")
  }
});

//Permet de vider la zone Exercice ainsi que les éléméent enregistré dans le store
function viderZone() {
  deleteStore(`newQuestionText`);

  deleteStore(`newBonneReponseText`);

  deleteStore('newMauvaiseReponseText');

  deleteStore('newNbMinimalBonneReponse');

  for (var i = 1; i < numReponse + 1; i++) {
    deleteStore('reponse' + i);
    deleteStore('' + i);
    deleteStore('reponseId' + i);
    deleteStore('reponseColor' + i);
  }

  deleteStore('numReponse');
  numReponse = 0;

  $('#qrName').val('');
  $(txtZone).empty();
  $("#cible").empty();
  txtZone.appendChild(txtDragAndDrop);
}

//Permet d'effacer la valeur des champs dans la zone Exercice
function viderChamps() {
  document.getElementById("newQuestionText").value = "";
  document.getElementById("newBonneReponseText").value = "";
  document.getElementById("newMauvaiseReponseText").value = "";
  document.getElementById("newNbMinimalBonneReponse").value = "";
}


// Supprime une ligne dans la zone de drop
function effacerLigne() {
  //recuperation de id de l'element
  let idElement = $($(this).parent()).attr('id');
  $("#" + idElement).remove();
}

// Redonne l'apparance par default d'une ligne
function affichageLigneParDefault() {
  $('#txtZone').find('span').css('background-color', '')
}

/*Permet d'exporter un Projet
On enregistre toutes les questions et réponses du projet dans le répertoire sélectionné
par l'utilisateur*/
$("#saveQRCode").on('click', e => {
  saveQRCodeImage();
  logger.info('Exportation du QR Code Exercice');

});

var dropZone = document.getElementById('dropZone');
var txtZone = document.getElementById('txtZone');
var txtDragAndDrop = document.createElement("P");

txtDragAndDrop.setAttribute("id", "txtDragAndDrop");
txtDragAndDrop.setAttribute("class", "col-sm-7");
txtDragAndDrop.setAttribute("style", "text-align: center; margin-top: 15%");
txtDragAndDrop.innerText = "Déposez vos réponses ici";

txtZone.appendChild(txtDragAndDrop);
// Ce declenche quand un element entre dans la zone de drop
dropZone.ondragenter = function (e) { };

// Ce declenche quand un element quitte la zone de drop
dropZone.ondragleave = function (e) { };

// Ce declenche quand un element se deplace dans la zone de drop
dropZone.ondragover = function (e) {
  e.preventDefault();
};

// Ce declenche quand un element est depose dans la zone de drop
dropZone.ondrop = function (e) {
  e.preventDefault();
  //On verifie qu'il y a une question de créée
  if (projet.getQuestion() == null) {
    $("#errorModalQuestion").modal('show');
    return;
  }
  else {
    txtDragAndDrop.remove();
  }

  // Parcours le ou les fichiers drop dans la zone
  for (let i = 0; i < e.dataTransfer.files.length; i++) {
    let qrFile = e.dataTransfer.files[i];

    facade = new FacadeController();
    facade.importQRCodeJson(qrFile, qrCode => {
      if (qrCode.getType() == 'xl' || qrCode.getType() == 'unique' || qrCode.getType() == 'reponse') {
        let qrId = qrCode.getId();
        let qrDatad = qrCode.getData();
        let qrName = qrCode.getName();
        let qrData = [];

        //console.log(qrDatad[0]);

        qrData.push(qrDatad);
        var new_rep = new QRCodeUnique(qrName, qrData, $("#qrColor").val()); // cretation d'une nouvelle reponse
        new_rep.setId(qrId);        // changemnt de l'id de la nouvelle reponse avec l'id du qr imprté
        new_rep.setData(qrData);
        var new_rep_vocal = qrData;

        //Récuperation des inforamtion de la question pour gérer la continuité
        numReponse++;
        deleteStore('numReponse');
        store.set('numReponse', numReponse);

        deleteStore("reponse" + numReponse);
        store.set("reponse" + numReponse, new_rep.getName());

        deleteStore("data" + numReponse);
        store.set("data" + numReponse, qrData);

        deleteStore("reponseId" + numReponse);
        store.set("reponseId" + numReponse, qrId);

        deleteStore("reponseColor" + numReponse);
        store.set("reponseColor" + numReponse, $("#qrColor").val());

        console.log(qrData);

        //sortir de la fonction si la reponse existe déjà pour la question
        let existe = false;
        $.each(projet.getReponses(), function (i, val) {
          if (projet.getReponseById(val.getId()).getName() === qrName) {
            existe = true;
          }
        });
        if (existe) {
          messageInfos("Cette réponse existe déjà.", "danger");
          return;
        }

        //verification que le QR code a un id     &&
        if (qrCode.getId() == null) {
          messageInfos("Votre Qr Code n'a pas d'identifiant ERROR!", "danger");
          return;
        }

        //Ajouter au projet et à la question la nouvelle réponse
        projet.addReponse(new_rep);
        //console.log('id='+new_rep.getId() );
        projet.getQuestion().addReponse((new_rep.getId()), new_rep_vocal);
        //console.log(projet.getQuestion());
        addReponseLine(new_rep);
      }
      else
        messageInfos("Mauvais format de qr Code ! ", "danger");
    });
  }
};


//Permet d'afficher une information sur le bouton pour generer les qr code
function afficheInfoBtnQrCode(button, cible) {
  if (cible == "question") {
    $("#infoGenererQrCodeQuestion").show();
  }
  else if (cible == "reponse") {
    var id_reponse = $(button).attr('id');
    $("div#infoGenererQrCodeReponse" + id_reponse).show();
  }
}

//Permet d'enlever l'information sur le bouton pour generer les qr code
function supprimeInfoBtnQrCode(button, cible) {
  if (cible == "question") {
    $("#infoGenererQrCodeQuestion").hide();
  }
  else if (cible == "reponse") {
    var id_reponse = $(button).attr('id');
    $("#infoGenererQrCodeReponse" + id_reponse).hide();
  }
}

//fonction pour Supprimer une réponse du     &&
function deleteReponse(button) {
  var k = $('#newNbMinimalBonneReponse').val();
  var id_reponse = $(button).attr('id');
  console.log(k);
  console.log(numReponse);
  numReponse--;
  if (k > numReponse) {
    $("#preview").attr("disabled", true);
    console.log("test");
  }
  projet.removeReponse(id_reponse);
  $("div#" + id_reponse).remove();

  //retour a l'initiale quand toutes les reponses sont suprimées
  nombre_reponse--;
  console.log(nombre_reponse);
  console.log(projet.getQuestion());
  if (nombre_reponse == 0) {
    txtDragAndDrop.setAttribute("id", "txtDragAndDrop");
    txtDragAndDrop.setAttribute("class", "col-sm-7");
    txtDragAndDrop.setAttribute("style", "text-align: center; margin-top: 15%");
    txtDragAndDrop.innerText = "Déposez vos réponses ici";
    txtZone.appendChild(txtDragAndDrop);
  }

  //Permet de gérer la conuité en suppriant la "bonne" reponse du store
  for (var i = 1; i < numReponse + 1; i++) {
    if (store.get('reponseId' + i) == id_reponse) {
      deleteStore('reponse' + i);
      deleteStore('data' + i);
      deleteStore('reponseId' + i);
      deleteStore('reponseColor' + i);
    }


  }
  logger.info('Suppression d\'une réponse');


}

//Méthode appliqué au chargement pour récupérer les élément enregistrés
function enregistrement() {

  //nombre de zone texte courant
  if (store.get(`numReponse`))
    numReponse = store.get(`numReponse`);
  else
    store.set(`numReponse`, numReponse);

  if (store.get(`newQuestionText`))
    $("#newQuestionText").val(store.get(`newQuestionText`));

  if (store.get(`newBonneReponseText`))
    $("#newBonneReponseText").val(store.get(`newBonneReponseText`));

  if (store.get('newMauvaiseReponseText'))
    $("#newMauvaiseReponseText").val(store.get('newMauvaiseReponseText'));

  if (store.get('newNbMinimalBonneReponse'))
    $('#newNbMinimalBonneReponse').val(store.get('newNbMinimalBonneReponse'));

  //créé une nouvelles question si le nombre de réponse est superieur à 0
  if (numReponse > 0) {
    let nouvQuestion = new Question(store.get(`newQuestionText`), store.get(`newBonneReponseText`), store.get('newMauvaiseReponseText'), [], store.get('newNbMinimalBonneReponse'), $("#qrColor").val());
    projet.setQuestion(nouvQuestion);
    //affichage de la zone de question
    $("#dropZone").show();
    //on cache le bouton question
    $("#genererQestion").hide();
  }
  else {
    $("#dropZone").hide();
    $("#play-sound-div").hide();
  }

  //recréation des question
  for (var i = 1; i < numReponse + 1; i++) {
    if (store.get('reponse' + i)) {
      var new_rep = new QRCodeUnique(store.get('reponse' + i), store.get('data' + i), store.get('reponseColor' + i)); // creation d'une nouvelle reponse
      new_rep.setId(store.get('reponseId' + i));
      projet.addReponse(new_rep);

      projet.getQuestion().addReponse(new_rep.getId(), new_rep.getData());
      addReponseLine(new_rep);

    }
  }
}


//Cette fonction sauvegarde l'image du qrcode dans un div pour le pouvoir generer apres
function saveQRCodeImages(div, qrcode, directoryName) {
  let img = document.getElementById("qrView").children[0].src;
  //let data = img.replace(/^data:image\/\w+;base64,/, '');
  let matches = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let data = new Buffer(matches[2], 'base64');
  var file_name = qrcode.getName().replace(/[^a-zA-Z0-9]+/g, "") + '.jpeg';
  fs.writeFile(path.join(directoryName, file_name), data, (err) => {
    if (err) {
      $("#questionsDivLabelsId").append("<div>" + err + "</div>");
    }
    console.log('The file has been saved!');
  });
}

function saveQRCodeImage() {
  var dir_path = dialog.showOpenDialogSync({ title: 'Sélectionnez un dossier', properties: ['openDirectory'] })[0];
  if (dir_path !== undefined) {
    var facade = new FacadeController();
    projet.setName($("#newQuestionText").val());

    var dir_path = path.join(dir_path, projet.getName());

    var fs = require('fs');
    if (!fs.existsSync(dir_path)) {
      fs.mkdirSync(dir_path);
    }

    //On enregistre la question
    let div = document.createElement('div');
    facade.genererQRCode(div, projet.getQuestion());
    saveQRCodeImages(div, projet.getQuestion(), dir_path);


    //Idem pour les réponses
    $.each(projet.getReponses(), function (id, reponse) {
      let div = document.createElement('div');
      facade.genererQRCode(div, reponse);
      saveQRCodeImages(div, reponse, dir_path);
    });
  }
}

function previewQRCodeQuestion() {
  var question = projet.getQuestion();
  question.qrcode.color = $('#qrColor').val();
  previewQRCode(question, $('#qrView')[0]);
  logger.info(`Génération du QR Code ExerciceQR : ${JSON.stringify(question.qrcode)}`);
}

// Previsualiser les reponses
function previewQRCodeReponse(button) {
  var id_reponse = $(button).attr('id');
  let rep = projet.getReponseById(id_reponse);
  previewQRCode(rep, $('#qrView')[0]);
}

// generate and print qr code
function previewQRCode(qrcode, div) {
  let facade = new FacadeController();
  facade.genererQRCode(div, qrcode);
}

function lireReponse(button) {
  var id_reponse = $(button).attr('id');
  var text_reponse = $("div#" + id_reponse + " label").text();
  var text_retourVocal = $("div#" + id_reponse + " em").text();
  logger.info('Lecture d\'une réponse');
  playTTS(text_reponse + text_retourVocal);
}

//méthode gérant al continuité sur les eones de texte Question, Bonne Reponse, Mauvaise Reponse et nb reponse
function activerSave(text) {
  deleteStore(text);

  var newText = $("#" + text).val();
  store.set(text, newText);
}

//methode de suppression dans le store
function deleteStore(del) {
  if (store.get(del))
    store.delete(del);
}

//pour ouvrir la page info.html quand on clique sur le bouton info du haut
$("#infos-exercice-qrcode").on('click', function () {
  remoteElectron.getGlobal('sharedObject').ongletAideActif = 'exerciceQrCode';
  $("#charger-page").load(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/aide/info.html"));
});


//Partie audio

var audioSource="";

$("#newQuestionAudio").on('click', function () {
  audioSource = "Question";
  logger.info("Ajout d'un fichier audio pour la question ");
});
$("#newBonneReponseAudio").on('click', function () {
  audioSource = "BonneReponse";
  logger.info("Ajout d'un fichier audio pour la bonne réponse");
});
$("#newMauvaiseReponseAudio").on('click', function () {
  audioSource = "MauvaiseReponse";
  logger.info("Ajout d'un fichier audio pour la mauvaise réponse");
});


/** Fonction pour ajouter un fichier audio */
function getMusicFromUrl() {
  /** Check internet connection*/
  logger.info('Test de la connexion internet');
  if (!navigator.onLine) {
    logger.error(`L'application ne peut pas télécharger de fichier audio sans une liaison à internet. Veuillez vérifier votre connexion internet`);
    alert("L'application ne peut pas télécharger de fichier audio sans une liaison à internet. Veuillez vérifier votre connexion internet");
    setTimeout(function(){$('#musicUrl').val('');},1);//obliger de mettre un setTimeout pour que le champ texte se vide
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
  if (audioSource == "Question") {
    let textArea = document.getElementById("newQuestionText");
    textArea.value = nom;
    textArea.name = url;
    textArea.setAttribute("disabled", "true");
  } else if (audioSource == "BonneReponse") {
    let textArea = document.getElementById("newBonneReponseText");
    textArea.value = nom;
    textArea.name = url;
    textArea.setAttribute("disabled", "true");
  } else if (audioSource == "MauvaiseReponse") {
    let textArea = document.getElementById("newMauvaiseReponseText");
    textArea.value = nom;
    textArea.name = url;
    textArea.setAttribute("disabled", "true");
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

$(document).ready(function () {
  //Use to implement information on the audio import
  var info = document.createElement('div'); // balise div : contain html information
  var info_activ = false; // boolean : give the etat of info (up/off)

  /** Show the information about the audio file import (help) */
 $('button#showInfo').on('click', e => {
    e.preventDefault();
    if (info_activ == false) {
      info.innerHTML = ``;
      fetch(root + '/rendererProcess/components/audioinfo.html').then(function (response) {
        return response.text();
      }).then(function (string) {
        // console.log(string);
        info.innerHTML = string;
      }).catch(function (err) {
        console.log(info.innerHTML);
        info.innerHTML = `Erreur`;
      });
      document.getElementById('elementsAudio').appendChild(info);
      info_activ = true;
    }
    else {
      document.getElementById('elementsAudio').removeChild(info);
      info_activ = false;
    }
  });

  $('#closeModalListeMusic').on('click', e => {
    $('#musicUrl').val('');
    $('#listeMusic').find('.errorLoader').remove();
  });

  $("#play-sound-div").hide();
});



/**  une fonction pour calculer le nombre de car de QRcode + les id des qrcodes */
function calculNombreCaractereQRCode(){
  let char = 0;
  let qrQuestion = projet.getQuestion();
  let qrcodes    = projet.getReponses();
  if (qrcodes.length!=0){
    for (const element of qrcodes) {
        char += element.getId().toString().length; 
        char += 2;  // pour les  "" autour de chaque QR
    }
    char += qrcodes.length-1;  // pour compter la virgule qui se trouve entre chaque deux QRcodes
  }
  if (qrQuestion!=null) {
    char += qrQuestion.getColor().length
    char += qrQuestion.getId().toString().length;
    char += qrQuestion.getType().length;
    char ++;        // pour la version 
  }
  char += document.getElementById("newQuestionText").value.length;
  char += document.getElementById("newBonneReponseText").value.length;
  char += document.getElementById("newMauvaiseReponseText").value.length;
  char += document.getElementById("newNbMinimalBonneReponse").value.length;
  char += 133 ;   // nombre de caractères dans {"id":,"name":"","data":[],"nb_min_reponses":"","type":"","color":"","text_bonne_reponse":"","text_mauvaise_reponse":"","version":""} 
  return char;
}



function verifNombreCaractere() {
  let nombreCaratereMAX = 1240;
  //progress bar gestion
  let total = SetProgressBar();
  $('#messages').empty();
  if (total >= nombreCaratereMAX) {
    if($("#genererQestion").is(":visible")){
      messageInfos("La limite de caractère est atteinte (Environ 1100 caractères)", "warning");
    } else {
      messageInfos("La taille maximale est atteinte, il faut supprimer des Questions", "warning");
    }
    document.getElementById("newQuestionText").setAttribute("maxLength",0);
    document.getElementById("newBonneReponseText").setAttribute("maxLength",0);
    document.getElementById("newMauvaiseReponseText").setAttribute("maxLength",0);
  }
  else {
    document.getElementById("newQuestionText").setAttribute("maxLength",nombreCaratereMAX);
    document.getElementById("newBonneReponseText").setAttribute("maxLength",nombreCaratereMAX);
    document.getElementById("newMauvaiseReponseText").setAttribute("maxLength",nombreCaratereMAX);
  }
  if (document.getElementById("newQuestionText").value.length==0 && document.getElementById("newBonneReponseText").value.length==0 &&
      document.getElementById("newMauvaiseReponseText").value.length==0)
  {
    document.getElementById("progressbarId").style.width=0;
  }
}


/** fonction qui fait la mis à jour de Progress Bar */
function SetProgressBar() {
  //progress bar gestion
  let total = 0;
  let nombreCaratereMAX = 1240;
  total += calculNombreCaractereQRCode();   
  let totalSeted = Math.trunc((total / nombreCaratereMAX) * 10000) / 100;
  //mise ajour des données sur le progress bar
  $("#progressbarId").attr('aria-valuenow', totalSeted);
  $("#progressbarId").attr("style", "width:" + totalSeted + "%");
  $("#progressbarId").text(totalSeted + "%");
  //FIN progress bar gestion
  return total;
}
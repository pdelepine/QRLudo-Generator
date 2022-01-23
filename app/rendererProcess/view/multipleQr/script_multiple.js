/**
 * @Date:   2018-12-06T16:32:33+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2019-01-16T23:37:53+01:00
 */


$().ready(function () {
  enregistrement();
  store.delete(`numFich`);
  store.set(`numFich`, numFich);

  $("#play-sound-div").hide();


  /** Genere le qrCode multiple */
  $("#preview").on('click', function () {

    affichageLigneParDefault();

    let qrColor = $("#qrColor").val();
    controllerMultiple.setQRCodeMultiple(new QRCodeMultipleJson(document.getElementById('qrName').value, [], qrColor));


    /** Ajoute les donnees json de chaque qrCode unique dans le qrCode multiple */
    let qrcodes = controllerMultiple.getQRCodeAtomiqueArray();
    let qrcodeEns = controllerMultiple.getQRCodeMultiple();


    for (let i = 0; i < qrcodes.length; i++) {
      qrcodeEns.ajouterQrCode(qrcodes[i]);
    }

    let facade = new FacadeController();
    facade.genererQRCode($('#qrView')[0], qrcodeEns);
    //console.log($('#qrView')[0]);

    // On affiche le qrCode
    $('#qrView').show();
    $('#saveQRCode').attr('disabled', false);

    logger.info("Génération du QR Code Multiple : " + JSON.stringify(qrcodeEns.qrcode));
  });

  //$("#empty").on('click',viderZone);
  $("#emptyFields").on('click', function () {
    viderZone();
    verifNombreCaractere();
  })

  $("#saveQRCode").on('click', e => {
    saveQRCodeImage();
  });

  if (document.getElementById('qrName').value.length === 0) {
    $('#preview #empty').attr('disabled', true);
  }

  if (numFich > 0)
    document.getElementById('preview').disabled = false;

  verifNombreCaractere();
});

var dropZone = document.getElementById('dropZone');
var txtZone = document.getElementById('txtZone');

var txtDragAndDrop = document.createElement("P");

txtDragAndDrop.setAttribute("id", "txtDragAndDrop");
txtDragAndDrop.setAttribute("class", "col-sm-7");
txtDragAndDrop.setAttribute("style", "text-align: center; margin-top: 15%");
txtDragAndDrop.innerText = "Déposez vos fichiers ici";

txtZone.appendChild(txtDragAndDrop);
/** Ce declenche quand un element entre dans la zone de drop */
dropZone.ondragenter = function (e) { };

/** Ce declenche quand un element quitte la zone de drop */
dropZone.ondragleave = function (e) { };

/** Ce declenche quand un element se deplace dans la zone de drop */
dropZone.ondragover = function (e) {
  e.preventDefault();
};

/** Ce declenche quand un element est depose dans la zone de drop */
dropZone.ondrop = function (e) {
  e.preventDefault();

  logger.info(`script_multiple.dropZone.ondrop | Un élement à été déposé dans la zone de drop : ${e}`);

  let afficherPopUp = false;
  let nomFichierIdentique = "";

  /** Parcours le ou les fichiers drop dans la zone */
  for (let i = 0; i < e.dataTransfer.files.length; i++) {
    let qrFile = e.dataTransfer.files[i];

    controllerMultiple.isUnique(qrFile, qrcode => {
      //TODO Ici changer le "ensemble" en "multiple"
      if (qrcode.getType() != "ensemble") {
        let words = qrFile.name.split(".");
        if (!controllerMultiple.occurenceFichier(words[0])) {
          genererLigne(words[0], numFich);
          store.set(`fichierDrop${numFich}`, words[0]);
          numFich++;
          store.set(`numFich`, numFich);
          controllerMultiple.recuperationQrCodeUnique(qrFile);
        } else {
          afficherPopUp = true;
          nomFichierIdentique += "\t" + words[0] + "\n";
        }
      } else {
        messageInfos("Impossible de mettre un qrcode multiple dans un qrcode multiple. Veuillez mettre que des qrcodes uniques", "danger");
      }
    });

  }

  logger.info(`script_multiple.dropZone.ondrop | L'élement déposé est : ${controllerMultiple.getQRCodeAtomiqueArray()}`);

  /** Affiche un popup avec le nom des fichiers qui n'ont pu être ajouté */
  if (afficherPopUp) {
    messageInfos("Un ou plusieurs fichiers ont le même nom : " + nomFichierIdentique, "warning");
  }
  activer_button();
};

function ajoutQrCcode() {

  let qrColor = $('#qrColor').val();
  var qrName = $("#nomQR").val();
  var donnee = document.getElementById("ContenuQR");
  var qrData = [];
  if (donnee.value.substring(donnee.value.length - 3, donnee.value.length) == "mp3") {
    donnee = {
      type: 'music',
      name: donnee.value,
      url: donnee.name
    }

    let jsonAudio = JSON.stringify(donnee);
    qrData.push(JSON.parse(jsonAudio));
  }
  else {
    donnee = {
      type: 'text',
      text: donnee.value
    }

    let jsonText = JSON.stringify(donnee);
    qrData.push(JSON.parse(jsonText));
  }

  /** Reset de la boite de dialogue */
  document.getElementById("nomQR").value = "";
  document.getElementById("ContenuQR").value = "";
  document.getElementById("ContenuQR").disabled = false;

  let newQrUnique = new QRCodeUnique(qrName, qrData, qrColor);
  genererLigne(qrName, numFich);

  store.set(`fichierDrop${numFich}`, qrName);
  numFich++;
  store.set(`numFich`, numFich);

  controllerMultiple.ajoutQRcode(newQrUnique);

  activer_button();

  document.getElementById("saveQRCode").disabled = true;

  logger.info("Ajout d'un QR Code : " + JSON.stringify(newQrUnique.qrcode));
}

/** permet la continuité entre les onflet spécifiquement pour l'onglet multiple */
function enregistrement() {

  if (store.get(`numFich`)) {
    numFich = store.get(`numFich`);
  }

  /** vérifier si un enregistrement du titre existe */
  if (store.get(`titremultiple`)) {
    $('#qrName').val(store.get(`titremultiple`));
  }

  for (var i = 0; i < numFich; i++) {
    if (store.get(`fichierDrop${i}`)) {
      genererLigne(store.get(`fichierDrop${i}`));
    }
  }
}

function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
/**
 * Genere une ligne dans la zone de drop en fonction des fichiers drop dans la zone
 * Chaque ligne est clickable pour affichier le qrCode unique
 * Chaque ligne a un bouton pour supprimer la ligne
 */
function genererLigne(name, numLigne) {
  $('#txtDragAndDrop').hide();

  let baliseDiv = document.createElement("DIV");
  let baliseSpan = document.createElement("SPAN");
  let textDiv = document.createTextNode(name);

  let baliseButtonDelete = document.createElement("BUTTON");
  let baliseIDelete = document.createElement("I");

  let baliseButtonUp = document.createElement("BUTTON");
  let baliseIUp = document.createElement("I");

  let baliseButtonDown = document.createElement("BUTTON");
  let baliseIDown = document.createElement("I");

  let balisePrevisualisation = document.createElement("BUTTON");
  let baliseIPrevisualisation = document.createElement("I");

  let baliseLabel = document.createElement("LABEL");
  baliseLabel.setAttribute("class", "btn");
  baliseLabel.innerHTML = name;

  /** fonctionnalité bouton delete   && */
  setAttributes(baliseIDelete, { "class": "fa fa-trash-alt ", "height": "8px", "width": "8px" });
  baliseButtonDelete.addEventListener("click", effacerLigne);
  baliseButtonDelete.addEventListener("click", verifNombreCaractere);
  baliseButtonDelete.setAttribute("class", "btn btn-outline-success float-right");
  baliseButtonDelete.setAttribute("padding", "10px 10px");
  baliseButtonDelete.appendChild(baliseIDelete);

  /** fonctionnalité bouton up  && */
  setAttributes(baliseIUp, { "class": "fa fa-arrow-up ", "height": "8px", "width": "8px" });
  baliseButtonUp.setAttribute("class", "btn btn-outline-success float-right ");
  baliseButtonUp.appendChild(baliseIUp);
  baliseButtonUp.setAttribute("id", name + 'Up');
  baliseButtonUp.addEventListener("click", upItem);

  /** fonctionnalité bouton down  && */
  setAttributes(baliseIDown, { "class": "fa fa-arrow-down ", "height": "8px", "width": "8px" });
  baliseButtonDown.setAttribute("class", "btn btn-outline-success float-right ");
  baliseButtonDown.appendChild(baliseIDown);
  baliseButtonDown.setAttribute("id", name + 'Down');
  baliseButtonDown.addEventListener("click", downItem);

  /** fonctionnalité bouton previsualisation */
  setAttributes(baliseIPrevisualisation, { "class": "fa fa-qrcode", "height": "8px", "width": "8px" });
  balisePrevisualisation.setAttribute("class", "btn btn-outline-success float-right");
  balisePrevisualisation.setAttribute("id", name + 'Previsualisation');
  balisePrevisualisation.addEventListener("click", afficherQrCode)
  balisePrevisualisation.appendChild(baliseIPrevisualisation);

  /** fonctionnalité nom qrcode */
  baliseSpan.appendChild(baliseLabel);
  baliseSpan.setAttribute("style", "white-space: nowrap; padding:5px; font-size:0.7em;");
  baliseSpan.setAttribute("class", "qrData text-left ");
  baliseSpan.setAttribute("name", "qrCode");

  //baliseDiv.addEventListener("click", afficherQrCode);
  baliseDiv.setAttribute("style", "height:40px");
  baliseDiv.appendChild(baliseSpan);
  baliseDiv.id = name;

  baliseDiv.appendChild(baliseButtonDelete);
  baliseDiv.appendChild(balisePrevisualisation)
  baliseDiv.appendChild(baliseButtonUp);
  baliseDiv.appendChild(baliseButtonDown);

  txtZone.appendChild(baliseDiv);
}

/** Affiche le qrCode unique lie à la ligne cliquable */
function afficherQrCode(e) {
  let item = e.target;
  let id = this.id;

  affichageLigneParDefault();


  let qrcodes = controllerMultiple.getQRCodeAtomiqueArray();
  /** Affiche le QR Code que l'on vient de selectionner */
  for (let i = 0; i < qrcodes.length; i++) {
    if (qrcodes[i].getName() + "Previsualisation" == id) {
      let facade = new FacadeController();
      facade.genererQRCode($('#qrView')[0], qrcodes[i]);
      controllerMultiple.setQRCodeSelectionne(qrcodes[i]);
    }
  }

  logger.info("Prévisualisation d'un Qr code : " + JSON.stringify(controllerMultiple.getQRCodeSelectionne()));
}

/** Supprime une ligne dans la zone de drop */
function effacerLigne() {
  let id = this.parentNode.id;

  for (var i = 0; i < numFich; i++) {
    if (store.get(`fichierDrop${i}`) == id) {
      store.delete(`fichierDrop${i}`);
    }
  }
  /** Supprime la ligne html lie au fichier */
  for (let i = 0; i <= txtZone.childElementCount; i++) {
    if (txtZone.childNodes[i].id == id) {
      txtZone.removeChild(txtZone.childNodes[i]);
    }
  }

  /** Supprime le fichier dans le tableau files */
  let qrCodes = controllerMultiple.getQRCodeAtomiqueArray();
  controllerMultiple.setQRCodeAtomiqueArray(qrCodes.filter(item => item.getName() != id));

  /** verification qu'il ne reste plus delement pour remetre le text du dop */
  if ($("#txtZone div").length == 0) {
    $('#txtDragAndDrop').show();
  }

  logger.info("Suppression d'un QR Code; id : " + JSON.stringify(id));
}

/** Vide les tableaux qrCodes, files et les lignes de la zone drop */
function viderZone() {
  controllerMultiple = new ControllerMultiple();
  $('#qrName').val('');
  $(txtZone).empty();

  $('#qrView').hide();
  txtZone.appendChild(txtDragAndDrop);
  $('#txtDragAndDrop').show();

  /** Permet la suppression des elements du store créé dans le script_multiple */
  if (store.get(`numFich`)) {
    store.delete(`numFich`);
  }

  /** vérifier si un enregistrement du titre existe */
  if (store.get(`titremultiple`)) {
    store.delete(`titremultiple`);
  }

  for (var i = 0; i < numFich; i++) {
    if (store.get(`fichierDrop${i}`)) {
      store.delete(`fichierDrop${i}`);
    }
  }
  numFich = 0;

  logger.info("Réinitialisation de la page multiple");
}

/** Redonne l'apparance par default d'une ligne */
function affichageLigneParDefault() {
  $('#txtZone').find('span').css('background-color', '')
}

/** Active le button vider et generer apres avoir donne un nom au qrCode */
function activer_button() {
  /** Permet l'enregistrement du titre dans le store */
  store.delete(`titremultiple`);
  var titre = document.getElementById('qrName').value;
  store.set(`titremultiple`, titre);

  //if (document.getElementById('qrName').value.length > 0) {
  $('#preview ,#empty').attr('disabled', false);
  //}
}

/** save image qr code */
function saveQRCodeImage() {
  const fs = require('fs');

  let qrcode = controllerMultiple.getQRCodeMultiple();
  let img = $('#qrView img')[0].src;

  // var data = img.replace(/^data:image\/\w+;base64,/, '');

  var data = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.open('GET', data, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == xhr.DONE) {
      var filesaver = require('file-saver');
      filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg');
    }
  }

  xhr.send();

  logger.info("Exportation du QR Code multiple");
}

/**  function pour calculer le nombre de caractères du QRcode Multiple intermédiaire */
function caractDansQRMult() {
  let char = 0;
  let qrColor = $('#qrColor').val();
  let qrName = $('#qrName').val();
  let qrData = "random String";

  let newQrMult = new QRCodeMultipleJson(qrName, qrData, qrColor);

  char += qrColor.length;
  char += newQrMult.getType().length;
  char++;  // ++1 pour la version 'pas de getter dans la class QRCodeMultipleJson 
  char += 63;  // la taille de  {"name":"","type":"ensemble","data":[],"color":"","version":""}

  return char;
}


/**  une fonction pour calculer la somme des caractères de chaque qrcode unique */
function caractDeQRCodesUniques() {
  let char = 0;
  let qrcodes = controllerMultiple.getQRCodeAtomiqueArray();

  for (const element of qrcodes) {
    char += element.getData().toString().length;
    char += element.getColor().toString().length;
    char += element.getId().toString().length;
    char += element.getName().toString().length;
    char += element.getType().toString().length;
    char += 63; // la taille de {"qrcode":{"id":"","name":"","type":"","data":[""],"color":""}}
  }

  char += caractDansQRMult();  // plus les caractères dans le qrmult
  return char;
}

function verifNombreCaractere() {

  var nombreCaratereMAX = 1240;
  //progress bar gestion
  var total = SetProgressBar();

  $('#messages').empty();

  if (total >= nombreCaratereMAX) {
    messageInfos("La limite de caractère est atteinte (Environ 1100 caractères)", "warning");
    //si nombre de caractére max attein on disable le button pour l'ajoute d'autre qrCode
    document.getElementById("addNewQR").disabled = true;
    document.getElementById("qrName").setAttribute("maxlength", 0);
  }
  else {
    document.getElementById("addNewQR").disabled = false;
    document.getElementById("qrName").setAttribute("maxlength", nombreCaratereMAX);
  }

  // si le nombre de caractére max n'est pas attein mais le progress bar est > 85%, on disable le button d'ajoute 
  if (Math.round((total * 100) / nombreCaratereMAX) >= 85) {
    document.getElementById("addNewQR").disabled = true;
  }

  // si le champ de qrName est vide ou si le pourcentage>100 , on disable le button de génération de QRcode
  if (document.getElementById("qrName").value.length == 0 || total > nombreCaratereMAX) {

    document.getElementById("preview").disabled = true;

  } else {

    document.getElementById("preview").disabled = false;

  }

  if (document.getElementById("qrName").value.length == 0 && controllerMultiple.getQRCodeAtomiqueArray() == 0) {
    document.getElementById("progressbarId").style.width = 0;
  }

}


/** foncion qui fait la mis à jour de Progress Bar */
function SetProgressBar() {
  //progress bar gestion
  var total = 0;

  var nombreCaratereMAX = 1240;

  if (document.getElementById("qrName") != null) total += document.getElementById("qrName").value.length;

  // on ajoute la tailles des uniques qrcodes
  total += caractDeQRCodesUniques();

  var totalSeted = Math.round((total * 100) / nombreCaratereMAX);

  //mise ajour des données sur le progress bar
  $("#progressbarId").attr('aria-valuenow', totalSeted);
  $("#progressbarId").attr("style", "width:" + totalSeted + "%");
  $("#progressbarId").text(totalSeted + "%");
  //FIN progress bar gestion
  return total;
}



/** fonction deplacement de fichier vers le haut ou bas  &&& */
function upItem(e) {
  let parentElement = $(this).parent();

  /** Gere la continuité sur le moveUp : */
  let parentElementVal = parentElement.attr('id');
  let prevVal = $(parentElement).prev().attr('id');
  /** Permet de savoir le numFich qui correspond au fichier appelé avec le bouton */
  var tmpVal = 0;

  for (var i = 0; i < numFich; i++) {
    if (store.get(`fichierDrop${i}`) == parentElementVal)
      tmpVal = i;
    if (store.get(`fichierDrop${i}`) == prevVal)
      store.set(`fichierDrop${i}`, parentElementVal);
  }
  store.set(`fichierDrop${tmpVal}`, prevVal);

  $(parentElement).insertBefore($(parentElement).prev());
  logger.info("Déplacement d'un QR Code vers le haut; id : " + JSON.stringify(parentElementVal));
}

/** fonction deplacement de fichier vers bas  &&& */
function downItem(e) {
  let parentElement = $(this).parent();

  /** Gere la continuité sur le moveUp : */
  let parentElementVal = parentElement.attr('id');
  let nextVal = $(parentElement).next().attr('id');
  /** Permet de savoir le numFich qui correspond au fichier appelé avec le bouton */
  var tmpVal = 0;

  for (var i = 0; i < numFich; i++) {
    if (store.get(`fichierDrop${i}`) == parentElementVal)
      tmpVal = i;
    if (store.get(`fichierDrop${i}`) == nextVal)
      store.set(`fichierDrop${i}`, parentElementVal);
  }
  store.set(`fichierDrop${tmpVal}`, nextVal);

  $(parentElement).insertAfter($(parentElement).next());
  logger.info("Déplacement d'un QR Code vers le bas; id : " + JSON.stringify(parentElementVal));
}

//pour ouvrir la page info.html quand on clique sur le bouton info du haut
$("#infos-multiple").on('click', function () {
  remoteElectron.getGlobal('sharedObject').ongletAideActif = 'multiple'
  $("#charger-page").load(getNormalizePath(root + '/rendererProcess/view/aide/info.html'));
});

//Partie audio

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
  let textArea = document.getElementById("ContenuQR");
  textArea.value = nom;
  textArea.name = url;
  textArea.setAttribute("disabled", "true");
}

function showError(modal, errorMsg, message = "Veuillez coller un lien de fichier téléchargeable. Reportez vous à la rubrique Info pour plus d'informations.") {
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
  // Gestion de la continuité
  enregistrement();

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
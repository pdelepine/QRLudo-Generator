
/**
 * @Author: alassane
 * @Date:   2018-11-10T17:59:11+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2019-02-04T21:09:51+01:00
 */

// fichier script concernant les qr codes uniques
var qrcode;
var qrType;
var newQrUnique;

// var { ipcRenderer } = require('electron');
var { Menu, MenuItem } = remoteElectron;

var menu = new Menu();

$(document).ready(function () {


  store.set("charMax", 1134);

  //appel à la fonction qui permet de lire les enregistrement
  chargement();
  SetProgressBar();



  //Use to implement information on the audio import
  var info = document.createElement('div'); // balise div : contain html information
  var info_activ = false; // boolean : give the etat of info (up/off)


  // desactiver les boutons s'il y a rien à lire ou generer
  if (document.getElementById('qrName') !== null) {
    if (document.getElementById('qrName').value.length === 0) {
      $('#preview').attr('disabled', true);
    }
  }

  $("#saveQRCode").on('click', e => {
    saveQRCodeImage();
  });

  $('#closeModalListeMusic').on('click', e => {
    $('#musicUrl').val('');
    $('#listeMusic').find('.errorLoader').remove();
  }); // close modal add music

  // enable right click
  menu.append(new MenuItem({
    label: 'Coller le lien',
    click() {
      const {
        clipboard
      } = require('electron');
      let url = clipboard.readText();
      $('input#musicUrl').val(url);
      getMusicFromUrl();
    }
  }));

  $('input#musicUrl').contextmenu(e => {
    menu.popup(require('electron').remote.getCurrentWindow())
    if (info_activ == true) {
      document.getElementById('elementsAudio').removeChild(info);
      info_activ = false;
    }
  });

  /** Show the information about the audio file import (help) */
  $('button#showInfo').on('click', e => {
    e.preventDefault();
    if (info_activ == false) {
      info.innerHTML = ``;
      fetch(path.join(__dirname.match(`.*app`)[0], '/rendererProcess/components/audioinfo.html')).then(function (response) {
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

  $('button#emptyFields').on('click', function () {

    /** mise a jour des données sur le progress bar */
    $("#progressbarId").attr('aria-valuenow', 0);
    $("#progressbarId").attr("style", "width:" + 0 + "%");
    $("#progressbarId").text(0);
    $("#textarea1").val("");
    $("#qrName").val("");

    //FIN progress bar gestion
    //afficher popup quand on click sur reinitialiser
    // cache le qr générer & desactivation du bouton exporter

    store.delete(`titreUnique`);
    //implémentation des différentes zones de txt enregistrées
    for (var i = 0; i <= numZoneCourante; i++) {
      if (store.get(`zone${i}`)) {
        store.delete(`zone${i}`);
      }
    }

    /** On parcours le store pour afficher les texte enregistré dans les zones correspondantes */
    for (var i = 0; i <= numZoneCourante; i++) {
      if (store.get(`text${i}`)) {
        store.delete(`text${i}`);
      }
    }

    store.delete("numZoneCourante");
    numZoneCourante = 0;
    store.set(`numZoneCourante`, numZoneCourante);
    store.delete("nbZoneDonne")
    nbZoneDonne = 0;
    store.set(`nbZoneDonne`, nbZoneDonne);

    /** supprimer les textarea, inputs .. */
    var divChamps = $('#cible');
    divChamps.children($('.legendeQR')).remove();
    ajouterChampLegende();

    document.getElementById("check-ios").checked = false;

    if(store.get(`typeUnique`)) {
      store.delete(`typeUnique`);
    }

    $('#qrView').hide();
    $('#saveQRCode').attr('disabled', true);
    $('#preview').attr('disabled', true);

    var settings = require('electron').remote.require("electron-settings");
    if (settings.hasSync("defaultColor")) {
      $("#qrColor").val(settings.getSync("defaultColor"));
    }

    $("#ajouterTexte").attr('disabled', false);

    logger.info('Réinitialisation du QRCode Unique');
  });
});

/** trigger preview qrcode action */
$('#preview').on('click', e => {

  //re-afficher le qr generer si le bouton est reinitialiser a deja été utilisé
  $("#qrView").show();

  //enlever les messages en haut de page
  initMessages();
  let inputArray = $('input, textarea');

  // get all required attributes for qrcode
  let qrColor = $('#qrColor').val();
  let qrName = $('#qrName').val();
  if(document.getElementById("check-ios").checked == true)
    qrType = "xl"
  else
    qrType = "unique"
  let qrData = [];

  for (let data of document.getElementsByClassName("form-control qrData")) {
    if (data.name.substr(0, 5) == 'https' || data.name.substr(0, 4) == 'https') {
      let dataAudio = {
        type: 'music',
        url: data.name,
        name: data.value
      }

      let jsonAudio = JSON.stringify(dataAudio);
      qrData.push(JSON.parse(jsonAudio));
    } else {
      let dataText = data.value;

      let jsonText = JSON.stringify(dataText);
      qrData.push(JSON.parse(jsonText));
    }
  }

  qrType = $('#typeQRCode').val();

  // Generate in a div, the qrcode image for qrcode object
  let div = $('#qrView')[0];

  newQrUnique = new QRCodeUnique(qrName, qrType, qrData, qrColor);

  newQrUnique.setId(store.get("newQrID"));

  previewQRCode(qrName, qrData, qrColor, div);
  $('#emptyZones').attr('disabled', false);
});




function generQRInter() {
  /**
  cette fonction va être appeler quand on va remplir le champ de "qrName" et elle va générer un qrcode intermédiaire
  et on prends son ID et on va stocker ce ID dans l'objet store "newQrID" et on va également stocker le nombre de char Max
  qu'on peut avoir dans un qrcode dans l'objet store "charMax"
  charMax = 1240 - qrcolor - qrID - qrtype et  puis dans la fonction verifNombreCaractere on va prendre en
  compte qrName et qrData "compter les mots qui se trouvent dans les champs qname et data".

  et puis on va appeler verifNombreCaractere pour verifier le nombre de caractere total ou j'ai ajouté le comptage de char
  du champ qrName et la fonction verifNombreCaractere va appeler la fonction SetProgressBar qui va faire la mise à jour
  du progressBar

  sachant que comme j'ai implémenté cette solution de manière dynamique, on perd l'assosiation data -> ID comme l'ID
  est calculé en fonction de data.
  */

  let charMax = 1240;
  let qrColor = $('#qrColor').val();
  let qrName = $('#qrName').val();
  let qrData = random_string(50);
  if(document.getElementById("check-ios").checked == true)
    qrType = "xl"
  else
    qrType = "unique"
  let newQrUnique = new QRCodeUnique(qrName, qrType, qrData, qrColor);
  //  le QRcode intermédiaire
  //  console.log(`test : ${ JSON.stringify(newQrUnique) }`);
  charMax -= qrColor.length;
  charMax -= newQrUnique.getType().length;
  charMax -= newQrUnique.getId().length;
  // a nested function to generate a random string in order to get QRcode data and use it to generate our QRcode
  function random_string(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  store.set("newQrID", newQrUnique.getId());
  verifNombreCaractere(store.get("numZoneCourante"));
  store.set("charMax", charMax);

}

/** Fonction permettant la continuité entre les onglet avec la gestion de l'objet store */
function chargement() {

  //nombre de zone texte courant
  if (store.get(`nbZoneDonne`))
    numZoneDonne = store.get(`nbZoneDonne`);
  else
    store.set(`nbZoneDonne`, nbZoneDonne);

  //indice des zones textes presente, peut etre superieur au zone texte presente
  if (store.get(`numZoneCourante`))
    numZoneCourante = store.get(`numZoneCourante`);
  else
    store.set(`numZoneCourante`, numZoneCourante);

  if (store.get(`titreUnique`)) {
    $('#qrName').val(store.get(`titreUnique`));
  }

  if(store.get(`typeUnique`)){
    document.getElementById("check-ios").checked = store.get(`typeUnique`);
  }

  if (!isImportationQRUnique) {
    //implémentation des différentes zones de txt enregistrées
    for (var i = 1; i <= numZoneCourante; i++) {
      if (store.get(`zone${i}`)) {
        var text = document.createElement('div');
        text.innerHTML = store.get(`zone${i}`);
        text.setAttribute("class", "d-flex align-items-start legendeQR");

        // L'id du div est différent si c'est une zone de texte ou un fichier audio
        if (store.get(`zone${i}`).indexOf("textarea") != -1) {
          text.setAttribute("id", "legendeTextarea" + i);
        }
        else {
          text.setAttribute("id", "inputAudio");
        }

        $('#cible').append(text);
      }
    }
  }

  /** On parcours le store pour afficher les texte enregistré dans les zones correspondantes */
  for (var i = 0; i <= numZoneCourante; i++) {
    if (store.get(`text${i}`)) {
      $('#textarea' + (i)).val(store.get(`text${i}`));
    }
  }

  //insertion du premier champ Texte s'il y en a pas
  if (numZoneCourante < 1) {
    ajouterChampLegende();
  }
}

/** form validation return true if all fields are filled */
function validateForm(inputArray) {
  //cet index pour enlever un input de type file
  let index = 0;
  initMessages();
  for (input of inputArray) {
    // eliminer les input de type file
    if ($(input).attr('type') != 'file') {
      if (!$(input).val() || $(input).val() == "") {
        messageInfos("Veuillez renseigner tous les champs", "danger"); //message a afficher en haut de la page
        return false;
      }
    } else {
      //enlever l'element input de type file
      inputArray.splice(index, 1);
    }

    ++index;
  }

  return true;
}


/** generate and print qr code */
function previewQRCode(name, data, color, div) {

  // instanciate a qrcode unique object
  if(document.getElementById("check-ios").checked == true)
    type = "xl"
  else
    type = "unique"
  qrcode = new QRCodeUnique(name, type, data, color);
  let facade = new FacadeController();
  logger.info(`Génération du QR Code Unique : ${JSON.stringify(qrcode)}`);
  facade.genererQRCode(div, qrcode);
}

/** save image qr code */
function saveQRCodeImage() {
  const fs = require('fs');

  logger.info('Exportation du QR Code Unique');

  let img = $('#qrView img')[0].src;

  var data = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.open('GET', data, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == xhr.DONE) {
      var filesaver = require('file-saver');
      //Dans les deux cas filsaver.saveAs renvoie rien qui s'apparente à un bolléen
      if (filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg') == true) {
        messageInfos("Le QR code a bien été enregistré", "success"); //message a afficher en haut de la page
      }
    }
  }
  xhr.send();
}

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

    const { clipboard } = require('electron');

    let url = clipboard.readText();
    let xhr = new XMLHttpRequest();

    logger.info(`Demande de téléchargement d'un fichier audio à l'adresse ${url}`);

    Music.getDownloadLink(url, link => {
      if (link == null) {
        showError(modal, errorMsg);
        logger.error(`Impossibilité de télécharger le fichier audio à l'adresse ${url}`);
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
              logger.info(`script_unique.getMusicFromUrl | Sauvegarde du fichier audio à l'adresse : ${temp}/Download/${filename}`);
              fs.writeFileSync(`${temp}/Download/${filename}`, Buffer(new Uint8Array(this.result)));

              $(loader, errorMsg).remove();
            };
            fileReader.readAsArrayBuffer(blob);

            logger.info(`Fichier audio <${filename}> téléchargé avec succès`);

            changementChampLegendeEnChampSon(filename, link);
          } else {
            logger.error('Le fichier n\'est pas un fichier audio');
            showError(modal, errorMsg, "Le fichier n'est pas un fichier audio");
          }
        } else {
          // request failed
          logger.error('La requête de téléchargement a échouée');
          showError(modal, errorMsg);
        }
      };

      xhr.onloadstart = function (e) {
        logger.info(`Début téléchargement du fichier audio`);
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

function showError(modal, errorMsg, message = "Veuillez coller un lien de fichier téléchargeable. Reportez vous à la rubrique Info pour plus d'informations.") {
  $(modal).find('.loader').remove();
  $(errorMsg).text(message);
  $(errorMsg).css('color', '#f35b6a');
  $(errorMsg).addClass('errorLoader');
  $(modal).prepend(errorMsg); // add error message
}

/**
 * verifier le champ qrName du formulaire myFormActive puis activer le button generer
 *
 * Le nom du QR Code doit contenir au moins un caractère, sinon le bouton generer n'est pas accessible
 */
function activer_button() {
  //Permet l'enregistrement du titre dans le store Titre
  store.delete(`titreUnique`);
  var titre = document.getElementById('qrName').value;
  store.set(`titreUnique`, titre);

  $('#preview').attr('disabled', true); //Par defaut le bouton generer est toujours activé, on le desactive dans la condition suivante si necessaire
  if (document.getElementById('qrName').value.length > 0) {

    $('#preview, #emptyZones, #showAudio').attr('disabled', false);
  }
}

/**
 * Ajoute la valeur de la checkbox check-ios dans le store
 */
function saveType() {
  store.delete('typeUnique');
  let type = document.getElementById("check-ios").checked;
  store.set('typeUnique', type);
}


/** ajouter une nvlle legende (textarea) a chaque click sur button Texte
 * (pour chaque textarea il faut rajouter à l'attribut class la valeur qrData class="... qrData")
 */
function ajouterChampLegende(valeur = "") {
  incrementerNbZoneDonne();
  incrementerNumZoneCourante();

  var textareaLegende = document.createElement('div');
  textareaLegende.innerHTML = `<i class='fa fa-play align-self-center icon-player'></i><i class="fa fa-pause align-self-center icon-player"></i>
    <textarea id='textarea${numZoneCourante}' class='form-control qrData test' rows='3' name='legendeQR' placeholder='Tapez votre texte (environ 1100 caractères maximum)' maxlength='1240' onkeyup="verifNombreCaractere(${numZoneCourante});" onchange="generQRInter();">${valeur}</textarea>
    <button type="button" id="showAudio${numZoneCourante}" class="btn btn-outline-success align-self-center btn-unique-xl" name="ajouterSon" data-toggle="modal" data-target="#listeMusic" onclick='changementAudioSource(${numZoneCourante});' style="margin-left:15px;">
      <i class="fa fa-music"></i>&nbsp;&nbsp;Audio
    </button>
    <button class="btn btn-outline-success align-self-center " type="button" id="deleteAudio${numZoneCourante}" onclick="supprimerAudio(this, ${numZoneCourante});verifNombreCaractere(${numZoneCourante});">
      <i class="fa fa-times" aria-hidden="true"></i>
    </button>
    <button id='delete${numZoneCourante}' type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='supprimerChampLegende(this, ${numZoneCourante});'>
    <div class="inline-block">
      <i class='fa fa-trash-alt'></i></button>
      <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='moveUp(this, ${numZoneCourante});'>
      <i class='fa fa-arrow-up'></i></button>
      <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='moveDown(this, ${numZoneCourante});'>
      <i class='fa fa-arrow-down'></i></button>`;
  textareaLegende.setAttribute("class", "d-flex align-items-start legendeQR");
  textareaLegende.setAttribute("id", `legendeTextarea${numZoneCourante}`);

  document.getElementById('cible').appendChild(textareaLegende);

  store.set(`zone${numZoneCourante}`, textareaLegende.innerHTML);

  //reasignation du nombre total de caractère restant pour la nouvelle zone
  var totatCaractere = SetProgressBar();
  $('#textarea' + numZoneCourante).attr('maxlength', (store.get("charMax") - totatCaractere));
}

/** foncion qui  calcule le nombre de caractère dans les zones de texte et met la valeur sur les progress bar */
function SetProgressBar() {
  //progress bar gestion
  var total = 0;
  var nombreCaratereMAX = store.get("charMax");

  $("#cible textarea").each(function () {
    total += $(this).val().length;
    //console.log(total);
  });

  if (document.getElementById("qrName") != null) total += document.getElementById("qrName").value.length;
  // on va ajouter la taille du qr nom aussi

  //$("#cible input").val().length;
  var totalSeted = Math.round((total * 100) / nombreCaratereMAX);

  //mise ajour des données sur le progress bar
  $("#progressbarId").attr('aria-valuenow', totalSeted);
  $("#progressbarId").attr("style", "width:" + totalSeted + "%");
  $("#progressbarId").text(totalSeted + "%");
  //FIN progress bar gestion
  return total;
}

/** verifier si le nombre de caractère maximal est respecté, si ce n'est pas le cas on affiche une pop up d'informations */
function verifNombreCaractere(num) {
  //Permet l'enregistrement du text dans le store

  if (document.getElementById('textarea' + num) != null) {
    store.delete(`text${num}`);
    var txt = document.getElementById('textarea' + num).value;
    store.set(`text${num}`, txt);
  }

  var nombreCaratereMAX = store.get("charMax");
  //progress bar gestion
  var total = SetProgressBar();

  $('#messages').empty();
  if (total >= nombreCaratereMAX) {
    messageInfos("La limite de caractère est atteinte (" + store.get("charMax") + " caractères)", "warning");
    disableButtonAddNewData();
    //si nombre de caractére max attein toute les zone de texte sont fermer a l'jout de caractère
    $("#cible textarea").each(function () {
      $(this).attr('maxlength', $(this).val().length);
    });
    document.getElementById("qrName").setAttribute("maxlength", $("#qrName").val().length);
  }
  else {
    activateButtonAddNewData();
    //reassignation du nombre de caractére disponible pour toutes les zones
    $("#cible textarea").each(function () {
      $(this).attr('maxlength', store.get("charMax"));
    });
    document.getElementById("qrName").setAttribute("maxlength", store.get("charMax"));
  }

  if (total > nombreCaratereMAX) {
    if (document.getElementById("preview").disabled == false)
      document.getElementById("preview").disabled = true;
  }
  else {
    if (document.getElementById("qrName") != null) {
      if (document.getElementById("qrName").value.length == 0) {
        document.getElementById("preview").disabled = true;
      }
      else {
        document.getElementById("preview").disabled = false;
      }
    }
  }
}

function supprimerAudio(e,numText) {
    $('#textarea'+numText).val('')
    $('#textarea'+numText).attr('name', 'legendeQR')
    $('#textarea'+numText).removeAttr("disabled")
  //calcul et mise a jour de la bar de progression
  SetProgressBar();
}

/** supprime un le textarea correspondant au numText */
function supprimerChampLegende(e, numText) {
  decrementerNbZoneDonne();

  //suppression dans le store de la zone de txt correspondante
  store.delete(`text` + numText);
  store.delete(`zone` + numText);

  $(e).parents('div#legendeTextarea' + numText).remove();

  activateButtonAddNewData();

  //calcul et mise a jour de la bar de progression
  SetProgressBar();
}

//permet de savoir quel bouton audio a été clické
var audioSource = "";

/** Fonction qui modifie la variable audioSource */
function changementAudioSource(numText) {
  audioSource = numText;
}

/** Fonction qui modifie un champ legende en champ son */
function changementChampLegendeEnChampSon(nom, url) {
  let textArea = document.getElementById("textarea" + audioSource);
  textArea.value = nom;
  textArea.name = url;
  textArea.setAttribute("disabled", "true");
  //calcul et mise a jour de la bar de progression
  SetProgressBar();
}

/** generer un input 'pour un fichier audio' -> nom de fichier + url
 * (pour chaque input il faut rajouter à l'attribut class la valeur qrData class=".. qrData")
 */
function ajouterChampSon(nom, url) {
  incrementerNbZoneDonne();
  incrementerNumZoneCourante();

  var inputSon = document.createElement('div');
  inputSon.innerHTML = `<i class='fa fa-play align-self-center icon-player'></i><i class='fa fa-pause align-self-center icon-player'></i>
      <!-- <input type='text' id='${url}' name='AudioName' class='form-control qrData' value='${nom}' readonly>  -->
    <textarea id='textarea${numZoneCourante}' class='form-control qrData' onkeyup="verifNombreCaractere(${numZoneCourante});" onchange="generQRInter();" name='${url}'  maxlength='1240'  readonly>${nom}</textarea>
    <button id='delete${numZoneCourante}' type='button' class='btn btn-outline-success legendeQR-close-btn align-self-center' onclick='supprimerChampLegende(this,${numZoneCourante});'>
    <div class="inline-block">
      <i class='fa fa-trash-alt'></i></button>
      <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='moveUp(this,${numZoneCourante});'>
      <i class='fa fa-arrow-up'></i></button>
      <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='moveDown(this,${numZoneCourante});'>
      <i class='fa fa-arrow-down'></i></button>
    </div>`;
  inputSon.setAttribute("class", "d-flex align-items-start legendeQR");
  inputSon.setAttribute("id", `legendeTextarea${numZoneCourante}`);
  document.getElementById('cible').appendChild(inputSon);

  $('#listeMusic .close').on('click',);

  store.set(`zone${numZoneCourante}`, inputSon.innerHTML);

  //calcul et mise a jour de la bar de progression
  SetProgressBar();
}

/** déplacer au dessus du champ précédent */
function moveUp(e, numTxt) {
  let prev = $(e).parents('.legendeQR').prev();
  let div = $(e).parents('.legendeQR');

  let divVal = $(e).parents('.legendeQR').children('textarea').val();
  let prevVal = $(e).parents('.legendeQR').prev().children('textarea').val()

  if (prev.length > 0) {

    for (var i = 1; i < numZoneCourante + 1; i++) {
      if (store.get("text" + i) == prevVal)
        store.set("text" + i, divVal);
    }
    store.set("text" + numTxt, prevVal);

    div.remove();
    div.insertBefore(prev);
  }
}

/** déplacer en dessous du champ suivant */
function moveDown(e, numTxt) {
  let next = $(e).parents('.legendeQR').next();
  let div = $(e).parents('.legendeQR');

  let divVal = $(e).parents('.legendeQR').children('textarea').val();
  let nextVal = $(e).parents('.legendeQR').next().children('textarea').val();

  if (next.length > 0) {

    for (var i = 1; i < numZoneCourante + 1; i++) {
      if (store.get("text" + i) == nextVal)
        store.set("text" + i, divVal);
    }
    store.set("text" + numTxt, nextVal);

    div.remove();
    div.insertAfter(next);
  }


}

/** Fonction qui incremente de 1 le nombre de zones de données */
function incrementerNbZoneDonne() {
  store.delete(`nbZoneDonne`);
  nbZoneDonne++; // Nouveau numero pour le prochain textarea
  store.set(`nbZoneDonne`, nbZoneDonne);
}

/** Fonction qui décremente de 1 le nombre de zones de données */
function decrementerNbZoneDonne() {
  store.delete(`nbZoneDonne`);
  nbZoneDonne--; // Nouveau numero pour le prochain textarea
  store.set(`nbZoneDonne`, nbZoneDonne);
}

/** Permet de set le numero de la nouvelle zone de donnée courante */
function incrementerNumZoneCourante() {
  store.delete(`numZoneCourante`);
  numZoneCourante++; // Nouveau numero pour le prochain textarea
  store.set(`numZoneCourante`, numZoneCourante);
}

/** Permet d'activer les boutons qui ajoutes des nouvelles zones de données
 * => Le bouton 'Ajouter Nouveau Contenu' et le bouton 'Audio'
 */
function activateButtonAddNewData() {
  $('#ajouterTexte').attr('disabled', false);
  $('#showAudio').attr('disabled', false);
}

/** Permet de desactiver les boutons qui ajoutes des nouvelles zones de données
 * => Le bouton 'Ajouter Nouveau Contenu' et le bouton 'Audio'
 */
function disableButtonAddNewData() {
  $('#ajouterTexte').attr('disabled', true);
  $('#showAudio').attr('disabled', true);
}

/** pour ouvrir la page info.html quand on clique sur le bouton info du haut */
$("#infos-unique").on('click', function () {
  require('electron').remote.getGlobal('sharedObject').ongletAideActif = 'unique'
  $("#charger-page").load(getNormalizePath(root + "/rendererProcess/view/aide/info.html"));
});

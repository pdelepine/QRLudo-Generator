/**
 * @Author: alassane
 * @Date:   2018-11-10T17:59:11+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-05T16:00:26+01:00
 */

// fichier script concernant les qr codes uniques

var qrcode;
var qrType;

$(document).ready(function() {
  var settings = require("electron-settings");

  if (settings.has("defaultColor")) {
    $("#qrColor").val(settings.get("defaultColor"));
  }

});

// trigger preview qrcode action
$('#preview').click(e => {

  //enlever les messages en haut de page
  initMessages();
  let inputArray = $('input, textarea');

  // if (validateForm(inputArray)) { // all fields are filled
  // get all required attributes for qrcode
  let qrColor = $('#qrColor').val();
  let qrName = $('#qrName').val();
  let qrData = [];

  for (data of $('.qrData')) {
    if (data.name == 'AudioName') {
      let dataAudio = {
        type: 'music',
        url: data.id,
        name: data.value
      }

      let jsonAudio = JSON.stringify(dataAudio);
      qrData.push(JSON.parse(jsonAudio));
    } else
      qrData.push($(data).val());

  }

  qrType = $('#typeQRCode').val();

  // Generate in a div, the qrcode image for qrcode object
  let div = $('#qrView')[0];

    $('#annuler').attr('disabled', false);
  }
  $("#saveQRCode").on("click", function(){
    saveQRCodeImage();
  });
});


// form validation return true if all fields are filled
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


// generate and print qr code
function previewQRCode(name, data, color, div) {

  // instanciate a qrcode unique object
  if (qrType == 'xl')
    qrcode = new QRCodeXL(name, data, color);
  else
    qrcode = new QRCodeUnique(name, data, color);

  let facade = new FacadeController();
  facade.genererQRCode(div, qrcode);
}

// save image qr code
function saveQRCodeImage() {
  const fs = require('fs');

  let img = $('#qrView img')[0].src;

  // var data = img.replace(/^data:image\/\w+;base64,/, '');

  var data = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  console.log(data);
  xhr.open('GET', data, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == xhr.DONE) {
      var filesaver = require('file-saver');
      console.log(xhr.response);
      filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg');
    }
  }

  xhr.send();


  // fs.writeFile(`${root}/QR-Unique/QR/${qrcode.getName()}.jpeg`, data, {
  //   encoding: 'base64'
  // }, (err) => {
  //   if (err) throw err;
  //   messageInfos("votre QR est bien sauvegardé","success");
  // });

}


function getMusicFromUrl() {
  const {
    clipboard
  } = require('electron');
  let url = clipboard.readText();
  url = url.replace('/open?', '/uc?');
  url += '&authuser=0&export=download';

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.onload = function(e) {
    if (this.status == 200) {
      // get binary data as a response
      var blob = this.response;

      // get filename
      let filename = xhr.getResponseHeader("content-disposition").split(";")[1];
      filename = filename.replace('filename="', '');
      filename = filename.replace('.mp3"', '.mp3');

      $('#musicUrl').val('');

      // save file in folder projet/download
      var fileReader = new FileReader();
      fileReader.onload = function() {
        fs.writeFileSync(`${root}/Download/${filename}`, Buffer(new Uint8Array(this.result)));
      };
      fileReader.readAsArrayBuffer(blob);

      ajouterChampSon(filename, clipboard.readText());
      $('#closeModalListeMusic').click();
    } else {
      // request failed
    }
  };

  xhr.send();

}

//verifier le champ qrName du formulaire myFormActive puis activer le button generer
function activer_button() {
  if (document.getElementById('qrName').value.length > 0) {
    $('#preview, #annuler, #ajouterTexte, #showAudio').attr('disabled', false);
  }
}

//ajouter une nvlle legende (textarea) a chaque click sur button Texte (pour chaque textarea il faut rajouter à l'attribut class la valeur qrData class="... qrData")
function ajouterChampLegende(valeur = "") {

  var textareaLegende = document.createElement('div');
  textareaLegende.innerHTML = `<textarea id='testtexxtarea' class='form-control qrData' rows='3' name='legendeQR' placeholder='Mettre la légende'>${valeur}</textarea>
  <button type='button' class='btn btn-outline-success legendeQR-close-btn' onclick='supprimerChampLegende(this);'>
  <i class='fa fa-trash-alt'></i></button>`;
  textareaLegende.setAttribute("class", "d-flex align-items-start legendeQR");
  textareaLegende.setAttribute("id", "legendeTexarea");

  document.getElementById('cible').appendChild(textareaLegende);
}

function supprimerChampLegende(e) {
  $(e).parents('div#legendeTexarea').remove();
}

//generer un input 'pour un fichier audio' -> nom de fichier + url (pour chaque input il faut rajouter à l'attribut class la valeur qrData class=".. qrData")
function ajouterChampSon(nom, url) {

  var inputSon = document.createElement('div');
  inputSon.innerHTML = "<input type='text' id='" + url + "' name='AudioName' class='form-control qrData' value='" + nom + "' readonly>" +
    "<button type='button' class='btn btn-outline-success legendeQR-close-btn' onclick='supprimerChampSon(this);'>" +
    "<i class='fa fa-trash-alt'></i>" +
    "</button>";
  inputSon.setAttribute("class", "d-flex align-items-start legendeQR");
  inputSon.setAttribute("id", "inputAudio");
  document.getElementById('cible').appendChild(inputSon);

  $('#listeMusic .close').click();

}

//supprimer un champ Audio -> event onclick
function supprimerChampSon(e) {
  $(e).parents('div#inputAudio').remove();
}

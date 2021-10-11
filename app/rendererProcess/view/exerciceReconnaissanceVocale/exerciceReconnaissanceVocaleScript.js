
function genererJson() {
  if(store.get(`sousOnglet`) == "qcm") {
    genererJsonQCM();
  } else if(store.get(`sousOnglet`) == "question_ouverte") {
    genererJsonQuestionOuverte();
  }
}

var questionQCM =null;
var questionQCMQRCode;

function genererJsonQCM(){
  questionOuverte = null;
  var messageBonneReponse = $("#MessageBonnereponseQCM").val();
  var messageMauvaiseReponse = $("#MessageMauvaisereponseQCM").val();
  var questions = [];
  nbQues=1;

  for(let i = 1;i<=nbQues;++i){
    var questionText = $("#textQuestion"+i.toString()).val();
    var reponses = [];
    nbReponse=2;
    // Ajout des réponss
    for(let j=1;j<=nbReponse;++j){
      var id = "question"+i.toString()+"Reponse"+j.toString();
      var isGoodAnswer = $("#gridCheckQuestion"+i.toString()+"Reponse"+j.toString()).is(':checked');
      var responseText = $("#textQuestion"+i.toString()+"Reponse"+j.toString()).val();  
      //création d'une reponseQCM et on l'ajoute dans le tableau des réponses
      let reponse = new ReponseQCM(id,responseText,isGoodAnswer);
      reponses.push(reponse);
    }
    // On vérifie que les réponses sont complètes avant de générer le QR code
    var reponsesComplete = true;
    for(let i = 0; i < reponses.length; i++) {
      if(reponses[i].getReponse() === "") { // reponses[i].getReponse() correspond au texte de la réponse
        reponsesComplete = false;
        break;
      }
    }
    if(questionText !== "" && reponsesComplete) {
      //création d'une questionQCM et on l'ajoute dans le tableau des questions 
      id = "question"+i.toString();
      question = new QuestionQCM(id,questionText,reponses);
      questions.push(question);
    }
    else{
      messageInfos("Veuillez remplir tous les champs.", "danger");
    }
  }
  if(messageBonneReponse != "" && messageMauvaiseReponse != "" && questions.length>0){
    //création d'un nouveau projetQCM
    projet = new ProjetQCM(questions,messageBonneReponse,messageMauvaiseReponse);

    initMessages();

    console.log(projet.qrcode);
    questionQCMQRCode = projet.qrcode
    // On génére le QrCode a afficher
    previewQRCodeQCM();
    // On affiche le qrCode
    $('#qrView').show();
    logger.info(`Génération du QR Code QCM de l'exercice à reconnaissance vocale : ${ JSON.stringify(questionQCMQR) }`);
  } else {
    messageInfos("Veuillez remplir tous les champs.", "danger");
    logger.error(`Génération du QR Code QCM impossible : certains champs ne sont pas remplis`);
  }
}

function previewQRCodeQCM() {
  previewQRCode(questionQCM, $('#qrView')[0]);
}


var questionOuverte=null;

function genererJsonQuestionOuverte(){
  questionQCM = null;
  var questionText = $("#Question").val();
  var reponseText = $("#Bonnereponse").val();
  var messageBonneReponse = $("#MessageBonnereponse").val();
  var messageMauvaiseReponse = $("#MessageMauvaisereponse").val();

  if(questionText !== "" && reponseText !== "" && messageBonneReponse !== "" && messageMauvaiseReponse !== "") {
    questionOuverte = new QRCodeQuestionOuverte(questionText, reponseText, messageBonneReponse, messageMauvaiseReponse);

    initMessages();

    console.log(questionOuverte.qrcode);

    // On génére le QrCode a afficher
    previewQRCodeQuestionOuverte();
    // On affiche le qrCode
    $('#qrView').show();
    logger.info(`Génération du QR Code Question Ouverte de l'exercice à reconnaissance vocale : ${ JSON.stringify(questionOuverte) }`);
  } else {
    messageInfos("Veuillez remplir tous les champs.", "danger");
    logger.error(`Génération du QR Code Question Ouverte impossible : certains champs ne sont pas remplis`);
  }

}

function previewQRCodeQuestionOuverte() {
  previewQRCode(questionOuverte, $('#qrView')[0]);
}

// generate and print qr code
function previewQRCode(qrcode, div) {
  let facade = new FacadeController();
  qrcode.qrcode.color = $('#qrColor').val();
  facade.genererQRCode(div, qrcode);
}

$(document).ready(function() {

  if(!store.get("sousOnglet"))
    store.set("sousOnglet", "question_ouverte");

  if(!isImportationExerciceRecoVocaleQCM) {
    //méthode gérant la continuité
    enregistrement();
  }

  initMessages();

  // Ajouter une nouvelle Reponse une fois qu'on va clicker sur la button Ajouterreponse
  $("#ajouterQuestion").on('click',function () {
    ajouterNouvelleReponse();

  })

  // Aucun champs audio à lire dans cet onglet
  $("#play-sound-div").hide();
});

// Ajouter une nouvelle Reponse une fois qu'on va clicker sur la button Ajouterreponse

var compteurReponse = 1;
function ajouterNouvelleReponse(contenu = "", isBonneRep = false){
  compteurReponse++;
  logger.info('Ajout d\'une nouvelle réponse au QR Code QCM de l\'exercice à reconnaissance vocale');
  if (compteurReponse < 30) {
    type = "Reponse";
    let reponse = document.createElement('div');
    reponse.innerHTML = `<div class="form-row" id="divQuestion` + compteurReponse + `">
                            <div class="form-group col-md-3">
                                  <label class="control-label">Réponse `+ compteurReponse + ` :</label>
                                </div>
                          <div class="form-group col-md-6">
                            <span class="row">
                                <input type="text" class="form-control col-sm-6" id="reponse`+ compteurReponse + `" rows="2" name="nomprojet"
                                    placeholder="Réponse" onkeyup="activerSave('reponse`+compteurReponse+`');">
                                <i class="fas fa-info-circle mt-2 ml-2" 
                                    title="Nous vous conseillons de cocher la case 'Utiliser le numéro de la réponse comme réponse vocale' si votre réponse est longue ou difficilement prononçable" 
                                    data-toggle="tooltip" data-placement="right"></i>
                              </span>
                           </div>
                           <div class="form-group col-md-2">
                                   <input class="form-check-input" type="checkbox" name="gridRadios" id="gridCheck`+ compteurReponse + `" style="width:70px;" 
                                      value="option"` + compteurReponse + `" onclick="activerSaveCheckbox('gridCheck`+compteurReponse+`')" >
                                      <label class="form-check-label" for="gridCheck`+ compteurReponse + `">
                            </div>
                            <div class="form-group col-md-1">
                                <button id="deleteQRCode`+ compteurReponse + `" type="button"
                                    class="btn btn-outline-success align-self-center" onclick="supprLigne(` + compteurReponse + ",\'" + type + `\');">
                                    <i class="fa fa-times" aria-hidden="true"></i>
                                    </div>
                            </div>`;

    let container = $("#repContainer");
    container.append(reponse);

    $("#reponse"+ compteurReponse).val(contenu);
    $("#gridCheck"+ compteurReponse).prop('checked', isBonneRep);

    store.set("nbReponse",compteurReponse);
  }
}



//Pour supprimer une énigme ou bien une réponse 
function supprLigne(idLigne, element) {
  if (element == "Reponse") {
    if(compteurReponse>1){
      compteurReponse--;
      logger.info('Suppression d\'une réponse au QR Code QCM de l\'exercice à reconnaissance vocale');
      store.set("nbReponse",compteurReponse);
      $("#divQuestion" + idLigne).on('click', function() {
        $(this).remove();
        for(let cpt = idLigne; cpt <= compteurReponse; cpt++) {
          let id = cpt+1;
          let div = $("#divQuestion" + id)[0].getElementsByTagName("div");
          div[0].getElementsByTagName("label")[0].innerHTML = "Réponse " + cpt + " :";
          div[2].getElementsByTagName("input")[0].id = "gridCheck" + cpt;
          div[2].getElementsByTagName("label")[0].for = "gridCheck" + cpt;
          div[1].getElementsByTagName("input")[0].id = "reponse" + cpt;
          div[3].getElementsByTagName("button")[0].id = "deleteQRCode" + cpt;
          div[3].getElementsByTagName("button")[0].setAttribute("onclick", "supprLigne(" + cpt + ",\'" + element +"\')");
          $("#divQuestion" + id)[0].id = "divQuestion" + cpt;

          if(store.get(`reponse${id}`) && store.get(`gridCheck${id}`)) {
            store.set(`reponse${cpt}`, store.get(`reponse${id}`));
            store.set(`gridCheck${cpt}`, store.get(`gridCheck${id}`));
          }
        }
      });
      deleteStore("reponse"+compteurReponse+1);
      deleteStore("gridCheck"+compteurReponse+1)
    }
  }
}

$(document).ready(function() {
  $('div.info-content').css('display', 'none');

  $("#content a.nav-link").on('click',e => {
    e.preventDefault();
    let element = e.target;
    let tab = $(element).attr('href');

    $('a').attr('class', 'nav-item nav-link');
    $('div.tab-pane').attr('class', 'tab-pane');

    $(element).addClass('active');
    $(tab).addClass('active');
  });

  $('.tab-content').find('a').on('click',e => {
    let href = $(e.target).attr('href');
    let display = $(href).css('display');

    if (display == 'block')
      $(href).fadeOut();
    else
      $(href).fadeIn();
  });
});

//script 
$("#emptyFields").on('click',function(){
    viderChamps();
  });

  $("#saveQRCode").on('click',e => {
    saveQRCodeImage(questionQCM, questionOuverte);
  });


function viderChamps(){
  $('#Question').val('');
  $('#Bonnereponse').val('');
  $('#MessageBonnereponse').val('');
  $('#MessageMauvaisereponse').val('');
  $('#reponseinitiale').val('');
  $('#QuestionQCM').val('');
  $('#reponseParIdentifiant').prop('checked', false);
  $('#gridCheck1').prop('checked', false);
  $('#MessageMauvaisereponseQCM').val('');
  $('#MessageBonnereponseQCM').val('');
  $("#repContainer").empty();

  deleteStore(`Question`);
  deleteStore(`Bonnereponse`);
  deleteStore('MessageBonnereponse');
  deleteStore('MessageMauvaisereponse');
  deleteStore(`reponseinitiale`);
  deleteStore(`QuestionQCM`);
  deleteStore(`MessageMauvaisereponseQCM`);
  deleteStore('MessageBonnereponseQCM');
  deleteStore('reponseParIdentifiant');
  deleteStore('gridCheck1');
  for(var i = 2; i<=compteurReponse; i++) {
    deleteStore(`reponse${i}`);
    deleteStore(`gridCheck${i}`);
  }

  compteurReponse = 1;
  store.set("nbReponse", compteurReponse);

  logger.info('Réinitialisation de l\'exercice à reconnaissance vocale');
}

// save image qr code
function saveQRCodeImage(questionQCM, questionOuverte) {
  const fs = require('fs');

  logger.info('Exportation du QR Code de l\'exercice à reconnaissance vocale');

  let img = $('#qrView img')[0].src;
var qrcode
  var data = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

  if (questionOuverte == null) {
    var qrcode = questionQCM;
  }
  else {
    var qrcode = questionOuverte;
  }
  
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  console.log(data);
  xhr.open('GET', data, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == xhr.DONE) {
      var filesaver = require('file-saver');
      console.log(xhr.response);
      //Dans les deux cas filsaver.saveAs renvoie rien qui s'apparente à un bolléen
      if (filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg') == true) {
        console.log(filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg').getName);
        messageInfos("Le QR code a bien été enregistré", "success"); //message a afficher en haut de la page
      }

    }
  }
  xhr.send();
}


//pour ouvrir la page info.html quand on clique sur le bouton info du haut
$("#infos-exercice-reco-vocale").on('click',function () {
  remoteElectron.getGlobal('sharedObject').ongletAideActif = 'exerciceRecoVocale'
  $("#charger-page").load(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/aide/info.html"));
});




function enregistrement() {

  if(!store.get(`sousOnglet`) || store.get(`sousOnglet`) == "question_ouverte") {
    $("#onglet-QuesOuverte").attr('class','tab-pane fade in active show');
    $("#questionOuverteOnglet").attr('class','nav-link active');
  } else if(store.get(`sousOnglet`) == "qcm") {
    $("#onglet-QCM").attr('class','tab-pane fade in active show');
    $("#questionQCMOnglet").attr('class','nav-link active');
  }

  if(store.get(`Question`))
    $("#Question").val(store.get(`Question`));
  
  if(store.get(`Bonnereponse`) )
    $("#Bonnereponse").val(store.get(`Bonnereponse`));

  if(store.get(`MessageBonnereponse`) )
    $("#MessageBonnereponse").val(store.get(`MessageBonnereponse`));

  if(store.get('MessageMauvaisereponse'))
    $("#MessageMauvaisereponse").val(store.get('MessageMauvaisereponse'));

  if(store.get('QuestionQCM'))
    $("#QuestionQCM").val(store.get('QuestionQCM'));

  if(store.get('reponseParIdentifiant'))
    $("#reponseParIdentifiant").prop('checked', store.get('reponseParIdentifiant'));

  if(store.get('MessageMauvaisereponseQCM'))
    $("#MessageMauvaisereponseQCM").val(store.get('MessageMauvaisereponseQCM'));

  if(store.get('MessageBonnereponseQCM'))
    $("#MessageBonnereponseQCM").val(store.get('MessageBonnereponseQCM'));

  if(store.get('reponseinitiale'))
    $("#reponseinitiale").val(store.get('reponseinitiale'));

  if(store.get('gridCheck1'))
    $("#gridCheck1").prop('checked', store.get('gridCheck1'));

  var nbRep = 0;
  if(store.get('nbReponse'))
    nbRep = store.get('nbReponse');

  for(var i=2; i<=nbRep; i++) {
    ajouterNouvelleReponse(store.get(`reponse${i}`), store.get(`gridCheck${i}`));
  }
}


//méthode gérant la continuité sur les zones de texte Question, Bonne Reponse, Mauvaise Reponse et nb reponse
function activerSave(text){
  var newText = $("#"+text).val();
  store.set(text,newText);
}

function activerSaveCheckbox(text){
  var b = $("#"+text).is(':checked');
  store.set(text, b);
}

//methode de suppression dans le store
function deleteStore(del){
  if(store.get(del) )
    store.delete(del);
}

//On stocke dans le store, le sous onglet "question_ouverte"
$("#questionOuverteOnglet").on('click',function() {
  store.set("sousOnglet", "question_ouverte");
  initMessages();
});
//On stocke dans le store, le sous onglet "qcm"
$("#questionQCMOnglet").on('click',function() {
  store.set("sousOnglet", "qcm");
  initMessages();
});


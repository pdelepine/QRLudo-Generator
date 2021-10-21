
function genererJson() {
  if(store.get(`sousOnglet`) == "qcm") {
    genererJsonQCM();
  } else if(store.get(`sousOnglet`) == "question_ouverte") {
    genererJsonQuestionOuverte();
  }
}

var questionQCM =null;

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

    // On génére le QrCode a afficher
    previewQRCodeQCM();
    // On affiche le qrCode
    $('#qrView').show();
    console.log(JSON.stringify(projet.qrcode));
    logger.info(`Génération du QR Code QCM de l'exercice à reconnaissance vocale : ${ JSON.stringify(projet.qrcode) }`);
  } else {
    messageInfos("Veuillez remplir tous les champs.", "danger");
    logger.error(`Génération du QR Code QCM impossible : certains champs ne sont pas remplis`);
  }
}

function previewQRCodeQCM() {
  previewQRCode(projet, $('#qrView')[0]);
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



  // Aucun champs audio à lire dans cet onglet
  $("#play-sound-div").hide();
});

// Ajouter une nouvelle Reponse une fois qu'on va clicker sur le button AjouterReponse

var compteurReponse = {1:1};
var compteurQuestion = 1;
function ajouterNouvelleReponse(contenu = "", isBonneRep = false, question_id=1){
  compteurReponse[question_id]++;
  logger.info('Ajout d\'une nouvelle réponse au QR Code QCM de l\'exercice à reconnaissance vocale');
  if (compteurReponse[question_id] < 30) {
    type = "Reponse";
    let reponse = document.createElement('div');
    reponse.innerHTML = ` <div class="form-group col-md-3">
                            <label class="control-label">Réponse `+ compteurReponse[question_id] + ` :</label>
                          </div>
                          <div class="form-group col-md-6">
                            <span class="row">
                              <input type="text" class="form-control col-sm-6" id="question` + question_id + `Reponse`+ compteurReponse[question_id] + `" rows="2" name="nomprojet"
                                    placeholder="Réponse" onkeyup="activerSave('question` + question_id + `Reponse`+compteurReponse[question_id]+`');">
                              <i class="fas fa-info-circle mt-2 ml-2" 
                                    title="Nous vous conseillons de cocher la case 'Utiliser le numéro de la réponse comme réponse vocale' si votre réponse est longue ou difficilement prononçable" 
                                    data-toggle="tooltip" data-placement="right"></i>
                            </span>
                          </div>
                          <div class="form-group col-md-2">
                            <input class="form-check-input" type="checkbox" name="gridRadios" id="gridCheckQuestion` + question_id +`Reponse`+ compteurReponse[question_id] + `" style="width:70px;" 
                                  value="option" onclick="activerSaveCheckbox('gridCheckQuestion` + question_id +`Reponse`+compteurReponse[question_id]+`')" >
                            <label class="form-check-label" for="gridCheckQuestion`+ question_id +`Reponse`+ compteurReponse[question_id] + `">
                          </div>
                          <div class="form-group col-md-1">
                            <button id="deleteQuestion` + question_id +`Reponse`+ compteurReponse[question_id] + `" type="button"
                                    class="btn btn-outline-success align-self-center" onclick="supprLigne(`+question_id+"," + compteurReponse[question_id] + ",\'" + type + `\');">
                            <i class="fa fa-times" aria-hidden="true"></i>
                          </div>`;

    reponse.setAttribute("class","form-row");
    reponse.id="divQuestion" + question_id + "Reponse"+ compteurReponse[question_id];

    let container = $("#reponseContainerQuestion"+question_id);
    container.append(reponse);

    $("#reponse"+ compteurReponse[question_id]).val(contenu);
    $("#gridCheck"+ compteurReponse[question_id]).prop('checked', isBonneRep);

    store.set("nbReponse",compteurReponse[question_id]);
  }
}

function ajouterNouvelleQuestion(){
  compteurQuestion++;
  compteurReponse[compteurQuestion]=1;
  type = "Reponse";
  logger.info('Ajout d\'une nouvelle question au QR Code QCM de l\'exercice à reconnaissance vocale');
  let question = document.createElement('div');
  question.innerHTML = `  <div class="question-intro">
                            <div class="row"> 
                              <div class="col">
                                <label class="question-intro-label" data-toggle="collapse" data-target="#collapseQuestion`+compteurQuestion+`" aria-expanded="false" aria-controls="collapseQuestion`+compteurQuestion+`" style="color:#28a745;padding-right:25px;">Question `+compteurQuestion+` : </label>
                                <input type="text" class="input-lg question-intro-input" style="width:400px;"  id="textQuestion`+compteurQuestion+`" cols="10" name="nomprojet"
                                  placeholder="Quelle est votre question" onkeyup="activerSave('textQuestion`+compteurQuestion+`');" />
                              </div>
                              <div class="btn-question col-2">
                                <button class="btn btn-outline-success align-self-center btn-question-collapse" type="button" data-toggle="collapse" data-target="#collapseQuestion`+compteurQuestion+`" aria-expanded="false" aria-controls="#collapseQuestion`+compteurQuestion+`" id="btnCollapseQuestion`+compteurQuestion+`">
                                  <i class="fa fa-chevron-up pull-right"></i>
                                  <i class="fa fa-chevron-down pull-right"></i>
                                </button>
                                <button class="btn btn-outline-success align-self-center " type="button" id="deleteQuestion`+compteurQuestion+`" onclick="supprimerQuestion(`+compteurQuestion+`,'Question');">
                                  <i class="fa fa-trash" aria-hidden="true"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="collapse" id="collapseQuestion`+compteurQuestion+`">
                            <br>
                            <div class="form-row">
                              <div class="form-group col-md-10" style="text-align: right;">
                                <label>Bonne(s) réponse(s)</label>
                              </div>
                            </div>
                            <div id="reponseContainerQuestion`+compteurQuestion+`">
                            <div class="form-row" id="divQuestion` + compteurQuestion + `Reponse`+ compteurReponse[compteurQuestion] +`">
                              <div class="form-group col-md-3">
                                <label class="control-label">Réponse `+ compteurReponse[compteurQuestion] + ` :</label>
                              </div>
                              <div class="form-group col-md-6">
                                <span class="row">
                                  <input type="text" class="form-control col-sm-6" id="question` + compteurQuestion + `Reponse`+ compteurReponse[compteurQuestion] + `" rows="2" name="nomprojet"
                                    placeholder="Réponse" onkeyup="activerSave('question` + compteurQuestion + `Reponse`+compteurReponse[compteurQuestion]+`');">
                                  <i class="fas fa-info-circle mt-2 ml-2" 
                                    title="Nous vous conseillons de cocher la case 'Utiliser le numéro de la réponse comme réponse vocale' si votre réponse est longue ou difficilement prononçable" 
                                    data-toggle="tooltip" data-placement="right"></i>
                                </span>
                              </div>
                              <div class="form-group col-md-2">
                                <input class="form-check-input" type="checkbox" name="gridRadios" id="gridCheckQuestion` + compteurQuestion +`Reponse`+ compteurReponse[compteurQuestion] + `" style="width:70px;" 
                                      value="option" onclick="activerSaveCheckbox('gridCheckQuestion` + compteurQuestion +`Reponse`+compteurReponse[compteurQuestion]+`')" >
                                <label class="form-check-label" for="gridCheckQuestion` + compteurQuestion +`Reponse`+ compteurReponse[compteurQuestion] + `">
                              </div>
                              <div class="form-group col-md-1">
                                <button id="deleteQuestion` + compteurQuestion +`Reponse`+ compteurReponse[compteurQuestion] + `" type="button"
                                    class="btn btn-outline-success align-self-center" onclick="supprLigne(`+compteurQuestion+"," + compteurReponse[compteurQuestion] + ",\'" + type + `\');">
                                <i class="fa fa-times" aria-hidden="true"></i>
                              </div>
                            </div>
                            </div>
                            <div class="form-group col-md-6">
                              <label style="color:#a5b2af;">Ajouter une réponse</label>
                              <button id="ajouterReponseQuestion`+compteurQuestion+`" type="button"
                                class="btn btn-outline-success align-self-center" onclick="ajouterNouvelleReponse('',false,`+compteurQuestion+`);" style="color:#a5b2af;" name="ajouterReponse">
                                <i class="fa fa-plus" aria-hidden="true"></i>
                              </button>
                            </div>
                          </div>`;
    
    question.setAttribute("class","question");
    question.id="question"+compteurQuestion;

    let container = $("#questionContainer");
    container.append(question);
  }



//Pour supprimer une énigme ou bien une réponse 
function supprLigne(question_id,idLigne, element) {
  if (element == "Reponse") {
    if(compteurReponse[question_id]>1){
      compteurReponse[question_id]--;
      logger.info('Suppression d\'une réponse au QR Code QCM de l\'exercice à reconnaissance vocale');
      store.set("nbReponse",compteurReponse[question_id]);
      $("#divQuestion" +question_id+"Reponse"+ idLigne).on('click', function() {
        $(this).remove();
        for(let cpt = idLigne; cpt <= compteurReponse[question_id]; cpt++) {
          let id = cpt+1;
          let div = $("#divQuestion"+question_id+"Reponse" + id)[0].getElementsByTagName("div");
          div[0].getElementsByTagName("label")[0].innerHTML = "Réponse " + cpt + " :";
          div[2].getElementsByTagName("input")[0].id = "gridCheckQuestion"+question_id+"Reponse" + cpt;
          div[2].getElementsByTagName("label")[0].for = "gridCheckQuestion"+question_id+"Reponse" + cpt;
          div[1].getElementsByTagName("input")[0].id = "question"+question_id+"Reponse" + cpt;
          div[3].getElementsByTagName("button")[0].id = "deleteQuestion"+question_id+"Reponse" + cpt;
          div[3].getElementsByTagName("button")[0].setAttribute("onclick", "supprLigne("+question_id+"," + cpt + ",\'" + element +"\')");
          $("#divQuestion"+question_id+"Reponse" + id)[0].id = "divQuestion"+question_id+"Reponse" + cpt;

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

//Pour supprimer une énigme ou bien une réponse 
function supprimerQuestion(question_id, element) {
  if (element == "Question") {
    if(compteurQuestion>1){
      compteurQuestion--;
      logger.info('Suppression d\'une question dans le QCM de l\'exercice à reconnaissance vocale');
      // UPDATE NBQUESTIONS A FAIRE store.set("nbReponse",compteurReponse[question_id]);
      $("#question" +question_id).on('click', function() {
        $(this).remove();
        for(let cpt = question_id; cpt <= compteurQuestion; cpt++) {
          let id = cpt+1;
          compteurReponse[cpt]=compteurReponse[id];
          
          let div = $("#question"+id)[0].getElementsByTagName("div");
          div[2].getElementsByTagName("label")[0].setAttribute("data-target","#collapseQuestion"+cpt);
          div[2].getElementsByTagName("label")[0].innerHTML = "Question "+cpt+" :";
          div[2].getElementsByTagName("label")[0].setAttribute("aria-controls","#collapseQuestion"+cpt);
          div[2].getElementsByTagName("input")[0].id="textQuestion"+cpt;
          div[2].getElementsByTagName("input")[0].setAttribute("onkeyup","activerSave('textQuestion"+cpt+"');");
          div[3].getElementsByTagName("button")[0].setAttribute("data-target","#collapseQuestion"+cpt);
          div[3].getElementsByTagName("button")[0].setAttribute("aria-controls","#collapseQuestion"+cpt);
          div[3].getElementsByTagName("button")[0].id="btnCollapseQuestion"+cpt;
          div[3].getElementsByTagName("button")[1].setAttribute("onclick","supprimerQuestion("+cpt+",'Question');");
          div[3].getElementsByTagName("button")[1].id="deleteQuestion"+cpt;
          div[4].id="collapseQuestion"+cpt;
          div[7].id="reponseContainerQuestion"+cpt;
          let last_div=7;
          for(let cpt_rep=1;cpt_rep<=compteurReponse[cpt];cpt_rep++){
            div[last_div+1].id="divQuestion"+cpt+"Reponse"+cpt_rep;
            div[last_div+2].getElementsByTagName("label")[0].innerHTML = "Réponse " + cpt_rep + " :";
            div[last_div+3].getElementsByTagName("input")[0].id = "question"+cpt+"Reponse" + cpt_rep;
            div[last_div+3].getElementsByTagName("input")[0].setAttribute("onkeyup","activerSave('question"+cpt+"Reponse"+cpt_rep+"');");
            div[last_div+4].getElementsByTagName("input")[0].id = "gridCheckQuestion"+cpt+"Reponse" + cpt_rep;
            div[last_div+4].getElementsByTagName("input")[0].setAttribute("onclick","activerSaveCheckbox('gridCheckQuestion"+cpt+"Reponse"+cpt_rep+"');");
            div[last_div+4].getElementsByTagName("label")[0].setAttribute("for","gridCheckQuestion"+cpt+"Reponse" + cpt_rep);
            div[last_div+5].getElementsByTagName("button")[0].id = "deleteQuestion"+cpt+"Reponse" + cpt_rep;
            div[last_div+5].getElementsByTagName("button")[0].setAttribute("onclick", "supprLigne("+cpt+"," + cpt_rep + ",'Reponse')");
            last_div+=5;
          }
          div[last_div+1].getElementsByTagName("button")[0].id="ajouterReponseQuestion"+cpt;
          div[last_div+1].getElementsByTagName("button")[0].setAttribute("onclick","ajouterNouvelleReponse('',false,"+cpt+");");
          $("#question"+id)[0].id="question"+cpt;
        }
        compteurReponse[compteurQuestion+1]=0;
      });
      
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


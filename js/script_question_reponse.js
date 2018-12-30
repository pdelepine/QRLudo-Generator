/**
 * @Date:   2018-11-23T11:47:00+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-04T21:15:05+01:00
 */

/**
 * Abdessabour HARBOUL
 * 2018
 */

var projet = new Projet();

$(document).ready(function() {

  // Cacher le boutton de previsualisation du qrCode Question par default
  $('#previwQuesQRCodeId').hide();

  //Clear Question Form
  $("#addNewQuesBtnId").click(function() {
    clearModalForm('newQuestionModalId');
  });

  //Clear Reponse Form
  $("#addNewRepBtnId").click(function() {
    clearModalForm('newReponseModalId');
  });

  //Clear Choose Reponse form then load the combobox with all the reponses in the project.
  $("#addNewChooseRepBtnId").click(function() {
    $("#reponsesChooseSelectId").empty();
    $('#reponsesChooseSelectId').append($('<option>', {
      val: "norep",
      text: "---Selectionner Une Reponse---"
    }));
    $.each(projet.getReponses(), function(i, val) {
      $('#reponsesChooseSelectId').append($('<option>', {
        val: val.getId(),
        text: val.getName()
      }));
    });
  });

  //Ajout d'une nouvelle question
  $("#addQuestionBtnId").click(function() {
    if (addNewValueToComboBox($('#questionTextAreaId').val(), 'questionsId', 'newQuestionModalId', projet.getQuestions())) {
      $('#reponsesDivId').show();
    }
    console.log(projet);
  });

  //Ajout d'une nouvelle reponse
  $("#addReponseBtnId").click(function() {
    addNewValueToArray($('#reponseTextAreaId').val(), projet.getReponses(), 'newReponseModalId');
    updateReponses();
  });

  //cet evenement permet l'affectation d'une reponse a la question selectionnée
  $("#chooseReponseBtnId").click(function() {
    for (let ques_item of projet.getQuestions()) {
      if (ques_item.getName() === $("#questionsId option:selected").text()) {
        for (let rep_itemUid of ques_item.getReponsesUIDs()) {
          if (rep_itemUid === $("#reponsesChooseSelectId option:selected").val()) {
            return;
          }
        }
        ques_item.addReponse($("#reponsesChooseSelectId option:selected").val());
        break;
      }
    }

    updateReponses();
    $("#chooseReponseModalId .close").click();
    console.log($("input#"+ $("#reponsesChooseSelectId option:selected").val()));
  });


  //Evenement quand la liste deroulante de la question change
  $("#questionsId").change(function() {
    updateReponses();
  });

  //Previsualiser le QRcode Question
  $("#previwQuesQRCodeId").click(function() {
    for (let ques_item of projet.getQuestions()) {
      if ($("#questionsId").val() == ques_item.getId()) {
        previewQRCode(ques_item, $('#qrView')[0], "type_question");
        break;
      }
    }
  });

  /* Methode qui genere un dossier avec un fichier json comportant tous les informations
   sur les questions et reponse du projets ainsi que les qrcodes de ces questions_reponses*/
  $("#save").click(function() {
    var facade = new FacadeController();
    projet.setName($("#projectId").val());
    console.log(projet);
    let dir = projet.getName();
    if (!fs.existsSync(`${root}/${dir}`)) {
      fs.mkdirSync(`${root}/${dir}`);
    }
    fs.writeFile(`${root}/${dir}/data.json`, projet.getDataString(), function(err) {
      if (err) {
        console.log("ERROR !!");
      }
    });
    for (question of projet.getQuestions()) {
      let div = document.createElement('div');
      facade.genererQRCode(div, question);
      saveQRCodeImage(div, question, projet.getName());
    }
    for (reponse of projet.getReponses()) {
      let div = document.createElement('div');
      facade.genererQRCode(div, reponse);
      saveQRCodeImage(div, reponse, projet.getName());
    }
  });

  //Import d'un projet existant
  $('#importFileValidateBtnId').click(function() {
    let loaded = $.ajax({
      url: document.getElementById("importProjectInputFileId").files[0].path,
      dataType: 'json',
      async: false,
      success: function(data) {
        // console.log("success");
      }
    }).responseJSON;
    projet = new Projet();
    projet.projet.id = loaded.id;
    projet.projet.nom = loaded.nom;
    console.log(loaded);
    for (let ques of loaded.questions) {
      let current_ques = new Question(ques.qrcode.name, ques.qrcode.data);
      current_ques.setId(ques.qrcode.id);
      projet.addQuestion(current_ques);
    }
    for (let rep of loaded.reponses) {
      let current_rep = new Reponse(rep.qrcode.name);
      current_rep.setId(rep.qrcode.id);
      projet.addReponse(current_rep);
    }
    $('#projectId').val(projet.getName());
    $('#questionsId').html('');
    $('#questionsId').append($('<option>', {
      val: "noquest",
      text: "---Selectionner Une Question---"
    }));
    for (let question of projet.getQuestions()) {
      $('#questionsId').append($('<option>', {
        val: question.getId(),
        text: question.getName()
      }));
    }
    $("#importProjectModalId .close").click();
  });
});

function toggleEditMessage(totoggle){
  totoggle.parent('div').find("div").toggle();
}

function updateReponses(){
  var id_question = $("#questionsId option:selected").val();
  var question = null;
  if(id_question !== 'noquest'){
    question = projet.getQuestionById(id_question);
  }

  $("#reponsesDivLabelsId").empty();
  $.each(projet.getReponses(), function(i, val) {

    var str_checked = '';
    var str_message_value = '';
    if(question !== null){
      var rep = question.getReponseById(val.qrcode.id);
      console.log(rep);
      if(rep!==null){
        str_checked = 'checked';
        str_message_value = rep.message;
      }
    }

    var new_reponse_div = "<div class='form-inline'><label class='form-control control-label col-md-6' style='padding-top:10px;'>" + val.getName() + "</label>" +
      "<input class='form-check-input' type='checkbox' id='" + val.getId() + "' onclick='changeReponse($(this))' " + str_checked + "/>" +
      "<button id='" + val.getId() + "' type='button' name='rep[]' class='btn btn-outline-success' onclick='deleteReponse($(this));'><i class='fa fa-trash-alt'></i></button>" +
      "<button type='button' name='previwRepQRCodeName' class='btn btn-outline-success' onclick='previewRep($(this));'><i class='fa fa-qrcode'></i></button>" +
      "<button type='button' name='showEditMessage' class='btn btn-outline-success' onclick='toggleEditMessage($(this));'><i class='fa fa-edit'></i></button>" +
      "<div class='form-inline' id='customMessageDiv' style='display:none;'>" +
        "<input class='form-control control-label col-md-6' type='text' id='" + val.getId() + "' name='message' value='" + str_message_value + "'/>"+
        "<button class='btn btn-outline-success' onclick='setCustomMessage($(this));'><i class='fas fa-check'></i></button>" +
      "</div></div>"
    $("#reponsesDivLabelsId").append(new_reponse_div);
  });
}

function changeReponse(checkbox){
  var id_question = $("#questionsId option:selected").val();
  //si une question est selectionnée
  if(id_question !== 'noquest'){
    for (let ques_item of projet.getQuestions()) {
      if (id_question == ques_item.getId()) {
        id_reponse = JSON.parse($(checkbox).attr('id'));
        if($(checkbox).prop('checked')){
          ques_item.addReponse(id_reponse);
        }
        else{
          ques_item.removeReponse(id_reponse);
        }
      }
    }
  }
}

function setCustomMessage(button){
  var id_question = JSON.parse($("#questionsId option:selected").val());
  console.log(id_question);
  if(id_question!=='noquest'){
    for(let question of projet.getQuestions()){
      console.log(question);
      if(question.qrcode.id === id_question){
        var input_text = button.parent('div').find("input");
        console.log($(input_text).val());
        question.setMessage(JSON.parse($(input_text).attr('id')), $(input_text).val());
        console.log(question);
      }
    }

  }
}

//Cette fonction sauvegardel'image du qrcode dans un div pour le pouvoir generer apres
function saveQRCodeImage(div, qrcode, directoryName) {
  let img = $(div).children()[0].src;
  let data = img.replace(/^data:image\/\w+;base64,/, '');
  fs.writeFile(`${root}/${directoryName}/${qrcode.getName()}.jpeg`, data, {
    encoding: 'base64'
  }, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

//Cette Fonction Supprime Une reponse a une question
function deleteReponse(todelete) {
  for (q of projet.getQuestions()) {
    if (q.getId() == $("#questionsId option:selected").val()) {
      for (i = 0; i < q.getReponsesUIDs().length; i++) {
        if (q.getReponsesUIDs()[i] == todelete.attr('id')) {
          q.getReponsesUIDs().splice(i, 1);
        }
      }
    }
  }
  todelete.parent('div').remove();
}

// Previsualiser les reponses
function previewRep(topreview) {
  let rep = projet.getReponsesById(topreview.prev().attr("id"));
  previewQRCode(rep, $('#qrView')[0], "type_reponse");
}

// generate and print qr code
function previewQRCode(qrcode, div, type) {
  let facade = new FacadeController();
  if (type == "type_question"){
    $.each($("#reponsesDivLabelsId div input"), function(i, val){
      if(val.value !== ''){
        qrcode.setMessage(val.id, val.value);
      }

    });
    facade.genererQRCode(div, qrcode);
  }
  else if ((type == "type_reponse")) {
    facade.genererQRCode(div, qrcode);
  }
}


//Ajouter une nouvelle valeur a la liste deroulante
function addNewValueToComboBox(new_val, selectid, modalIdToClose, array) {
  if (new_val === "") return false; // si le champ est vide on sort
  //sortir de la fonction si le champ entré existe deja
  let existe = false;
  $('select#' + selectid).find('option').each(function() {
    if ($(this).text() === new_val) {
      existe = true;
      return;
    }
  });
  if (existe) return false;
  //Ajouter a la liste deroulante la nouvelle valeur
  let nouvques = new Question(new_val);
  array.push(nouvques);
  $('#' + selectid).append($('<option>', {
    val: nouvques.getId(),
    text: new_val
  }));
  //fermer la pop-up
  $("#" + selectid).val(nouvques.getId()).change();
  $("#" + modalIdToClose + " .close").click();
  return true;
}

//Ajouter une nouvelle valeur a un tableau
function addNewValueToArray(new_val, my_array, modalIdToClose) {
  if (new_val === "") return false; // si le champ est vide on sort
  //sortir de la fonction si le champ entré existe deja
  let existe = false;
  $.each(my_array, function(i, val) {
    if (val.getName() === new_val) {
      existe = true;
      return;
    }
  });
  if (existe) return false;
  //Ajouter au tableau la nouvelle valeur
  my_array.push(new Reponse(new_val));

  //fermer la pop-up
  $("#" + modalIdToClose + " .close").click();
  return true;
}

//Renvoie un Array des valeur d'une liste deroulante
function selectOptionsValuesAsArray(selectId) {
  let resArray = [];
  $('select#' + selectId).find('option').each(function() {
    resArray.push($(this).val());
  });
  return resArray;
}

//Mettre les champs d'un modal vides
function clearModalForm(modal_id) {
  $('#' + modal_id).find('form')[0].reset();
}

function showEditMessage(input){
  console.log(input);
  if(input.css('display')=='none'){
    input.css('display', 'block');
  } else {
    input.css('display', 'none');
  }
}

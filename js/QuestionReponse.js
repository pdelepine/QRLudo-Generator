/**
 * @Author: alassane
 * @Date:   2018-11-23T11:47:00+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-23T12:56:20+01:00
 */

 /**
  * Abdessabour HARBOUL
  * 2018
  */

var fs = require('fs');
const path = require('path');
let root = path.dirname(require.main.filename);
const {
  FacadeController
} = require(`${root}/Controller/FacadeController`);
const {
  QuestionReponse
} = require(`${root}/Model/QuestionReponse`);

let quesrepcontroller = new QuesRepController();
let projet = new Projet();




$(document).ready(function() {

  //console.log("PathName : " + pathname);
  console.log("Root : " + root);

  //Cacher le div des reponses par default
  $('#reponsesDivId').hide();

  //Clear Question Form
  $("#addNewQuesBtnId").click(function() {
    quesrepcontroller.clearModalForm('newQuestionModalId');
  });

  //Clear Reponse Form
  $("#addNewRepBtnId").click(function() {
    quesrepcontroller.clearModalForm('newReponseModalId');
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
        text: val.getTitle()
      }));
    });
  });

  //Ajout d'une nouvelle question
  $("#addQuestionBtnId").click(function() {
    if (quesrepcontroller.addNewValueToComboBox($('#questionTextAreaId').val(), 'questionsId', 'newQuestionModalId', projet.getQuestions())) {
      $('#reponsesDivId').show();
    }
    console.log(projet);
  });

  //Ajout d'une nouvelle reponse
  $("#addReponseBtnId").click(function() {
    quesrepcontroller.addNewValueToArray($('#reponseTextAreaId').val(), projet.getReponses(), 'newReponseModalId');
    console.log(projet);
  });

  //cet evenement permet l'affectation d'une reponse a la question selectionnée
  $("#chooseReponseBtnId").click(function() {
    for (let ques_item of projet.getQuestions()) {
      if (ques_item.getTitle() === $("#questionsId option:selected").text()) {
        for (let rep_itemUid of ques_item.getReponsesUIDs()) {
          if (rep_itemUid === $("#reponsesChooseSelectId option:selected").val()) {
            return;
          }
        }
        ques_item.addReponse($("#reponsesChooseSelectId option:selected").val());
        break;
      }
    }
    $("#reponsesDivLabelsId").append("<div class='form-inline'><label class='form-control control-label col-md-6' style='padding-top:10px;'>" + $("#reponsesChooseSelectId option:selected").text() + "</label>" +
      "<button id='" + $("#reponsesChooseSelectId option:selected").val() + "' type='button' name='rep[]' class='btn btn-outline-success' onclick='deleteReponse($(this));'><i class='fa fa-trash-alt'></i></button></div>");
    $("#chooseReponseModalId .close").click();
    console.log(projet);
  });



  //Evenement quand la liste deroulante de la question change
  $("#questionsId").change(function() {
    if ($(this).val() === "noquest") $('#reponsesDivId').hide(); // le div se cache quand l'option "Selectionner une question est selectionné"
    else {
      $('#reponsesDivId').show(); // Si une autre valeur le div des reponses sera affiché
      $('#reponsesDivLabelsId').html('');
      for (let ques_item of projet.getQuestions()) {
        if ($(this).val() == ques_item.getId()) {
          for (let repUid_item of ques_item.getReponsesUIDs()) {
            for (let rep of projet.getReponses()) {
              if (repUid_item == rep.getId()) {
                $("#reponsesDivLabelsId").append("<div class='form-inline'><label class='form-control control-label col-md-6' style='padding-top:10px;'>" + rep.getTitle() + "</label>" +
                  "<button id='" + rep.getId() + "' type='button' name='rep[]' class='btn btn-outline-success' onclick='deleteReponse($(this));'><i class='fa fa-trash-alt'></i></button></div>");
              }
            }
          }
        }
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
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
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
      //element.parentNode.removeChild(div);
    }
    for (reponse of projet.getReponses()) {
      let div = document.createElement('div');
      facade.genererQRCode(div, reponse);
      saveQRCodeImage(div, reponse, projet.getName());
      //element.parentNode.removeChild(div);
    }
  });


});

function saveQRCodeImage(div, qrcode, directoryName) {
  //console.log("The DIV : " + div);
  let img = $(div).children()[0].src;
  //console.log("The IMG : " + img);
  let data = img.replace(/^data:image\/\w+;base64,/, '');
  //console.log("The DATA : " + data);
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

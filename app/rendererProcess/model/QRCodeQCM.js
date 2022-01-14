/**
 * classe permettant de créer une réponse
 */
class ReponseQCM {
  /**
   * 
   * @param {} id = "question{i}reponse{j}"
   * @param {} reponse valeur de la réponse
   * @param {} isGoodAnswer true si c'est la bonne réponse à la question; false sinon
   */
  constructor(id, reponseText = "", isGoodAnswer = false) {
    this.reponse = {
      id: id,
      reponseText: reponseText,
      isGoodAnswer: isGoodAnswer
    };
  }

  getId() {
    return this.reponse.id;
  }

  getReponse() {
    return this.reponse.reponseText;
  }

  getIsGoodAnswer() {
    return this.reponse.isGoodAnswer;
  }
}
/**
 * classe permettant de créer une question
 */
class QuestionQCM {
  /**
   * 
   * @param {} id = "question{i}"
   * @param {} textQuestion la question
   * @param {} reponses tableau de ReponseQCM
   */
  constructor(id, textQuestion = "", reponses = []) {
    this.question = {
      id: id,
      textQuestion: textQuestion,
      reponses: reponses
    };
  }

  getId() {
    return this.question.id;
  }

  setId(newId) {
    this.question.id = newId;
  }

  getTextQuestion() {
    return this.question.textQuestion;
  }

  setTextQuestion(newTextQuestion) {
    this.question.textQuestion = newTextQuestion;
  }

  getReponses() {
    return this.question.reponses;
  }

  setReponses(newReponses) {
    this.question.reponses = newReponses;
  }
}
/**
 * Classe permettant de créer un projet de QCM
 */
class ProjetQCM {
  /**
   * @param type - Qr Code type
   * @param {} questions tableau de QuestionQCM
   * @param {} textBonneReponse le message de bonne réponse 
   * @param {} textMauvaiseReponse le message de mauvaise réponse
   */
  constructor(questions = [], textBonneReponse = "", textMauvaiseReponse = "") {
    var dataString = "";
    for (let i = 0; i < questions.length; i++) {
      dataString += questions[i];
    }
    var md5Value = MDFiveConverter.convert(dataString);

    this.qrcode = {
      id: md5Value,
      type: "ExerciceReconnaissanceVocaleQCM",
      questions: questions,
      textBonneReponse: textBonneReponse,
      textMauvaiseReponse: textMauvaiseReponse
    };
  }

  getId() {
    return this.qrcode.id;
  }

  getType() {
    return this.qrcode.type;
  }

  getQuestions() {
    return this.qrcode.questions;
  }

  getQuestionFromId(id) {
    for (let i = 0; i < this.qrcode.questions.length; i++) {
      if (this.qrcode.questions[i].id == id) {
        return this.qrcode.questions[i];
      }
    }
    return null;
  }

  getTextBonneReponse() {
    return this.qrcode.textBonneReponse;
  }

  getTextMauvaiseReponse() {
    return this.qrcode.textMauvaiseReponse;
  }

  getDataString() {
    return JSON.stringify(this.qrcode);
  }
}

module.exports = {
  ProjetQCM,
  QuestionQCM,
  ReponseQCM
};
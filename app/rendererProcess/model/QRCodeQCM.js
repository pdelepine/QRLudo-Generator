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
  constructor(id, reponse = "", isGoodAnswer = false){
    this.reponse = {
      id: id,
      reponse: reponse,
      isGoodAnswer: isGoodAnswer
    };
  }

  getId(){
    return this.id;
  }

  getReponse(){
    return this.reponse;
  }

  getIsGoodAnswer(){
    return this.isGoodAnswer;
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
  constructor(id, textQuestion = "", reponses = []){
    this.question = {
      id: id,
      textQuestion: textQuestion,
      reponses: reponses
    };
  }

  getId(){
    return this.id;
  }

  setId(newId){
    this.id=newId;
  }

  getTextQuestion(){
    return this.textQuestion;
  }

  setTextQuestion(newTextQuestion){
    this.textQuestion=newTextQuestion;
  }

  getReponses(){
    return this.reponses;
  }

  setReponses(newReponses){
    this.reponses=newReponses;
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
  constructor(questions = [], textBonneReponse = "", textMauvaiseReponse = ""){
    var dataString="";
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

  getId(){
    return this.qrcode.id;
  }

  getQuestions(){
    return this.qrcode.questions;
  }

  getQuestionFromId(id){
    for(let i = 0 ; i < this.qrcode.questions.length; i++){
      if(this.qrcode.questions[i].id == id){
          return this.qrcode.questions[i];
      }
  }
  return null;
  }

  getTextBonneReponse(){
    return this.qrcode.textBonneReponse;
  }

  getTextMauvaiseReponse(){
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
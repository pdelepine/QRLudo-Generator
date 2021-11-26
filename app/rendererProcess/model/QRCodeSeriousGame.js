/**
 * @Date : 2020-11-10
 */
/**
 * DELÉPINE Pierre-yVes
 */

 const { MDFiveConverter } = require(`${root}/rendererProcess/controller/MDFiveConverter.js`);

 /**
  *  Classe permettant de créer un projet de serious game
  */
 class ProjetSeriousGame {
     /**
      * Constructeur d'un projet Serious Game
      * @param  {} nom="No_Name"
      * @param  {} questionsQr=[] liste des questions avec qrcode
      * @param  {} questionsReco=[] liste des questions à reconnaissance vocale
      */
     constructor(nom = "No_Name", questionsQr = [], questionsReco = []) {
         var dataString = nom;
         for (let i = 0; i < questionsQr.length; i++) {
             dataString += questionsQr[i];
         }
         for (let i = 0; i < questionsReco.length; i++) {
             dataString += questionsReco[i];
         }
 
         /** Génération de l'id unique  */
         var md5Value = MDFiveConverter.convert(dataString);
 
         this.scenario = "";
         this.projet = {
             id: md5Value,
             nom: nom,
             questionsQrCode: questionsQr,
             questionsRecoVocale: questionsReco
         };
     }
 
     setScenario(scenario) {
         this.scenario = scenario;
     }
 
     addQuestionQr(question) {
         this.projet.questionsQrCode.push(question);
     }
 
     addQuestionReco(question) {
         this.projet.questionsRecoVocale.push(question);
     }
 
     setName(nom) {
         this.projet.nom = nom;
     }
 
     getProject() {
         return this.projet;
     }
 
     getName() {
         return this.projet.nom;
     }
 
     getScenario() {
         return this.scenario;
     }
 
     getQuestionsQr() {
         return this.projet.questionsQrCode;
     }
 
     /** Retourne le QRCodeQuestion de la question possédant cet id d'énigme sinon renvoie null */
     getQuestionQrFromId(id){
         for(let i = 0 ; i < this.projet.questionsQrCode.length; i++){
             if(this.projet.questionsQrCode[i].idQR == id){
                 return this.projet.questionsQrCode[i];
             }
         }
         return null;
     }
 
     /** Retourne un tableau de toutes les réponses de toutes les questions QRCodes sous forme de ReponseQuestionsQR */
     getReponsesQrCode() {
         let reponses = [];
         this.projet.questionsQrCode.forEach(function (question){
             for (let i = 0; i < question.reponsesQR.length; i++) {
                 reponses.push(new ReponseQuestionQR(question.reponsesQR[i], (question.bonneReponseQR == i + 1) ? "true" : "false"));
             }
         });
         return reponses;
     }
 
     /** Retourne un tableau des questions à QRCode formaté pour le json du qrcodeSeriousGame */
     getQuestionsQrForJson() {
         let questions = [];
 
         this.projet.questionsQrCode.forEach(function (element) {
             let reponses = [];
             for (let i = 0; i < element.reponsesQR.length; i++) {
                 reponses.push([element.reponsesQR[i], (element.bonneReponseQR == i + 1) ? "true" : "false"]);
             }
             questions.push([element.idQR.toString(), element.questionQR, reponses]);
         });
         return questions;
     }
 
     getQuestionsReco() {
         return this.projet.questionsRecoVocale;
     }
 
     /** Retourne un tableau des questions à reconnaissance vocale formaté pour le json du qrcodeSeriousGame */
     getQuestionsRecoForJson() {
         let questions = [];
         this.projet.questionsRecoVocale.forEach(function (element) {
             questions.push([element.idRec.toString(), element.questionRec, element.reponseRec]);
         });
         return questions;
     }
 
     /** retoune le RecVocaleQuestion de la question posédant cet id d'énigme sinon renvoie null */
     getQuestionRecoFromId(id){
         for(let i = 0 ; i < this.projet.questionsRecoVocale.length; i++){
             if(this.projet.questionsRecoVocale[i].idRec == id){
                 return this.projet.questionsRecoVocale[i];
             }
         }
         return null;
     }
 
     getDataString() {
         return JSON.stringify(this.projet);
     }
 }
 
 /**
  * Classe permettant de créer une question QR
  */
 class QRCodeQuestion {
     constructor(textQuestion, tabReponse = [], estBonneReponse, idEnigme) {
         this.questionQR = textQuestion;
         this.reponsesQR = tabReponse;
         this.bonneReponseQR = estBonneReponse;
         this.idQR = idEnigme;
     }
 
     setQuestion(question){
         this.questionQR = question;
     }
 
     setReponses(reponses = []){
         this.reponsesQR = reponses;
     }
 
     setBonneReponseQR(reponse){
         this.bonneReponseQR=reponse;
     }
 
     setId(id){
         this.idQR = id;
     }
 
     getQuestion(){
         return this.questionQR;
     }
 
     getReponses(){
         return this.reponsesQR;
     }
 
     getBonneReponse(){
         return this.bonneReponseQR;
     }
     getId(){
         return this.idQR ;
     }
 }


 class QRCodeSeriousGame {
 
    constructor(data,color ='#000000') {
        this.qrcode = {
            id: data.id,
            type: data.type,
            jsonData: data,
            color : color
        };
    }

    getId() {
        return this.qrcode.id;
    }

    getType() {
        return this.qrcode.type;
    }

    getDataString() {
        return JSON.stringify (this.qrcode.jsonData);
    }

    setColor(color) {
        this.qrcode.color = color;
    }

    getColor() {
        return this.qrcode.color;
    }
}

 
 /**
  * Classe permettant de créer une qrRecoVocale
  */
 class RecVocaleQuestion {
     constructor(textQuestion, textReponse, idEnigme) {
         this.questionRec = textQuestion;
         this.reponseRec = textReponse;
         this.idRec = idEnigme;
     }
 
     setQuestion(question){
         this.questionRec = question;
     }
 
     setReponse(reponse){
         this.reponseRec = reponse;
     }
 
     setId(id){
         this.idRec = id;
     }
 
     getQuestion(){
         return this.questionRec ;
     }
 
     getReponse(){
         return this.reponseRec ;
     }
 
     getId(){
         return this.idRec ;
     }
 
 }
 /**
  * Classe Représentant une réponse d'un questionQR
  */
 class ReponseQuestionQR {
     constructor(reponse_, isGoodAnswer_, color_ = '#000000') {
         this.qrcode = {
             id: new Date().getTime(),
             name: reponse_,
             type: "ReponseSeriousGame",
             reponse: reponse_,
             isGoodAnswer: isGoodAnswer_,
             color: color_
         };
 
     }
 
     getId() {
         return this.qrcode.id;
     }
 
     getType() {
         return this.qrcode.type;
     }
 
     getDataString() {
         return JSON.stringify(this.qrcode);
     }
 
     setColor(color){
         this.qrcode.color = color;
     }
 
     getColor() {
         return this.qrcode.color;
     }
 
     getName() {
         return this.qrcode.reponse;
     }
 }
 
 module.exports = {
     ProjetSeriousGame,
     QRCodeSeriousGame,
     QRCodeQuestion,
     RecVocaleQuestion,
     ReponseQuestionQR
 };
 
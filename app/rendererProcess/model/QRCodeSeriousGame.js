/**
 * @Date : 2020-11-10 Création du modèle
 * @Date : 2021-11-26 Nouveau format du modèle
 */
/**
 * @author DELÉPINE Pierre-Yves
 * @author MITATY Simon
 */

 const { MDFiveConverter } = require(`${root}/rendererProcess/controller/MDFiveConverter.js`);

 /**
  *  Classe permettant de créer un projet de serious game
  */
 class ProjetSeriousGame {
     /**
      * Constructeur d'un projet Serious Game
      * @param  type = "SeriousGame" - QR Code Type
      * @param  {} textNodes=[] liste des questions avec qrcode
      * @param  {} questionNodes=[] liste des questions à reconnaissance vocale
      */
     constructor(textNodes = [], questionNodes = []) {
         var dataString = "";
         for (let i = 0; i < textNodes.length; i++) {
             dataString += textNodes[i];
         }
         for (let i = 0; i < questionNodes.length; i++) {
             dataString += questionNodes[i];
         }
 
         /** Génération de l'id unique  */
         let md5Value = MDFiveConverter.convert(dataString);
         let type = "SeriousGame";
 
         this.qrcode = {
             id: md5Value,
             type: type,
             textNodes: textNodes,
             questionNodes: questionNodes
         };
     }

     setType(type){
         this.qrcode.type = type;
     }

     setTextNodes(textNodes){
         this.qrcode.textNodes = textNodes;
     }

     setQuestionNodes(questionNodes){
         this.qrcode.questionNodes = questionNodes;
     }

     getType(){
         return this.qrcode.type;
     }

     getTextNodes(){
         return this.qrcode.textNodes;
     }

     getQuestionNodes(){
         return this.qrcode.questionNodes;
     }

     getDataString(){
         return JSON.stringify(this.qrcode);
     }

 }


 /**
  * Classe permettant la création d'objet Json pour les text nodes
  */
 class TextNode {
     /**
      * @param name = "No_Name"
      * @param {} text = Contenu du champ texte
      * @param {} exitLink = Contient le nom du noeud suivant
      */

     constructor(name = "No_Name", text = {}, exitLink = ""){
         this.name = name;
         this.text = text;
         this.exitLink = exitLink;
     }

     setName(name){
         this.name = name;
     }

     setText(text){
         this.text = text;
     }

     setExitLink(exitLink){
         this.exitLink = exitLink;
     }

     getName(){
         return this.name;
     }

     getText(){
         return this.text;
     }

     getExitLink(){
         return this.exitLink;
     }
 }

 /**
  * Classe permettant la création d'objet Json pour les question nodes
  */
 class QuestionNode {
     /**
      * @param {} name = "No_Name"
      * @param {} textQuestion = Contient le texte de la question
      * @param {} reponses = Contient la liste des réponses à la question
      */

     constructor(name = "No_Name", textQuestion = {}, reponses = []){
         this.name = name;
         this.textQuestion = textQuestion;
         this.reponses = reponses;
     }

    setName(name){
        this.name = name;
    }

    setReponses(reponses){
        this.reponses = reponses;
    }

    setTextQuestion(textQuestion){
        this.textQuestion = textQuestion;
    }

    getName(){
        return this.name;
    }

    getReponses() {
        return this.reponses;
    }

    getTextQuestion(){
        return this.textQuestion;
    }
 }

 
 module.exports = {
     ProjetSeriousGame,
     TextNode,
     QuestionNode
 };
 
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
     * @param  {} text_nodes=[] liste des questions avec qrcode
     * @param  {} question_nodes=[] liste des questions à reconnaissance vocale
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
            text_nodes: textNodes,
            question_nodes: questionNodes
        };

        this.qrcodeMetaData = {};
    }

    setType(type) {
        this.qrcode.type = type;
    }

    setTextNodes(textNodes) {
        this.qrcode.text_nodes = textNodes;
    }

    setQuestionNodes(questionNodes) {
        this.qrcode.question_nodes = questionNodes;
    }

    getType() {
        return this.qrcode.type;
    }

    getTextNodes() {
        return this.qrcode.text_nodes;
    }

    getQuestionNodes() {
        return this.qrcode.question_nodes;
    }

    getDataString() {
        return JSON.stringify(this.qrcode);
    }

    setQrCodeMetadata(qrcodeMetadata) {
        this.qrcodeMetaData = qrcodeMetadata;
    }

    getJSONMetaData() {
        return JSON.stringify(this.qrcodeMetaData);
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

    constructor(name = "No_Name", text = {}, exitLink = "") {
        this.name = name;
        this.txt = text;
        this.ext = exitLink;
    }

    setName(name) {
        this.name = name;
    }

    setText(text) {
        this.txt = text;
    }

    setExitLink(exitLink) {
        this.ext = exitLink;
    }

    getName() {
        return this.name;
    }

    getText() {
        return this.txt;
    }

    getExitLink() {
        return this.ext;
    }
}

/**
 * Classe permettant la création d'objet Json pour les question nodes
 */
class QuestionNode {
    /**
     * @param {} name = "No_Name"
     * @param {String} type = M, Q ou O pour QCM, QR, QO
     * @param {} textQuestion = Contient le texte de la question
     * @param {} reponses = Contient la liste des réponses à la question
     */

    constructor(name = "No_Name", type, textQuestion = {}, reponses = []) {
        this.type = type;
        this.name = name;
        this.txt = textQuestion;
        this.rep = reponses;
    }

    setName(name) {
        this.name = name;
    }

    setReponses(reponses) {
        this.rep = reponses;
    }

    setTextQuestion(textQuestion) {
        this.txt = textQuestion;
    }

    getName() {
        return this.name;
    }

    getReponses() {
        return this.rep;
    }

    getTextQuestion() {
        return this.txt;
    }
}

module.exports = {
    ProjetSeriousGame,
    TextNode,
    QuestionNode
};

/**
 * @Author: alassane
 * @Date:   2018-11-10T20:58:49+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-16T16:20:58+01:00
 */


/**
 * Jules Leguy, Alassane Diop
 * 2017
 **/

/*
 * Classe permettant à la vue d'interagir avec le controller.
 * La vue instancie cette classe une seule fois à son initialisation et fait systématiquement appel à cette instance quand elle a besoin d'un traitement du controller.
 */

const {
  ImageGeneratorJson
} = require(`./ImageGeneratorJson`);

const {
  CompresseurTexte
} = require('./CompresseurTexte');
const {
  ImageGenerator
} = require('./ImageGenerator');

class FacadeController {

  constructor() {
    this.compresseurXml = new CompresseurTexte();
    this.imageGenerator = new ImageGenerator(this.compresseurXml);
    // this.imageGenerator = new ImageGenerator();
  }

  //Renvoie un nouveau QRCodeAtomique
  creerQRCodeAtomique() {
    return new QRCodeAtomique();
  }

  //Renvoie un nouveau QRCodeEnsemble
  creerQRCodeEnsemble() {
    return new QRCodeEnsemble();
  }

  //Génère une image QRCode à partir d'un objet QRCode dans le div passé en paramètre
  genererQRCode(divImg, qrcode) {
    const {
      JsonCompressor
    } = require('./JsonCompressor');

    try {
      while (divImg.hasChildNodes()) {
        divImg.removeChild(divImg.firstChild);
      }

      let args = [qrcode, divImg];

      let tailleQR = qrcode.getDataString().length;

      //si la taille depasse 500 -> generer un fichier json et le sauvegarder dans le dossier /QR-Unique/json/ puis dans le drive -> via un click sur le button sauvegarder situé dans le message d'alert
      //voir la fonction sauvegarderFichierJsonUnique(..) dans scripts_xl.js
      if(tailleQR > 500){

        //sauvegarder le fichier json
        //definir le nom du fichier + path
        let now = new Date();
        let nomFichier = now.getDay()+"-"+now.getMonth()+"-"+now.getFullYear()+"-"+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
        let path = "./QR-Unique/json/";

        let msg = "La taille '"+tailleQR+"' de ce QR-Code dépasse le maximum autorisé '500'.&nbsp;&nbsp;&nbsp;<button type='button' class='btn btn-outline-success' id='sauvegarderQRcode' onclick='sauvegarderFichierJsonUnique(\""+nomFichier+"\",\""+path+"\");'>Sauvegarder</button>";

        //message a afficher apres le sauvegarde du fichier json
        messageInfos(msg,"warning");

        $('#saveQRCode, #listenField, #stop').attr('disabled', true);
      }
      else{
            // compress qrcode when length reaches more than 117
            // compression is interesting only when qrcode reaches more than 117 car
            if (tailleQR > 117) {
              JsonCompressor.compress(qrcode.getDataString(), ImageGeneratorJson.genererQRCode, args);
            } else {
              args.push(qrcode.getDataString());
              ImageGeneratorJson.genererQRCode(args);
            }

            $('#saveQRCode, #listenField').attr('disabled', false);

          }

    } catch (e) {
      console.log(e);
    }
  }

  //Génère une image contenant une famille de QRCodes dans les metadonnees
  genererImageFamilleQRCode(tableauQRCodes, divImg) {
    while (divImg.hasChildNodes()) {
      divImg.removeChild(divImg.firstChild);
    }
    this.imageGenerator.genererImageFamilleQRCode(tableauQRCodes, divImg);
  }

  //Fonction appelée pour importer un qrcode json
  importQRCodeJson(file, callback) {
    let qrcode;

    const {
      QRCodeLoaderJson
    } = require('./QRCodeLoaderJson');
    QRCodeLoaderJson.loadImage(file, callback);
  }

  //Fonction appelée pour importer un qrcode
  importQRCode(file, callback) {
    let qrcode;

    const {
      QRCodeLoader
    } = require('./QRCodeLoader');

    // QRCodeLoader.loadImage(file, function(qrcode, drawQRCode) {
    //   console.log(qrcode);
    //   callback(qrcode); // faire le view du qrcode
    // });
    QRCodeLoader.loadImage(file, callback);
  }

  //Renvoie la taille réelle du qrcode après compression
  getTailleReelleQRCode(qrcode) {
    return this.compresseurXml.compresser(qrcode.getDonneesUtilisateur()).length;
  }

}

module.exports = {
  FacadeController
};

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 */

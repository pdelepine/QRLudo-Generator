/**
 * @Author: alassane
 * @Date:   2018-11-10T20:58:49+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2019-01-16T23:22:00+01:00
 */


/**
 * Jules Leguy, Alassane Diop
 * 2017
 **/

/*
 * Classe permettant à la vue d'interagir avec le controller.
 * La vue instancie cette classe une seule fois à son initialisation et fait systématiquement appel à cette instance quand elle a besoin d'un traitement du controller.
 */


class FacadeController {

  constructor() {
  }

  /**
   * Génère une image QRCode à partir d'un objet QRCode dans le div passé en paramètre
   * @param {*} divImg
   * @param {Object} qrcode, Objet contenant un attribut (Object) `qrcode` qui sera tranformé en JSon pour la génération
   */
  genererQRCode(divImg, qrcode) {
    try {
      while (divImg.hasChildNodes()) {
        divImg.removeChild(divImg.firstChild);
      }

      // Ajout de version du format du JSON représentatif du qr code
      switch (qrcode.qrcode.type) {
        case "unique":
          qrcode.qrcode.version = '3';
          break;
        case "ensemble":
          qrcode.qrcode.version = '3';
          break;
        case "question":
          qrcode.qrcode.version = '3';
          break;
        case "reponse":
          qrcode.qrcode.version = '3';
          break;
        case "ExerciceReconnaissanceVocaleQCM":
          qrcode.qrcode.version = '5';
          break;
        case "ExerciceReconnaissanceVocaleQuestionOuverte":
          qrcode.qrcode.version = '4';
          break;
        case "SeriousGame":
          qrcode.qrcode.version = '5';
          break;
        default:
          logger.error('Le type de qrcode n\'est pas pris en compte : ' + qrcode.qrcode.type);
      }

      // Création d'un objet qrcode, mime => type d'image a générer, size => taille de l'image, value => le texte à transformer
      let qr;
      try {
        // Si la taille du string représentant le Qrcode dépasse 120 caractères, on compresse le string avant de le tranformer
        if (qrcode.getDataString().length > 120) {
          logger.info('FacadeController.genererQRCode | Génération du QR code avec compression car il est trop volumineux');

          let gzippedQR;
          // Compression du QR Code
          JsonCompressor.compress(qrcode.getDataString(), (e) => gzippedQR = e[0].toString('base64'), []);
          logger.info(`FacadeController.genererQRCode | Compressed data : \n${gzippedQR}`);

          qr = new QRious({
            mime: "image/jpeg",
            size: 400,
            value: gzippedQR
          });
        } else {
          logger.info('FacadeController.genererQRCode | Génération du QR code sans compression');

          qr = new QRious({
            mime: "image/jpeg",
            size: 400,
            value: qrcode.getDataString()
          });
        }
      } catch (exception) {
        logger.error('FacadeController.genererQRCode | Problème lors de la génération du QR code \n' + exception);
      }

      // Transformation de l'objet qrcode en dataURL
      let qrdata = qr.toDataURL();
      console.log('Data JPEG ' + qrdata);

      // Création de l'exif
      let exif = {};

      if (qrcode.qrcode.type === "SeriousGame") {
        exif[piexif.ExifIFD.UserComment] = qrcode.getJSONMetaData().toString();
      } else {
        // UserComment est un tag spécifique au Exif du JPEG et permet de mettre un string en valeur
        exif[piexif.ExifIFD.UserComment] = qrcode.getDataString().toString();
      }

      let exifObj = { "Exif": exif };
      let exifBytes = piexif.dump(exifObj);                                 // Tranformation de l'obj exif en string
      let exifModified = piexif.insert(exifBytes, qrdata);                  // Insertion de l'exif string dans le dataURL du Jpeg

      let image = new Image();
      image.src = exifModified;
      $(divImg).prepend(image);

      logger.info(`FacadeController.genererQRCode | Génération du QR code résussi ${JSON.stringify(qrcode)}`);
      $('#saveQRCode, #listenField').attr('disabled', false);
    } catch (e) {
      logger.error('Problème dans la fonction genererQRCode du FacadeController');
      logger.error(e);
    }
  }

  /** Génère une image contenant une famille de QRCodes dans les metadonnees */
  genererImageFamilleQRCode(tableauQRCodes, divImg) {
    while (divImg.hasChildNodes()) {
      divImg.removeChild(divImg.firstChild);
    }
  }

  /**
   * Fonction appelée pour transformer le string de données du QR code en l'une des classes QR code disponibles
   * @param {String} qrcodeDataString
   * @param {Function} callback
   */
  importQRCodeJson(qrcodeDataString, callback) {
    QRCodeLoaderJson.loadImage(qrcodeDataString, callback);
  }

  /**
   * Fonction appelée pour importer le fichier JPEG contenant le QR code.
   * Les métadonnées du fichier sont lues et transformées en un modèle de QR code correspondant
   * @param {String} blobFile le blob du fichier a tranformer
   * @param {Function} callback la fonction appelée après importation du fichier
   */
  importQRCode(blobFile, callback) {
    QRCodeLoaderJson.loadImage(blobFile, callback);
  }

  /** Renvoie la taille réelle du qrcode après compression */
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

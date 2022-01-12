
/**
 * @Author: alassane
 * @Date:   2018-11-14T00:46:15+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-06T18:19:38+01:00
 */


/**
 * Permet de créer un objet QRCode à partir d'une image QRCode ou d'instancier un tableau 
 * contenant les objets QRCodes obtenus à partir d'une image enregistrant une famille de QRCodes
 */

class QRCodeLoaderJson {
  /**
   * Renvoie le QRCode crée à partir des informations du fichier image passé en paramètre
   * @param {Blob} blobFile
   * @param {Function} callback la fonction à qui on passe le QRCode généré
   */
  static loadImage(blobFile, callback) {
    // Initialisation du lecteur de fichier
    let fileReader = new FileReader();

    // Les métadonnées lues seront stockées ici
    let dataRead;

    // Paramétrage de la tranformation à faire lorsque le fichier est chargé
    fileReader.addEventListener("load", function () {
      let exifObj = piexif.load(fileReader.result);
      logger.info(`QRCodeLoaderJson.loadImage | exifObj \n${JSON.stringify(exifObj)}`);

      // On lit l'ancienne manière de sauvegarder les métadonnées, le champ `0th`
      let old_dataUtf8 = exifObj["0th"][700];
      logger.info(`QRCodeLoaderJson.loadImage | Métadonnées lues dans le champ 0th \n${old_dataUtf8}`);

      // On lit la nouvelle manière de sauvegarder les métadonnées, le champ `UserComment`
      let new_dataString = exifObj['Exif'][piexif.ExifIFD.UserComment];
      logger.info(`QRCodeLoaderJson.loadImage | Métadonnées lues dans le champ UserComment \n${new_dataString}`);

      if (!old_dataUtf8) {
        if (new_dataString) {
          dataRead = new_dataString;
        }
      } else {
        dataRead = UTF8ArraytoString(old_dataUtf8);
      }

      QRCodeLoaderJson.convertJSONStringToQR(dataRead, callback);
    });

    // On lance la lecture du fichier
    fileReader.readAsDataURL(blobFile);

  }

  /**
   * Transforme le string du JSON du QR code et renvoie la classe du QR code construit
   * @param {String} qrcodeString 
   * @param {Function} callback la fonction à qui on passe le QRCode généré
   */
  static convertJSONStringToQR(qrcodeString, callback) {

    logger.info(`QRCodeLoaderJson.loadImage | Essaie tranformation des données`);
    let qrcode;
    let qr;

    if (qrcodeString.charAt(0) === '{') {
      logger.info(`QRCodeLoaderJson.loadImage | Données non compressée, parsing du Json`);

      qr = JSON.parse(qrcodeString);

    } else {
      logger.info(`QRCodeLoaderJson.loadImage | Données compressée, décompression des données avant parsing du Json`);

      let dezippedData;
      JsonCompressor.decompress(filename, (data) => dezippedData = data);
      logger.info(`QRCodeLoaderJson.loadImage | Données décompressée ${dezippedData}`)
      qr = JSON.parse(dezippedData);
    }

    switch (qr.type) {
      case "unique":
        qrcode = new QRCodeUnique(qr.name, qr.data, qr.color);
        qrcode.setId(qr.id);
        break;

      case "ensemble":
        qrcode = new QRCodeMultipleJson(qr.name, qr.data, qr.color);
        break;

      case "question":
        qrcode = new Question(qr.name, qr.data, qr.color);
        qrcode.setId(qr.id);
        qrcode.setMinAnswer(qr.nb_min_reponses);
        qrcode.setGoodAnswer(qr.text_bonne_reponse[0]);
        qrcode.setBadAnswer(qr.text_mauvaise_reponse);
        break;

      case "reponse":
        qrcode = new Reponse(qr.name, qr.color);
        qrcode.setId(qr.id);
        break;

      case "ExerciceReconnaissanceVocaleQCM":
        qrcode = new QRCodeQCM(qr.name, qr.data, qr.lettreReponseVocale, qr.text_bonne_reponse, qr.text_mauvaise_reponse, qr.color);
        break;

      case "ExerciceReconnaissanceVocaleQuestionOuverte":
        qrcode = new QRCodeQuestionOuverte(qr.name, qr.data, qr.text_bonne_reponse, qr.text_mauvaise_reponse, qr.color);
        break;

      case "SeriousGame":
        qrcode = new ProjetSeriousGame();
        qrcode.setQrCodeMetadata(qr);
        break;

      default:
        logger.error(`QR Code importé ${JSON.parse(qrcodeString).type} invalide`);
        throw "QR Code invalide";
    }

    logger.info(`QRCodeLoaderJson.convertJSONStringToQR | QR Code chargé avec succès : ${JSON.stringify(qrcode)}`);

    if (callback)
      callback(qrcode);
  }

  /** from utf8 array return string */
  static UTF8ArraytoString(array) {
    let result = "";

    for (let i = 0; i < array.length; i++)
      result += String.fromCharCode(array[i]);

    return result;
  }

}

module.exports = {
  QRCodeLoaderJson
};

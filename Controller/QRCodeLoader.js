
class QRCodeLoader{


  //Renvoie le QRCode crée à partir des informations du fichier image passé en paramètre
  static loadQRCode(file, callback){

    var qrcode;
    var fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    // `onload` as listener
    fileReader.addEventListener('load', function (ev) {
      console.log("dataUrlSize:", ev.target.result.length);

      try{
      qrcode = QRCodeLoader.creerQRCode(ev.target.result);
      }
      catch(e){
        alert(e);
        return;
      }

      if (callback){
        callback(qrcode, drawQRCode); // renvoyer le qrcode créé
      }
    });

  }

  //Traduit les int en chaine xml utf8 puis crée un objet QRCode à partir des données reconstituées
  static creerQRCode(data){

    //On récupère les données exif de l'image
    var exifObj = piexif.load(data);
    var dataUtf8 = exifObj["0th"][700];

    if (!dataUtf8){
      throw "L'image est invalide (ne contient pas de métadonnées)";
    }

    //On convertit les données en chaîne de caractères
    var donnees = QRCodeLoader.bin2String(dataUtf8);


    //On convertit la chaine xml en données xml
    var qrxml = new window.DOMParser().parseFromString(donnees, "text/xml")

    //On vérifie qu'on a bien réussi à parser le xml
    if(!qrxml){
      throw "L'image est invalide (xml incorrect)";
    }

    //On lit le type de QRCode contenu dans l'image
    var typeQRCode= qrxml.getElementsByTagName(DictionnaireXml.getTagDonneesUtilisateur())[0].getAttribute(DictionnaireXml.getAttTypeQRCode());

    //On vérifie que le xml est bien formé (qu'il possède un noeud donneesUtilisateur et un noeud metadonnees)
    if (!qrxml.getElementsByTagName(DictionnaireXml.getTagDonneesUtilisateur()[0]) || !qrxml.getElementsByTagName(DictionnaireXml.getTagMetaDonnees()[0])){
      throw "L'image est invalide (xml incorrect)";
    }

    //On instancie un objet QRCode du bon type
    var qrcode;
    switch(typeQRCode){
      case DictionnaireXml.getValTypeAtomique():
        qrcode = new QRCodeAtomique();
        qrcode.setNoeudRacine(qrxml);
        break;
      case DictionnaireXml.getValTypeEnsemble():
        qrcode = new QRCodeEnsemble();
        qrcode.setNoeudRacine(qrxml);
        break;
      default:
        throw "L'image est invalide (le type de QRCode n'est pas reconnu)";
        break;
    }

    return qrcode;

  }


  //Convertit un tableau d'entiers en chaîne de caractères
  static bin2String(array){
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(array[i]);
    }
    return result;
  }


}

/**
 * @Author: alassane
 * @Date:   2018-12-04T14:28:52+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2019-01-28T01:41:24+01:00
 */

/** Boolean qui permet de detecter si l'onglet unique est load dans le cas de l'importation d'un QR unique */
var isImportationQRUnique = false;

/** Boolean qui permet de detecter si l'onglet reco vocale est load dans le cas de l'importation d'un QCM */
var isImportationExerciceRecoVocaleQCM = false;

/** Déclaration de l'entier renseignant le nombre de zones de donnee dans l'onglet qr unique (les zones de textes ou les fichier audio) */
var nbZoneDonne = 0;

/** Déclaration de l'entier permettant l'implémentation des différentes zones de données dans l'onglet qr unique */
var numZoneCourante = 0;

/** nombre de fichier ajouté dans l'onglet multiple */
var numFich = 0;

/** numero de la reponse dans QR Exercice */
var numReponse = 0;

/** Déclaration de variable globales */
const path = require('path');
const root = __dirname.match(`.*app`)[0];
const piexif = require('piexifjs');
const fs = require('fs');
const remoteElectron = require('electron').remote;
const logger = remoteElectron.getGlobal('sharedObject').loggerShared.getLogger();
const { setTimeout } = require('timers');

/** Déclaration du store permettant la continuité entre les differents onglets */
const store = remoteElectron.getGlobal('sharedObject').store;

function getNormalizePath(pathToNormalize) {
  logger.info('script_loader.getNormalizePath | Transformation du chemin en : ' + (path.resolve(pathToNormalize)).replaceAll(' ', '%20'));
  return (path.resolve(pathToNormalize)).replaceAll(' ', '%20');
}

/** Import de $ comme appel à jQuery */
window.$ = window.jQuery = require(root + "/rendererProcess/utils/jquery/jquery.min.js");
// window.$ = window.jQuery = require('jquery');
require(root + "/rendererProcess/utils/jquery/jquery.qrcode.min.js");
require(root + "/rendererProcess/utils/jquery/jquery-qrcode-0.14.0.min.js");
require(root + "/rendererProcess/utils/jquery/jquery-qrcode-0.14.0.js");
require(root + "/rendererProcess/utils/bootstrap.min.js");
require(root + "/rendererProcess/utils/fontawesome/solid.js");
require(root + "/rendererProcess/utils/fontawesome/fontawesome.js");

/** Create QRLudo temp folder if not exist
 * C'est ici que sont entreposé les fichier télécharger de dropbox et google drive
 */
const { exec } = require('child_process');
switch (process.platform) {
  case 'linux':
    var temp = path.join(process.env.HOME, 'temp/QRLudo');
    logger.info(`Création d'un dossier temporaire : ${temp} et ses sous-dossiers Download et tts`);
    fs.access(temp, fs.constants.F_OK, (err) => {
      if (err) {
        var { ipcRenderer } = require('electron');

        exec(`mkdir -p ${temp}/Download`, (error, stdout, stderr) => {
          if (error) {
            logger.error(`Problème de création du dossier : ${temp}/Download`);
            console.error(`exec error: ${error}`);
            ipcRenderer.send('exitApp', null);
            return;
          }
        });

        exec(`mkdir -p ${temp}/tts`, (error, stdout, stderr) => {
          if (error) {
            logger.error(`Problème de création du dossier : ${temp}/tts`);
            console.error(`exec error: ${error}`);
            ipcRenderer.send('exitApp', null);
            return;
          }
        });
      }
    });
    break;

  case 'win32':
    var temp = path.join(process.env.temp, 'QRLudo');
    logger.info(`Création d'un dossier temporaire : ${temp} et ses sous-dossiers Download et tts`);
    fs.access(temp, fs.constants.F_OK, (err) => {
      if (err) {
        var { ipcRenderer } = require('electron');

        exec(`mkdir ${temp}\\Download`, (error, stdout, stderr) => {
          if (error) {
            logger.error(`Problème de création du dossier : ${temp}\\Download`);
            console.error(`exec error: ${error}`);
            ipcRenderer.send('exitApp', null);
            return;
          }
        });

        exec(`mkdir ${temp}\\tts`, (error, stdout, stderr) => {
          if (error) {
            logger.error(`Problème de création du dossier : ${temp}\\tts`);
            console.error(`exec error: ${error}`);
            ipcRenderer.send('exitApp', null);
            return;
          }
        });
      }
    });
    break;

  default:
    logger.error('Le système d\'exploitation est inconnu');
    break;
}

/** Check internet connection 
logger.info('Test de la connexion internet');
/*if (!navigator.onLine) {
  logger.error(`L'application ne peut pas se lancer sans une liaison à internet. Veuillez vérifier votre connexion internet`);
  alert("L'application ne peut pas se lancer sans une liaison à internet. Veuillez vérifier votre connexion internet");
  window.close();
} else {
  logger.info('L\'application est bien connectée à internet');
}*/

const { ipcRenderer } = require('electron');
const dialog = remoteElectron.dialog;

const { CompresseurTexte } = require(`${root}/rendererProcess/controller/CompresseurTexte`);
const { ControllerMultiple } = require(`${root}/rendererProcess/controller/ControllerMultiple`);
const { FacadeController } = require(`${root}/rendererProcess/controller/FacadeController`);
const { JsonCompressor } = require(`${root}/rendererProcess/controller/JsonCompressor`);
const { MDFiveConverter } = require(`${root}/rendererProcess/controller/MDFiveConverter`);
const { QRCodeLoader } = require(`${root}/rendererProcess/controller/QRCodeLoader`);
const { QRCodeLoaderJson } = require(`${root}/rendererProcess/controller/QRCodeLoaderJson`);

/**
 * On charge les modèle de données 
 */

const { Music } = require(`${root}/rendererProcess/model/Music`);
const { QRCodeMultipleJson } = require(`${root}/rendererProcess/model/QRCodeMultipleJson`);
const { QRCodeUnique } = require(`${root}/rendererProcess/model/QRCodeUnique`);

const { QRCodeXMLJson } = require(`${root}/rendererProcess/model/QRCodeXMLJson`);

const { Projet,
  Reponse,
  Question } = require(`${root}/rendererProcess/model/QRCodeQuestionReponse`);

const { ProjetQCM,
  QuestionQCM,
  ReponseQCM } = require(`${root}/rendererProcess/model/QRCodeQCM`);

const { ProjetSeriousGame,
  TextNode,
  QuestionNode } = require(`${root}/rendererProcess/model/QRCodeSeriousGame`);

const { QRCodeQuestionOuverte } = require(`${root}/rendererProcess/model/QRCodeQuestionOuverte`);

const { SGDot } = require(`${root}/rendererProcess/model/SGDot`);
const { SGLink } = require(`${root}/rendererProcess/model/SGLink`);
const { SGNode } = require(`${root}/rendererProcess/model/SGNode`);
const { SGTextNode } = require(`${root}/rendererProcess/model/SGTextNode`);
const { SGQuestionQCMNode } = require(`${root}/rendererProcess/model/SGQuestionQCMNode`);
const { SGQuestionQONode } = require(`${root}/rendererProcess/model/SGQuestionQONode`);
const { SGQuestionQRNode } = require(`${root}/rendererProcess/model/SGQuestionQRNode`);


// Instanciate object
let controllerMultiple = new ControllerMultiple();

const QRious = require('qrious');
const zlib = require('zlib');
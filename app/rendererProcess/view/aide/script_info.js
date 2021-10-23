/**
 * @Author: alassane
 * @Date:   2018-12-10T13:37:39+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-10T21:54:12+01:00
 */

$(document).ready(function () {
  $('div.info-content').css('display', 'none');

  $("#content a.nav-link").on('click',e => {
    e.preventDefault();
    let element = e.target;
    console.log('script_info.on(click, a.nav-link) : element '+ element);
    let tab = $(element).attr('href');

    $('a').attr('class', 'nav-item nav-link');
    $('div.tab-pane').attr('class', 'tab-pane');

    $(element).addClass('active');
    $(tab).addClass('active');
  });
  
  $('.tab-content').find('a').on('click',e => {
    let href = $(e.target).attr('href');
    let display = $(href).css('display');

    if (display == 'block')
      $(href).fadeOut();
    else
      $(href).fadeIn();
  });


  $('.tab-content').find('a').on('mouseover',e => {                    
    /* pour changer la couleur du lien quand on mouseover ce lien */  
    $(e.target).css('color', '#7E7E7E');
  });

  $('.tab-content').find('a').on('mouseout',e => {     
    /* pour remettre la couleur originale quand on mouseout */            
    $(e.target).css('color', 'black');
  });



});

$("#unique-info").on('click',function(){
  logger.info("Demande d'informations sur Unique");
  $("#info-unique").css("display","block");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","none");
});

//test la connexion internet pour la vidéo explicative de Unique
$("#buttonAffichageVideoUnique").on('click',function(){
  /** Check internet connection */
  logger.info('Test de la connexion internet');
  if (!navigator.onLine) {
    logger.error(`L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet`);
    alert("L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet");
  } else {
    logger.info('L\'application est bien connectée à internet');
    document.getElementById("videoUnique").src = document.getElementById("videoUnique").src;
  }
});

$("#multiple-info").on('click',function(){
  logger.info("Demande d'informations sur Multiple");
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","block");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","none"); 
});

//test la connexion internet pour la vidéo explicative de Multiple
$("#buttonAffichageVideoMultiple").on('click',function(){
  /** Check internet connection */
  logger.info('Test de la connexion internet');
  if (!navigator.onLine) {
    logger.error(`L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet`);
    alert("L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet");
  } else {
    logger.info('L\'application est bien connectée à internet');
    document.getElementById("videoMultiple").src = document.getElementById("videoMultiple").src;
  }
});


$("#exo-qrcode-info").on('click',function(){
  logger.info("Demande d'informations sur Exercice - QR Code");
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","block");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","none");
});

//test la connexion internet pour la vidéo explicative de Exercice - QR Code
$("#buttonAffichageVideoExercice").on('click',function(){
  /** Check internet connection */
  logger.info('Test de la connexion internet');
  if (!navigator.onLine) {
    logger.error(`L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet`);
    alert("L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet");
  } else {
    logger.info('L\'application est bien connectée à internet');
    document.getElementById("videoExercice").src = document.getElementById("videoExercice").src;
  }
});

$("#exo-reco-vocale-info").on('click',function(){
  logger.info("Demande d'informationssur Reconnaissance vocale");
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "block");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","none");
});

//test la connexion internet pour la vidéo explicative de Question Ouverte
$("#buttonAffichageVideoQuestionOuverte").on('click',function(){
  /** Check internet connection */
  logger.info('Test de la connexion internet');
  if (!navigator.onLine) {
    logger.error(`L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet`);
    alert("L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet");
  } else {
    logger.info('L\'application est bien connectée à internet');
    document.getElementById("videoQuestionOuverte").src = document.getElementById("videoQuestionOuverte").src;
  }
});

//test la connexion internet pour la vidéo explicative de QCM
$("#buttonAffichageVideoQCM").on('click',function(){
  /** Check internet connection */
  logger.info('Test de la connexion internet');
  if (!navigator.onLine) {
    logger.error(`L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet`);
    alert("L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet");
  } else {
    logger.info('L\'application est bien connectée à internet');
    document.getElementById("videoQCM").src = document.getElementById("videoQCM").src;
  }
});

$("#serious-game-info").on('click',function(){
  logger.info("Demande d'informations sur Serious Game");
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "block");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","none");
});

//test la connexion internet pour la vidéo explicative de Serious Game
$("#buttonAffichageVideoSeriousGame").on('click',function(){
  /** Check internet connection */
  logger.info('Test de la connexion internet');
  if (!navigator.onLine) {
    logger.error(`L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet`);
    alert("L'application ne peut pas charger la vidéo sans une liaison à internet. Veuillez vérifier votre connexion internet");
  } else {
    logger.info('L\'application est bien connectée à internet');
    document.getElementById("videoSeriousGame").src = document.getElementById("videoSeriousGame").src;
  }
});

$("#music-info").on('click',function(){
  logger.info("Demande d'information sur Musique");
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","block");
  $("#info-Import").css("display","none");
});

$("#import-info").on('click',function(){
  logger.info("Demande d'informations sur Import");
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","block");
});

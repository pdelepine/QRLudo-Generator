import { qrUnique } from "./qrUnique";
import { qrcode } from "./qrcode";

/**
 * Typage d'une réponse à une question du QCM
 * @param id permet d'ordonner les réponse
 * @param text text de la réponse
 * @param isGoodAnswer est-ce la réponse est la bonne
 */
interface reponseQCM {
  id: number;
  text: string;
  isGoodAnswer: boolean;
}

/**
 * Typage d'une question du QCM
 * @param id permet d'ordonner les questions
 * @param textQuestion le texte de la question
 * @param reponses la liste des réponse possible à la question
 */
interface questionQCM {
  id: number;
  textQuestion: string;
  reponses: reponseQCM[];
}

/**
 * Interface représentant le type d'un qr QCM
 * @param name le nom du QCM
 * @param questions la liste de question du QCM
 * @param textBonneReponse le texte à lire lors d'une bonne réponse
 * @param textMauvaiseReponse le texte a lire lors d'une mauvaise réponse
 */
interface qrQCM extends qrcode {
  name: string;
  questions: questionQCM[];
  textBonneReponse: string;
  textMauvaiseReponse: string;
}

export type { reponseQCM, questionQCM, qrQCM };

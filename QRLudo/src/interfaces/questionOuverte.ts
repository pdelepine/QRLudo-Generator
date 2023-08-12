import { qrcode } from "./qrcode";

/**
 * Interface représentant le type d'un qr QCM
 * @param question la question
 * @param reponse la réponse à la question
 * @param textBonneReponse le texte à lire lors d'une bonne réponse
 * @param textMauvaiseReponse le texte a lire lors d'une mauvaise réponse
 */
interface qrQuestionOuverte extends qrcode {
  question: string;
  reponse: string;
  textBonneReponse: string;
  textMauvaiseReponse: string;
}

export type { qrQuestionOuverte };

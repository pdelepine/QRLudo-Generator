import { qrQuestionOuverte } from "@/interfaces/questionOuverte";
import { defineStore } from "pinia";

const useQrQuestionOuverteStore = defineStore("qrQuestionOuverte", {
  state: () => ({
    qrQuestionOuverte: {
      qrtype: "ExerciceReconnaissanceVocaleQuestionOuverte",
      question: "",
      reponse: "",
      textBonneReponse: "",
      textMauvaiseReponse: "",
    } as qrQuestionOuverte,
  }),
  getters: {
    question: (state) => state.qrQuestionOuverte.question,
  },
  actions: {
    /**
     * Définie le nom du QCM
     * @param question
     */
    setQuestion(question: string) {
      this.qrQuestionOuverte.question = question;
    },

    /**
     * Supprime la question
     * @param item
     */
    deleteQuestion() {
      this.qrQuestionOuverte.question = "";
    },

    /**
     * Supprime toutes les infos
     */
    deleteAll() {
      this.qrQuestionOuverte.question = "";
      this.qrQuestionOuverte.reponse = "";
      this.qrQuestionOuverte.textBonneReponse = "";
      this.qrQuestionOuverte.textMauvaiseReponse = "";
    },
  },
});

export default useQrQuestionOuverteStore;

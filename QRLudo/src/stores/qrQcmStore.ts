import { qrQCM, questionQCM, reponseQCM } from "@/interfaces/qcm";
import { defineStore } from "pinia";

const useQrQCMStore = defineStore("qrQCM", {
  state: () => ({
    qrQCM: {
      qrtype: "ExerciceReconnaissanceVocaleQCM",
      name: "",
      questions: [] as questionQCM[],
      textBonneReponse: "",
      textMauvaiseReponse: "",
    } as qrQCM,
  }),
  getters: {
    // Renvoie la liste des questions triées
    sortList: (state) => state.qrQCM.questions.sort((a, b) => a.id - b.id),
    name: (state) => state.qrQCM.name,
    textBonneReponse: (state) => state.qrQCM.textBonneReponse,
    textMauvaiseReponse: (state) => state.qrQCM.textMauvaiseReponse,
  },
  actions: {
    /**
     * Ajoute une question au QCM
     * @param item
     */
    addQuestion(question: questionQCM) {
      question.id = this.qrQCM.questions.length + 1;
      this.qrQCM.questions.push(question);
    },

    addReponse(question: questionQCM) {
      this.qrQCM.questions = this.qrQCM.questions.map((mapItem) => {
        if (mapItem.id === question.id) {
          mapItem.reponses.push({
            id: mapItem.reponses.length + 1,
            text: "",
            isGoodAnswer: false,
          });
        }
        return mapItem;
      });
    },

    deleteReponse(question: questionQCM, reponse: reponseQCM) {
      this.qrQCM.questions = this.qrQCM.questions.map((mapItem) => {
        if (mapItem.id === question.id) {
          mapItem.reponses = mapItem.reponses
            .filter((reponseItem) => reponseItem.id != reponse.id)
            .map((reponseItem) => {
              if (reponseItem.id > reponse.id) {
                reponseItem.id--;
              }
              return reponseItem;
            });
        }
        return mapItem;
      });
    },

    /**
     * Définie le nom du QCM
     * @param name
     */
    setName(name: string) {
      this.qrQCM.name = name;
    },

    /**
     * Fait monter la question d'un cran dans l'ordre
     * @param item
     * @returns
     */
    upQuestion(question: questionQCM) {
      if (question.id <= 1) return;
      const id = question.id;
      this.qrQCM.questions = this.qrQCM.questions.map((mapItem) => {
        if (mapItem.id === id) {
          mapItem.id = mapItem.id - 1;
        } else if (mapItem.id === id - 1) {
          mapItem.id = mapItem.id + 1;
        }
        return mapItem;
      });
    },

    /**
     * Fait descendre d'un cran la question dans l'ordre
     * @param item
     * @returns
     */
    downQuestion(item: questionQCM) {
      if (item.id >= this.qrQCM.questions.length) return;
      const id = item.id;
      this.qrQCM.questions = this.qrQCM.questions.map((mapItem) => {
        if (mapItem.id === id) {
          mapItem.id = mapItem.id + 1;
        } else if (mapItem.id === id + 1) {
          mapItem.id = mapItem.id - 1;
        }
        return mapItem;
      });
    },

    /**
     * Supprime la question
     * @param item
     */
    deleteQuestion(question: questionQCM) {
      const id = question.id;
      this.qrQCM.questions = this.qrQCM.questions
        .filter((mapItem) => mapItem.id != id)
        .map((mapItem) => {
          if (mapItem.id > id) {
            mapItem.id--;
          }
          return mapItem;
        });
    },

    deleteMessageBonneReponse() {
      this.qrQCM.textBonneReponse = "";
    },

    deleteMessageMauvaiseReponse() {
      this.qrQCM.textMauvaiseReponse = "";
    },

    /**
     * Supprime toutes les questions
     */
    deleteAllQuestions() {
      this.qrQCM.name = "";
      this.qrQCM.questions = [];
      this.qrQCM.textBonneReponse = "";
      this.qrQCM.textMauvaiseReponse = "";
    },
  },
});

export default useQrQCMStore;

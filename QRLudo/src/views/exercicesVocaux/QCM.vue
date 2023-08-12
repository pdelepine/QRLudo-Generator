<script setup lang="ts">
import eventBus from "@/eventBus";
import { questionQCM, reponseQCM } from "@/interfaces/qcm";
import useQrQCMStore from "@/stores/qrQcmStore";
import { ref } from "vue";

const show = ref();

// Récupération du store
const qrQcmStore = useQrQCMStore();

// --- Déclarations des actions utilisateurs ---
const addQuestionAction = () => {
  qrQcmStore.addQuestion({
    id: 0,
    textQuestion: "",
    reponses: [{ id: 1, text: "", isGoodAnswer: false }],
  });
};

const deleteQuestionAction = (item: questionQCM) => {
  qrQcmStore.deleteQuestion(item);
};

const addReponseAction = (question: questionQCM) => {
  qrQcmStore.addReponse(question);
};

const deleteReponseAction = (question: questionQCM, reponse: reponseQCM) => {
  qrQcmStore.deleteReponse(question, reponse);
};

const openQrCodeDialogAction = () => {
  eventBus.emit("open-qrcode-dialog");
};

const resetQrQCMAction = () => {
  qrQcmStore.deleteAllQuestions();
};
</script>

<template>
  <v-card>
    <v-card-text>
      <v-sheet
        v-for="question in qrQcmStore.sortList"
        class="h-auto pa-3"
        border
      >
        <v-text-field
          v-model="question.textQuestion"
          label="Question"
          class="w-auto"
        >
          <template v-slot:append>
            <v-btn icon variant="plain" class="h-auto">
              <v-icon>mdi-music</v-icon>
              <v-tooltip activator="parent" location="top">
                Ajouter de l'audio
              </v-tooltip>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              variant="plain"
              class="h-auto"
              :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="show = !show"
            ></v-btn>
          </template>
        </v-text-field>
        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>
            <v-card-text>
              <v-row v-for="reponse in question.reponses">
                <v-col cols="7">
                  <v-text-field
                    v-model="reponse.text"
                    :label="`Réponse ${reponse.id}`"
                  />
                </v-col>
                <v-col>
                  <v-checkbox
                    v-model="reponse.isGoodAnswer"
                    label="Bonne réponse ?"
                  />
                </v-col>
                <v-col cols="1">
                  <v-btn
                    @click="() => deleteReponseAction(question, reponse)"
                    icon
                    variant="plain"
                  >
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="top"
                      >Supprimer</v-tooltip
                    >
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
            <v-btn
              @click="() => addReponseAction(question)"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-qrcode-plus"
              class="mt-5"
              block
              >Ajouter une nouvelle réponse</v-btn
            >
          </div>
        </v-expand-transition>
      </v-sheet>
    </v-card-text>

    <v-card-text>
      <v-text-field
        v-model="qrQcmStore.qrQCM.textBonneReponse"
        label="Message de bonne réponse"
        clearable
        color="primary"
      >
        <template v-slot:append>
          <v-btn icon variant="plain" class="h-auto">
            <v-icon>mdi-music</v-icon>
            <v-tooltip activator="parent" location="top"
              >Ajouter de l'audio</v-tooltip
            >
          </v-btn>
        </template>
      </v-text-field>
      <v-text-field
        v-model="qrQcmStore.qrQCM.textMauvaiseReponse"
        label="Message de mauvaise réponse"
        clearable
        color="primary"
      >
        <template v-slot:append>
          <v-btn icon variant="plain" class="h-auto">
            <v-icon>mdi-music</v-icon>
            <v-tooltip activator="parent" location="top"
              >Ajouter de l'audio</v-tooltip
            >
          </v-btn>
        </template>
      </v-text-field>
    </v-card-text>

    <v-card-text>
      <v-btn
        @click="() => addQuestionAction()"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-qrcode-plus"
        class="mt-5"
        block
        >Ajouter une nouvelle question</v-btn
      >
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="() => resetQrQCMAction()"
        prepend-icon="mdi-refresh"
        color="warning"
        variant="outlined"
        >Réinitialiser</v-btn
      >
      <v-btn
        @click="() => openQrCodeDialogAction()"
        prepend-icon="mdi-cog-play"
        color="primary"
        variant="flat"
        >Générer</v-btn
      >
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.panel {
  border: 1px solid;
  border-color: #1867c0;
}
</style>

<script setup lang="ts">
import QRCodeDialog from "@/components/QRCodeDialog.vue";
import eventBus from "@/eventBus";
import useQrQuestionOuverteStore from "@/stores/qrQuestionOuverteStore";
import { ref } from "vue";

// Récupération du Store
const qrQuestionOuverteStore = useQrQuestionOuverteStore();

const question = ref<string>(qrQuestionOuverteStore.question);

// --- Déclarations des actions utilisateurs ---
const deleteQuestionAction = () => {
  qrQuestionOuverteStore.deleteQuestion();
};

const deleteReponseAction = () => {
  qrQuestionOuverteStore.deleteReponse();
};

const deleteBonneReponseAction = () => {
  qrQuestionOuverteStore.deleteMessageBonneReponse();
};

const deleteMauvaiseReponseAction = () => {
  qrQuestionOuverteStore.deleteMessageMauvaiseReponse();
};

const openQrCodeDialogAction = () => {
  eventBus.emit("open-qrcode-dialog");
};

const resetQrQuestionOuverteAction = () => {
  qrQuestionOuverteStore.deleteAll();
};
</script>

<template>
  <v-card>
    <QRCodeDialog
      :qrcode-type="qrQuestionOuverteStore.qrQuestionOuverte.qrtype"
    />
    <v-card-text>
      <v-text-field
        v-model="qrQuestionOuverteStore.qrQuestionOuverte.question"
        label="Question"
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
          <v-btn @click="() => deleteQuestionAction()" icon variant="plain">
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Supprimer</v-tooltip>
          </v-btn>
        </template>
      </v-text-field>
      <v-text-field
        v-model="qrQuestionOuverteStore.qrQuestionOuverte.reponse"
        class="w-50"
        label="Réponse attendue"
        clearable
        color="primary"
      >
        <template v-slot:append>
          <v-btn @click="() => deleteReponseAction()" icon variant="plain">
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Supprimer</v-tooltip>
          </v-btn>
        </template>
      </v-text-field>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text>
      <v-text-field
        v-model="qrQuestionOuverteStore.qrQuestionOuverte.textBonneReponse"
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
          <v-btn @click="() => deleteBonneReponseAction()" icon variant="plain">
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Supprimer</v-tooltip>
          </v-btn>
        </template>
      </v-text-field>
      <v-text-field
        v-model="qrQuestionOuverteStore.qrQuestionOuverte.textMauvaiseReponse"
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
          <v-btn @click="() => deleteBonneReponseAction()" icon variant="plain">
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Supprimer</v-tooltip>
          </v-btn>
        </template>
      </v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="() => resetQrQuestionOuverteAction()"
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

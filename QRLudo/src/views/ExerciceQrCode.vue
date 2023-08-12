<script setup lang="ts">
import eventBus from "@/eventBus";
import { ref } from "vue";

const tab = ref();

const openQrCodeDialogAction = () => {
  eventBus.emit("open-qrcode-dialog");
};

const resetQrExerciceAction = () => {
  //qrQcmStore.deleteAllQuestions();
};
</script>

<template>
  <v-card>
    <v-card-title>QR Exercice</v-card-title>
    <v-card-subtitle
      >Création de QR Exercice. Les exercices permettent de prendre connaissance
      des réponses avant validation. Plusieurs réponses peuvent êtres
      acceptées.</v-card-subtitle
    >

    <v-card-text>
      <v-text-field label="Question" clearable color="primary">
        <template v-slot:append>
          <v-btn icon variant="plain" class="h-auto">
            <v-icon>mdi-music</v-icon>
            <v-tooltip activator="parent" location="top"
              >Ajouter de l'audio</v-tooltip
            >
          </v-btn>
        </template>
      </v-text-field>
      <v-text-field label="Message de bonne réponse" clearable color="primary">
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
      <v-text-field
        label="Nombre de bonne réponse"
        clearable
        color="primary"
        class="w-25"
        type="number"
      >
      </v-text-field>

      <div class="d-flex justify-center mb-5">
        <v-btn variant="flat" color="primary" prepend-icon="mdi-cog-play"
          >Créer l'exercice</v-btn
        >
      </div>

      <v-card>
        <v-card-title>Bonne(s) réponse(s)</v-card-title>
      </v-card>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="() => resetQrExerciceAction()"
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

<script setup lang="ts">
import { ref } from "vue";

const tab = ref();
</script>

<template>
  <v-card>
    <v-tabs v-model="tab" color="primary">
      <v-tab :to="{ name: 'QuestionOuverte' }" value="question-ouverte">
        Question ouverte
      </v-tab>
      <v-tab :to="{ name: 'QCM' }" value="qcm"> QCM </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <RouterView />
    </v-window>
  </v-card>
</template>

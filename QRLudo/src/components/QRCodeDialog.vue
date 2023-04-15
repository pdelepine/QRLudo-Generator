<script setup lang="ts">
import { ref } from "vue";
import eventBus from "@/eventBus";

const isOpen = ref<boolean>(false);

eventBus.on("open-qrcode-dialog", () => {
  isOpen.value = true;
});
</script>

<template>
  <v-dialog
    v-model="isOpen"
    transition="dialog-bottom-transition"
    class="w-50"
    persistent
  >
    <v-card>
      <v-card-title>QRCode généré</v-card-title>
      <v-img></v-img>
      <v-card-actions>
        <v-btn @click="() => (isOpen = false)" color="primary">Fermer</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" variant="outlined">Exporter</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

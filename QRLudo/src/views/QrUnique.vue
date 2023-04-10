<script setup lang="ts">
import { itemQRUnique } from "@/interfaces/itemQRUnique";
import { ref } from "vue";
import useQrUniqueStore from "@/stores/qruniqueStore";
import { computed } from "vue";

const qruniqueStore = useQrUniqueStore();

const addItemAction = () => {
  qruniqueStore.addItem({ id: 0, texte: "" });
};

const upItemAction = (item: itemQRUnique) => {
  qruniqueStore.upItem(item);
};

const downItemAction = (item: itemQRUnique) => {
  qruniqueStore.downItem(item);
};

const deleteItemAction = (item: itemQRUnique) => {
  qruniqueStore.deleteItem(item);
};
</script>

<template>
  <v-card>
    <v-card-title prepend-icon="mdi-qrcode">QR Unique</v-card-title>
    <v-card-subtitle
      >Création de QR unique. Vous pouvez utiliser du contenu textuel ou
      vocal.</v-card-subtitle
    >
    <v-card-text>
      <v-text-field label="Nom du QR code" clearable></v-text-field>

      <v-textarea
        v-for="item in qruniqueStore.sortList"
        :key="item.id"
        label="Texte du QR code"
        v-model="item.texte"
        clearable
      >
        <template v-slot:append>
          <v-btn icon variant="plain">
            <v-icon>mdi-music</v-icon>
            <v-tooltip activator="parent" location="top"
              >Ajouter de l'audio</v-tooltip
            >
          </v-btn>
          <v-btn @click="() => deleteItemAction(item)" icon variant="plain">
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Supprimer</v-tooltip>
          </v-btn>
          <v-btn @click="() => upItemAction(item)" icon variant="plain">
            <v-icon>mdi-arrow-up</v-icon>
            <v-tooltip activator="parent" location="top">Monter</v-tooltip>
          </v-btn>
          <v-btn @click="() => downItemAction(item)" icon variant="plain">
            <v-icon>mdi-arrow-down</v-icon>
            <v-tooltip activator="parent" location="top">Descendre</v-tooltip>
          </v-btn>
        </template>
      </v-textarea>
      <v-btn
        @click="() => addItemAction()"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-file-document-plus-outline"
        >Ajouter du nouveau contenu</v-btn
      >
    </v-card-text>

    <v-card-actions>
      <v-btn color="warning" variant="outlined">Réinitialiser</v-btn>
      <v-btn color="primary" variant="flat">Générer</v-btn>
      <v-btn color="success" variant="outlined">Exporter</v-btn>
    </v-card-actions>
  </v-card>
</template>

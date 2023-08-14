<script setup lang="ts">
import QRCodeDialog from "@/components/QRCodeDialog.vue";
import eventBus from "@/eventBus";
import { itemQrMultiple } from "@/interfaces/qrMultiple";
import useQrMultipleStore from "@/stores/qrmultipleStore";
import { ref } from "vue";

// Récupération du store
const qrMultipleStore = useQrMultipleStore();

const isOpenAddDialog = ref<boolean>(false);

// Déclaration des actions utilisateur
const addItemAction = () => {
  isOpenAddDialog.value = true;
  qrMultipleStore.addItem({
    id: 0,
    item: { qrtype: "unique", name: "test", items: [{ id: 1, texte: "" }] },
  });
};

const upItemAction = (item: itemQrMultiple) => {
  qrMultipleStore.upItem(item);
};

const downItemAction = (item: itemQrMultiple) => {
  qrMultipleStore.downItem(item);
};

const deleteItemAction = (item: itemQrMultiple) => {
  qrMultipleStore.deleteItem(item);
};

const openQrCodeDialogAction = () => {
  eventBus.emit("open-qrcode-dialog");
};

const resetQRMultipleAction = () => {
  qrMultipleStore.deleteAll();
};
</script>

<template>
  <!-- Dialog d'ajout de Qr Unique-->
  <v-dialog v-model="isOpenAddDialog" persistent width="50%">
    <v-card>
      <v-card-title>Ajouter un QR Unique</v-card-title>

      <v-card-text>
        <v-text-field label="Nom du QR code" clearable></v-text-field>
        <v-text-field label="Contenu du QR code" clearable class="h-auto">
          <template v-slot:append>
            <v-btn icon variant="plain" class="h-auto">
              <v-icon>mdi-music</v-icon>
              <v-tooltip activator="parent" location="top"
                >Ajouter de l'audio</v-tooltip
              >
            </v-btn>
          </template>
        </v-text-field>
        <v-file-input label="Ajouter un QR Unique déjà généré"></v-file-input>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="() => (isOpenAddDialog = false)">Fermer</v-btn>
        <v-btn color="primary" variant="flat">Valider</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Page QR Multiple -->
  <v-card>
    <QRCodeDialog :qrcode-type="qrMultipleStore.qrMultiple.qrtype" />
    <v-card-title>QR Multiple</v-card-title>
    <v-card-subtitle
      >Création de QR Multiple. Les QR Multiples contiennent plusieurs QR
      Unique.</v-card-subtitle
    >
    <v-card-text>
      <v-text-field
        v-model="qrMultipleStore.name"
        label="Nom du QR code"
        clearable
      ></v-text-field>

      <div class="mb-5">
        <v-row v-for="item in qrMultipleStore.sortList">
          <v-col cols="12" md="4">
            <v-btn
              variant="outlined"
              class="h-auto"
              color="secondary"
              prepend-icon="mdi-qrcode"
              >Qr code : {{ item.item.name }}
              <template v-slot:append>
                <v-btn
                  @click="() => deleteItemAction(item)"
                  icon
                  variant="plain"
                >
                  <v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent" location="top"
                    >Supprimer</v-tooltip
                  >
                </v-btn>
                <v-btn @click="() => upItemAction(item)" icon variant="plain">
                  <v-icon>mdi-arrow-up</v-icon>
                  <v-tooltip activator="parent" location="top"
                    >Monter</v-tooltip
                  >
                </v-btn>
                <v-btn @click="() => downItemAction(item)" icon variant="plain">
                  <v-icon>mdi-arrow-down</v-icon>
                  <v-tooltip activator="parent" location="top"
                    >Descendre</v-tooltip
                  >
                </v-btn>
              </template>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-btn
        @click="() => addItemAction()"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-qrcode-plus"
        block
        >Ajouter un nouveau qr code</v-btn
      >
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="() => resetQRMultipleAction()"
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

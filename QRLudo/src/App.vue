<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import Home from "@/views/Home.vue";
import QRCodeDialog from "./components/QRCodeDialog.vue";
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title
        ><RouterLink :to="{ name: 'Home' }" class="main-title"
          >QRLudo</RouterLink
        >
      </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer expand-on-hover rail>
      <v-list density="compact" nav>
        <v-list-item :to="{ name: 'QRUnique' }" prepend-icon="mdi-qrcode"
          >QR Unique</v-list-item
        >
        <v-list-item :to="{ name: 'QRMultiple' }" prepend-icon="mdi-qrcode-plus"
          >QR Multiple</v-list-item
        >
        <v-list-item
          :to="{ name: 'ExerciceQR' }"
          prepend-icon="mdi-format-list-bulleted-type"
          >QR Exercices</v-list-item
        >
        <v-list-item
          :to="{ name: 'ExerciceVocaux' }"
          prepend-icon="mdi-microphone"
          >Exercices oraux</v-list-item
        >
        <v-list-item
          :to="{ name: 'SeriousGame' }"
          prepend-icon="mdi-controller-classic"
          >SeriousGame</v-list-item
        >
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <QRCodeDialog />
      <v-container>
        <RouterView v-slot="{ Component }">
          <v-scroll-x-transition>
            <component :is="Component" />
          </v-scroll-x-transition>
        </RouterView>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.main-title {
  text-decoration: none;
  color: white;
}
</style>

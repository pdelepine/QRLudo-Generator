<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import Home from "./views/Home.vue";
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title> QRLudo </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <Home />
    </v-main>
  </v-app>
</template>

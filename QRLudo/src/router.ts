import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import QRUnique from "@/views/QrUnique.vue";
import QRMultiple from "@/views/QrMultiple.vue";
import ExerciceQR from "@/views/ExerciceQrCode.vue";
import ExerciceVocaux from "@/views/exercicesVocaux/ExerciceVocaux.vue";
import QuestionOuverte from "@/views/exercicesVocaux/QuestionOuverte.vue";
import QCM from "@/views/exercicesVocaux/QCM.vue";
import SeriousGame from "@/views/SeriousGame.vue";

// Déclaration des routes de notre application nécessaire pour le routing
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
    name: "Home",
  },
  {
    path: "/qrunique",
    component: QRUnique,
    name: "QRUnique",
  },
  {
    path: "/qrmultiple",
    component: QRMultiple,
    name: "QRMultiple",
  },
  {
    path: "/exerciceqr",
    component: ExerciceQR,
    name: "ExerciceQR",
  },
  {
    path: "/exercicevocaux",
    component: ExerciceVocaux,
    name: "ExerciceVocaux",
    children: [
      {
        path: "questionouverte",
        component: QuestionOuverte,
        name: "QuestionOuverte",
      },
      {
        path: "qcm",
        component: QCM,
        name: "QCM",
      },
    ],
  },
  {
    path: "/seriousgame",
    component: SeriousGame,
    name: "SeriousGame",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;

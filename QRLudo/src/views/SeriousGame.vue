<script setup lang="ts">
import { SGNode } from "@/sgEngine/sgNode";
import { SGQuestionQCMNode } from "../sgEngine/sgQuestionQcmNode";
import { SGQuestionQONode } from "../sgEngine/sgQuestionQoNode";
import { SGQuestionQRNode } from "../sgEngine/sgQuestionQrNode";
import { SGTextNode } from "../sgEngine/sgTextNode";
import P5 from "p5";
import { SGLink } from "@/sgEngine/sgLink";
import { sketch } from "@/sgEngine/sketch";

let myP5 = new P5(sketch);
</script>

<template>
  <div>
    <div id="seriousGameDiagram" style="width: 100%; height: 100%"></div>
  </div>
</template>

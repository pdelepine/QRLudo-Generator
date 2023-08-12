<script setup lang="ts">
import { ref } from "vue";
import qrious from "qrious";
import piexifjs from "piexifjs";
import eventBus from "@/eventBus";
import useQrUniqueStore from "@/stores/qruniqueStore";

const isOpen = ref<boolean>(false);
const props = defineProps({ qrcodeType: String });
const qruniqueStore = useQrUniqueStore();

const imageSrc = ref();

eventBus.on("open-qrcode-dialog", () => {
  isOpen.value = true;
});

const genererQrCode = () => {
  if (!props.qrcodeType) return;
  let qrcodeType = props.qrcodeType;
  let qrCodeToTransform;

  switch (qrcodeType) {
    case "unique":
    case "xl":
      qrCodeToTransform = JSON.stringify(qruniqueStore.qrcode);
      //qrcode.version = "3";
      break;
    case "ensemble":
    //qrcode.version = "3";
    //break;
    case "question":
    //qrcode.version = "3";
    //break;
    case "reponse":
    //qrcode.version = "3";
    //break;
    case "ExerciceReconnaissanceVocaleQCM":
    //qrcode.version = "5";
    //break;
    case "ExerciceReconnaissanceVocaleQuestionOuverte":
    //qrcode.version = "4";
    //break;
    case "SeriousGame":
    //qrcode.version = "5";
    //break;
    default:
      qrCodeToTransform = JSON.stringify({});
    // logger.error('Le type de qrcode n\'est pas pris en compte : ' + qrcode.qrcode.type);
  }

  let transformedQR;
  try {
    if (qrCodeToTransform.length > 120) {
      // let gzippedQR = zlib.gzipSync(qrCodeToTransform).toString("base64");
      // transformedQR = new qrious({
      //   mime: "image/jpeg",
      //   size: 400,
      //   value: gzippedQR,
      //   foreground: "#000000",
      // });
      qrCodeToTransform = new qrious({
        mime: "image/jpeg",
        size: 400,
        value: qrCodeToTransform,
        foreground: "#000000",
      });
    } else {
      qrCodeToTransform = new qrious({
        mime: "image/jpeg",
        size: 400,
        value: qrCodeToTransform,
        foreground: "#000000",
      });
    }
  } catch (exception) {
    console.log(
      "FacadeController.genererQRCode | Problème lors de la génération du QR code \n" +
        exception
    );
  }

  // Transformation de l'objet qrcode en dataURL
  let qrDateURL = "";
  try {
    qrDateURL = qrCodeToTransform.toDataURL();
  } catch (e) {
    console.log(
      `FacadeController.genererQRCode | Problème lors de la conversion en dataURL du qr code : ${JSON.stringify(
        e
      )}`
    );
  }
  // Création de l'exif
  // UserComment est un tag spécifique au Exif du JPEG et permet de mettre un string en valeur
  // piexifjs.ExifIFD.UserComment = 37510
  let exif = { 37510: "" };
  if (qrcodeType === "SeriousGame") {
    //exif[37510] = qrcode.getJSONMetaData().toString();
  } else {
    exif[37510] = qrCodeToTransform.toString();
  }

  let exifObj = { Exif: exif };
  let exifBytes = piexifjs.dump(exifObj); // Tranformation de l'obj exif en string
  let exifModified = piexifjs.insert(exifBytes, qrDateURL); // Insertion de l'exif string dans le dataURL du Jpeg

  imageSrc.value = exifModified;
};
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
      <v-img
        :src="imageSrc"
        width="400"
        height="400"
        class="ml-auto mr-auto"
      ></v-img>
      <v-card-actions>
        <v-btn @click="() => (isOpen = false)" color="primary">Fermer</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="() => genererQrCode()" color="success" variant="outlined"
          >Générer</v-btn
        >
        <v-btn color="success" variant="outlined">Exporter</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

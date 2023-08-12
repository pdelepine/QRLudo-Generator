import { qrcode } from "./qrcode";

interface itemQRUnique {
  id: number;
  texte: string;
}

interface qrUnique extends qrcode {
  name: string;
  items: itemQRUnique[];
}

export type { qrUnique, itemQRUnique };

import { qrUnique } from "./qrUnique";
import { qrcode } from "./qrcode";

/**
 * Typage des qrunique dans un QR multiple
 * @param id permet d'ordonner l'item dans la liste
 * @param item le qrunique
 */
interface itemQrMultiple {
  id: number;
  item: qrUnique;
}

/**
 * Typage d'un QR multiple
 * @param name le nom du QR multiple
 * @param items la liste de qrunique
 */
interface qrMultiple extends qrcode {
  name: string;
  items: itemQrMultiple[];
}

export type { itemQrMultiple, qrMultiple };

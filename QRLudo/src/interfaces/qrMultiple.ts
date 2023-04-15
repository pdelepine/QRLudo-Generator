import { qrUnique } from "./qrUnique";

interface itemQrMultiple {
  id: number;
  item: qrUnique;
}

interface qrMultiple {
  name: string;
  items: itemQrMultiple[];
}

export type { itemQrMultiple, qrMultiple };

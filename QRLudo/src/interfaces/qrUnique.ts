interface itemQRUnique {
  id: number;
  texte: string;
}

interface qrUnique {
  name: string;
  items: itemQRUnique[];
}

export type { qrUnique, itemQRUnique };

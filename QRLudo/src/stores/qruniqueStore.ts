import { qrUnique, itemQRUnique } from "@/interfaces/qrUnique";
import { defineStore } from "pinia";

const useQrUniqueStore = defineStore("qrUnique", {
  state: () => ({
    qrUnique: { name: "", items: [] as itemQRUnique[] } as qrUnique,
  }),
  getters: {
    sortList: (state) => state.qrUnique.items.sort((a, b) => a.id - b.id),
    name: (state) => state.qrUnique.name,
  },
  actions: {
    addItem(item: itemQRUnique) {
      item.id = this.qrUnique.items.length + 1;
      this.qrUnique.items.push(item);
    },
    defineName(name: string) {
      this.qrUnique.name = name;
    },

    upItem(item: itemQRUnique) {
      if (item.id <= 1) return;
      const id = item.id;
      this.qrUnique.items = this.qrUnique.items.map((mapItem) => {
        if (mapItem.id === id) {
          mapItem.id = mapItem.id - 1;
        } else if (mapItem.id === id - 1) {
          mapItem.id = mapItem.id + 1;
        }
        return mapItem;
      });
    },

    downItem(item: itemQRUnique) {
      if (item.id >= this.qrUnique.items.length) return;
      const id = item.id;
      this.qrUnique.items = this.qrUnique.items.map((mapItem) => {
        if (mapItem.id === id) {
          mapItem.id = mapItem.id + 1;
        } else if (mapItem.id === id + 1) {
          mapItem.id = mapItem.id - 1;
        }
        return mapItem;
      });
    },

    deleteItem(item: itemQRUnique) {
      const id = item.id;
      this.qrUnique.items = this.qrUnique.items
        .filter((mapItem) => mapItem.id != id)
        .map((mapItem) => {
          if (mapItem.id > id) {
            mapItem.id--;
          }
          return mapItem;
        });
    },

    deleteAll() {
      this.qrUnique.name = "";
      this.qrUnique.items = [];
    },
  },
});

export default useQrUniqueStore;

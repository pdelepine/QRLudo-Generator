import { itemQRUnique } from "@/interfaces/itemQRUnique";
import { defineStore } from "pinia";

const useQrUniqueStore = defineStore("qrUnique", {
  state: () => ({ name: "", items: [] as itemQRUnique[] }),
  getters: {
    sortList: (state) => state.items.sort((a, b) => a.id - b.id),
  },
  actions: {
    addItem(item: itemQRUnique) {
      item.id = this.items.length + 1;
      this.items.push(item);
    },
    defineName(name: string) {
      this.name = name;
    },
    upItem(item: itemQRUnique) {
      if (item.id <= 1) return;
      const id = item.id;
      this.items = this.items.map((mapItem) => {
        if (mapItem.id === id) {
          mapItem.id = mapItem.id - 1;
        } else if (mapItem.id === id - 1) {
          mapItem.id = mapItem.id + 1;
        }
        return mapItem;
      });
    },
    downItem(item: itemQRUnique) {
      if (item.id >= this.items.length) return;
      const id = item.id;
      this.items = this.items.map((mapItem) => {
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
      this.items = this.items
        .filter((mapItem) => mapItem.id != id)
        .map((mapItem) => {
          if (mapItem.id > id) {
            mapItem.id--;
          }
          return mapItem;
        });
    },
  },
});

export default useQrUniqueStore;

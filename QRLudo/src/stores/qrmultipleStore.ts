import { itemQrMultiple, qrMultiple } from "@/interfaces/qrMultiple";
import { defineStore } from "pinia";

const useQrMultipleStore = defineStore("qrMultiple", {
  state: () => ({
    qrMultiple: { name: "", items: [] as itemQrMultiple[] } as qrMultiple,
  }),
  getters: {
    sortList: (state) => state.qrMultiple.items.sort((a, b) => a.id - b.id),
    name: (state) => state.qrMultiple.name,
  },
  actions: {
    addItem(item: itemQrMultiple) {
      item.id = this.qrMultiple.items.length + 1;
      this.qrMultiple.items.push(item);
    },
    setName(name: string) {
      this.qrMultiple.name = name;
    },

    upItem(item: itemQrMultiple) {
      if (item.id <= 1) return;
      const id = item.id;
      this.qrMultiple.items = this.qrMultiple.items.map((mapItem) => {
        if (mapItem.id === id) {
          mapItem.id = mapItem.id - 1;
        } else if (mapItem.id === id - 1) {
          mapItem.id = mapItem.id + 1;
        }
        return mapItem;
      });
    },

    downItem(item: itemQrMultiple) {
      if (item.id >= this.qrMultiple.items.length) return;
      const id = item.id;
      this.qrMultiple.items = this.qrMultiple.items.map((mapItem) => {
        if (mapItem.id === id) {
          mapItem.id = mapItem.id + 1;
        } else if (mapItem.id === id + 1) {
          mapItem.id = mapItem.id - 1;
        }
        return mapItem;
      });
    },

    deleteItem(item: itemQrMultiple) {
      const id = item.id;
      this.qrMultiple.items = this.qrMultiple.items
        .filter((mapItem) => mapItem.id != id)
        .map((mapItem) => {
          if (mapItem.id > id) {
            mapItem.id--;
          }
          return mapItem;
        });
    },

    deleteAll() {
      this.qrMultiple.name = "";
      this.qrMultiple.items = [];
    },
  },
});

export default useQrMultipleStore;

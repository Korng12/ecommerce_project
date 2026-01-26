import { defineStore } from "pinia";
import brands from "@/model/brands.json";

export const useBrand = defineStore("useBrand", {
  state: () => ({
    brands: []
  }),

  actions: {
    async fetchBrands() {
      // simulate async for consistency
      this.brands = brands
    }
  }
});

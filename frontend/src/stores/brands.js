import { defineStore } from "pinia";
import brands from "@/model/brands.json";

export const useBrand = defineStore("useBrand", {
  state: () => ({
    brands
  }),
  getters: {},
  actions: {}
});

import { defineStore } from "pinia";

const API_URL = "http:/api/brands"; // ✅ use Vite proxy

export const useBrand = defineStore("brand", {
  state: () => ({
    brands: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchAllBrands() {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // ✅ normalize data for UI
        this.brands = Array.isArray(data)
          ? data.map(b => ({
              id: b.id,
              name: b.name
            }))
          : [];
      } catch (err) {
        console.error("❌ Failed to fetch brands:", err);
        this.brands = [];
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});

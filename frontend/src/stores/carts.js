import { defineStore } from "pinia";
import cartData from "@/model/carts.json";
export const useCart = defineStore("cartStore", {
  state: () => ({
    cart: cartData,
  }),
  getters: {
    subtotal: (state) =>
      state.cart.reduce((sum, item) => sum + item.item_total, 0),

    tax: (state) => state.subtotal * 0.08, 

    shipping: (state) => (state.subtotal > 2000 ? 0 : 15),

    total: (state) => state.subtotal + state.tax + state.shipping,
  },
  actions: {},
});

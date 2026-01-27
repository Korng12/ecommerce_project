import { defineStore } from "pinia";

const WISHLIST_KEY = "ecommerce_wishlist";

export const useWishlist = defineStore("wishlistStore", {
  state: () => ({
    wishlist: [],
    loading: false,
  }),
  getters: {
    isInWishlist: (state) => (productId) => {
      return state.wishlist.some((item) => item.id === productId);
    },
    wishlistCount: (state) => state.wishlist.length,
  },
  actions: {
    // Load wishlist from localStorage
    loadFromLocalStorage() {
      try {
        const stored = localStorage.getItem(WISHLIST_KEY);
        if (stored) {
          this.wishlist = JSON.parse(stored);
        }
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error);
        this.wishlist = [];
      }
    },

    // Save wishlist to localStorage
    saveToLocalStorage() {
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlist));
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error);
      }
    },

    // Add product to wishlist
    addToWishlist(product) {
      if (!this.isInWishlist(product.id)) {
        this.wishlist.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          rating: product.rating,
          stock: product.stock,
          addedAt: new Date().toISOString(),
        });
        this.saveToLocalStorage();
      }
    },

    // Remove product from wishlist
    removeFromWishlist(productId) {
      this.wishlist = this.wishlist.filter((item) => item.id !== productId);
      this.saveToLocalStorage();
    },

    // Toggle product in wishlist
    toggleWishlist(product) {
      if (this.isInWishlist(product.id)) {
        this.removeFromWishlist(product.id);
      } else {
        this.addToWishlist(product);
      }
    },

    // Clear entire wishlist
    clearWishlist() {
      this.wishlist = [];
      this.saveToLocalStorage();
    },
  },
});

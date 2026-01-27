import { defineStore } from "pinia";
import getImageUrl from "../utils/convertImagePath";

const API_URL = "http://localhost:3000/api";

export const useProduct = defineStore("productStore", {
  state: () => ({
    products: [],
    errorData: null,
    loading: false,
  }),
  getters: {
    getByCategory: (state) => (catName) => {
      if (!catName) return state.products;
      return state.products.filter(
        (p) => (p.category || "").toLowerCase() === catName.toLowerCase(),
      );
    },
    searchSuggestions: (state) => (query) => {
      if (!query) return [];
      return state.products
        .filter((p) =>
          (p.name || "").toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5);
    },
    getProductsByBrand: (state) => (brandName) => {
      if (!brandName) return state.products;
      return state.products.filter(
        (p) => (p.brand || "").toLowerCase() === brandName.toLowerCase(),
      );
    },
    getPopularProducts: (state) => {
      return state.products
        .slice()
        .sort((a, b) => b.totalReviews - a.totalReviews)
        .slice(0, 10);
    },
    searchSuggestions: (state) => (query) => {
      if (!query) return [];
      return state.products
        .filter((p) =>
          (p.name || "").toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5);
    },
    getProductsByBrand: (state) => (brandName) => {
      if (!brandName) return state.products;
      return state.products.filter(
        (p) => (p.brand || "").toLowerCase() === brandName.toLowerCase(),
      );
    },
    getPopularProducts: (state) => {
      return state.products
        .slice()
        .sort((a, b) => b.totalReviews - a.totalReviews);
      // .slice(0,10)
    },
  },
  actions: {
    async fetchAllProducts() {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        // Normalize backend shape to what the UI expects
        this.products = Array.isArray(data)
          ? data.map((p) => {
              const primaryImage =
                p.images && Array.isArray(p.images)
                  ? p.images.find((i) => i.isPrimary) || p.images[0]
                  : null;
              // Construct full backend URL for images
              const imageUrl = primaryImage?.imageUrl || "";
              const image = imageUrl ? getImageUrl(imageUrl) : "";

              // Get active promotion if available
              const activePromotion =
                p.promotions && Array.isArray(p.promotions)
                  ? p.promotions.find(
                      (promo) =>
                        promo.isActive &&
                        new Date(promo.startDate) <= new Date() &&
                        new Date() <= new Date(promo.endDate),
                    )
                  : null;

              // Format promotion text based on type
              let promotionText = "";
              let promotionDiscount = null;
              if (activePromotion) {
                if (activePromotion.type === "percentage") {
                  promotionDiscount = parseFloat(activePromotion.value);
                  promotionText = `${activePromotion.value}% OFF`;
                } else if (activePromotion.type === "fixed_amount") {
                  promotionDiscount = parseFloat(activePromotion.value);
                  promotionText = `$${activePromotion.value} OFF`;
                }
                // Add name if available
                if (activePromotion.name) {
                  promotionText = `${activePromotion.name} - ${promotionText}`;
                }
              }

              return {
                id: p.id,
                name: p.name,
                price: p.price,
                image,
                brand: p.brand?.name || "",
                category: p.category?.name || "",
                rating: Number(p.averageRating || 0),
                totalReviews: p.totalReviews || 0,
                description: p.description || "",
                promotion: promotionText || null,
                promotionDiscount: promotionDiscount,
                promotionType: activePromotion?.type || null,
                stock: p.stock || 0,
                images: (p.images || []).map((img) => ({
                  ...img,
                  imageUrl: getImageUrl(img.imageUrl),
                })),
                specifications: p.specifications || {},
              };
            })
          : [];
      } catch (err) {
        console.error("Failed to fetch products:", err);
        this.products = [];
        throw err;
      }
    },

    async createProduct(formData) {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(`${API_URL}/products`, {
          method: "POST",
          body: formData, // FormData for file upload
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to create product");
        }

        // Refresh products list after creating
        await this.fetchAllProducts();
      } catch (err) {
        console.error("Failed to create product:", err);
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(productId, formData) {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(`${API_URL}/products/${productId}`, {
          method: "PUT",
          body: formData, // FormData for file upload
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to update product");
        }

        // Refresh products list after updating
        await this.fetchAllProducts();
      } catch (err) {
        console.error("Failed to update product:", err);
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(productId) {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(`${API_URL}/products/${productId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete product");
        }

        // Remove from local state
        this.products = this.products.filter((p) => p.id !== productId);
      } catch (err) {
        console.error("Failed to delete product:", err);
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});

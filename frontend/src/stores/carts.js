import { defineStore } from "pinia";

export const useCart = defineStore("cartStore", {
  state: () => ({
    cart: [],
    error: null,
    loading: false,
  }),

  getters: {
    cartCount(state) {
      return state.cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    subtotal(state) {
      return state.cart.reduce(
        (sum, item) => sum + (item.price * item.quantity || 0),
        0,
      );
    },

    tax() {
      return this.subtotal * 0.08;
    },

    shipping() {
      return this.subtotal > 2000 ? 0 : 15;
    },

    total() {
      return this.subtotal + this.tax + this.shipping;
    },
  },

  actions: {
    async getCart() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch("http://localhost:3000/api/carts", {
          credentials: "include", // Send cookies with request
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          throw new Error("Please login first");
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch cart (${response.status})`);
        }

        const data = await response.json();
        // Transform backend data structure to match frontend expectations
        this.cart = (data.items || []).map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          name: item.product?.name || "Unknown Product",
          description: item.product?.description || "",
          price: parseFloat(item.product?.price) || 0,
          image: (() => {
            const primary = item.product?.images?.find((img) => img.isPrimary) || item.product?.images?.[0];
            const url = primary?.imageUrl;
            if (!url) return "/placeholder.png";
            return url.startsWith("http") ? url : `http://localhost:3000${url}`;
          })(),
          brand: item.product?.brand?.name || "Unknown Brand",
        }));
        return true;
      } catch (err) {
        console.error("Error fetching cart:", err);
        this.error = err.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    //  Add to cart (no userId needed - from JWT)
    async addToCart(productId, quantity = 1) {
      this.error = null;

      try {
        const response = await fetch("http://localhost:3000/api/carts/add", {
          method: "POST",
          credentials: "include", // Send cookies with request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, quantity }),
        });

        if (response.status === 401) {
          throw new Error("Please login first");
        }

        if (!response.ok) {
          throw new Error("Failed to add to cart");
        }

        const { item } = await response.json();
    
    // Update state directly instead of refetching entire cart
    const existingItem = this.cart.find(i => i.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        productId,
        quantity,
        // Add product details from response or fetch separately
      });
    }
    return true;
      } catch (err) {
        console.error("Error adding to cart:", err);
        this.error = err.message;
        throw err; // Re-throw so component can handle it
      }
    },
    async updateCartItem(productId, quantity) {
      this.error = null;

      try {
        const response = await fetch('http://localhost:3000/api/carts/update', {
          method : 'PATCH',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ productId, quantity})
        });

        if(!response.ok){
          throw new Error('Failed to update cart item');
        }

        // Update cart state directly
        const item = this.cart.find(i => i.productId === productId);
        if (item) {
          item.quantity = quantity;
        }

        return true;
      }catch (err) {
        console.error('Error updating cart item:', err);
        this.error = err.message;
        throw err;
      }
    },
    async removeFromCart(productId) {
      this.error = null;
      try {
        const response = await fetch('http://localhost:3000/api/carts/remove', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({productId})
        })
        this.cart = this.cart.filter(item => item.productId !== productId);
        return true;
      } catch (error) {
        console.error('Error removing from cart:', error);
        this.error = error.message;
        throw error;
      }
    },

    async clearCart() {
      this.error = null;
      try {
        const response = await fetch('http://localhost:3000/api/carts/clear', {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to clear cart');
        }

        this.cart = [];
        return true;
      } catch (error) {
        console.error('Error clearing cart:', error);
        this.error = error.message;
        throw error;
      }
    }
  },
});

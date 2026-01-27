import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    checkedAuth: false,
  }),

  actions: {
    async login(email, password) {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await response.json();
      this.user = data.user;
      this.isAuthenticated = true;
      this.checkedAuth = true;
    },
    async register(username, email, password) {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, email, password })
        });

        const data = await response.json(); // ✅ read once

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        this.user = data.user;
        this.isAuthenticated = true;
        this.checkedAuth = true;

        return data;
      },


    async fetchCurrentUser() {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });

        if (!res.ok) {
          console.warn('Failed to fetch current user:', res.status);
          throw new Error();
        }

        const data = await res.json();
        this.user = data.user;
        this.isAuthenticated = true;
      } catch (error) {
        console.warn('Fetch current user error:', error);
        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.checkedAuth = true;
      }
    },

    async logout() {
      try {
        // Call backend logout endpoint to clear cookies
        await fetch("http://localhost:3000/api/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Clear local state regardless of backend response
        this.user = null;
        this.isAuthenticated = false;
        this.checkedAuth = true;

        // Clear cart when user logs out
        const { useCart } = await import("./carts");
        const cartStore = useCart();
        cartStore.cart = [];

      }
    },
  },
});

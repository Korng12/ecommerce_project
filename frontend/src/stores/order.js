import { defineStore } from "pinia";

export const useOrder = defineStore("orderStore", {
  state: () => ({
    orders: [],
    error: null,
    loading: false,
  }),
  getters: {
    totalRevenue(state) {
        return state.orders.reduce((sum, order) => {
          if (order.status === 'paid') {
            return sum + order.totalAmount;
          }
          return sum;
        },0);
    },
    avgOrderValue(state) {
        const paidOrders = state.orders.filter(order => order.status === 'paid');
        if (paidOrders.length === 0) return 0;
        const total = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        return total / paidOrders.length;
    }
  },
  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch("http://localhost:3000/api/orders", {
          credentials: "include", // Send cookies with request
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders (${response.status})`);
        }

        const data = await response.json();
        this.orders = data;
        this.loading = false;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
        console.error("Fetch orders error:", error);
      }
    },
    async getAdminOrders() {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch("http://localhost:3000/api/orders/admin/all", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch admin orders (${res.status})`);
        }

        const data = await res.json();
        console.log("Admin orders received:", data);
        this.orders = data;
        this.loading = false;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
        console.error("Get admin orders error:", error);
      }
    },
  },
});

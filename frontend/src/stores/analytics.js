import { defineStore } from "pinia";

const API_BASE_URL = "http://localhost:3000/api";

export const useAnalytics = defineStore("analyticsStore", {
  state: () => ({
    keyMetrics: {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      cartAbandonmentRate: 0,
    },
    topProducts: [],
    revenueByCategory: [],
    revenueByBrand: [],
    revenueTrend: [],
    dailyOrders: [],
    loading: false,
    error: null,
  }),

  getters: {
    // Format revenue for display
    formattedRevenue: (state) => {
      return `$${state.keyMetrics.totalRevenue.toLocaleString()}`;
    },

    // Get chart data for revenue by category
    categoryChartData: (state) => {
      return {
        labels: state.revenueByCategory.map((item) => item.name),
        datasets: [
          {
            data: state.revenueByCategory.map((item) => item.revenue),
            backgroundColor: [
              "#3B82F6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
              "#EC4899",
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 15,
          },
        ],
      };
    },

    // Get chart data for revenue by brand
    brandChartData: (state) => {
      return {
        labels: state.revenueByBrand.map((item) => item.name),
        datasets: [
          {
            label: "Revenue",
            data: state.revenueByBrand.map((item) => item.revenue),
            backgroundColor: [
              "#3B82F6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
            ],
            borderRadius: 6,
          },
        ],
      };
    },

    // Get chart data for revenue trend
    revenueTrendChartData: (state) => {
      const monthNames = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec",
      };

      return {
        labels: state.revenueTrend.map((item) => {
          const [year, month] = item.month.split("-");
          return monthNames[month] || month;
        }),
        datasets: [
          {
            label: "Revenue",
            data: state.revenueTrend.map((item) => item.revenue),
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#3B82F6",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    },

    // Get chart data for daily orders
    dailyOrdersChartData: (state) => {
      return {
        labels: state.dailyOrders.map((item) => {
          const date = new Date(item.date);
          return date.toLocaleDateString("en-US", { weekday: "short" });
        }),
        datasets: [
          {
            label: "Orders",
            data: state.dailyOrders.map((item) => item.orders),
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#3B82F6",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    },
  },

  actions: {
    async fetchKeyMetrics() {
      try {
        this.loading = true;
        this.error = null;

        const res = await fetch(`${API_BASE_URL}/metrics`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch key metrics");
        }

        const data = await res.json();
        this.keyMetrics = data;
      } catch (err) {
        console.error("Failed to fetch key metrics:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchTopProducts(limit = 5) {
      try {
        this.loading = true;
        this.error = null;

        const res = await fetch(`${API_BASE_URL}/top-products?limit=${limit}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch top products");
        }

        const data = await res.json();
        this.topProducts = data;
      } catch (err) {
        console.error("Failed to fetch top products:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchRevenueByCategory() {
      try {
        this.loading = true;
        this.error = null;

        const res = await fetch(`${API_BASE_URL}/revenue-category`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch revenue by category");
        }

        const data = await res.json();
        this.revenueByCategory = data;
      } catch (err) {
        console.error("Failed to fetch revenue by category:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchRevenueByBrand() {
      try {
        this.loading = true;
        this.error = null;

        const res = await fetch(`${API_BASE_URL}/revenue-brand`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch revenue by brand");
        }

        const data = await res.json();
        this.revenueByBrand = data;
      } catch (err) {
        console.error("Failed to fetch revenue by brand:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchRevenueTrend() {
      try {
        this.loading = true;
        this.error = null;

        const res = await fetch(`${API_BASE_URL}/revenue-trend`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch revenue trend");
        }

        const data = await res.json();
        this.revenueTrend = data;
      } catch (err) {
        console.error("Failed to fetch revenue trend:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchDailyOrders() {
      try {
        this.loading = true;
        this.error = null;

        const res = await fetch(`${API_BASE_URL}/daily-orders`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch daily orders");
        }

        const data = await res.json();
        this.dailyOrders = data;
      } catch (err) {
        console.error("Failed to fetch daily orders:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Fetch all analytics data at once
    async fetchAllAnalytics() {
      await Promise.all([
        this.fetchKeyMetrics(),
        this.fetchTopProducts(),
        this.fetchRevenueByCategory(),
        this.fetchRevenueByBrand(),
        this.fetchRevenueTrend(),
        this.fetchDailyOrders(),
      ]);
    },
  },
});

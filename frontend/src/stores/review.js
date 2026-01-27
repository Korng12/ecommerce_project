import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";
const REVIEW_API_URL = "http://localhost:3000/api/reviews";

export const useReview = defineStore("reviewStore", {
  state: () => ({
    reviews: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    },
    stats: {},
    errorData: null,
  }),
  getters: {},
  actions: {
    async getUserReviews() {
      try {
        const res = await fetch(`${REVIEW_API_URL}/user/my-reviews`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user reviews");
        }
        const data = await res.json();
        this.reviews = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    },
    async fetchReviewsByProduct(productId, page = 1, limit = 10) {
      try {
        const res = await fetch(
          `${REVIEW_API_URL}/product/${productId}?page=${page}&limit=${limit}`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await res.json();
        // API returns { reviews, pagination, stats }
        this.reviews = data?.reviews || [];
        this.pagination = data?.pagination || {
          page,
          limit,
          total: 0,
          pages: 0,
        };
        this.stats = data?.stats || {};
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        this.reviews = [];
      }
    },
    async addReview(productId, rating, comment) {
      try {
        const authStore = useAuthStore();
        const token = authStore?.token;

        const res = await fetch(`${REVIEW_API_URL}/product/${productId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ rating, comment }),
        });

        if (res.status === 401) {
          throw new Error("Please login to submit a review");
        }

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err?.message || "Failed to submit review");
        }

        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Error adding review:", error);
        this.errorData = error?.message || null;
        throw error;
      }
    },

    async updateReview(reviewId, rating, comment) {
      try {
        const res = await fetch(`${REVIEW_API_URL}/${reviewId}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating, comment }),
        });
        if (res.status === 401) {
          throw new Error("Please login to update a review");
        }
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to update review");
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Error updating review:", error);
        throw error;
      }
    },

    async deleteReview(reviewId) {
      try {
        const res = await fetch(`${REVIEW_API_URL}/${reviewId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.status === 401) {
          throw new Error("Please login to delete a review");
        }
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete review");
        } else {
          // Remove deleted review from state
          this.reviews = this.reviews.filter((r) => r.id !== reviewId);
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
      }
    },
    async markReviewHelpful(reviewId) {
      try {
        const res = await fetch(`${REVIEW_API_URL}/${reviewId}/helpful`, {
          method: "POST",
        });
        if (!res.ok) {
          throw new Error("Failed to mark review as helpful");
        }
      } catch (error) {
        console.error("Error marking review as helpful:", error);
      }
    },
  },
});

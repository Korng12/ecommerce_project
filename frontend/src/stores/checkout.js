import { defineStore } from "pinia";

// Checkout flow: create order from active cart, then create payment intent for that order.
export const useCheckoutStore = defineStore("checkout", {
  state: () => ({
    orderId: null,
    orderTotal: 0,
    paymentIntentId: null,
    clientSecret: null, // needed to confirm with Stripe on the frontend
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  }),

  actions: {
    async createOrderFromCart() {
      this.status = "loading";
      this.error = null;

      try {
        const res = await fetch("http://localhost:3000/api/orders/create", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          throw new Error("Please login first");
        }

        if (!res.ok) {
          throw new Error("Failed to create order from cart");
        }

        const data = await res.json();
        this.orderId = data.orderId;
        this.orderTotal = Number(data.totalAmount) || 0;
        this.status = "succeeded";
        return data;
      } catch (err) {
        console.error("createOrderFromCart error:", err);
        this.status = "failed";
        this.error = err.message;
        throw err;
      }
    },

    async createPaymentIntent(orderId = this.orderId) {
      if (!orderId) {
        throw new Error("Missing orderId. Create order first.");
      }

      this.status = "loading";
      this.error = null;

      try {
        const res = await fetch(
          "http://localhost:3000/api/payments/create-intent",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
          },
        );

        if (res.status === 401) {
          throw new Error("Please login first");
        }

        if (!res.ok) {
          throw new Error("Failed to create payment intent");
        }

        // Backend should respond with clientSecret and paymentIntentId
        const data = await res.json();
        this.paymentIntentId = data.paymentIntentId || data.id || null;
        this.clientSecret = data.clientSecret || data.client_secret || null;
        this.status = "succeeded";
        return data;
      } catch (err) {
        console.error("createPaymentIntent error:", err);
        this.status = "failed";
        this.error = err.message;
        throw err;
      }
    },

    async confirmPaymentSuccess() {
      if (!this.orderId) {
        throw new Error("No orderId to confirm");
      }

      try {
        const res = await fetch(
          "http://localhost:3000/api/payments/confirm-success",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId: this.orderId }),
          },
        );

        if (!res.ok) {
          throw new Error("Failed to confirm payment");
        }

        return await res.json();
      } catch (err) {
        console.error("confirmPaymentSuccess error:", err);
        throw err;
      }
    },

    async abandonPendingOrder(orderId = this.orderId) {
      if (!orderId) {
        console.warn("No orderId to abandon");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/orders/abandon", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        if (!res.ok) {
          console.error("Failed to abandon order:", await res.json());
          return;
        }

        console.log("Order cancelled, cart reactivated");
        return await res.json();
      } catch (err) {
        console.error("abandonPendingOrder error:", err);
      }
    },

    resetCheckout() {
      this.orderId = null;
      this.orderTotal = 0;
      this.paymentIntentId = null;
      this.clientSecret = null;
      this.status = "idle";
      this.error = null;
    },
  },
});

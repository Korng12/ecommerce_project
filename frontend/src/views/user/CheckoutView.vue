<script setup>
import { ref, onMounted, computed, watch } from "vue";
import PaymentMethod from "@/components/payment/PaymentMethod.vue";
import PaymentForm from "@/components/payment/PaymentForm.vue";
import OrderSummary from "@/components/order/OrderSummary.vue";
import CartList from "@/components/cart/CartList.vue";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import { useCart } from "@/stores/carts";
import { useCheckoutStore } from "@/stores/checkout";

const cartStore = useCart();
const checkoutStore = useCheckoutStore();
// Default to a valid payment method so the form renders
const paymentMethod = ref("card");
const hasItemsInCart = computed(() => Array.isArray(cartStore.cart) && cartStore.cart.length > 0);

// If cart becomes empty, reset checkout state so message/form disappear
watch(
  () => cartStore.cart?.length || 0,
  (len) => {
    if (len === 0) {
      checkoutStore.resetCheckout();
      checkoutStore.error = null;
    }
  },
);

// Ensure cart data is loaded when visiting checkout
onMounted(async () => {
  await cartStore.getCart();
});

// Called from OrderSummary when user clicks Pay Now
const handleCheckout = async () => {
  // Prevent checkout when cart is empty
  if (!hasItemsInCart.value) {
    checkoutStore.error = "Cart is empty. Add items before paying.";
    checkoutStore.status = "idle";
    return;
  }

  // If order already exists, don't create duplicate - user can complete payment
  if (checkoutStore.orderId) {
    console.log("Order already exists, skipping creation. User can complete payment.");
    return;
  }

  if (checkoutStore.status === "loading") {
    console.warn("Checkout already in progress, ignoring duplicate click");
    return;
  }

  try {
    // Step 1: Create order from cart
    await checkoutStore.createOrderFromCart();

    // Step 2: Create payment intent for the order
    await checkoutStore.createPaymentIntent();

    // Now clientSecret is available for Stripe confirmation
    console.log('Order and payment intent created:', checkoutStore.orderId, checkoutStore.clientSecret);
  } catch (err) {
    console.error('Checkout failed:', err);
  }
};
</script>

<template>
  <Header />
  <div class="p-4 md:p-10 flex flex-col lg:flex-row gap-8 md:pt-24">

    <!-- LEFT: Payment Section -->
    <div class="w-full lg:w-2/3 flex flex-col gap-6">
      <!-- Show checkout error -->
      <div v-if="checkoutError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <strong>Error:</strong> {{ checkoutError }}
      </div>

      <!-- Show message when order exists and payment form is ready -->
      <div v-if="hasItemsInCart && checkoutStore.orderId && checkoutStore.clientSecret"
        class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        Order created successfully. Please complete your payment below to confirm.
      </div>

      <PaymentMethod v-model="paymentMethod" />
      <PaymentForm v-if="hasItemsInCart" :modelValue="paymentMethod" :clientSecret="checkoutStore.clientSecret"
        :loading="checkoutStore.status === 'loading'" :error="checkoutStore.error" />
      <div v-else class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        Your cart is empty. Please add items to proceed with payment.
      </div>
    </div>

    <!-- RIGHT: Cart + Summary -->
    <div class="w-full lg:w-1/3 flex flex-col gap-6">
      <CartList :items="cartStore.cart" />
      <OrderSummary :subtotal="cartStore.subtotal" :shipping="cartStore.shipping" :tax="cartStore.tax"
        @checkout="handleCheckout" />
    </div>
  </div>
  <Footer />
</template>

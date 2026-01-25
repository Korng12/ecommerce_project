<script setup>
import { ref, onMounted } from "vue";
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

// Ensure cart data is loaded when visiting checkout
onMounted(async () => {
  await cartStore.getCart();
});

// Called from OrderSummary when user clicks Pay Now
const handleCheckout = async () => {
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
      <PaymentMethod v-model="paymentMethod" />
      <PaymentForm :modelValue="paymentMethod" :clientSecret="checkoutStore.clientSecret"
        :loading="checkoutStore.status === 'loading'" :error="checkoutStore.error" />
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

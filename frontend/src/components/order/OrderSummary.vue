<script setup>
import { useRoute } from 'vue-router';
import { useCheckoutStore } from '@/stores/checkout';
import { useCart } from '@/stores/carts';

defineProps({
  subtotal: Number,
  shipping: Number,
  tax: Number
});

const emit = defineEmits(['checkout']);
const path = useRoute().path;
const checkoutStore = useCheckoutStore();
const cartStore = useCart();

const handleButtonClick = () => {
  if (path === '/checkoutView' && !checkoutStore.orderId && checkoutStore.status !== 'loading') {
    emit('checkout');
  }
};
</script>

<template>
  <div class="p-6 bg-white shadow-lg rounded-2xl h-fit">
    <p class="text-xl font-bold mb-5">Order Summary</p>

    <div class="flex justify-between py-2">
      <p>Subtotal</p>
      <p>${{ subtotal.toFixed(2) }}</p>
    </div>

    <div class="flex justify-between py-2">
      <p>Standard Shipping</p>
      <p>${{ shipping.toFixed(2) }}</p>
    </div>

    <div class="flex justify-between py-2">
      <p>Tax</p>
      <p>${{ tax.toFixed(2) }}</p>
    </div>

    <hr class="my-4" />

    <div class="flex justify-between font-bold text-lg">
      <p>Total</p>
      <p>${{ (subtotal + shipping + tax).toFixed(2) }}</p>
    </div>

    <button v-if="path === '/checkoutView'" @click="handleButtonClick"
      :disabled="checkoutStore.orderId || checkoutStore.status === 'loading'"
      class="w-full mt-4 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
      {{ checkoutStore.status === 'loading' ? 'Processing...' : checkoutStore.orderId ? 'Payment in Progress' : 'PayNow' }}
    </button>

    <RouterLink v-else to="/checkoutView">
      <button :disabled="cartStore.cart.length === 0" class="w-full mt-4 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
        Checkout
      </button>
    </RouterLink>
  </div>
</template>

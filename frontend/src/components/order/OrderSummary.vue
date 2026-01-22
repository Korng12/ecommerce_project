<script setup>
import { useRoute } from 'vue-router';
defineProps({
  subtotal: Number,
  shipping: Number,
  tax: Number
});
const path = useRoute().path;
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
    <RouterLink to="/checkoutView">
      <button class="w-full mt-4 bg-blue-700 text-white py-3 rounded-lg">

        {{ path === '/checkoutView' ? 'Pay Now' : 'Checkout' }}

      </button>
    </RouterLink>
  </div>
</template>

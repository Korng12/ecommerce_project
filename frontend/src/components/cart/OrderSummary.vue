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
      <p>Subtotal</p><p>${{ subtotal }}</p>
    </div>

    <div class="flex justify-between py-2">
      <p>Standard Shipping</p><p>${{ shipping }}</p>
    </div>

    <div class="flex justify-between py-2">
      <p>Tax</p><p>${{ tax }}</p>
    </div>

    <hr class="my-4" />

    <div class="flex justify-between font-bold text-lg">
      <p>Total</p><p>${{ subtotal + shipping + tax }}</p>
    </div>

    <button class="w-full mt-4 bg-blue-700 text-white py-3 rounded-lg">
      <RouterLink to="/checkout">
        {{ path === '/checkout' ? 'Pay Now' : 'Checkout' }}
      </RouterLink>
    </button>
  </div>
</template>

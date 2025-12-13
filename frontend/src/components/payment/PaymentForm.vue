<script setup>
import { defineProps } from "vue";
import qr from "@/assets/image/qr.png"; // adjust your path

const props = defineProps({
  modelValue: String // card, khqr, bank
});
</script>

<template>

  <!-- CARD PAYMENT -->
  <div 
    v-if="modelValue === 'card'"
    class="transition-all duration-300"
  >
    <input 
      type="text" placeholder="Card Number"
      class="border border-gray-300 rounded-lg p-3 w-full mb-4 shadow-sm"
    />

    <div class="flex gap-4">
      <input 
        type="text" placeholder="Expiration date (MM/YY)"
        class="border border-gray-300 rounded-lg p-3 w-full shadow-sm"
      />
      <input 
        type="text" placeholder="CVV"
        class="border border-gray-300 rounded-lg p-3 w-full shadow-sm"
      />
    </div>

    <input 
      type="text" placeholder="Name on card"
      class="border border-gray-300 rounded-lg p-3 w-full mt-4 shadow-sm"
    />

    <button class="bg-blue-600 text-white w-full py-3 rounded-lg mt-4">
      Pay Now
    </button>
  </div>

  <!-- KHQR PAYMENT -->
  <div 
    v-if="modelValue === 'khqr'"
    class="flex flex-col gap-4 p-6 border border-gray-300 rounded-xl shadow-sm bg-white transition-all duration-300"
  >
    <p class="font-medium text-lg">Scan this QR to pay</p>

    <img :src="qr" class="w-48 mx-auto" />

    <div>
      <p class="text-sm font-medium">Upload payment slip</p>
      <input type="file" class="border border-gray-300 p-2 rounded-lg w-full mt-1" />
    </div>

    <button class="bg-blue-600 text-white w-full py-3 rounded-lg">
      Confirm Payment
    </button>
  </div>

  <!-- BANK PAYMENT -->
  <div 
    v-if="modelValue === 'bank'"
    class="flex flex-col gap-4 p-6 border border-gray-300 rounded-xl shadow-sm bg-white transition-all duration-300"
  >
    <p class="font-medium text-lg">Bank Information</p>

    <p class="text-gray-600 text-sm"><strong>Bank:</strong> ABA Bank</p>
    <p class="text-gray-600 text-sm"><strong>Account Name:</strong> E-shop</p>
    <p class="text-gray-600 text-sm mb-4"><strong>Account Number:</strong> 000 123 456</p>

    <p class="text-sm font-medium">Upload transfer slip</p>
    <input type="file" class="border border-gray-300 p-2 rounded-lg w-full" />

    <button class="bg-blue-600 text-white w-full py-3 rounded-lg">
      Confirm Transfer
    </button>
  </div>

</template>

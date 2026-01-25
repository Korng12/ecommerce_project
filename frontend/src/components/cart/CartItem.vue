<script setup>
import { useCart } from '@/stores/carts';
import { ref } from 'vue';

const props = defineProps({
  item: Object,
});

const cartStore = useCart();
const stockError = ref('');

const increment = async () => {
  // Check if increment would exceed available stock
  if (props.item.stock !== undefined && props.item.quantity >= props.item.stock) {
    stockError.value = `Only ${props.item.stock} available in stock`;
    setTimeout(() => stockError.value = '', 3000);
    return;
  }

  try {
    stockError.value = '';
    await cartStore.updateCartItem(props.item.productId, props.item.quantity + 1);
  } catch (error) {
    stockError.value = error.message;
    setTimeout(() => stockError.value = '', 3000);
  }
};

const decrement = async () => {
  if (props.item.quantity > 1) {
    try {
      stockError.value = '';
      await cartStore.updateCartItem(props.item.productId, props.item.quantity - 1);
    } catch (error) {
      stockError.value = error.message;
      setTimeout(() => stockError.value = '', 3000);
    }
  }
};
</script>

<template>
  <div class="p-4 sm:p-6 mb-6 bg-white shadow-lg rounded-2xl">
    <div class="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-6">

      <!-- Product Image - fixed key -->
      <img :src="item.image" alt="product image"
        class="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-xl bg-gray-50 p-3 shadow-sm" />

      <!-- Product Info -->
      <div class="flex flex-col flex-1 gap-2 w-full">

        <!-- Title + Brand + Icons -->
        <div class="flex justify-between items-start w-full">
          <div>
            <p class="font-bold text-lg sm:text-xl">{{ item.name }}</p>
            <p class="text-gray-500 text-sm">{{ item.brand }}</p> <!-- Add brand -->
          </div>

          <div class="flex gap-2 sm:gap-3">
            <i class="pi pi-heart cursor-pointer border p-2 rounded-full hover:bg-gray-200"></i>
            <i @click="cartStore.removeFromCart(item.productId)"
              class="pi pi-times cursor-pointer border p-2 rounded-full hover:bg-gray-200"></i>
          </div>
        </div>

        <!-- Shortened description (first 100-150 chars) -->
        <p class="text-gray-600 text-sm sm:text-base">
          {{ item.description && item.description.length > 70
            ? item.description.substring(0, 70) + '...'
            : item.description }}
        </p>

        <!-- Stock status warning -->
        <div v-if="item.stock !== undefined" class="flex items-center gap-2">
          <span v-if="item.stock === 0" class="text-red-600 text-sm font-semibold">Out of Stock</span>
          <span v-else-if="item.quantity >= item.stock" class="text-orange-500 text-sm font-semibold">
            Maximum quantity in cart ({{ item.stock }} available)
          </span>
          <span v-else-if="item.stock <= 10" class="text-orange-500 text-sm">
            Only {{ item.stock }} left in stock
          </span>
        </div>

        <!-- Error message -->
        <p v-if="stockError" class="text-red-600 text-sm font-medium">{{ stockError }}</p>

        <!-- Qty + Price -->
        <div class="mt-4 flex flex-col sm:flex-row items-center justify-between w-full gap-4">

          <!-- Quantity -->
          <div class="flex items-center bg-gray-100 rounded-full shadow-inner">
            <button @click="decrement" :disabled="item.quantity <= 1"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-200 text-xl disabled:opacity-50 disabled:cursor-not-allowed">−</button>
            <span class="w-10 sm:w-12 text-center font-medium text-lg">{{ item.quantity }}</span>
            <button @click="increment" :disabled="item.stock !== undefined && item.quantity >= item.stock"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-200 text-xl disabled:opacity-50 disabled:cursor-not-allowed">+</button>
          </div>

          <!-- Price (or item_total for line total) -->
          <div class="text-right">
            <p class="text-lg sm:text-xl font-bold">${{ (item.price * item.quantity).toFixed(2) }}</p>
            <!-- Optional: show unit price smaller -->
            <p class="text-sm text-gray-500">${{ item.price }} each</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

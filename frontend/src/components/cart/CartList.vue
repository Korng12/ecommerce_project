<script setup>
import CartItem from "@/components/cart/CartItem.vue";
import { useCart } from "@/stores/carts";
defineProps({
  items: Array,
});

const cartStore = useCart();
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <p class="text-3xl font-bold">Cart List</p>
      <i v-show="cartStore.cart.length > 0" @click="cartStore.clearCart()" class="pi pi-trash text-3xl cursor-pointer"></i>
    </div>

    <div v-if="items.length === 0">
      <p class="text-gray-500 text-center py-10">Your cart is empty</p>
    </div>

    <CartItem v-for="item in items" :key="item.productId" :item="item" />
  </div>
</template>

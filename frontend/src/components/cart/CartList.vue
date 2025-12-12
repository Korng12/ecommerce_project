<script setup>
import CartItem from "@/components/cart/CartItem.vue";

defineProps({
  items: Array,
});
</script>

<template>
  <div>
    <p class="text-3xl font-bold mb-6">Cart List</p>

    <div v-if="items.length === 0">
      <p class="text-gray-500 text-center py-10">Your cart is empty</p>
    </div>

    <CartItem v-for="item in items" :key="item.product_id" :item="item" />
  </div>
</template>

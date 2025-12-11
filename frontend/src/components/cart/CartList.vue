<script setup>
import CartItem from "@/components/cart/CartItem.vue";

defineProps({
  items: Array
});
</script>

<template>
  <div>
    <p class="text-3xl font-bold mb-6">Cart List</p>

    <CartItem
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

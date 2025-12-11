<!-- CartPage.vue -->
<script setup>
import { ref } from "vue";
import CartList from "@/components/cart/CartList.vue";
import OrderSummary from "@/components/cart/OrderSummary.vue";
import mouse from "@/assets/image/mouse.png";

const cartItems = ref([
  { id: 1, name: "Acer Mouse", color: "Black", type: "Wireless", desc: "Desc...", img: mouse, qty: 1, price: 1200 },
  { id: 2, name: "Acer Mouse", color: "Black", type: "Wireless", desc: "Desc...", img: mouse, qty: 1, price: 1200 },
]);
</script>

<template>
  <section class="flex gap-10 p-10">
    <div class="w-2/3">
      <CartList :items="cartItems" />
    </div>

    <div class="w-1/3">
      <OrderSummary :subtotal="2400" :shipping="15" :tax="120" />
    </div>
  </section>
</template>

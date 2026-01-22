<!-- CartPage.vue -->
<script setup>
import { onMounted } from 'vue';
import CartList from "@/components/cart/CartList.vue";
import OrderSummary from "@/components/order/OrderSummary.vue";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import { useCart } from "@/stores/carts";

const cartStore = useCart();

// Fetch cart data when component is mounted
onMounted(async () => {
  await cartStore.getCart();
});
</script>

<template>
  <Header />

  <section class="flex gap-10 p-10 pt-24 md:pt-24">
    <div class="w-2/3">
      <CartList :items="cartStore.cart" />
    </div>

    <div class="w-1/3">
      <OrderSummary :subtotal="cartStore.subtotal" :shipping="cartStore.shipping" :tax="cartStore.tax" />
    </div>
  </section>

  <Footer />
</template>

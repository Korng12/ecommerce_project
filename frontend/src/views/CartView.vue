<!-- CartPage.vue -->
<script setup>
import CartList from "@/components/cart/CartList.vue";
import OrderSummary from "@/components/cart/OrderSummary.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useCart } from "@/stores/carts";

const cartStore = useCart();
const carts = cartStore.cart;

const subtotal = cartStore.subtotal;
const tax = cartStore.tax;
const shipping = cartStore.shipping;
</script>

<template>
  <Header />

  <section class="flex gap-10 p-10 pt-24 md:pt-24">
    <div class="w-2/3">
      <CartList :items="carts" />
    </div>

    <div class="w-1/3">
      <OrderSummary :subtotal="subtotal" :shipping="shipping" :tax="tax" />
    </div>
  </section>

  <Footer />
</template>

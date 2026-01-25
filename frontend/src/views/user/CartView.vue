<!-- CartPage.vue -->
<script setup>
import { onMounted } from 'vue';
import CartList from "@/components/cart/CartList.vue";
import OrderSummary from "@/components/order/OrderSummary.vue";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import { useCart } from "@/stores/carts";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const cartStore = useCart();
const authStore = useAuthStore();
const router = useRouter();

// Fetch cart data when component is mounted
onMounted(async () => {
  // Verify user is authenticated
  if (!authStore.isAuthenticated) {
    router.push({ name: "login" });
    return;
  }

  await cartStore.getCart();
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <section class="flex gap-10 p-10 pt-24 md:pt-24">
      <div class="w-2/3">
        <CartList :items="cartStore.cart" />
      </div>

      <div class="w-1/3">
        <OrderSummary :subtotal="cartStore.subtotal" :shipping="cartStore.shipping" :tax="cartStore.tax" />
      </div>
    </section>

    <div class="flex-grow"></div>
    <Footer />
  </div>
</template>

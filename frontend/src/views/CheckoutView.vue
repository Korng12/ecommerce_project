<script setup>
import { ref } from "vue";
import PaymentMethod from "@/components/payment/PaymentMethod.vue";
import PaymentForm from "@/components/payment/PaymentForm.vue";
import OrderSummary from "@/components/cart/OrderSummary.vue";
import CartList from "@/components/cart/CartList.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useCart } from "@/stores/carts";

const cartStore = useCart();
const carts = cartStore.cart;

const subtotal = cartStore.subtotal;
const tax = cartStore.tax;
const shipping = cartStore.shipping;
const paymentMethod = ref("card");
</script>

<template>
  <Header/>
  <div class="p-4 md:p-10 flex flex-col lg:flex-row gap-8 md:pt-24">

    <!-- LEFT: Payment Section -->
    <div class="w-full lg:w-2/3 flex flex-col gap-6">
      <PaymentMethod v-model="paymentMethod" />
      <PaymentForm :modelValue="paymentMethod" />
    </div>

    <!-- RIGHT: Cart + Summary -->
    <div class="w-full lg:w-1/3 flex flex-col gap-6">
      <CartList :items="carts" />
      <OrderSummary :subtotal="subtotal" :shipping="shipping" :tax="tax" />
    </div>
  </div>
  <Footer/>
</template>



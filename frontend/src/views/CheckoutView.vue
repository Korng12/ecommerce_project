<script setup>
import { ref } from "vue";
import PaymentMethod from "@/components/payment/PaymentMethod.vue";
import PaymentForm from "@/components/payment/PaymentForm.vue";
import OrderSummary from "@/components/cart/OrderSummary.vue";
import CartList from "@/components/cart/CartList.vue";
import mouse from "@/assets/image/mouse.png";

const cartItems = ref([
  { id: 1, name: "Acer Mouse", color: "Black", type: "Wireless", desc: "Desc...", img: mouse, qty: 1, price: 1200 },
  { id: 2, name: "Acer Mouse", color: "Black", type: "Wireless", desc: "Desc...", img: mouse, qty: 1, price: 1200 },
]);
const paymentMethod = ref("card");
</script>

<template>
  <div class="p-4 md:p-10 flex flex-col lg:flex-row gap-8">

    <!-- LEFT: Payment Section -->
    <div class="w-full lg:w-2/3 flex flex-col gap-6">
      <PaymentMethod v-model="paymentMethod" />
      <PaymentForm :modelValue="paymentMethod" />
    </div>

    <!-- RIGHT: Cart + Summary -->
    <div class="w-full lg:w-1/3 flex flex-col gap-6">
      <CartList :items="cartItems" />
      <OrderSummary :subtotal="2400" :shipping="15" :tax="120" />
    </div>

  </div>
</template>



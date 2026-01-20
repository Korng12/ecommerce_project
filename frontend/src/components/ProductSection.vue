<template>
  <div v-if="show">
    <div class="flex flex-col gap-4 items-center w-full mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
      <button class="view-more text-sm text-blue-500">View More</button>
      <div class="grid grid-cols-3 gap-4">
        <ProductCard v-for="product in productsStore.products" :key="product.id" :product="product"></ProductCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue';
import { useProduct } from '@/stores/products';

const props = defineProps({
  title: {
    type: String,
    default: 'Product Section'
  },
  show: {
    type: Boolean,
    default: true
  }
});

const productsStore = useProduct();
</script>

<style>
.text-left {
  text-align: left;
}
</style>
<template>
  <div>
    <div class="flex">
      <!-- <div v-for="product in productsStore.products" :key="product.id">
        <ProductCard :product="product"></ProductCard>
      </div> -->
      <!-- <div>
      </div> -->
      <div class="flex flex-col gap-4 items-center w-full">
        <h1>Popular Product</h1>
        <div  class="grid grid-cols-3 gap-4">
          <ProductCard v-for="product in productsStore.products" :key="product.id" :product="product"></ProductCard>
        </div>
      </div>
   
    </div>

  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue';
import { useProduct } from '@/stores/products';
const productsStore=useProduct();
</script>

<style>

</style>
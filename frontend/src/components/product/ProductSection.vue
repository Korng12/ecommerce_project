<template>
  <div v-if="show">
    <div class="flex flex-col gap-4 items-center w-full mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
      <button class="view-more text-sm text-blue-500">View More</button>
      <div v-if="props.products?.length" class="grid grid-cols-3 gap-4">
        <ProductCard v-for="product in props.products" :key="product.id" :product="product"></ProductCard>
      </div>
      <div v-else class="text-gray-500 py-8">
        Loading products...
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from '@/components/product/ProductCard.vue';


const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Product Section'
  },
  show: {
    type: Boolean,
    default: true
  }
});

</script>

<style>
.text-left {
  text-align: left;
}
</style>
<template>
  <div class="w-full ">
    <div class="mt-24">
      <HeroSection></HeroSection>
    </div>
    <div class="mt-24">
      <BannerHero></BannerHero>
    </div>
    <div>
      <CategoryPreview></CategoryPreview>
    </div>

    <!-- Only show "Popular Products" section -->
    
    <ProductSection title="Popular Products" :products="productsStore.getPopularProducts" :show="true" />
    <ProductSection title="Best Selling" :show="false" />
    <ProductSection title="Recommended" :show="false" />
    <ProductSection title="Accessories" :show="false" />

  </div>
</template>

<script setup>
import ProductSection from '@/components/product/ProductSection.vue';
import BannerHero from '@/components/BannerHero.vue';
import HeroSection from '@/components/HeroSection.vue';
import CategoryPreview from '@/components/CategoryPreview.vue';
import { onMounted } from 'vue';
import { useProduct } from '@/stores/products';
const productsStore = useProduct();
onMounted(async () => {
  if (!productsStore.products?.length) {
    try { await productsStore.fetchAllProducts() } catch (e) { /* noop */ }
  }
});
</script>

<style>

</style>
<template>
  <div class="w-full h-screen">
    <Header></Header>
    <div class="mt-24">
      <BannerHero></BannerHero>
    </div>
    
    <!-- Show all product sections -->
    <ProductSection title="Popular Products" :show="true" />
    <ProductSection title="Best Selling" :show="true" />
    <ProductSection title="Recommended" :show="true" />
    <ProductSection title="Accessories" :show="true" />
    <div>
      <SpecialProduct></SpecialProduct>
    </div>
    <div>
      <Footer></Footer>
    </div>
  </div>
</template>

<script setup>
import ProductSection from '@/components/ProductSection.vue';
import Header from '@/components/Header.vue';
import BannerHero from '@/components/BannerHero.vue';
import Footer from '@/components/Footer.vue';
import SpecialProduct from '@/components/SpecialProduct.vue';
</script>

<style>
/* Add any necessary styles here */
</style>
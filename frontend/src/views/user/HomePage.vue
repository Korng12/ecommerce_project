<template>
  <div class="w-full h-screen">
    <div>
    <Header></Header>
    </div>
    <div class="mt-24">
        <HeroSection></HeroSection>
     </div>
   
    <!-- Show all product sections -->
    <ProductSection title="Popular Products" :show="true" />
    <ProductSection title="Best Selling" :show="true" />
    <ProductSection title="Recommended" :show="true" />
    <ProductSection title="Accessories" :show="true" />
     <div>
      <SpecialKind></SpecialKind>
    </div>
    <div>
      <SpecialProduct></SpecialProduct>
    </div>
    <div>
      <Footer></Footer>
    </div>
  </div>
</template>

<script setup>
import ProductSection from '@/components/product/ProductSection.vue';
import Header from '@/components/layout/Header.vue';
import HeroSection from '@/components/BannerHero.vue';
import Footer from '@/components/layout/Footer.vue';
import SpecialProduct from '@/components/SpecialProduct.vue';
import SpecialKind from '@/components/SpecialKind.vue';
</script>

<style>
/* Add any necessary styles here */
</style>
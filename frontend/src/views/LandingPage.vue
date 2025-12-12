<template>
  <div class="w-full h-screen ">
    <!-- <h1 >hello</h1> -->
  
    <div>

      <Header></Header>
    </div>
    <div class="mt-24">
        <HeroSection></HeroSection>
     </div>
    <div class="mt-24">
      <BannerHero></BannerHero>
    </div>
    <div>
      <CategoryPreview></CategoryPreview>
    </div>
    <ProductSection></ProductSection>
    <div>
      <Footer></Footer>
    </div>

  </div>
</template>

<script setup>
import ProductSection from '@/components/ProductSection.vue';
import Header from '@/components/Header.vue';
import BannerHero from '@/components/BannerHero.vue';
import HeroSection from '@/components/HeroSection.vue';
import { isProxy } from 'vue';
import CategoryPreview from '@/components/CategoryPreview.vue';
import Footer from '@/components/Footer.vue';

</script>

<style>

</style>
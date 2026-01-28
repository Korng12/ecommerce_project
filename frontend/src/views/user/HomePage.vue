<template>
  <div class="w-full bg-white">
    <div>
      <Header></Header>
    </div>

    <!-- Hero Banner - Full Width -->
    <div class="mt-24">
      <HeroSection></HeroSection>
    </div>

    <!-- Popular Products Section -->
    <div class="mt-16 px-4 md:px-8 lg:px-16">
      <div class="max-w-[1400px] mx-auto">
        <ProductSection 
          title="Popular Products" 
          :products="productsStore.getPopularProducts" 
          :show="true"
          viewMorePath="/products?sort=popular"
        />
      </div>
    </div>

    <!-- Best Selling Products -->
    <div class="mt-16 px-4 md:px-8 lg:px-16">
      <div class="max-w-[1400px] mx-auto">
        <ProductSection 
          title="Best Sellers" 
          :products="productsStore.products.slice().sort((a,b) => b.totalReviews - a.totalReviews)" 
          :show="true"
          viewMorePath="/products?sort=bestselling"
        />
      </div>
    </div>

    <!-- Recommended For You -->
    <div class="mt-16 px-4 md:px-8 lg:px-16">
      <div class="max-w-[1400px] mx-auto">
        <ProductSection 
          title="Recommended" 
          :products="productsStore.products.slice(0, Math.min(10, productsStore.products.length))" 
          :show="true"
          viewMorePath="/products"
        />
      </div>
    </div>

    <!-- Category Products -->
    <div v-if="productsStore.getByCategory('Accessories').length > 0" class="mt-16 px-4 md:px-8 lg:px-16">
      <div class="max-w-[1400px] mx-auto">
        <ProductSection 
          title="Accessories" 
          :products="productsStore.getByCategory('Accessories')" 
          :show="true"
          viewMorePath="/products?category=Accessories"
        />
      </div>
    </div>

    <!-- Special Products Sections -->
    <div class="mt-16">
      <SpecialKind></SpecialKind>
    </div>
    
    <div class="mt-16">
      <SpecialProduct></SpecialProduct>
    </div>
  </div>
</template>

<script setup>
import ProductSection from '@/components/product/ProductSection.vue';
import Header from '@/components/layout/Header.vue';
import HeroSection from '@/components/BannerHero.vue';
import SpecialProduct from '@/components/SpecialProduct.vue';
import SpecialKind from '@/components/SpecialKind.vue';
import { onMounted } from 'vue'; 
import { useProduct } from '@/stores/products';
import { useBrand } from '@/stores/brands';
import { useAuthStore } from '@/stores/auth';

const productsStore = useProduct();
const brandsStore = useBrand();
const authStore = useAuthStore();

onMounted(async () => {
  if (!productsStore.products?.length) {
    try { 
      await productsStore.fetchAllProducts();
    } catch (e) {
      console.error('Failed to fetch products:', e);
    }
  }
});
</script>

<template>
  <div class="w-full">
    <div>
    <Header></Header>
    </div>
    <div class="mt-24">
        <HeroSection></HeroSection>
     </div>
   
    <!-- Show all product sections -->
    <ProductSection title="Popular Products" :products="productsStore.getPopularProducts" :show="true" />

    <ProductSection title="Best Selling" :show="true" />
    <ProductSection title="Recommended" :show="true" />
    <ProductSection title="Accessories"  :show="true" />
     <div>
      <SpecialKind></SpecialKind>
    </div>
    <div>
      <SpecialProduct></SpecialProduct>
    </div>
    <div>
   
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
const productsStore = useProduct();
const brandsStore = useBrand();
onMounted(async()=>{
  if(!productsStore.products?.length){
    try{ await productsStore.fetchAllProducts()} catch(e){/*no op*/}
  }
})
</script>

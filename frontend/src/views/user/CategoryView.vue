<template>
  <div class="flex flex-col min-h-screen">
    <Header></Header>
    <div class="mt-32 px-16">
      <h1 class="text-2xl font-bold">{{ catName }} Products</h1>
      <div class="flex justify-between items-center">
        <div class="flex justify-center mt-10">
          <div class="relative w-full max-w-md">
            <input
              @keyup.exact.enter="onSearch" 
              type="text"
              v-model="query"
              placeholder="Search..."
              class="w-full pl-4 pr-12 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <button
              @click="onSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex gap-2 text-gray-700">
        <select v-model="selectedBrand" class="rounded-xl border-gray-300">
            <option value="">All Brands</option>
            <option v-for="brand in brandsStore.brands" :key="brand.id" :value="brand.name">
              {{ brand.name }}
            </option>
          </select>
          <select v-model="sortBy" class="rounded-xl border-gray-300">
            <option value="default">Sort by: Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
          </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="filteredProducts.length > 0" class="mt-16 px-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="product in filteredProducts" :key="product.id">
          <ProductCard :product="product"></ProductCard>
        </div>
      </div>
    </div>

    <!-- No Products Found -->
    <div v-else class="mt-16 px-16 text-center py-20">
      <p class="text-gray-500 text-xl">No products found</p>
    </div>

    <div class="flex-grow"></div>
    <!-- <Footer class="mt-16"></Footer> -->
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import ProductCard from '@/components/product/ProductCard.vue';
import Footer from '@/components/layout/Footer.vue';
import { useProduct } from '@/stores/products';
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {useBrand} from '@/stores/brands';
const route=useRoute();
const catName=computed(()=>route.params.catName)
const productsStore=useProduct();
const query = ref(''); // also bind with model // that is mean whenever this variable change, Vue will auto render Ui
const searchText=ref('')
const brandsStore=useBrand();
const selectedBrand = ref('');
const sortBy = ref('default');
// const filteredProducts=ref(''); 
const selectedCategory=computed(()=>
  productsStore.getByCategory(catName.value)
)

const onSearch=()=>{
  searchText.value=query.value.trim().toLowerCase();
}
const filteredProducts = computed(()=>{
  let products = [...selectedCategory.value];
  if(selectedBrand.value){
    products = products.filter(p=>p.brand.toLowerCase()===selectedBrand.value.toLowerCase())
  }
  if(sortBy.value==='low-high'){
    products.sort((a,b)=>a.price - b.price)
  } else if(sortBy.value==='high-low'){
    products.sort((a,b)=>b.price - a.price)
  }
 
  return  products.filter(p=>p.name.toLowerCase().includes(searchText.value))
  console.log(filteredProducts.value.length)
  searchText.value=''
})

onMounted(async () => {
  if (!productsStore.products?.length) {
    try { await productsStore.fetchAllProducts() } catch (e) { /* noop */ }
  }
  if (!brandsStore.brands?.length) {
    try { await brandsStore.fetchAllBrands() } catch (e) { /* noop */ }
  }
});
</script>

<style scoped>

input {
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
</style>
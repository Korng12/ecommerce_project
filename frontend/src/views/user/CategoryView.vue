<template>
  <div>
    <Header></Header>
    <div class="mt-32 px-16">
      <h1>{{ catName }} Prouduct</h1>
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
        <select name="all" id="" class="rounded-xl">
          <option value="brand">All Brand</option>
          <option value="brand">brand</option>
          <option value="brand">brand</option>
          <option value="brand">brand</option>
        </select>
        <select name="" id="" class="rounded-xl">
          <option value="brand">brand</option>
          <option value="brand">brand</option>
          <option value="brand">brand</option>

        </select>
        <div>

        </div>
      </div>
      </div>
    </div>
    <!-- <div class="mt-16 flex gap-8 px-16">
      <div v-for="product in selectedCategory" :key="product.id" class="">
        <ProductCard :product="product"></ProductCard>
      </div>
    </div> -->
    <template v-if="filteredProducts.length ==0">
      <div class="mt-16 flex gap-8 px-16">
        <div v-for="product in filteredProducts" :key="product.id" class="">
          <ProductCard :product="product"></ProductCard>
        </div>
      </div>
    </template>
    <template v-if="filteredProducts.length >0">
      <div class="mt-16 flex gap-8 px-16">
        <div v-for="product in filteredProducts" :key="product.id" class="">
          <ProductCard :product="product"></ProductCard>
        </div>
      </div>
    </template>
    <Footer class="mt-16"></Footer>
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import ProductCard from '@/components/product/ProductCard.vue';
import Footer from '@/components/layout/Footer.vue';
import { useProduct } from '@/stores/products';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
const route=useRoute();
const catName=computed(()=>route.params.catName)
const productsStore=useProduct();
const query = ref(''); // also bind with model // that is mean whenever this variable change, Vue will auto render Ui
const searchText=ref('')
// const filteredProducts=ref(''); 
const selectedCategory=computed(()=>
  productsStore.getByCategory(catName.value)
)
const onSearch=()=>{
  searchText.value=query.value.trim().toLowerCase();
}
const filteredProducts = computed(()=>{
  // searchText.va =query.value.trim().toLowerCase();
  // if(!searchText.value) return selectedCategory.value;
  // console.log(search)
  // console.log(query.value.length)
  return  selectedCategory.value.filter(p=>p.name.toLowerCase().includes(searchText.value))
  console.log(filteredProducts.value.length)
  searchText.value=''
})
console.log("Tthe length",filteredProducts.value.length)
</script>

<style scoped>

input {
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
</style>
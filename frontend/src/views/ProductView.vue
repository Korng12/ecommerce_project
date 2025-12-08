<template>
  <div>
    <Header></Header>
     <section class="mt-32 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
    
    <!-- Product Image -->
    <div class="relative">
      <img 
        :src="fixImage(product.image)" 
        alt="Product Image" 
        class="w-full rounded-2xl shadow-lg object-cover"
      />
      <!-- Optional: Zoom / hover effect -->
      <div class="absolute inset-0 hover:scale-105 transition-transform duration-500 rounded-2xl"></div>
    </div>

    <!-- Product Info -->
    <div class="flex flex-col gap-6">
      <!-- Title -->
      <h1 class="text-4xl font-extrabold text-gray-900">{{ product.name }}</h1>

      <!-- Brand -->
      <p class="text-gray-600 text-lg">{{ product.brand }}</p>

      <!-- Price -->
      <p class="text-3xl font-bold text-blue-600">${{ product.price }}</p>

      <!-- Rating -->
      <div class="flex items-center gap-2">
        <template v-for="i in 5" :key="i">
          <svg 
            v-if="i <= Math.round(product.rating)" 
            class="w-5 h-5 text-yellow-400" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.962c.3.922-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.196-1.538-1.118l1.287-3.962a1 1 0 00-.364-1.118L2.05 9.39c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.963z"></path>
          </svg>
          <svg 
            v-else 
            class="w-5 h-5 text-gray-300" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.962c.3.922-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.196-1.538-1.118l1.287-3.962a1 1 0 00-.364-1.118L2.05 9.39c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.963z"></path>
          </svg>
        </template>
        <span class="text-gray-500">({{ product.rating }})</span>
      </div>

      <!-- Description -->
      <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>

      <!-- Options (optional) -->
      <div class="flex items-center gap-4">
        <label class="font-semibold text-gray-700">Color:</label>
        <select class="border border-gray-300 rounded-lg px-3 py-2">
          <option>Black</option>
          <option>White</option>
          <option>Silver</option>
        </select>
      </div>

      <!-- Add to Cart -->
      <button 
        class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-105 active:scale-95"
      >
        Add to Cart
      </button>
    </div>
  </section>
  <Footer></Footer>
  </div>
 
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useProduct } from '@/stores/products'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
const productStore = useProduct()
const route = useRoute()
const id = route.params.productId
const product = productStore.products.find(pro => pro.id == id) || {
  name: 'Product Name',
  brand: 'Brand Name',
  price: 0,
  rating: 4,
  image: '../assets/small_img/mac_book_hero.jpg',
  description: 'This is a sample product description. Highlight features, specs, and other details to make it appealing.'
}

// Helper to fix image path
const fixImage = (path) => new URL(path, import.meta.url).href
</script>

<style scoped>
/* Optional: add smooth hover zoom for image */
img:hover {
  transform: scale(1.03);
  transition: transform 0.5s ease;
}
</style>

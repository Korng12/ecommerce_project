<template>
  <nav class="fixed w-full z-50 top-0 left-0 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-md transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 lg:px-16 flex justify-between items-center h-16">
      <!-- Logo -->
      <a href="#" class="flex items-center space-x-3">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Logo">
        <span class="text-xl font-bold text-gray-900">E-Store</span>
      </a>

      <!-- Desktop Menu -->
      <ul class="hidden md:flex items-center space-x-8 font-medium text-gray-700">
        <li><router-link href="#" to="/HomePage" class="hover:text-blue-600 transition">Home</router-link></li>

        <li><router-link to="/aboutUsView" class="hover:text-blue-600 transition">About</router-link></li>
        <li class="relative group">
          <button class="flex items-center gap-1 hover:text-blue-600 transition">
            Categories
            <svg class="w-4 h-4 transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <ul class="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <!-- <li><a href="#" class="block px-4 py-2 hover:bg-gray-100">Phones</a></li>
            <li><a href="#" class="block px-4 py-2 hover:bg-gray-100">Laptops</a></li>
            <li><a href="#" class="block px-4 py-2 hover:bg-gray-100">Accessories</a></li> -->
               <li v-for="cat in categoriesStore.categories" :key="cat.id" class="block px-4 py-2 hover:bg-gray-100">
               <router-link :to="{name:'categoryView',params:{catName:cat.name}}">
                {{ cat.name }}
               </router-link>
              </li>
            
          </ul>
        </li>
        <li><router-link :to="{name:'contactUsView',path:'/contactUsView'}" class="hover:text-blue-600 transition">Contact</router-link></li>
      </ul>

      <!-- Right Icons -->
      <div class="flex items-center gap-4 md:gap-6 relative">
        <!-- Search Icon -->
        <button @click="toggleSearch" class="p-2 rounded-full hover:bg-gray-200 transition-transform duration-200 hover:scale-110">
          <font-awesome-icon icon="search" class="text-gray-700"/>
        </button>

        <!-- User Dropdown -->
        <div class="relative group">
          <button class="flex items-center gap-1 p-2 rounded-full hover:bg-gray-200 transition-transform duration-200 hover:scale-110">
            <font-awesome-icon icon="user" class="text-gray-700"/>
          </button>
          <ul class="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <li><router-link to="/login" class="block px-4 py-2 hover:bg-gray-100">Login</router-link></li>
            <li><router-link to="/register" class="block px-4 py-2 hover:bg-gray-100">Register</router-link></li>
          </ul>
        </div>

        <!-- Cart -->
        <router-link :to="{name:'cartView',path:'/cartView'}">
          <button class="relative p-2 rounded-full hover:bg-gray-200 transition-transform duration-200 hover:scale-110">
            <font-awesome-icon icon="shopping-cart" class="text-gray-700"/>
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
          </button>
        </router-link>

        <!-- Mobile Burger -->
        <button class="md:hidden p-2 rounded-md hover:bg-gray-200 transition-transform duration-200 hover:scale-110">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Dropdown Expands Header -->
    <transition name="fade-slide">
      <div v-if="searchOpen" class="w-full bg-white border-t border-gray-200 shadow-inner px-6 lg:px-16 py-3">
        <div class="max-w-7xl mx-auto flex items-center gap-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autofocus
          />
          <button @click="closeSearch" class="p-2 text-gray-500 hover:text-gray-700 transition">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>

        <!-- Optional Suggestions -->
        <ul v-if="suggestions.length" class="max-w-7xl mx-auto mt-2 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <li 
            v-for="(item, i) in suggestions" 
            :key="i" 
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
            @click="selectSuggestion(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </transition>

  </nav>
</template>

<script setup>
import CartView from '@/views/user/CartView.vue'
import { ref, computed } from 'vue'
import { useCategory } from '@/stores/categories'
import { useProduct } from '@/stores/products';
const categoriesStore=useCategory();

const searchOpen = ref(false)
const searchQuery = ref('')
const products = ['iPhone 15', 'MacBook Pro', 'AirPods', 'Apple Watch', 'iPad Pro']

const toggleSearch = () => searchOpen.value = !searchOpen.value
const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
}

// Filter suggestions
const suggestions = computed(() => {
  if (!searchQuery.value) return []
  return products.filter(p => p.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const selectSuggestion = (item) => {
  searchQuery.value = item
  closeSearch()
}
</script>

<style scoped>
/* Smooth fade + slide animation */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

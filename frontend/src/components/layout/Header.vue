<template>
  <nav class="fixed w-full z-50 top-0 left-0 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-md transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 lg:px-16 flex justify-between items-center h-16">

      <!-- Logo -->
      <router-link to="/app" class="flex items-center space-x-3">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Logo">
        <span class="text-xl font-bold text-gray-900">E-Store</span>
      </router-link>

      <!-- Desktop Menu -->
      <ul class="hidden md:flex items-center space-x-8 font-medium text-gray-700">
        <li>
          <router-link to="/app" class="hover:text-blue-600 transition">Home</router-link>
        </li>

        <li>
          <router-link to="/aboutUsView" class="hover:text-blue-600 transition">About</router-link>
        </li>

        <!-- Categories -->
        <li class="relative group">
          <button class="flex items-center gap-1 hover:text-blue-600 transition">
            Categories
            <svg class="w-4 h-4 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <ul class="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <li v-for="cat in categoriesStore.categories" :key="cat.id" class="px-4 py-2 hover:bg-gray-100">
              <router-link :to="{ name: 'categoryView', params: { catName: cat.name } }">
                {{ cat.name }}
              </router-link>
            </li>
          </ul>
        </li>

        <li>
          <router-link to="/contactUsView" class="hover:text-blue-600 transition">Contact</router-link>
        </li>
      </ul>

      <!-- Right Icons -->
      <div class="flex items-center gap-4 md:gap-6 relative">

        <!-- Search -->
        <button @click="toggleSearch" class="p-2 rounded-full hover:bg-gray-200 transition-transform hover:scale-110">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/>
          </svg>
        </button>

        <!-- User Dropdown -->
        <div  class="relative group">
          <button class="flex items-center gap-1 p-2 rounded-full hover:bg-gray-200 transition-transform duration-200 hover:scale-110">
            <font-awesome-icon icon="user" class="text-gray-700"/>
          </button>
         
          <ul v-if="!authStore.isAuthenticated" class="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <li><router-link to="/login" class="block px-4 py-2 hover:bg-gray-100">Login</router-link></li>
            <li><router-link to="/register" class="block px-4 py-2 hover:bg-gray-100">Register</router-link></li>
          </ul>
          <ul v-else class="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <li><router-link to="/app/profile" class="block px-4 py-2 hover:bg-gray-100">Profile</router-link></li>
            <li><button @click="handleLogout" class="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button></li>
          </ul>
        </div>

        <!-- Cart -->
        <router-link :to="{name:'cartView',path:'/cartView'}">
          <button class="relative p-2 rounded-full hover:bg-gray-200 transition-transform duration-200 hover:scale-110">
            <font-awesome-icon icon="shopping-cart" class="text-gray-700"/>
            <span v-if="cartStore.cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{{ cartStore.cartCount }}</span>
          </button>
        </router-link>

      </div>
    </div>

    <!-- Search Bar -->
    <transition name="fade-slide">
      <div v-if="searchOpen" class="w-full bg-white border-t border-gray-200 px-6 lg:px-16 py-3">
        <div class="max-w-7xl mx-auto flex items-center gap-3">
          <input v-model="searchQuery" type="text" placeholder="Search products..."
            class="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500"/>
          <button @click="closeSearch">✖</button>
        </div>
      </div>
    </transition>

  </nav>
</template>

<script setup>
import CartView from '@/views/user/CartView.vue'
import { ref, computed,onMounted } from 'vue'
import { useCategory } from '@/stores/categories'
import { useProduct } from '@/stores/products';
import {useAuthStore} from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useCart} from '@/stores/carts';

const cartStore=useCart();
const categoriesStore=useCategory();
const authStore=useAuthStore();
const router = useRouter();

// Fetch cart on mount if user is authenticated
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await cartStore.getCart();
  }
});

const searchOpen = ref(false)
const searchQuery = ref('')
const products = ['iPhone 15', 'MacBook Pro', 'AirPods', 'Apple Watch', 'iPad Pro']
onMounted(() => {
  categoriesStore.fetchAllCategories();
  console.log('Fetched categories in header:', categoriesStore.categories);
});
const toggleSearch = () => searchOpen.value = !searchOpen.value
const closeSearch = () => { searchOpen.value = false; searchQuery.value = '' }

// Handle logout with redirect
const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'landingPage' });
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

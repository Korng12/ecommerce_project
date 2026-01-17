<template>
  <nav class="fixed w-full z-50 top-0 left-0 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-md transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 lg:px-16 flex justify-between items-center h-16">

      <!-- Logo -->
      <router-link to="/HomePage" class="flex items-center space-x-3">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Logo">
        <span class="text-xl font-bold text-gray-900">E-Store</span>
      </router-link>

      <!-- Desktop Menu -->
      <ul class="hidden md:flex items-center space-x-8 font-medium text-gray-700">
        <li>
          <router-link to="/HomePage" class="hover:text-blue-600 transition">Home</router-link>
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
        <div class="relative group">

          <!-- Logged out -->
          <button v-if="!isLoggedIn" class="p-2 rounded-full hover:bg-gray-200 transition-transform hover:scale-110">
            <svg class="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>

          <!-- Logged in -->
          <router-link v-if="isLoggedIn" to="/profile" class="p-2 rounded-full hover:bg-gray-200 transition-transform hover:scale-110">
            <svg class="w-7 h-7 text-amber-800" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a3 3 0 110 6 3 3 0 010-6zm0 12c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 2 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </router-link>

          <!-- Dropdown -->
          <ul class="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <li v-if="!isLoggedIn">
              <router-link to="/login" class="block px-4 py-2 hover:bg-gray-100">Login</router-link>
            </li>
            <li v-if="!isLoggedIn">
              <router-link to="/register" class="block px-4 py-2 hover:bg-gray-100">Register</router-link>
            </li>
            <li v-if="isLoggedIn">
              <router-link to="/profile" class="block px-4 py-2 hover:bg-gray-100">My Profile</router-link>
            </li>
            <li v-if="isLoggedIn">
              <button @click="logout" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
            </li>
          </ul>
        </div>

        <!-- Cart -->
        <router-link to="/cartView" class="relative p-2 rounded-full hover:bg-gray-200 transition-transform hover:scale-110">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6M17 13l1.5 6M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
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
import { ref, computed } from 'vue'
import { useCategory } from '@/stores/categories'

const categoriesStore = useCategory()

const searchOpen = ref(false)
const searchQuery = ref('')

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

const toggleSearch = () => searchOpen.value = !searchOpen.value
const closeSearch = () => { searchOpen.value = false; searchQuery.value = '' }

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
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

<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-4">
    <div class="text-center max-w-md">
      <!-- 403 Number -->
      <div class="mb-8">
        <h1 class="text-9xl md:text-[140px] font-bold text-gray-900 leading-none">403</h1>
      </div>

      <!-- Heading -->
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Access Denied</h2>

      <!-- Description -->
      <p class="text-gray-600 text-lg mb-8">
        You don't have permission to access this page. This area is restricted to authorized users.
      </p>

      <!-- Helpful Links -->
      <div class="space-y-3 mb-8">
        <router-link 
          to="/" 
          class="inline-block w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Back to Home
        </router-link>
        <router-link 
          v-if="!authStore.isAuthenticated"
          to="/login" 
          class="inline-block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Sign In
        </router-link>
        <router-link 
          v-else
          to="/app" 
          class="inline-block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Continue Shopping
        </router-link>
      </div>

      <!-- Suggestion -->
      <p class="text-sm text-gray-500">
        Think this is a mistake? <router-link to="/contactus" class="text-gray-900 font-semibold hover:underline">Contact support</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
</style>

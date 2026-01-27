<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-4">
    <div class="text-center max-w-md">
      <!-- 404 Number -->
      <div class="mb-8">
        <h1 class="text-9xl md:text-[140px] font-bold text-gray-900 leading-none">404</h1>
      </div>

      <!-- Heading -->
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>

      <!-- Description -->
      <p class="text-gray-600 text-lg mb-8">
        Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
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
          to="/app" 
          class="inline-block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Continue Shopping
        </router-link>
      </div>

      <!-- Suggestion -->
      <p class="text-sm text-gray-500">
        Need help? <router-link to="/contactus" class="text-gray-900 font-semibold hover:underline">Contact us</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
// 404 Not Found Page
</script>

<style scoped>
</style>

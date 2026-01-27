<template>
  <div v-if="show" class="w-full py-12 px-4 md:px-8">
    <!-- Section Header -->
    <div class="mb-10 flex items-center justify-between">
      <div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          {{ title }}
        </h1>
        <div class="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
      </div>
      <router-link
        v-if="hasMoreProducts"
        :to="viewMorePath"
        class="hidden md:inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300"
      >
        View More
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </router-link>
    </div>

    <!-- Products Grid -->
    <div v-if="displayedProducts?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in displayedProducts" 
        :key="product.id" 
        :product="product"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="py-16 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m0 0L4 7m8 4v10m0 0l-8-4m8 4l8-4"></path>
      </svg>
      <p class="text-gray-400 text-lg font-medium">Loading amazing products...</p>
      <p class="text-gray-400 text-sm mt-2">Please wait while we fetch the latest items</p>
    </div>

    <!-- Mobile View More Button -->
    <router-link
      v-if="hasMoreProducts"
      :to="viewMorePath"
      class="md:hidden flex items-center justify-center gap-2 w-full mt-8 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 active:scale-95"
    >
      View More
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ProductCard from '@/components/product/ProductCard.vue';

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Product Section'
  },
  show: {
    type: Boolean,
    default: true
  },
  viewMorePath: {
    type: String,
    default: '/products'
  }
});

// Always display exactly 10 products
const displayedProducts = computed(() => {
  return props.products?.slice(0, 10) || [];
});

// Check if there are more products than the 10 displayed
const hasMoreProducts = computed(() => {
  return (props.products?.length || 0) > 10;
});
</script>

<style scoped>
/* Smooth transitions for interactive elements */
a {
  @apply transition-all duration-300 ease-in-out;
}

/* Gradient text effect (optional enhancement) */
.gradient-text {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
}
</style>
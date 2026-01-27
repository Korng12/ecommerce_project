<template>
  <div class="bg-white py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Shop by Category</h2>
        <p class="text-gray-600 mt-2">Browse our wide selection of products</p>
      </div>

      <!-- Loading State -->
      <div v-if="categoryStore.loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="rounded-lg bg-gray-200 h-72 animate-pulse"></div>
      </div>

      <!-- Categories Grid -->
      <div v-else-if="categoryStore.categories?.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <router-link
          v-for="category in categoryStore.categories"
          :key="category.id"
          :to="{name:'categoryView', params: { catName: category.name } }"
          class="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-100"
        >
          <!-- Image Container -->
          <div class="relative w-full h-72 overflow-hidden bg-gray-300">
            <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <!-- Always visible overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- Content -->
          <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 class="text-lg md:text-xl font-bold mb-1">{{ category.name }}{{ category.image }}</h3>
            <p class="text-sm text-gray-200">{{ category.description }}</p>
            <!-- <div class="mt-3 inline-block">
              <span class="text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full group-hover:bg-white/30 transition-colors">
                Shop Now →
              </span>
            </div> -->
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 text-lg">No categories available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategory } from '@/stores/categories';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const categoryStore = useCategory();

onMounted(async () => {
  if (!categoryStore.categories?.length) {
    try {
      await categoryStore.fetchAllCategories();
    } catch (e) {
      console.error('Failed to load categories:', e);
    }
  }
});
</script>

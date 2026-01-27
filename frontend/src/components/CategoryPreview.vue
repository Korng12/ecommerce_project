<template>
  <div class="bg-gray-50 py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Categories</h2>

      <div class="grid gap-6 lg:grid-cols-3">
        <div
          v-for="category in categoryStore.categories"
          :key="category.id"
          class="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer"
        >
          <!-- Image -->
          <img
            :src="category.image"
            alt=""
            class="w-full h-64 sm:h-80 lg:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <!-- Dark Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <!-- Text -->
          <div class="absolute bottom-4 left-4 text-white space-y-1">
            <h3 class="text-lg font-semibold opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              {{ category.name }}
            </h3>
            <p class="text-sm opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
              {{ category.description }} 
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategory } from '@/stores/categories';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const route =useRoute();
const catName=route.params.catName;
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

const fixImage = (path) => {
  if (!path) return ''
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  // If it's a backend path (starts with /), prepend the API base URL
  if (path.startsWith('/')) {
    return `http://localhost:3000${path}`
  }
  // Otherwise treat as local asset
  try {
    return new URL(path, import.meta.url).href
  } catch {
    return path
  }
};
</script>

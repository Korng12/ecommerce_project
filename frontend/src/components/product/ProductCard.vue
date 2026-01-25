<template>
  <router-link :to="{ name: 'productView', params: { productId: product.id } }" :class="product.stock <= 0 ? 'pointer-events-none' : ''">
    <div
      class="w-96 bg-white rounded-2xl p-5 shadow-lg transition-transform duration-300 cursor-pointer group relative overflow-hidden"
      :class="product.stock <= 0 ? 'opacity-60' : 'hover:shadow-2xl hover:scale-105'"
    >
      <!-- Out of Stock Overlay -->
      <div v-if="product.stock <= 0" class="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-2xl">
        <span class="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl">OUT OF STOCK</span>
      </div>

      <!-- Low Stock Badge -->
      <div v-else-if="product.stock > 0 && product.stock <= 10" class="absolute top-2 right-2 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
        Only {{ product.stock }} left!
      </div>

      <!-- Product Image -->
      <div class="overflow-hidden rounded-2xl">
        <img
          :src="fixImage(product.image)"
          alt=""
          class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <!-- <img src="../../assets/small_img/mac_book.jpg" alt=""> -->

      <!-- Product Info -->
      <div class="mt-4 space-y-1">
        <!-- <p>{{ product.image }}</p> -->
        <h2 class="text-lg font-semibold text-gray-900">{{ product.name }}</h2>
        <p class="text-sm text-gray-500">{{ product.brand }}</p>
        <p class="text-sm text-gray-500">{{ product.category }}</p>
        
        <!-- Price Badge -->
        <p
          class="mt-2 inline-block bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full"
        >
          ${{ product.price }}
        </p>

        <!-- Rating Badge -->
        <p
          class="mt-1 inline-block bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full"
        >
          ⭐ {{ product.rating }}
        </p>
      </div>

      <!-- Optional Glow/Animation Overlay -->
      <div
        v-if="product.stock > 0"
        class="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-30 pointer-events-none transition-all duration-300"
      ></div>
    </div>
  </router-link>
</template>

<script setup>
import { defineProps } from "vue";
import { useProduct } from "@/stores/products";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const store = useProduct();

const fixImage = (path) => {
  // If path is already a full URL (from backend), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Otherwise, treat as local asset
  try {
    return new URL(path, import.meta.url).href;
  } catch {
    return path;
  }
};
</script>

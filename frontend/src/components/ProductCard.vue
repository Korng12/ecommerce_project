<template>
  <router-link :to="{ name: 'productView', params: { productId: product.id } }">
    <div
      class="w-96 bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer group relative overflow-hidden"
    >
      <!-- Product Image -->
      <div class="overflow-hidden rounded-2xl">
        <img
          :src="fixImage(product.image)"
          alt=""
          class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <!-- Product Info -->
      <div class="mt-4 space-y-1">
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
  return new URL(path, import.meta.url).href;
};
</script>

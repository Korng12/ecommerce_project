<template>
  <router-link :to="{ name: 'productView', params: { productId: product.id } }"
    :class="product.stock <= 0 ? 'pointer-events-none' : ''">
    <div
      class="h-full bg-white rounded-xl shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden hover:shadow-xl"
      :class="product.stock <= 0 ? 'opacity-50' : ''">
      <!-- Out of Stock Overlay -->
      <div v-if="product.stock <= 0"
        class="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-xl">
        <span class="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">OUT OF STOCK</span>
      </div>

      <!-- Stock Badge -->
      <div v-else class="absolute top-3 right-3 z-10">
        <span v-if="product.stock <= 10"
          class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          Only {{ product.stock }} left!
        </span>
      </div>

      <!-- Product Image Container -->
      <div class="relative overflow-hidden bg-gray-100 h-48">
        <img :src="fixImage(product.image)" alt=""
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          @error="onImageError" />

        <!-- Promotion Badge (if applicable) -->
        <div v-if="product.promotion"
          class="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M4.5 3a2.5 2.5 0 015 0v.006h.01a7 7 0 013.922 12.255.5.5 0 01-.714-.712A6 6 0 009.5 3.5h-.01V3a2.5 2.5 0 00-5 0v.5H4a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V5.5a2 2 0 00-2-2h-.5v-.5a2.5 2.5 0 00-5 0v.006h-.01A7 7 0 014.5 3z" />
          </svg>
          <span class="font-black">{{ product.promotion }}</span>
        </div>
      </div>

      <!-- Product Info -->
      <div class="p-4 space-y-2">
        <!-- Brand -->
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">{{ product.brand }}</p>

        <!-- Product Name -->
        <h2 class="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {{ product.name }}
        </h2>

        <!-- Category -->
        <p class="text-xs text-gray-500">{{ product.category }}</p>

        <!-- Rating Section -->
        <div class="flex items-center gap-2 pt-1">
          <div class="flex items-center">
            <div class="flex gap-0.5">
              <span v-for="i in 5" :key="i" class="text-base relative inline-block">
                <!-- Full Star -->
                <span v-if="i <= Math.floor(product.rating)" class="text-amber-400">★</span>
                <!-- Half Star -->
                <span v-else-if="i === Math.ceil(product.rating) && product.rating % 1 !== 0"
                  class="relative inline-block">
                  <span class="text-gray-300">★</span>
                  <span class="absolute inset-0 overflow-hidden text-amber-400"
                    :style="{ width: ((product.rating % 1) * 100) + '%' }">★</span>
                </span>
                <!-- Empty Star -->
                <span v-else class="text-gray-300">★</span>
              </span>
            </div>
            <span class="ml-2 text-xs text-gray-600 font-medium">
              {{ product.rating }}/5 | {{ product.totalReviews }} reviews | {{ wishlistStore.wishlistCountByProductId}} wishLists
            </span>
          </div>
        </div>

        <!-- Price Section -->
        <div class="pt-2 border-t border-gray-100 space-y-1">
          <div v-if="product.promotion && promotionalPrice" class="flex items-baseline gap-2">
            <span class="text-xl font-black text-blue-600">
              ${{ promotionalPrice.toFixed(2) }}
            </span>
            <span class="text-sm text-gray-400 line-through font-medium">
              ${{ parseFloat(product.price).toFixed(2) }}
            </span>
            <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              SALE
            </span>
          </div>
          <div v-else>
            <span class="text-lg font-bold text-gray-900">
              ${{ parseFloat(product.price).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Optional Glow/Animation Overlay -->
      <div v-if="product.stock > 0"
        class="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-30 pointer-events-none transition-all duration-300">
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { defineProps, computed } from "vue";
import { useProduct } from "@/stores/products";
import { useCart } from "@/stores/carts";
import { useWishlist } from "@/stores/wishlist";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const productStore = useProduct();
const cartStore = useCart();
const wishlistStore = useWishlist();
// Calculate promotional price based on promotion data
const promotionalPrice = computed(() => {
  if (!props.product.promotion || !props.product.promotionDiscount) return null;

  const basePrice = parseFloat(props.product.price);
  const discount = props.product.promotionDiscount;
  const type = props.product.promotionType;

  if (type === 'percentage') {
    return basePrice * (1 - discount / 100);
  } else if (type === 'fixed_amount') {
    return Math.max(0, basePrice - discount);
  }

  return null;
});

const fixImage = (path) => {
  // If path is already a full URL (from backend), return as-is
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  // Otherwise, treat as local asset
  try {
    return new URL(path, import.meta.url).href;
  } catch {
    return path;
  }
};

const fallbackImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20" font-family="Arial, sans-serif">No Image</text></svg>';

const onImageError = (event) => {
  if (event.target.dataset.fallbackApplied) return;
  event.target.dataset.fallbackApplied = 'true';
  event.target.src = fallbackImage;
};
</script>

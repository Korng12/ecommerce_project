<template>
    <div class="flex flex-col min-h-screen bg-white">
        <Header />

        <div class="flex-1 py-8 px-4 sm:px-6 lg:px-8 mt-20">
            <div class="max-w-7xl mx-auto">
                <!-- Header -->
                <div class="mb-6 pb-4 border-b">
                    <h1 class="text-2xl font-bold text-gray-900">My Wishlist</h1>
                    <p class="text-gray-500 text-sm mt-1">{{ wishlistStore.wishlistCount }} items</p>
                </div>

                <!-- Empty State -->
                <div v-if="wishlistStore.wishlistCount === 0" class="text-center py-16">
                    <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h2 class="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
                    <p class="text-gray-500 mb-6">Save items you love for later</p>
                    <router-link to="/app"
                        class="inline-block px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                        Continue Shopping
                    </router-link>
                </div>

                <!-- Wishlist Grid -->
                <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <div v-for="item in wishlistStore.wishlist" :key="item.id"
                        class="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all group">

                        <!-- Product Image -->
                        <router-link :to="`/product/${item.id}`" class="block relative">
                            <div class="relative h-48 bg-gray-50 overflow-hidden rounded-t-lg">
                                <img :src="fixImage(item.image)" :alt="item.name"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    @error="onImageError" />

                                <!-- Remove Button -->
                                <button @click.prevent="removeItem(item.id)"
                                    class="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition opacity-0 group-hover:opacity-100">
                                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <!-- Out of Stock Overlay -->
                                <div v-if="item.stock === 0"
                                    class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                    <span class="text-gray-700 font-medium text-sm">Out of Stock</span>
                                </div>
                            </div>
                        </router-link>

                        <!-- Product Info -->
                        <div class="p-3">
                            <router-link :to="`/product/${item.id}`">
                                <p class="text-xs text-gray-500 mb-1">{{ item.brand }}</p>
                                <h3
                                    class="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition min-h-[2.5rem]">
                                    {{ item.name }}
                                </h3>
                            </router-link>

                            <!-- Rating & Price -->
                            <div class="mt-2 flex items-center justify-between">
                                <div class="flex items-center gap-1">
                                    <span class="text-yellow-400 text-xs">★</span>
                                    <span class="text-xs text-gray-600">{{ item.rating || 0 }}</span>
                                </div>
                                <p class="text-base font-bold text-gray-900">${{ parseFloat(item.price).toFixed(2) }}
                                </p>
                            </div>

                            <!-- Add to Cart Button -->
                            <button @click="addToCart(item)" :disabled="item.stock === 0"
                                class="w-full mt-3 px-3 py-2 rounded-lg font-medium transition text-sm" :class="item.stock === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-gray-800'">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Clear All Button -->
                <div v-if="wishlistStore.wishlistCount > 0" class="mt-8 text-center border-t pt-6">
                    <button @click="clearAll" class="text-sm text-gray-500 hover:text-gray-700 transition">
                        Clear All Items
                    </button>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script setup>
import { useWishlist } from '@/stores/wishlist'
import { useCart } from '@/stores/carts'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

const wishlistStore = useWishlist()
const cartStore = useCart()

const removeItem = (productId) => {
    if (confirm('Remove this item from wishlist?')) {
        wishlistStore.removeFromWishlist(productId)
    }
}

const addToCart = async (item) => {
    try {
        await cartStore.addToCart(item.id, 1)
        // Optionally remove from wishlist after adding to cart
        // wishlistStore.removeFromWishlist(item.id)
    } catch (error) {
        console.error('Failed to add to cart:', error)
    }
}

const clearAll = () => {
    if (confirm('Are you sure you want to clear all items from your wishlist?')) {
        wishlistStore.clearWishlist()
    }
}

const fallbackImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20" font-family="Arial, sans-serif">No Image</text></svg>'

const fixImage = (path) => {
    if (!path) return fallbackImage
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    try {
        return new URL(path, import.meta.url).href
    } catch {
        return fallbackImage
    }
}

const onImageError = (event) => {
    if (event.target.dataset.fallbackApplied) return
    event.target.dataset.fallbackApplied = 'true'
    event.target.src = fallbackImage
}
</script>

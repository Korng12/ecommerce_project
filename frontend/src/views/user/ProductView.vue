<template>
  <div class="flex flex-col min-h-screen">
    <Header></Header>
    
    <!-- Main Product Section -->
    <section class="mt-32 max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Product Image -->
      <div class="relative">
        <img 
          :src="fixImage(product.image)" 
          alt="Product Image" 
          class="w-full rounded-2xl shadow-lg object-cover"
        />
        <!-- Optional: Zoom / hover effect -->
        <div class="absolute inset-0 hover:scale-105 transition-transform duration-500 rounded-2xl"></div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col gap-6">
        <!-- Title -->
        <h1 class="text-4xl font-extrabold text-gray-900">{{ product.name }}</h1>

        <!-- Brand -->
        <p class="text-gray-600 text-lg">{{ product.brand }}</p>

        <!-- Price -->
        <p class="text-3xl font-bold text-blue-600">${{ product.price }}</p>

        <!-- Rating -->
        <div class="flex items-center gap-2">
          <template v-for="i in 5" :key="i">
            <svg 
              v-if="i <= Math.round(product.rating)" 
              class="w-5 h-5 text-yellow-400" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.962c.3.922-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.196-1.538-1.118l1.287-3.962a1 1 0 00-.364-1.118L2.05 9.39c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.963z"></path>
            </svg>
            <svg 
              v-else 
              class="w-5 h-5 text-gray-300" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.962c.3.922-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.196-1.538-1.118l1.287-3.962a1 1 0 00-.364-1.118L2.05 9.39c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.963z"></path>
            </svg>
          </template>
          <span class="text-gray-500">({{ product.rating }})</span>
        </div>

        <!-- Description -->
        <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>

        <!-- Stock Information -->
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-700">Stock:</span>
          <span v-if="product.stock === 0" class="text-red-600 font-bold">Out of Stock</span>
          <span v-else-if="product.stock > 0 && product.stock <= 5" class="text-orange-500 font-semibold">
            Only {{ product.stock }} left in stock!
          </span>
          <span v-else class="text-green-600 font-semibold">{{ product.stock }} available</span>
        </div>

        <!-- Options (optional) -->
        <div class="flex items-center gap-4">
          <label class="font-semibold text-gray-700">Color:</label>
          <select class="border border-gray-300 rounded-lg px-3 py-2" :disabled="product.stock === 0">
            <option>Black</option>
            <option>White</option>
            <option>Silver</option>
          </select>
        </div>

        <!-- Add to Cart -->
        <button @click="handleAddToCart"
          :disabled="cartStore.loading || product.stock === 0"
          class="mt-4 px-6 py-3 rounded-xl shadow-lg transition transform active:scale-95"
          :class="product.stock === 0 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'"
        >
          {{ product.stock === 0 ? 'Out of Stock' : (cartStore.loading ? 'Adding...' : 'Add to Cart') }}
        </button>
        
        <!-- Error Message -->
        <p v-if="cartStore.error" class="text-red-600 text-sm">{{ cartStore.error }}</p>
      </div>
    </section>

    <!-- Related Products Section -->
    <section class="max-w-7xl mx-auto w-full px-6 py-16">
      <h1 class="text-2xl font-bold mb-8">Related Products</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="product in relatedProducts" :key="product.id">
          <ProductCard :product="product"></ProductCard>
        </div>
      </div>
    </section>

    <!-- Footer pushed to bottom -->
    <div class="flex-grow"></div>
    <Footer></Footer>
  </div>
 
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useProduct } from '@/stores/products'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import { computed ,onMounted } from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { useCart } from '@/stores/carts'

const cartStore = useCart()
const productStore = useProduct()
const route = useRoute()

const productId = computed(() => route.params.productId)

const product = computed(() =>
  productStore.products.find((pro) => String(pro.id) === String(productId.value)) || {
    id: null,
    name: 'Product Name',
    brand: 'Brand Name',
    price: 0,
    rating: 4,
    category: '',
    image: '../assets/small_img/mac_book_hero.jpg',
    description: 'This is a sample product description. Highlight features, specs, and other details to make it appealing.'
  }
)

// Handle add to cart with error handling
const handleAddToCart = async () => {
  try {
    if (!product.value.id) throw new Error('Product not found')
    await cartStore.addToCart(product.value.id, 1)
    alert('Product added to cart successfully!')
  } catch (error) {
    alert(error.message || 'Failed to add to cart. Please try again.')
  }
}

// we will filter related products by using category
const relatedProducts = computed(() => {
  if (!product.value.category) return []
  return productStore.products.filter(
    (p) =>
      p.category &&
      p.category.toLowerCase() === product.value.category.toLowerCase() &&
      p.id !== product.value.id
  )
})

// Helper to fix image path
const fixImage = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  try {
    return new URL(path, import.meta.url).href
  } catch {
    return path
  }
}

onMounted(async () => {
  if (!productStore.products.length) {
    try {
      await productStore.fetchAllProducts()
    } catch (e) {
      /* silent */
    }
  }
})
</script>

<style scoped>
/* Optional: add smooth hover zoom for image */
img:hover {
  transform: scale(1.03);
  transition: transform 0.5s ease;
}
</style>

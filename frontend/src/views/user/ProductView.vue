<template>
  <div class="flex flex-col min-h-screen">
    <Header></Header>

    <!-- Main Product Section -->
    <section class="mt-32 max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Product Image -->
      <div>
        <!-- Main Image -->
        <div class="relative">
          <img :src="selectedImage" alt="Product Image" class="w-full rounded-2xl shadow-lg object-cover h-96" />
        </div>

        <!-- Thumbnail Images -->
        <div v-if="productImages.length > 0" class="flex gap-4 mt-4 overflow-x-auto">
          <button v-for="image in productImages" :key="image.id" @click="selectedImage = fixImage(image.imageUrl)"
            class="relative flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all hover:border-blue-500"
            :class="selectedImage === fixImage(image.imageUrl) ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300'">
            <img :src="fixImage(image.imageUrl)" alt="Thumbnail" class="w-full h-full object-cover rounded-lg" />
          </button>
        </div>

        <!-- Tabs UNDER the image -->
        <div class="mt-8">
          <ProductTab :activeTab="activeTab" @update:activeTab="activeTab = $event" :reviews="reviewStore.reviews"
            :rating="rating" :comment="comment" :isAuthenticated="authStore.isAuthenticated"
            :currentUserId="authStore.user?.id" :pagination="reviewStore.pagination" @update:rating="rating = $event"
            @update:comment="comment = $event" @submit-review="submitReview" @delete-review="deleteReview"
            @edit-review="editReview" @update-page="changeReviewPage" :specifications="productSpecifications"
            :description="product.description" />
        </div>
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
            <!-- Full Star -->
            <svg v-if="i <= Math.floor(product.rating)" class="w-5 h-5 text-yellow-400" fill="currentColor"
              viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.962c.3.922-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.196-1.538-1.118l1.287-3.962a1 1 0 00-.364-1.118L2.05 9.39c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.963z">
              </path>
            </svg>
            <!-- Half Star -->
            <svg v-else-if="i === Math.ceil(product.rating) && product.rating % 1 !== 0" class="w-5 h-5 text-yellow-400"
              viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient :id="'half-' + i">
                  <stop offset="50%" stop-color="currentColor" />
                  <stop offset="50%" stop-color="#D1D5DB" />
                </linearGradient>
              </defs>
              <path :fill="'url(#half-' + i + ')'"
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.962c.3.922-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.196-1.538-1.118l1.287-3.962a1 1 0 00-.364-1.118L2.05 9.39c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.963z">
              </path>
            </svg>
            <!-- Empty Star -->
            <svg v-else class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.962c.3.922-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.196-1.538-1.118l1.287-3.962a1 1 0 00-.364-1.118L2.05 9.39c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.963z">
              </path>
            </svg>
          </template>
          <span class="text-gray-500">({{ product.rating }})</span>
        </div>

        <!-- Description -->
        <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>

        <!-- Quantity -->
        <div class="w-full max-w-sm bg-gray-100 rounded-full shadow-inner px-3 py-2">
          <div class="grid grid-cols-3 items-center">
            <button @click="decrement" :disabled="quantity <= 1"
              class="h-10 rounded-full flex items-center justify-center hover:bg-gray-200 text-xl disabled:opacity-50 disabled:cursor-not-allowed">−</button>
            <span class="text-center font-medium text-lg select-none">{{ quantity }}</span>
            <button @click="increment" :disabled="product.stock !== undefined && quantity >= product.stock"
              class="h-10 rounded-full flex items-center justify-center hover:bg-gray-200 text-xl disabled:opacity-50 disabled:cursor-not-allowed">+</button>
          </div>
        </div>

        <!-- Stock Information -->
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-700">Stock:</span>
          <span v-if="product.stock === 0" class="text-red-600 font-bold">Out of Stock</span>
          <span v-else-if="product.stock > 0 && product.stock <= 5" class="text-orange-500 font-semibold">
            Only {{ product.stock }} left in stock!
          </span>
          <span v-else-if="product.stock !== undefined && product.stock !== null"
            class="text-green-600 font-semibold">{{
              product.stock }} available</span>
          <span v-else class="text-green-600 font-semibold">Available</span>
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
        <div class="flex items-center gap-4">
          <button @click="handleAddToCart" :disabled="cartStore.loading || product.stock === 0"
            class="mt-4 px-6 py-3 rounded-xl shadow-lg transition transform active:scale-95"
            :class="product.stock === 0
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'">
            {{ product.stock === 0 ? 'Out of Stock' : (cartStore.loading ? 'Adding...' : 'Add to Cart') }}
          </button>
          <RouterLink :to="{ name: 'checkoutView' }">
            <button @click="checkout" :disabled="cartStore.loading || product.stock === 0"
              class="mt-4 px-6 py-3 rounded-xl shadow-lg transition transform active:scale-95"
              :class="product.stock === 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'">
              Buy Now
            </button>
          </RouterLink>
        </div>

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
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import { computed, onMounted, ref, watch } from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { useCart } from '@/stores/carts'
import { RouterLink } from 'vue-router'
import ProductTab from '@/components/product/ProductTab.vue'
import { useReview } from '@/stores/review'

const reviewStore = useReview()
const authStore = useAuthStore()
const cartStore = useCart()
const productStore = useProduct()
const route = useRoute()

const activeTab = ref('overview')
const quantity = ref(1);
const rating = ref(0)     // user selected rating
const comment = ref('')   // textarea
const selectedImage = ref('')  // for image switching
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
    stock: 0,
    description: 'This is a sample product description. Highlight features, specs, and other details to make it appealing.'
  }
)

// Get product images from the product data
const productImages = computed(() => {
  return product.value?.images || []
})

// Get product specifications
const productSpecifications = computed(() => {
  return product.value?.specifications || []
})

// Helper to fix image path (defined early for use in watchers)
const fixImage = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  try {
    return new URL(path, import.meta.url).href
  } catch {
    return path
  }
}

watch(productId, async (newId) => {
  if (!newId) return
  // always load when switching products (optional: only if reviews tab open)
  await reviewStore.fetchReviewsByProduct(newId)
}, { immediate: true })

// Set selected image when product changes
watch(product, (newProduct) => {
  if (newProduct) {
    // First try to get primary image from images array
    const primaryImage = productImages.value.find(img => img.isPrimary)
    if (primaryImage) {
      selectedImage.value = fixImage(primaryImage.imageUrl)
    } else if (productImages.value.length > 0) {
      // If no primary, use first image
      selectedImage.value = fixImage(productImages.value[0].imageUrl)
    } else {
      // Fallback to product.image
      selectedImage.value = fixImage(newProduct.image)
    }
  }
}, { immediate: true })

// load when user clicks "Reviews" tab (if you keep tab in child, emit it)
watch(activeTab, async (t) => {
  if (t === 'reviews') {
    await reviewStore.fetchReviewsByProduct(productId.value)
  }
})

const increment = () => {
  if (product.value.stock === undefined || quantity.value < product.value.stock) {
    quantity.value++
  }
}
const decrement = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const checkout = () => {
  // Optionally, you can add the product to cart before checkout
  if (cartStore.loading || product.value.stock === 0) return
  cartStore.addToCart(product.value.id, quantity.value)
}
// Handle add to cart with error handling
const handleAddToCart = async () => {
  try {
    if (!product.value.id) throw new Error('Product not found')
    await cartStore.addToCart(product.value.id, quantity.value)
    alert('Product added to cart successfully!')
  } catch (error) {
    alert(error.message || 'Failed to add to cart. Please try again.')
  }
}


const submitReview = async () => {
  if (rating.value < 1) return alert('Please select rating (1-5)')
  if (!comment.value.trim()) return alert('Please write comment')

  try {
    await reviewStore.addReview(productId.value, rating.value, comment.value)
    alert('Review submitted successfully!')
    // refresh list
    await reviewStore.fetchReviewsByProduct(productId.value)
    // reset form
    rating.value = 0
    comment.value = ''
  } catch (error) {
    alert(error.message || 'Failed to submit review')
  }
}

const deleteReview = async (reviewId) => {
  if (!confirm('Are you sure you want to delete this review?')) return

  try {
    await reviewStore.deleteReview(reviewId)
    await reviewStore.fetchReviewsByProduct(productId.value, reviewStore.pagination.page)
  } catch (error) {
    alert(error.message || 'Failed to delete review')
  }
}

const editReview = async (data) => {
  try {
    await reviewStore.updateReview(data.reviewId, data.rating, data.comment)
    alert('Review updated successfully!')
    await reviewStore.fetchReviewsByProduct(productId.value, reviewStore.pagination.page)
  } catch (error) {
    alert(error.message || 'Failed to update review')
  }
}

const changeReviewPage = async (newPage) => {
  await reviewStore.fetchReviewsByProduct(productId.value, newPage)
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

onMounted(async () => {
  if (!productStore.products.length) {
    try {
      await productStore.fetchAllProducts()
    } catch (e) {
      /* silent */
    }
  }
  await reviewStore.fetchReviewsByProduct(productId.value)
})
</script>

<style scoped>
/* Optional: add smooth hover zoom for image */
img:hover {
  transform: scale(1.03);
  transition: transform 0.5s ease;
}
</style>

<template>
  <div class="h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Product Inventory</h1>
      <p class="text-gray-600">Manage products and stock</p>
    </div>

    <!-- Action -->
    <div class="flex justify-between mb-4">
      <input v-model="search" placeholder="Search product..." class="border px-4 py-2 rounded w-1/3" />
      <div class="flex gap-2 text-gray-700">
        <select v-model="selectedCategory" class="rounded-xl border-gray-300">
          <option value="default">All Categories</option>
          <option v-for="category in categoryStore.categories" :key="category.id" :value="category.name">
            {{ category.name }}
          </option>
        </select>
        <select v-model="selectedBrand" class="rounded-xl border-gray-300">
          <option value="">All Brands</option>
          <option v-for="brand in brandStore.brands" :key="brand.id" :value="brand.name">
            {{ brand.name }}
          </option>
        </select>
        <select v-model="sortBy" class="rounded-xl border-gray-300">
          <option value="default">Sort by: Featured</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>
      <button @click="openModal" class="bg-blue-600 text-white px-4 py-2 rounded">
        + Add Product
      </button>

    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow">
      <!-- Loading State -->
      <div v-if="productStore.loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="productStore.error" class="p-8 text-center">
        <p class="text-red-600">{{ productStore.error }}</p>
        <button @click="productStore.fetchAllProducts()" class="mt-4 text-blue-600 hover:underline">
          Retry
        </button>
      </div>

      <!-- Products Table -->
      <table v-else class="w-full bg-white border rounded">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left">Image</th>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">Description</th>
            <th class="p-3 text-left">Brand</th>
            <th class="p-3 text-left">Category</th>
            <th class="p-3 text-left">Price</th>
            <th class="p-3 text-left">Stock</th>
            <th class="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="8" class="p-8 text-center text-gray-500">
              No products found
            </td>
          </tr>
          <tr v-else v-for="p in filteredProducts" :key="p.id" class="border-t">
            <td class="p-3">
              <img :src="p.image || 'https://via.placeholder.com/50'" class="w-12 h-12 rounded object-cover"
                @error="(e) => e.target.src = 'https://via.placeholder.com/50'" />
            </td>
            <td class="p-3">{{ p.name }}</td>
            <td class="p-3 max-w-xs truncate">{{ p.description || '-' }}</td>
            <td class="p-3">{{ p.brand || '-' }}</td>
            <td class="p-3">{{ p.category || '-' }}</td>
            <td class="p-3">${{ Number(p.price).toFixed(2) }}</td>
            <td class="p-3">
              <span :class="p.stock <= 10 ? 'text-red-600 font-semibold' : ''">
                {{ p.stock }}
              </span>
            </td>
            <td class="p-3 space-x-2">
              <button @click="editProduct(p)" class="text-blue-600 hover:underline">Edit</button>
              <button @click="deleteProduct(p)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div class="bg-white w-full max-w-lg rounded p-6">
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditing ? 'Edit Product' : 'Add Product' }}
        </h2>

        <div class="space-y-3">
          <input v-model="form.name" placeholder="Product name" class="w-full border p-2 rounded" />

          <textarea v-model="form.description" placeholder="Description" class="w-full border p-2 rounded"></textarea>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Product Image {{ isEditing ? '(Leave empty to keep current image)' : '' }}
            </label>
            <input ref="fileInput" type="file" accept="image/*" @change="handleImage"
              class="w-full border p-2 rounded" />
          </div>

          <!-- Image Preview -->
          <div v-if="imagePreview || (isEditing && form.existingImage)" class="mt-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ imageFile ? 'New Image Preview' : 'Current Image' }}
            </label>
            <img :src="imagePreview || form.existingImage" class="w-32 h-32 rounded object-cover border"
              @error="(e) => e.target.style.display = 'none'" />
            <button v-if="imageFile" @click="clearImage" type="button"
              class="mt-2 text-sm text-red-600 hover:underline">
              Remove new image
            </button>
          </div>

          <select v-model="form.categoryId" class="w-full border p-2 rounded">
            <option disabled value="">Select category</option>
            <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>

          <select v-model="form.brandId" class="w-full border p-2 rounded">
            <option disabled value="">Select brand (optional)</option>
            <option v-for="brand in brandStore.brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>


          <!-- PRICE -->
          <input type="number" v-model.number="form.price" min="1" step="0.01" placeholder="Price"
            class="w-full border p-2 rounded" />
          <p v-if="priceError" class="text-red-600 text-sm">
            Price must be greater than 0
          </p>

          <!-- STOCK -->
          <input type="number" v-model.number="form.stock" min="1" step="1" placeholder="Stock"
            class="w-full border p-2 rounded" />
          <p v-if="stockError" class="text-red-600 text-sm">
            Stock must be greater than 0
          </p>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button @click="closeModal" class="border px-4 py-2 rounded hover:bg-gray-50">
            Cancel
          </button>

          <button @click="saveProduct" :disabled="!isFormValid" class="px-4 py-2 rounded text-white"
            :class="isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProduct } from '@/stores/products'

import { useBrand } from "@/stores/brands";
import { useCategory } from '@/stores/categories'

const brandStore = useBrand()
const categoryStore = useCategory()
const productStore = useProduct()


// const API_URL = 'http://localhost:3000/api/products'

/* ================= STATE ================= */
// const products = ref([])
const search = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const sortBy = ref('default');
const selectedBrand = ref('');
const selectedCategory = ref('default');
const imageFile = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

const form = ref({
  id: null,
  name: '',
  description: '',
  price: 1,
  stock: 1,
  categoryId: '',
  brandId: ''
})

/* ================= VALIDATION ================= */
const priceError = computed(() => form.value.price <= 0)
const stockError = computed(() => form.value.stock <= 0)

const isFormValid = computed(() => {
  return (
    form.value.name &&
    form.value.categoryId &&
    form.value.price > 0 &&
    form.value.stock > 0
  )
})


/* ================= IMAGE ================= */
const handleImage = e => {
  imageFile.value = e.target.files[0] || null
  imagePreview.value = imageFile.value
    ? URL.createObjectURL(imageFile.value)
    : null
}

const clearImage = () => {
  imageFile.value = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

/* ================= SAVE ================= */
const saveProduct = async () => {
  if (!isFormValid.value) {
    alert('Price and stock must be greater than 0')
    return
  }

  const fd = new FormData()
  fd.append('name', form.value.name)
  fd.append('description', form.value.description || '')
  fd.append('price', form.value.price)
  fd.append('stock', form.value.stock)
  fd.append('categoryId', form.value.categoryId)

  if (form.value.brandId) fd.append('brandId', form.value.brandId)
  if (imageFile.value) fd.append('image', imageFile.value)

  try {
    if (isEditing.value) {
      await productStore.updateProduct(form.value.id, fd)
    } else {
      await productStore.createProduct(fd)
    }

    closeModal()
  } catch (err) {
    console.error('❌ Save Error:', err.response?.data || err)
    alert(err.response?.data?.message || 'Save failed')
  }
}

/* ================= EDIT ================= */
const editProduct = p => {
  isEditing.value = true
  form.value = {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    categoryId: p.categoryId,
    brandId: p.brandId,
    existingImage: p.image // Store existing image URL
  }
  imagePreview.value = null // Clear preview to show existing image
  imageFile.value = null
  showModal.value = true
}

/* ================= DELETE ================= */
const deleteProduct = async p => {
  if (!confirm(`Delete "${p.name}"? This action cannot be undone.`)) return

  try {
    await productStore.deleteProduct(p.id)
  } catch (err) {
    alert(err.message || 'Failed to delete product')
  }
}

/* ================= MODAL ================= */
const openModal = () => {
  isEditing.value = false
  form.value = {
    id: null,
    name: '',
    description: '',
    price: 1,
    stock: 1,
    categoryId: '',
    brandId: '',
    existingImage: null
  }
  imageFile.value = null
  imagePreview.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

/* ================= SEARCH ================= */
const filteredProducts = computed(() => {
  let products = [...productStore.products];
  if (selectedBrand.value) {
    products = products.filter(p => p.brand.toLowerCase() === selectedBrand.value.toLowerCase())
  }
  if (sortBy.value === 'low-high') {
    products.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'high-low') {
    products.sort((a, b) => b.price - a.price)
  }
  if (selectedCategory.value !== 'default') {
    products = products.filter(p => p.category.toLowerCase() === selectedCategory.value.toLowerCase())
  }
  return products.filter(p =>
    p.name.toLowerCase().includes(search.value.trim().toLowerCase())

  )
})

onMounted(async () => {
  if (!productStore.products.length) {
    try {
      await productStore.fetchAllProducts()
    } catch (e) {/* silent */ }
  }
  if (!brandStore.brands.length) {
    try {
      await brandStore.fetchAllBrands()
    } catch (e) {/* silent */ }
  }
  if (!categoryStore.categories.length) {
    try {
      await categoryStore.fetchAllCategories()
    } catch (e) {/* silent */ }
  }

})


</script>

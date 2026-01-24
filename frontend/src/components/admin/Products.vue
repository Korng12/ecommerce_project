<template>
  <div class="h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Product Inventory</h1>
      <p class="text-gray-600">Manage products and stock</p>
    </div>

    <!-- Action -->
    <div class="flex justify-between mb-4">
      <input
        v-model="search"
        placeholder="Search product..."
        class="border px-4 py-2 rounded w-1/3"
      />
      <button
        @click="openModal"
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>
    </div>

    <!-- Table -->
    <table class="w-full bg-white border rounded">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 text-left">Image</th>
          <th class="p-3 text-left">Name</th>
          <th class="p-3 text-left">Category</th>
          <th class="p-3 text-left">Price</th>
          <th class="p-3 text-left">Stock</th>
          <th class="p-3 text-left">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in filteredProducts" :key="p.id" class="border-t">
          <td class="p-3">
            <img
              :src="p.imageUrl || 'https://via.placeholder.com/50'"
              class="w-12 h-12 rounded object-cover"
            />
          </td>
          <td class="p-3">{{ p.name }}</td>
          <td class="p-3">{{ p.categoryName }}</td>
          <td class="p-3">${{ p.price }}</td>
          <td class="p-3">{{ p.stock }}</td>
          <td class="p-3 space-x-2">
            <button @click="editProduct(p)" class="text-blue-600">Edit</button>
            <button @click="deleteProduct(p)" class="text-red-600">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="filteredProducts.length === 0" class="text-center text-gray-500 mt-6">
      No products found
    </p>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div class="bg-white w-full max-w-lg rounded p-6">
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditing ? 'Edit Product' : 'Add Product' }}
        </h2>

        <div class="space-y-3">
          <input v-model="form.name" placeholder="Product name" class="w-full border p-2 rounded" />
          <input v-model="form.image" placeholder="Image URL" class="w-full border p-2 rounded" />

          <select v-model.number="form.categoryId" class="w-full border p-2 rounded">
            <option disabled value="">Select category</option>
            <option :value="1">Laptops</option>
            <option :value="2">Desktop Computers</option>
            <option :value="3">Smartphones</option>
            <option :value="4">Mobile Accessories</option>
          </select>

          <input type="number" v-model.number="form.price" placeholder="Price" class="w-full border p-2 rounded" />
          <input type="number" v-model.number="form.stock" placeholder="Stock" class="w-full border p-2 rounded" />
          <textarea v-model="form.description" placeholder="Description" class="w-full border p-2 rounded"></textarea>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button @click="closeModal" class="border px-4 py-2 rounded">Cancel</button>
          <button @click="saveProduct" class="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

/* ================= STATE ================= */
const products = ref([])
const search = ref('')
const showModal = ref(false)
const isEditing = ref(false)

const form = ref({
  id: null,
  name: '',
  description: '',
  image: '',
  price: null,
  stock: null,
  categoryId: null
})

/* ================= API ================= */
const API_URL = 'http://localhost:3000/api/products'

/* ================= LOAD PRODUCTS ================= */
const fetchProducts = async () => {
  try {
    const res = await axios.get(API_URL, { withCredentials: true })

    products.value = res.data.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      categoryId: p.category?.id,          // 🔥 IMPORTANT
      categoryName: p.category?.name || '-',
      imageUrl: p.images?.[0]?.imageUrl || ''
    }))
  } catch (err) {
    console.error('Fetch products error:', err.response?.data || err)
  }
}

/* ================= SAVE ================= */
const saveProduct = async () => {
  if (!form.value.name || !form.value.price || !form.value.categoryId) {
    alert('Name, price and category are required')
    return
  }

  const payload = {
    name: form.value.name,
    description: form.value.description,
    price: Number(form.value.price),
    stock: Number(form.value.stock || 0),
    categoryId: Number(form.value.categoryId),
    images: form.value.image
      ? [{ url: form.value.image, isPrimary: true }]
      : []
  }

  try {
    if (isEditing.value) {
      await axios.put(`${API_URL}/${form.value.id}`, payload, { withCredentials: true })
    } else {
      await axios.post(API_URL, payload, { withCredentials: true })
    }

    closeModal()
    await fetchProducts() 
  } catch (err) {
    console.error('Save product error:', err.response?.data || err)
    alert('Save failed. Check console.')
  }
}

/* ================= EDIT ================= */
const editProduct = (p) => {
  isEditing.value = true
  form.value = {
    id: p.id,
    name: p.name,
    description: '',
    image: p.imageUrl || '',
    price: p.price,
    stock: p.stock,
    categoryId: p.categoryId
  }
  showModal.value = true
}

/* ================= DELETE ================= */
const deleteProduct = async (p) => {
  if (!confirm('Delete this product?')) return

  try {
    await axios.delete(`${API_URL}/${p.id}`, { withCredentials: true })
    await fetchProducts()
  } catch (err) {
    console.error('Delete product error:', err.response?.data || err)
  }
}

/* ================= UI ================= */
const openModal = () => {
  isEditing.value = false
  form.value = {
    id: null,
    name: '',
    description: '',
    image: '',
    price: null,
    stock: null,
    categoryId: null
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

/* ================= SEARCH ================= */
const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(fetchProducts)
</script>

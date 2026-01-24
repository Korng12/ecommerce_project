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
        + Add Product
      </button>
    </div>

    <!-- Table -->
    <table class="w-full bg-white border rounded">
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
        <tr v-for="p in filteredProducts" :key="p.id" class="border-t">
          <td class="p-3">
            <img
              :src="p.imageUrl || 'https://via.placeholder.com/50'"
              class="w-12 h-12 rounded object-cover"
            />
          </td>
          <td class="p-3">{{ p.name }}</td>
          <td class="p-3">{{ p.description || '-' }}</td>
          <td class="p-3">{{ p.brandName || '-' }}</td>
          <td class="p-3">{{ p.categoryName || '-' }}</td>
          <td class="p-3">${{ p.price }}</td>
          <td class="p-3">{{ p.stock }}</td>
          <td class="p-3 space-x-2">
            <button @click="editProduct(p)" class="text-blue-600">Edit</button>
            <button @click="deleteProduct(p)" class="text-red-600">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

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

          <textarea
            v-model="form.description"
            placeholder="Description"
            class="w-full border p-2 rounded"
          ></textarea>

          <input type="file" accept="image/*" @change="handleImage" />

          <img v-if="imagePreview" :src="imagePreview" class="w-24 h-24 rounded object-cover" />

          <select v-model.number="form.brandId" class="w-full border p-2 rounded">
            <option :value="null">Select brand</option>
            <option :value="1">Apple</option>
            <option :value="2">Asus</option>
            <option :value="3">Samsung</option>
            <option :value="4">MSI</option>
          </select>

          <select v-model.number="form.categoryId" class="w-full border p-2 rounded">
            <option disabled value="">Select category</option>
            <option :value="1">Laptops</option>
            <option :value="2">Desktop</option>
            <option :value="3">Smartphones</option>
            <option :value="4">Accessories</option>
          </select>

          <input type="number" v-model.number="form.price" placeholder="Price" class="w-full border p-2 rounded" />
          <input type="number" v-model.number="form.stock" placeholder="Stock" class="w-full border p-2 rounded" />
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

const API_URL = 'http://localhost:3000/api/products'

const products = ref([])
const search = ref('')
const showModal = ref(false)
const isEditing = ref(false)

const imageFile = ref(null)
const imagePreview = ref(null)

const form = ref({
  id: null,
  name: '',
  description: '',
  price: null,
  stock: null,
  categoryId: null,
  brandId: null
})

/* ================= LOAD ================= */
const fetchProducts = async () => {
  const res = await axios.get(API_URL)
  products.value = res.data.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    brandId: p.brand?.id ?? null,
    brandName: p.brand?.name ?? '',
    categoryId: p.category?.id ?? null,
    categoryName: p.category?.name ?? '',
    imageUrl: p.images?.[0]?.imageUrl
      ? `http://localhost:3000${p.images[0].imageUrl}`
      : ''
  }))
}

/* ================= IMAGE ================= */
const handleImage = e => {
  imageFile.value = e.target.files[0]
  if (imageFile.value) {
    imagePreview.value = URL.createObjectURL(imageFile.value)
  }
}

/* ================= SAVE ================= */
const saveProduct = async () => {
  try {
    if (!form.value.name || !form.value.price || !form.value.categoryId) {
      alert('Name, price, and category are required')
      return
    }

    const fd = new FormData()
    fd.append('name', form.value.name)
    fd.append('description', form.value.description || '')
    fd.append('price', form.value.price)
    fd.append('stock', form.value.stock || 0)
    fd.append('categoryId', form.value.categoryId)

    if (form.value.brandId) {
      fd.append('brandId', form.value.brandId)
    }

    if (imageFile.value) {
      fd.append('image', imageFile.value)
    }

    if (isEditing.value) {
      await axios.put(`${API_URL}/${form.value.id}`, fd)
    } else {
      await axios.post(API_URL, fd)
    }

    closeModal()
    fetchProducts()
  } catch (err) {
    console.error('❌ Save Error:', err.response?.data || err)
    alert(err.response?.data?.error || err.response?.data?.message || 'Save failed')
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
    brandId: p.brandId
  }
  imagePreview.value = p.imageUrl
  imageFile.value = null
  showModal.value = true
}

/* ================= DELETE ================= */
const deleteProduct = async p => {
  if (!confirm('Delete product?')) return
  await axios.delete(`${API_URL}/${p.id}`)
  fetchProducts()
}

/* ================= MODAL ================= */
const openModal = () => {
  isEditing.value = false
  form.value = {
    id: null,
    name: '',
    description: '',
    price: null,
    stock: null,
    categoryId: null,
    brandId: null
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
const filteredProducts = computed(() =>
  products.value.filter(p =>
    (p.name || '').toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(fetchProducts)
</script>

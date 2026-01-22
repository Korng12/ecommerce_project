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
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div class="bg-white w-full max-w-lg rounded p-6">
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditing ? 'Edit Product' : 'Add Product' }}
        </h2>

        <div class="space-y-3">
          <input v-model="form.name" placeholder="Product name" class="w-full border p-2 rounded" />
          <input
            v-model="form.image"
            placeholder="Image URL (https://...)"
            class="w-full border p-2 rounded"
          />

          <!-- IMPORTANT: numeric categoryId -->
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

const API_URL = 'http://localhost:3000/api/products'

const search = ref('')
const products = ref([])
const showModal = ref(false)
const isEditing = ref(false)

const form = ref({
  id: null,
  name: '',
  description: '',
  image: '',
  price: null,
  stock: null,
  categoryId: null,
})

/* AUTH */
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

/* FILTER */
const filteredProducts = computed(() => {
  const q = search.value.toLowerCase()
  return products.value.filter(p => p.name.toLowerCase().includes(q))
})

onMounted(fetchProducts)

/* FETCH */
async function fetchProducts() {
  const res = await fetch(API_URL, { headers: authHeaders() })
  const data = await res.json()

  products.value = data.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    imageUrl: p.image,
    price: p.price,
    stock: p.stock,
    categoryId: p.categoryId,
    categoryName: p.categoryName,
  }))
}

/* MODAL */
function openModal() {
  resetForm()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function editProduct(p) {
  isEditing.value = true
  form.value = {
    id: p.id,
    name: p.name,
    description: p.description,
    image: p.imageUrl,
    price: p.price,
    stock: p.stock,
    categoryId: p.categoryId,
  }
  showModal.value = true
}

function resetForm() {
  isEditing.value = false
  form.value = {
    id: null,
    name: '',
    description: '',
    image: '',
    price: null,
    stock: null,
    categoryId: null,
  }
}

/* SAVE (FIXED) */
async function saveProduct() {
  if (
    !form.value.name ||
    form.value.price === null ||
    form.value.stock === null ||
    !form.value.categoryId
  ) {
    alert('Please fill all required fields')
    return
  }

  const payload = {
    name: form.value.name,
    description: form.value.description,
    price: Number(form.value.price),
    stock: Number(form.value.stock),
    categoryId: Number(form.value.categoryId),
    brandId: form.value.brandId ? Number(form.value.brandId) : null,

    // ✅ FIX IMAGE FORMAT
    images: form.value.image
      ? [{ url: form.value.image, isPrimary: true }]
      : []
  }

  console.log('🟢 PRODUCT PAYLOAD:', payload)

  const url = isEditing.value
    ? `${API_URL}/${form.value.id}`
    : API_URL

  const method = isEditing.value ? 'PUT' : 'POST'

  const res = await fetch(url, {
    method,
    credentials: 'include', // 🔥 REQUIRED (JWT COOKIE)
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('SAVE FAILED:', err)
    alert('Save failed. Check console.')
    return
  }

  closeModal()
  fetchProducts()
}


/* DELETE */
async function deleteProduct(p) {
  if (!confirm(`Delete "${p.name}"?`)) return

  await fetch(`${API_URL}/${p.id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  fetchProducts()
}
</script>

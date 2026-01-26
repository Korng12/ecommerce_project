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
              :src="p.image || 'https://via.placeholder.com/50'"
              class="w-12 h-12 rounded object-cover"
            />
          </td>
          <td class="p-3">{{ p.name }}</td>
          <td class="p-3">{{ p.description || '-' }}</td>
          <td class="p-3">{{ p.brand || '-' }}</td>
          <td class="p-3">{{ p.category || '-' }}</td>
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
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div class="bg-white w-full max-w-lg rounded p-6">
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditing ? 'Edit Product' : 'Add Product' }}
        </h2>

        <div class="space-y-3">
          <input
            v-model="form.name"
            placeholder="Product name"
            class="w-full border p-2 rounded"
          />

          <textarea
            v-model="form.description"
            placeholder="Description"
            class="w-full border p-2 rounded"
          ></textarea>

          <input type="file" accept="image/*" @change="handleImage" />

          <img
            v-if="imagePreview"
            :src="imagePreview"
            class="w-24 h-24 rounded object-cover"
          />

          <select v-model="form.categoryId" class="w-full border p-2 rounded">
            <option disabled value="">Select category</option>
            <option
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>


          <!-- PRICE -->
          <input
            type="number"
            v-model.number="form.price"
            min="1"
            step="0.01"
            placeholder="Price"
            class="w-full border p-2 rounded"
          />
          <p v-if="priceError" class="text-red-600 text-sm">
            Price must be greater than 0
          </p>

          <!-- STOCK -->
          <input
            type="number"
            v-model.number="form.stock"
            min="1"
            step="1"
            placeholder="Stock"
            class="w-full border p-2 rounded"
          />
          <p v-if="stockError" class="text-red-600 text-sm">
            Stock must be greater than 0
          </p>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button @click="closeModal" class="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            @click="saveProduct"
            :disabled="!isFormValid"
            class="px-4 py-2 rounded text-white"
            :class="isFormValid ? 'bg-blue-600' : 'bg-gray-400 cursor-not-allowed'"
          >
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
      await productStore.addProduct(fd) 
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
    brandId: p.brandId
  }
  imagePreview.value = p.imageUrl
  imageFile.value = null
  showModal.value = true
}

/* ================= DELETE ================= */
const deleteProduct = async p => {
  if (!confirm('Delete product?')) return
  productStore.deleteProduct(p.id)
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
    brandId: ''
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
const filteredProducts = computed(() =>{
  let products=[...productStore.products];
  if(selectedBrand.value){
    products = products.filter(p=>p.brand.toLowerCase()===selectedBrand.value.toLowerCase())
  }
  if(sortBy.value==='low-high'){
    products.sort((a,b)=>a.price - b.price)
  } else if(sortBy.value==='high-low'){
    products.sort((a,b)=>b.price - a.price) 
  }
  if(selectedCategory.value !=='default'){
    products = products.filter(p=>p.category.toLowerCase()===selectedCategory.value.toLowerCase())
  }
  return products.filter(p =>
    p.name.toLowerCase().includes(search.value.trim().toLowerCase())  

  )
})

onMounted(async () => {
  if(!productStore.products.length){
    try{
      await productStore.fetchAllProducts()
    } catch(e){/* silent */} 
  }
  if(!brandStore.brands.length){
    try{
      await brandStore.fetchAllBrands()
    } catch(e){/* silent */} 
  }
  if(!categoryStore.categories.length){
    try{
      await categoryStore.fetchAllCategories()
    } catch(e){/* silent */} 
  }
  
})


</script>

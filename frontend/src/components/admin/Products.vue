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
          <input v-model="form.name" placeholder="Product name" class="w-full border p-2 rounded" />

          <textarea
            v-model="form.description"
            placeholder="Description"
            class="w-full border p-2 rounded"
          ></textarea>

          <input type="file" accept="image/*" @change="handleImage" />

          <img v-if="imagePreview" :src="imagePreview" class="w-24 h-24 rounded object-cover" />

          <!-- BRAND -->
          <select v-model.number="form.brandId" class="w-full border p-2 rounded">
            <option :value="null">Select brand</option>
            <option v-for="b in brandStore.brands" :key="b.id" :value="b.id">
              {{ b.name }}
            </option>
          </select>

          <!-- CATEGORY (FIXED) -->
          <select v-model.number="form.categoryId" class="w-full border p-2 rounded">
            <option :value="null">Select category</option>
            <option v-for="c in categoryStore.categories" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>

          <!-- PRICE -->
          <input type="number" v-model.number="form.price" placeholder="Price" class="w-full border p-2 rounded" />
          <p v-if="priceError" class="text-red-600 text-sm">
            Price must be greater than 0
          </p>

          <!-- STOCK -->
          <input type="number" v-model.number="form.stock" placeholder="Stock" class="w-full border p-2 rounded" />
          <p v-if="stockError" class="text-red-600 text-sm">
            Stock must be greater than 0
          </p>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button @click="closeModal" class="border px-4 py-2 rounded">Cancel</button>
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
import { useBrand } from '@/stores/brands'
import { useCategory } from '@/stores/categories'

/* ================= STORES ================= */
const productStore = useProduct()
const brandStore = useBrand()
const categoryStore = useCategory()
const search = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const sortBy = ref('default');
const selectedBrand = ref('');
const selectedCategory = ref('default');
const imageFile = ref(null)
const imagePreview = ref(null)

/* ================= FORM ================= */
const form = ref({
  id: null,
  name: '',
  description: '',
  price: null,
  stock: null,
  categoryId: null,
  brandId: null
})

/* ================= VALIDATION ================= */
const priceError = computed(
  () => form.value.price !== null && form.value.price <= 0
)
const stockError = computed(
  () => form.value.stock !== null && form.value.stock <= 0
)

const isFormValid = computed(() =>
  form.value.name &&
  form.value.categoryId !== null &&
  form.value.price > 0 &&
  form.value.stock > 0
)

/* ================= COMPUTED ================= */
// const filteredProducts = computed(() =>
//   productStore.products.filter(p =>
//     p.name.toLowerCase().includes(search.value.toLowerCase())
//   )
// )

/* ================= IMAGE ================= */
const handleImage = (e) => {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

/* ================= CRUD ================= */
const saveProduct = async () => {
  if (!isFormValid.value) return

  try {
    if (isEditing.value) {
      await productStore.updateProduct(
        form.value.id,
        form.value,
        imageFile.value
      )
    } else {
      await productStore.createProduct(
        form.value,
        imageFile.value
      )
    }
    closeModal()
  } catch (err) {
    alert(productStore.error || 'Action failed')
  }
}

const editProduct = (p) => {
  isEditing.value = true

  // ✅ MAP CORRECT FIELDS
  form.value = {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    categoryId: p.categoryId,
    brandId: p.brandId
  }

  imagePreview.value = p.image
  imageFile.value = null
  showModal.value = true
}

const deleteProduct = async (p) => {
  if (!confirm('Delete product?')) return
  try {
    await productStore.deleteProduct(p.id)
  } catch (err) {
    alert(productStore.error || 'Delete failed')
  }
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

/* ================= LOAD ================= */
// onMounted(async () => {
//   await productStore.fetchAllProducts()
//   await brandStore.fetchBrands()
//   await categoryStore.fetchCategories()
// })
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

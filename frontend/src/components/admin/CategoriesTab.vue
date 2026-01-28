<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Categories Management</h2>
        <p class="text-gray-600 mt-1">Manage your product categories</p>
      </div>
      <button @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Plus :size="20" />
        <span>Add Category</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">Total Categories</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ categoryStore.totalCategories }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg">
            <Folder class="text-blue-600" :size="24" />
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="flex items-center gap-4">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
          <input v-model="searchQuery" type="text" placeholder="Search categories..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
    </div>

    <!-- Categories Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products Count
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="categoryStore.loading" class="hover:bg-gray-50">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                <div class="flex items-center justify-center gap-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span>Loading categories...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredCategories.length === 0" class="hover:bg-gray-50">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                No categories found
              </td>
            </tr>
            <template v-else v-for="category in filteredCategories" :key="category.id">
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <img v-if="category.image" :src="category.image" :alt="category.name"
                      class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <ImageIcon class="text-gray-400" :size="24" />
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900">{{ category.name }} </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <span>{{ category.products?.length || 0 }}</span>
                    <button v-if="(category.products?.length || 0) > 0" @click="toggleProducts(category.id)"
                      class="p-1 rounded hover:bg-gray-100 text-gray-500"
                      :title="isExpanded(category.id) ? 'Hide products' : 'View products'">
                      <ChevronDown v-if="isExpanded(category.id)" :size="16" />
                      <ChevronRight v-else :size="16" />
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-600 max-w-md truncate">
                    {{ category.description || 'No description' }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openEditModal(category)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <Edit2 :size="18" />
                    </button>
                    <button @click="confirmDelete(category)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 :size="18" />
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Products dropdown -->
              <tr v-if="isExpanded(category.id)" class="bg-gray-50">
                <td class="px-6 py-4" colspan="5">
                  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="product in category.products" :key="product.id"
                      class="p-3 rounded-lg border border-gray-200 bg-white flex items-start gap-3">
                      <div class="w-14 h-14 rounded-md bg-gray-100 overflow-hidden flex-shrink-0 relative">
                        <img v-if="getPrimaryImage(product)" :src="getPrimaryImage(product)" :alt="product.name"
                          class="w-full h-full object-cover" @error="(e) => e.target.style.display = 'none'" />
                        <div class="absolute inset-0 flex items-center justify-center text-xs text-gray-400"
                          :class="{ 'hidden': getPrimaryImage(product) }">
                          <ImageIcon :size="20" />
                        </div>
                      </div>
                      <div class="space-y-1">
                        <p class="font-semibold text-gray-900 text-sm line-clamp-2">{{ product.name }}</p>
                        <p class="text-xs text-gray-500">Stock: {{ product.stock ?? '—' }}</p>
                        <p class="text-sm text-gray-700 font-medium">${{ Number(product.price).toFixed(2) }}</p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-800">
            {{ isEditMode ? 'Edit Category' : 'Create New Category' }}
          </h3>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Name Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.name" type="text" required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category name" />
          </div>

          <!-- Description Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea v-model="formData.description" rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category description"></textarea>
          </div>

          <!-- Image Upload Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            <div class="flex items-center gap-4">
              <label
                class="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div class="text-center">
                  <Upload class="mx-auto text-gray-400 mb-1" :size="24" />
                  <span class="text-sm text-gray-600">Click to upload image</span>
                  <span class="text-xs text-gray-500 block mt-1">(PNG, JPG, GIF max 5MB)</span>
                </div>
                <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
              </label>
            </div>
          </div>

          <!-- Image Preview -->
          <div v-if="imagePreview || (isEditMode && formData.image && !imageFile)" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div class="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
              <img :src="imagePreview || formData.image" :alt="formData.name" class="w-full h-full object-cover"
                @error="imageError = true" />
            </div>
            <div v-if="imageFile" class="mt-2 text-sm text-green-600 flex items-center gap-1">
              <span>✓</span>
              <span>{{ imageFile.name }}</span>
            </div>
            <p v-if="imageError" class="text-sm text-red-500 mt-2">Failed to load image</p>
          </div>

          <!-- Error Message -->
          <div v-if="categoryStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ categoryStore.error }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4">
            <button type="button" @click="closeModal"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="categoryStore.loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ categoryStore.loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex items-center gap-4">
            <div class="bg-red-100 p-3 rounded-full">
              <AlertCircle class="text-red-600" :size="24" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Delete Category</h3>
              <p class="text-gray-600 mt-1">
                Are you sure you want to delete "{{ categoryToDelete?.name }}"? This action cannot be undone.
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 mt-6">
            <button @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button @click="handleDelete" :disabled="categoryStore.loading"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
              {{ categoryStore.loading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategory } from '@/stores/categories'
import { Plus, Search, Edit2, Trash2, Folder, ImageIcon, AlertCircle, Upload, ChevronDown, ChevronRight } from 'lucide-vue-next'

const categoryStore = useCategory()

// State
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const categoryToDelete = ref(null)
const imageError = ref(false)
const searchQuery = ref('')
const fileInput = ref(null)
const imageFile = ref(null)
const imagePreview = ref(null)
const expanded = ref(new Set())

const formData = ref({
  name: '',
  description: '',
  image: ''
})

// Computed
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categoryStore.categories

  const query = searchQuery.value.toLowerCase()
  return categoryStore.categories.filter(category =>
    category.name.toLowerCase().includes(query) ||
    (category.description && category.description.toLowerCase().includes(query))
  )
})

const isExpanded = (categoryId) => expanded.value.has(categoryId)

const toggleProducts = (categoryId) => {
  const next = new Set(expanded.value)
  if (next.has(categoryId)) {
    next.delete(categoryId)
  } else {
    next.add(categoryId)
  }
  expanded.value = next
}

const getPrimaryImage = (product) => {
  // Backend returns filtered array with only primary image
  if (product.images && product.images.length > 0) {
    const imageUrl = product.images[0].imageUrl
    // If the URL is relative, prepend the backend URL
    if (imageUrl && !imageUrl.startsWith('http')) {
      return `http://localhost:3000${imageUrl}`
    }
    return imageUrl
  }
  return null
}

// Methods
const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    imageError.value = true
    alert('File size must be less than 5MB')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    imageError.value = true
    alert('Please select a valid image file')
    return
  }

  imageFile.value = file
  imageError.value = false

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result
  }
  reader.readAsDataURL(file)
}

const openCreateModal = () => {
  isEditMode.value = false
  formData.value = {
    name: '',
    description: '',
    image: ''
  }
  imageFile.value = null
  imagePreview.value = null
  imageError.value = false
  showModal.value = true
}

const openEditModal = (category) => {
  isEditMode.value = true
  formData.value = {
    id: category.id,
    name: category.name,
    description: category.description || '',
    image: category.image || ''
  }
  imageFile.value = null
  imagePreview.value = null
  imageError.value = false
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    name: '',
    description: '',
    image: ''
  }
  imageFile.value = null
  imagePreview.value = null
  imageError.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  try {
    // If a new image file is selected, create FormData for multipart upload
    if (imageFile.value) {
      const formDataForUpload = new FormData()
      formDataForUpload.append('name', formData.value.name)
      formDataForUpload.append('description', formData.value.description)
      formDataForUpload.append('image', imageFile.value)

      if (isEditMode.value) {
        await categoryStore.updateCategory(formData.value.id, formDataForUpload)
      } else {
        await categoryStore.createCategory(formDataForUpload)
      }
    } else {
      // No new image, send regular data
      if (isEditMode.value) {
        await categoryStore.updateCategory(formData.value.id, {
          name: formData.value.name,
          description: formData.value.description
        })
      } else {
        await categoryStore.createCategory({
          name: formData.value.name,
          description: formData.value.description,
          image: formData.value.image
        })
      }
    }
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const confirmDelete = (category) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    await categoryStore.deleteCategory(categoryToDelete.value.id)
    showDeleteModal.value = false
    categoryToDelete.value = null
  } catch (error) {
    console.error('Error deleting category:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await categoryStore.fetchAllCategories()
})
</script>

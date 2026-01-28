<template>
  <div class="p-6 space-y-6">

    <!-- STATS -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow p-5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Banners</p>
          <p class="text-3xl font-bold">{{ totalBanners }}</p>
        </div>
        <div class="bg-blue-100 text-blue-600 p-3 rounded-lg">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16l4-4a3 3 0 014 0l4 4m4-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Banners</h1>
      <button
        @click="openCreate"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Add Banner
      </button>
    </div>

    <!-- SEARCH -->
    <input
      v-model="search"
      placeholder="Search banners..."
      class="w-full border rounded-lg px-4 py-2"
    />

    <!-- TABLE -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 text-gray-500 text-sm uppercase">
          <tr>
            <th class="px-6 py-3 text-left">Image</th>
            <th class="px-6 py-3 text-left">Title</th>
            <th class="px-6 py-3 text-left">Status</th>
            <th class="px-6 py-3 text-left">Position</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr v-for="b in filteredBanners" :key="b.id">
            <td class="px-6 py-4">
              <img
                  :src="`http://localhost:3000/uploads/banners/${b.image_url}`"
                  class="h-12 w-20 rounded object-cover border"
                />

            </td>

            <td class="px-6 py-4 font-medium">{{ b.title }}</td>

            <td class="px-6 py-4">
              <span
                :class="b.status === 'active'
                  ? 'text-green-600 font-semibold'
                  : 'text-red-600 font-semibold'"
              >
                {{ b.status }}
              </span>
            </td>

            <td class="px-6 py-4">{{ b.position }}</td>

            <td class="px-6 py-4 text-right space-x-3">
              <!-- EDIT -->
              <button
                @click="openEdit(b)"
                class="text-blue-600 hover:text-blue-800"
                title="Edit"
              >
                <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                       M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>


              <!-- DELETE (SVG kept) -->
              <button
                @click="deleteBanner(b.id)"
                class="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862
                       a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6
                       m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>

          <tr v-if="filteredBanners.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-400">
              No banners found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-xl rounded-lg shadow">

        <div class="px-6 py-4 border-b">
          <h2 class="text-lg font-semibold">
            {{ isEdit ? 'Edit Banner' : 'Create New Banner' }}
          </h2>
        </div>

        <!-- FORM -->
        <div class="p-6 space-y-5">

          <div>
            <label class="block text-sm font-medium mb-1">
              Banner Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              class="w-full border rounded-lg px-3 py-2"
              placeholder="Enter banner title"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Redirect Link</label>
            <input
              v-model="form.link"
              class="w-full border rounded-lg px-3 py-2"
              placeholder="/products"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Position</label>
            <input
              type="number"
              min="1"
              step="1"
              v-model.number="form.position"
              class="w-full border rounded-lg px-3 py-2"
            />

            <p v-if="positionError" class="text-red-600 text-sm mt-1">
              Position must be a positive number (1 or greater)
            </p>

          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select
              v-model="form.status"
              class="w-full border rounded-lg px-3 py-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- IMAGE -->
          <div>
            <label class="block text-sm font-medium mb-2">Banner Image</label>
            <label
              class="flex flex-col items-center justify-center border-2 border-dashed
                     rounded-lg p-6 cursor-pointer text-gray-500 hover:bg-gray-50"
            >
              <input
                type="file"
                class="hidden"
                accept="image/jpeg,image/png"
                @change="handleImage"
              />
              <span class="text-sm">Click to upload JPG or PNG</span>
            </label>

            <img
              v-if="imagePreview"
              :src="imagePreview"
              class="mt-4 h-28 rounded border object-cover"
            />
          </div>

        </div>

        <div class="px-6 py-4 border-t flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            @click="saveBanner"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {{ isEdit ? 'Update' : 'Create' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBannerStore } from '@/stores/banners'

const bannerStore = useBannerStore()

const search = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const imagePreview = ref(null)

const form = ref({
  id: null,
  title: '',
  link: '',
  status: 'active',
  position: 1,
  image: null
})

onMounted(() => {
  bannerStore.fetchBanners()
})

const banners = computed(() => bannerStore.banners)
const totalBanners = computed(() => bannerStore.totalBanners)

const filteredBanners = computed(() =>
  banners.value.filter(b =>
    b.title?.toLowerCase().includes(search.value.toLowerCase())
  )
)

const openCreate = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const openEdit = (b) => {
  isEdit.value = true
  showModal.value = true
  form.value = {
    id: b.id,
    title: b.title,
    link: b.link,
    status: b.status,
    position: b.position,
    image: null
  }
  imagePreview.value = `/uploads/banners/${b.image_url}`
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const handleImage = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.value.image = file
  imagePreview.value = URL.createObjectURL(file)
}

const saveBanner = async () => {
  if (!form.value.title) {
    alert('Banner title is required')
    return
  }

  if (form.value.position <= 0) {
    alert('Position must be greater than 0')
    return
  }

  if (!isEdit.value && !form.value.image) {
    alert('Banner image is required')
    return
  }

  if (isEdit.value) {
    await bannerStore.updateBanner(form.value.id, form.value)
  } else {
    await bannerStore.createBanner(form.value)
  }

  closeModal()
}


const deleteBanner = async (id) => {
  if (confirm('Delete this banner?')) {
    await bannerStore.deleteBanner(id)
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    title: '',
    link: '',
    status: 'active',
    position: 1,
    image: null
  }
  imagePreview.value = null
}
</script>

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
          <!-- Image Icon -->
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
    <div class="relative">
      <input
        v-model="search"
        type="text"
        placeholder="Search banners..."
        class="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring focus:ring-blue-200"
      />
      <span class="absolute left-3 top-2.5 text-gray-400">
        <!-- Search Icon -->
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </span>
    </div>

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
          <tr
            v-for="b in filteredBanners"
            :key="b.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4">
              <img
                :src="`http://localhost:3000/uploads/banners/${b.image_url}`"
                class="h-12 w-20 rounded object-cover border"
              />
            </td>

            <td class="px-6 py-4 font-medium">
              {{ b.title }}
            </td>

            <td class="px-6 py-4">
              <span
                :class="b.status === 'active'
                  ? 'text-green-600 font-semibold'
                  : 'text-red-600 font-semibold'"
              >
                {{ b.status }}
              </span>
            </td>

            <td class="px-6 py-4">
              {{ b.position }}
            </td>

            <td class="px-6 py-4 text-right space-x-3">
              <!-- Edit -->
              <button
                @click="openEdit(b)"
                class="text-blue-600 hover:text-blue-800"
              >
                <svg class="h-5 w-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                       M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>

              <!-- Delete -->
              <button
                @click="deleteBanner(b.id)"
                class="text-red-600 hover:text-red-800"
              >
                <svg class="h-5 w-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-xl rounded-lg shadow-lg overflow-hidden">
        
        <div class="px-6 py-4 border-b">
          <h2 class="text-lg font-semibold">
            {{ isEdit ? "Edit Banner" : "Create Banner" }}
          </h2>
        </div>

        <div class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium mb-1">Banner Title *</label>
            <input v-model="form.title" class="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Redirect Link</label>
            <input v-model="form.link" class="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Position</label>
            <input type="number" v-model="form.position" class="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select v-model="form.status" class="w-full border rounded-lg px-3 py-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Banner Image</label>
            <label class="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer text-gray-500 hover:bg-gray-50">
              <input type="file" class="hidden" accept="image/*" @change="handleImage" />
              <span class="text-sm">Click to upload image</span>
            </label>

            <div v-if="imagePreview" class="mt-4">
              <img :src="imagePreview" class="h-28 rounded-lg object-cover border" />
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 border rounded-lg">Cancel</button>
          <button @click="saveBanner" class="px-4 py-2 bg-blue-600 text-white rounded-lg">
            {{ isEdit ? "Update" : "Create" }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import axios from "axios"

const banners = ref([])
const search = ref("")
const showModal = ref(false)
const isEdit = ref(false)
const imagePreview = ref(null)

const form = ref({
  id: null,
  title: "",
  link: "",
  status: "active",
  position: 1,
  image: null
})

const loadBanners = async () => {
  const res = await axios.get("http://localhost:3000/api/banners")
  banners.value = res.data
}
onMounted(loadBanners)

const totalBanners = computed(() => banners.value.length)

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
  form.value = { ...b, image: null }
  imagePreview.value = `http://localhost:3000/uploads/banners/${b.image_url}`
}

const closeModal = () => showModal.value = false

const handleImage = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.value.image = file
  imagePreview.value = URL.createObjectURL(file)
}

const saveBanner = async () => {
  const fd = new FormData()
  Object.entries(form.value).forEach(([k, v]) => v && fd.append(k, v))

  if (isEdit.value) {
    await axios.put(`http://localhost:3000/api/banners/${form.value.id}`, fd)
  } else {
    await axios.post("http://localhost:3000/api/banners", fd)
  }
  closeModal()
  loadBanners()
}

const deleteBanner = async (id) => {
  if (confirm("Delete this banner?")) {
    await axios.delete(`http://localhost:3000/api/banners/${id}`)
    loadBanners()
  }
}

const resetForm = () => {
  form.value = { id: null, title: "", link: "", status: "active", position: 1, image: null }
  imagePreview.value = null
}
</script>

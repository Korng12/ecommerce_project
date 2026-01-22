<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">
      Users Management
    </h1>

    <!-- Search & Add -->
    <div class="flex justify-between items-center mb-6">
      <div class="relative w-80">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          :size="20"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users..."
          class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Add User
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow border overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">Name</th>
            <th class="px-6 py-3 text-left">Email</th>
            <th class="px-6 py-3 text-left">Role</th>
            <th class="px-6 py-3 text-left">Status</th>
            <th class="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <!-- ✅ USERS FOUND -->
        <tbody v-if="filteredUsers.length">
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-6 py-4 flex items-center gap-3">
              <div
                class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600"
              >
                {{ (user.name || '?').charAt(0).toUpperCase() }}
              </div>
              {{ user.name }}
            </td>

            <td class="px-6 py-4">{{ user.email }}</td>

            <td class="px-6 py-4">
               <span
                :class="[
                  'px-3 py-1 rounded-full text-sm',
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                ]"
              >
                {{ user.role === 'ADMIN' ? 'Admin' : 'User' }}
              </span>

            </td>

            <td class="px-6 py-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm',
                  user.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                ]"
              >
                {{ user.status }}
              </span>
            </td>

            <td class="px-6 py-4 space-x-3">
              <button
                @click="openEditModal(user)"
                class="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                @click="deleteUser(user.id)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>

        <!-- If empty data -->
        <tbody v-else>
          <tr>
            <td
              colspan="5"
              class="text-center py-10 text-gray-500"
            >
              <div class="flex flex-col items-center gap-2">
                <p class="text-lg font-semibold">
                  {{ emptyMessage }}
                </p>
                <p class="text-sm text-gray-400">
                  Try adding a new user or change your search keyword.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            {{ isEditing ? 'Edit User' : 'Add User' }}
          </h2>
          <button @click="closeModal"><X /></button>
        </div>

        <form @submit.prevent="isEditing ? updateUser() : addUser()">
          <div class="space-y-4">
            <input
              v-model="formData.name"
              type="text"
              placeholder="Full Name"
              required
              class="w-full px-4 py-2 border rounded-lg"
            />

            <input
              v-model="formData.email"
              type="email"
              placeholder="Email"
              required
              class="w-full px-4 py-2 border rounded-lg"
            />

            <select
              v-model="formData.role"
              required
              class="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Role</option>
              <option v-for="r in roles" :key="r" :value="r">
                {{ r }}
              </option>
            </select>

            <select
              v-model="formData.status"
              required
              class="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {{ isEditing ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Search, X } from 'lucide-vue-next'

/* ================= STATE ================= */
const users = ref([])
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingUserId = ref(null)

const roles = ['Admin', 'User']

const formData = ref({
  name: '',
  email: '',
  role: '',
  status: ''
})

/* ================= API ================= */
const API_URL = 'http://localhost:3000/users'


const loadUsers = async () => {
  const res = await axios.get(API_URL, { withCredentials: true })

  users.value = res.data.map(u => ({
    id: u.id,
    name: u.username || 'Unknown',
    email: u.email,
    role: u.role || 'USER',
    status: u.status || 'Active'
  }))

}




/* ================= CRUD ================= */
const addUser = async () => {
  try {
    await axios.post(
      'http://localhost:3000/api/users',
      formData.value,
      { withCredentials: true }   
    )
    await loadUsers()
    closeModal()
  } catch (err) {
    console.error('Add user error:', err)
  }
}

// Update user
const updateUser = async () => {
  try {
    await axios.put(
      `${API_URL}/${editingUserId.value}`,
      formData.value,
      { withCredentials: true }   
    )

    await loadUsers()
    closeModal()
  } catch (err) {
    console.error('Update user error:', err)
  }
}

// Delete user
const deleteUser = async (id) => {
  if (!confirm('Delete this user?')) return

  try {
    await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true       
    })

    await loadUsers()
  } catch (err) {
    console.error('Delete user error:', err)
  }
}



/* ================= UI ================= */
const openAddModal = () => {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

const openEditModal = (user) => {
  isEditing.value = true
  editingUserId.value = user.id

  formData.value = {
    name: user.name,
    email: user.email,
    role: user.role === 'ADMIN' ? 'Admin' : 'User',
    status: user.status
  }

  showModal.value = true
}


const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingUserId.value = null
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    role: '',
    status: ''
  }
}

/* ================= SEARCH ================= */
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

/* ✅ EMPTY MESSAGE LOGIC */
const emptyMessage = computed(() => {
  if (!users.value.length) {
    return 'User not found'
  }
  if (searchQuery.value && !filteredUsers.value.length) {
    return 'No users match your search'
  }
  return ''
})

/* ================= INIT ================= */
onMounted(loadUsers)
</script>

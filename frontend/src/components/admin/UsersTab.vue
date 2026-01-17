<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Users Management</h1>
    
    <!-- Search and Actions -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex-1 max-w-md">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
          <input 
            type="text" 
            placeholder="Search users..." 
            v-model="searchQuery"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button 
        @click="openAddModal"
        class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        + Add User
      </button>
    </div>
    
    <!-- Users Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-800">
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                  {{ user.name.charAt(0) }}
                </div>
                {{ user.name }}
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span :class="['px-3 py-1 rounded-full text-sm', 
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700']">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span :class="['px-3 py-1 rounded-full text-sm', 
                        user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700']">
                {{ user.status }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex space-x-2">
                <button 
                  @click="openEditModal(user)"
                  class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                >
                  Edit
                </button>
                <button 
                  @click="deleteUser(user.id)"
                  class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ isEditing ? 'Edit User' : 'Add New User' }}
            </h2>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <X :size="24" />
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="isEditing ? updateUser() : addUser()">
            <div class="space-y-4">
              <!-- Name Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  v-model="formData.name"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <!-- Email Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  v-model="formData.email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <!-- Role Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  v-model="formData.role"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a role</option>
                  <option value="User">User</option>
                  
                </select>
              </div>

              <!-- Status Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  v-model="formData.status"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                {{ isEditing ? 'Update User' : 'Add User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, X } from 'lucide-vue-next'

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const searchQuery = ref('')
const editingUserId = ref(null)

// Form data
const formData = ref({
  name: '',
  email: '',
  role: '',
  status: ''
})

// Mock users data
const users = ref([
  { id: 1, name: 'Meng Kong', email: 'korng@gmail.com', role: 'User', status: 'Active' },
  { id: 2, name: 'Seng Kea', email: 'sengkea@gmail.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Kakda', email: 'kakda@gmail.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'ChyHang', email: 'chyhang@gmail.com', role: 'User', status: 'Active' },
  { id: 5, name: 'Mesa', email: 'mesa@gmail.com', role: 'User', status: 'Active' },
])

// Filter users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
  )
})

// Open modal for adding new user
const openAddModal = () => {
  isEditing.value = false
  editingUserId.value = null
  resetForm()
  showModal.value = true
}

// Open modal for editing user
const openEditModal = (user) => {
  isEditing.value = true
  editingUserId.value = user.id
  formData.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  }
  showModal.value = true
}

// Add new user
const addUser = () => {
  const user = {
    id: users.value.length > 0 ? Math.max(...users.value.map(u => u.id)) + 1 : 1,
    ...formData.value
  }
  
  users.value.push(user)
  closeModal()
}

// Update existing user
const updateUser = () => {
  if (!editingUserId.value) return
  
  const index = users.value.findIndex(user => user.id === editingUserId.value)
  if (index !== -1) {
    users.value[index] = {
      ...users.value[index],
      ...formData.value
    }
  }
  
  closeModal()
}

// Delete user
const deleteUser = (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    users.value = users.value.filter(user => user.id !== id)
  }
}

// Reset form
const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    role: '',
    status: ''
  }
}

// Close modal
const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingUserId.value = null
  resetForm()
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && showModal.value) {
    closeModal()
  }
})
</script>
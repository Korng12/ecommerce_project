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
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button 
  @click="handleAddUser"
  :disabled="isLoading"
  class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
>
  <span v-if="isLoading">Adding...</span>
  <span v-else>Add User</span>
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
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
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
                <button class="p-1 text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button class="p-1 text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next'
import { ref } from 'vue' 
const isLoading = ref(false) 

// Mock users data
const users = [
  { id: 1, name: 'Meng Kong', email: 'korng@gmail.com', role: 'Manager', status: 'Active' },
  { id: 2, name: 'Seng Kea', email: 'sengkea@gmail.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Kakda', email: 'kakda@gmail.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'ChyHang', email: 'chyhang@gmail.com', role: 'User', status: 'Active' },
  { id: 5, name: 'Mesa', email: 'mesa@gmail.com', role: 'Admin', status: 'Active' },
]

const handleAddUser = () => {
  isLoading.value = true
  setTimeout(() => {
    console.log('Add user clicked')
    isLoading.value = false
  }, 1000)
}
</script>
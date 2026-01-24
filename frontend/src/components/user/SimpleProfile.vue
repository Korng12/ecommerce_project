<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-black py-16">
    <div class="max-w-4xl mx-auto px-6">
      
  
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
        <div class="h-48 bg-gradient-to-r from-gray-900 via-black to-gray-900 relative">
          <div class="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div class="px-10 pb-10">
          <div class="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20">
            
            <div class="relative">
              <div class="w-36 h-36 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
                <img 
                  src="/profile.png" 
                  alt="Profile"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
              <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            
          
            <div class="flex-1">
              <h1 class="text-4xl font-bold text-gray-900 mb-2">
                {{ user.username }}
              </h1>
              <p class="text-lg text-gray-600 mb-1">{{ user.email }}</p>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Account Settings</span>
              </div>
            </div>

           
            <div class="flex space-x-3">
              <button
                @click="isEditing = !isEditing"
                class="px-8 py-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 text-white rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center space-x-3 font-semibold"
              >
                <Edit2 class="w-5 h-5" />
                <span>{{ isEditing ? 'Cancel Edit' : 'Edit Profile' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      <div class="bg-white rounded-3xl shadow-2xl p-10">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-3xl font-bold text-gray-900">
            Account Information
          </h2>
          <div v-if="isEditing" class="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl">
            <svg class="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span class="font-semibold">Editing Mode</span>
          </div>
        </div>

        <form @submit.prevent="updateProfile">
          <div class="space-y-8">

        
            <div>
              <label class="block text-sm font-bold mb-3 text-gray-800 uppercase tracking-wide">Username</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  v-model="user.username"
                  :disabled="!isEditing"
                  class="w-full pl-12 pr-5 py-4 rounded-2xl border-2 transition-all focus:outline-none text-lg"
                  :class="isEditing ? 'bg-white border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100' : 'bg-gray-50 border-gray-200 text-gray-600'"
                  placeholder="Enter username"
                />
              </div>
            </div>

         
            <div>
              <label class="block text-sm font-bold mb-3 text-gray-800 uppercase tracking-wide">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  v-model="user.email"
                  type="email"
                  :disabled="!isEditing"
                  class="w-full pl-12 pr-5 py-4 rounded-2xl border-2 transition-all focus:outline-none text-lg"
                  :class="isEditing ? 'bg-white border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100' : 'bg-gray-50 border-gray-200 text-gray-600'"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div v-if="isEditing" class="pt-6 border-t-2 border-gray-100">
              <label class="block text-sm font-bold mb-4 text-gray-800 uppercase tracking-wide flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </label>
              <div class="space-y-5 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl">
                <div class="relative">
                  <input
                    v-model="passwordData.currentPassword"
                    type="password"
                    class="w-full px-5 py-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 text-lg"
                    placeholder="Current password"
                  />
                </div>
                <div class="relative">
                  <input
                    v-model="passwordData.newPassword"
                    type="password"
                    class="w-full px-5 py-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 text-lg"
                    placeholder="New password"
                  />
                </div>
                <div class="relative">
                  <input
                    v-model="passwordData.confirmPassword"
                    type="password"
                    class="w-full px-5 py-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 text-lg"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

          </div>

         
          <div v-if="isEditing" class="flex justify-end space-x-4 pt-10 mt-10 border-t-2 border-gray-100">
            <button
              type="button"
              @click="isEditing = false"
              class="px-10 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-10 py-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl text-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { Edit2 } from 'lucide-vue-next'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isEditing = ref(false)

const user = reactive({
  id: '',
  username: '',
  email: '',
  roleId: ''
})

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const getInitials = (username) =>
  username ? username.charAt(0).toUpperCase() : 'U'

const loadUserData = async () => {
  // First try to get from auth store
  if (authStore.user) {
    Object.assign(user, {
      id: authStore.user.id || '',
      username: authStore.user.username || '',
      email: authStore.user.email || '',
      roleId: authStore.user.roleId || ''
    })
  } else {
    // Fallback to fetching current user
    try {
      await authStore.fetchCurrentUser()
      if (authStore.user) {
        Object.assign(user, {
          id: authStore.user.id || '',
          username: authStore.user.username || '',
          email: authStore.user.email || '',
          roleId: authStore.user.roleId || ''
        })
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }
}

const updateProfile = async () => {
  try {
    // Use cookies for authentication (credentials: 'include' in fetch)
    const response = await axios.put('http://localhost:3000/api/profile', {
      username: user.username,
      email: user.email
    }, {
      withCredentials: true
    })
    
    // Update auth store with new data
    authStore.user = response.data
    
    isEditing.value = false
    alert('Profile updated successfully!')
  } catch (error) {
    alert('Failed to update profile: ' + (error.response?.data?.message || 'Server error'))
  }
}

const updatePassword = async () => {
  try {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert('Please fill in all password fields')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match')
      return
    }

    await axios.put('http://localhost:3000/api/profile/password', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }, {
      withCredentials: true
    })
    
    // Clear password fields
    passwordData.currentPassword = ''
    passwordData.newPassword = ''
    passwordData.confirmPassword = ''
    
    alert('Password updated successfully!')
  } catch (error) {
    alert('Failed to update password: ' + (error.response?.data?.message || 'Server error'))
  }
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = `
    <div class="w-full h-full flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600">
      ${getInitials(user.username)}
    </div>
  `
}

onMounted(loadUserData)
</script>
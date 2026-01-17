<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">

      <!-- HEADER -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div class="flex items-center space-x-6">

          <!-- Avatar -->
          <div class="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {{ getInitials(user.firstName, user.lastName) }}
          </div>

          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ user.firstName }} {{ user.lastName }}
            </h1>
            <p class="text-gray-600">{{ user.email }}</p>
            <p class="text-sm text-gray-500 mt-1">
              Member since {{ formatDate() }}
            </p>
          </div>

          <div class="flex space-x-3">
            <button
              @click="isEditing = !isEditing"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition flex items-center space-x-2"
            >
              <Edit2 class="w-4 h-4" />
              <span>{{ isEditing ? 'Cancel' : 'Edit Profile' }}</span>
            </button>

            <button
              @click="showDeleteModal = true"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition flex items-center space-x-2"
            >
              <Trash2 class="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- FORM -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          Profile Information
        </h2>

        <form @submit.prevent="updateProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label class="block text-sm mb-2 text-gray-700">Username</label>
              <input
                v-model="user.username"
                :disabled="!isEditing"
                class="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                :class="{ 'bg-gray-100': !isEditing }"
              />
            </div>

            <div>
              <label class="block text-sm mb-2 text-gray-700">First Name</label>
              <input
                v-model="user.firstName"
                :disabled="!isEditing"
                class="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                :class="{ 'bg-gray-100': !isEditing }"
              />
            </div>

            <div>
              <label class="block text-sm mb-2 text-gray-700">Last Name</label>
              <input
                v-model="user.lastName"
                :disabled="!isEditing"
                class="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                :class="{ 'bg-gray-100': !isEditing }"
              />
            </div>

            <div>
              <label class="block text-sm mb-2 text-gray-700">Email</label>
              <input
                v-model="user.email"
                disabled
                class="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-600"
              />
            </div>

            <div>
              <label class="block text-sm mb-2 text-gray-700">Phone</label>
              <input
                v-model="user.phone"
                :disabled="!isEditing"
                class="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                :class="{ 'bg-gray-100': !isEditing }"
              />
            </div>

            <div>
              <label class="block text-sm mb-2 text-gray-700">Gender</label>
              <select
                v-model="user.gender"
                :disabled="!isEditing"
                class="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                :class="{ 'bg-gray-100': !isEditing }"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm mb-2 text-gray-700">Address</label>
              <textarea
                v-model="user.address"
                :disabled="!isEditing"
                rows="3"
                class="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                :class="{ 'bg-gray-100': !isEditing }"
              ></textarea>
            </div>
          </div>

          <div v-if="isEditing" class="flex justify-end space-x-3">
            <button
              type="button"
              @click="isEditing = false"
              class="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <!-- DELETE MODAL -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full">
          <h3 class="text-xl font-semibold text-red-600 mb-4">
            Delete Account
          </h3>
          <p class="text-gray-600 mb-6">
            Are you sure? This action cannot be undone.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              @click="deleteUser"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { Edit2, Trash2 } from 'lucide-vue-next'
import axios from 'axios'

const isEditing = ref(false)
const showDeleteModal = ref(false)

const user = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  gender: '',
  avatar: ''
})

const getInitials = (f, l) =>
  `${f?.charAt(0) || ''}${l?.charAt(0) || ''}`.toUpperCase()

const formatDate = () =>
  new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

const loadUserData = () => {
  const data = localStorage.getItem('user')
  if (data) Object.assign(user, JSON.parse(data))
}

const updateProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    console.log('User data being sent:', user);
    
    const response = await axios.put('http://localhost:3000/api/profile', user, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    localStorage.setItem('user', JSON.stringify(user));
    isEditing.value = false;
    alert('Profile updated successfully in database!');
    console.log('Database updated:', response.data);
  } catch (error) {
    console.error('Update error:', error.response?.data || error.message);
    alert('Failed to update profile: ' + (error.response?.data?.message || 'Server error'));
  }
}

const deleteUser = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete('http://localhost:3000/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    alert('Account deleted successfully from database!');
    window.location.href = '/login';
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete account: ' + (error.response?.data?.message || 'Server error'));
  }
}

onMounted(loadUserData)
</script>

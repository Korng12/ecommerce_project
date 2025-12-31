<template>
  <div class="fixed inset-0 w-full h-full bg-gray-300 flex items-center justify-center p-4 overflow-auto">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg">
        <div class="bg-white p-8 text-black">
          <h1 class="text-3xl text-center font-bold mb-2">WELCOME BACK</h1>
          <p class="text-gray-800 text-center">Welcome back! Please enter your details.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
          <!-- Email -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                v-model="formData.email"
                class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                class="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="*********"
                required
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <EyeOff v-if="showPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Remember / Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-purple-600 hover:text-purple-700 font-medium">Forgot password?</a>
          </div>

          <!-- Submit -->
          <button type="submit" class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">Sign In</button>

          <!-- Toggle -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Don't have an account? 
              <router-link to="/register" class="text-purple-600 font-semibold hover:text-purple-700">Register</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

const showPassword = ref(false)
const formData = reactive({ email: '', password: '' })

const handleSubmit = () => {
  console.log('Login:', { ...formData })
}

const togglePasswordVisibility = () => showPassword.value = !showPassword.value
</script>

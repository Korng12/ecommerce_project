<template>
  <div class="fixed inset-0 w-full h-full bg-gray-300 flex items-center justify-center p-4 overflow-auto">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg">
        <!-- Header -->
         <!-- Add this after the header div -->
<div v-if="formError" class="bg-red-50 border-l-4 border-red-500 p-4 mx-8">
  <p class="text-red-700">{{ formError }}</p>
</div>
        <div class="bg-white p-8 text-black">
          <h1 class="text-3xl  text-center font-bold mb-2">
            {{ isLogin ? 'WELCOME BACK' : 'WELCOME BACK' }}
          </h1>
          <p class="text-gray-800 text-center">
            {{ isLogin ? 'Welcome back! Please enter your details.' : 'Welcome back! Please enter your details.' }}
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
          <!-- Name Field (Sign Up Only) -->
          <div v-if="!isLogin" class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                v-model="formData.name"
                class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="John Doe"
                :required="!isLogin"
              />
            </div>
          </div>

          <!-- Email Field -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
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

          <!-- Password Field -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
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

          <!-- Confirm Password (Sign Up Only) -->
          <div v-if="!isLogin" class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.confirmPassword"
                class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="*********"
                :required="!isLogin"
              />
            </div>
          </div>

          <!-- Forgot Password (Login Only) -->
          <div v-if="isLogin" class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-purple-600 hover:text-purple-700 font-medium">
              Forgot password?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {{ isLogin ? 'Sign In' : 'Register' }}
          </button>


          <!-- Toggle Mode -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              {{ isLogin ? "Don't have an account? " : "Already have an account? " }}
              <button
                type="button"
                @click="toggleMode"
                class="text-purple-600 font-semibold hover:text-purple-700"
              >
                {{ isLogin ? 'Register' : 'Sign In' }}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-vue-next'

const isLogin = ref(true)
const showPassword = ref(false)
const formError = ref('')

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = () => {
   if (!formData.email.includes('@')) {
    formError.value = 'Please enter a valid email address'
    return
  }
  
  if (formData.password.length < 6) {
    formError.value = 'Password must be at least 6 characters'
    return
  }
  
  if (!isLogin.value && formData.password !== formData.confirmPassword) {
    formError.value = 'Passwords do not match'
    return
  }
  
  formError.value = '' // Clear error
  
  if (isLogin.value) {
    console.log('Login:', { 
      email: formData.email, 
      password: formData.password 
    })
  }  else {
    console.log('Sign Up:', formData)
  }
}

const resetForm = () => {
  formData.name = ''
  formData.email = ''
  formData.password = ''
  formData.confirmPassword = ''
  showPassword.value = false
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  resetForm()
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSocialLogin = (provider) => {
  console.log(`Social login with ${provider}`)
}
</script>
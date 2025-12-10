<template>
  <div class="fixed inset-0 w-full h-full bg-gray-300 flex items-center justify-center p-4 overflow-auto">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg">
        <!-- Header -->
        <div class="bg-gray-400 p-8 text-white">
          <h1 class="text-3xl font-bold mb-2">
            {{ isLogin ? 'Welcome Back!' : 'Create Account' }}
          </h1>
          <p class="text-purple-100">
            {{ isLogin ? 'Sign in to continue' : 'Sign up to get started' }}
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
                placeholder="••••••••"
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
                placeholder="••••••••"
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
            {{ isLogin ? 'Sign In' : 'Create Account' }}
          </button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              class="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
              @click="handleSocialLogin('google')"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
              @click="handleSocialLogin('facebook')"
            >
              <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>

          <!-- Toggle Mode -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              {{ isLogin ? "Don't have an account? " : "Already have an account? " }}
              <button
                type="button"
                @click="toggleMode"
                class="text-purple-600 font-semibold hover:text-purple-700"
              >
                {{ isLogin ? 'Sign Up' : 'Sign In' }}
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

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = () => {
  if (isLogin.value) {
    console.log('Login:', { 
      email: formData.email, 
      password: formData.password 
    })
  } else {
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
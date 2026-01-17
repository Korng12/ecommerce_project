<template>
  <div class="fixed inset-0 w-full h-full bg-gray-300 flex items-center justify-center p-4 overflow-auto">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div class="p-8 text-black text-center">
          <h1 class="text-3xl font-bold mb-2">WELCOME BACK</h1>
          <p class="text-gray-700">Welcome back! Please enter your details.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8 space-y-6">

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-2">Email Address</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                v-model="formData.email"
                class="w-full pl-12 py-3 border rounded-xl"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium mb-2">Password</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                class="w-full pl-12 pr-12 py-3 border rounded-xl"
                placeholder="********"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <EyeOff v-if="showPassword" />
                <Eye v-else />
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold"
          >
            Sign In
          </button>

          <p v-if="message" class="text-red-500 text-center">{{ message }}</p>

          <p class="text-center text-sm">
            Don't have an account?
            <router-link to="/register" class="text-blue-600 font-semibold">
              Register
            </router-link>
          </p>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const showPassword = ref(false);
const message = ref('');

const formData = reactive({
  email: '',
  password: ''
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/login', formData);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    router.push('/profile');
  } catch (err) {
    message.value = err.response?.data?.message || 'Login failed';
  }
};
</script>

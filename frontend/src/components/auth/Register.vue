<template>
  <div class="fixed inset-0 w-full h-full bg-gray-300 flex items-center justify-center p-4 overflow-auto">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div class="p-8 text-black text-center">
          <h1 class="text-3xl font-bold mb-2">CREATE ACCOUNT</h1>
          <p class="text-gray-700">Please fill in your details to register.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8 space-y-6">

          <!-- Username -->
          <div>
            <label class="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              v-model="formData.username"
              class="w-full py-3 px-4 border rounded-xl"
              placeholder="JohnDoe"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              v-model="formData.email"
              class="w-full py-3 px-4 border rounded-xl"
              placeholder="you@example.com"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              v-model="formData.password"
              class="w-full py-3 px-4 border rounded-xl"
              placeholder="********"
              required
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              v-model="formData.confirmPassword"
              class="w-full py-3 px-4 border rounded-xl"
              placeholder="********"
              required
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold"
          >
            Register
          </button>

          <p class="text-center text-sm">
            Already have an account?
            <router-link to="/login" class="text-blue-600 font-semibold">
              Sign In
            </router-link>
          </p>

          <p v-if="error" class="text-red-500 text-center">{{ error }}</p>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const error = ref('');
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const handleSubmit = async () => {
  if (!formData.username || !formData.email || !formData.password) {
    error.value = 'All fields are required';
    return;
  }

  if (formData.password.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    error.value = 'Passwords do not match';
    return;
  }

  try {
    await authStore.register(
      formData.username,
      formData.email,
      formData.password,
    );

    router.push('/app');

  } catch (err) {
    error.value = err?.message || 'Registration failed';
  }
};

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-black py-16">
    <div class="max-w-4xl mx-auto px-6">


      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
        <div class="h-48 bg-gradient-to-r via-black relative">
          <div class="absolute inset-0 bg-black/10"></div>
        </div>

        <div class="px-10 pb-10">
          <div class="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20">

            <div class="relative">
              <div
                class="w-36 h-36 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
                <img src="/profile.png" alt="Profile" class="w-full h-full object-cover" @error="handleImageError" />
              </div>
              <div
                class="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Account Settings</span>
              </div>
            </div>


            <div class="flex space-x-3">
              <button @click="isEditing = !isEditing"
                class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center space-x-3 font-semibold">
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
              <path
                d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input v-model="user.username" :disabled="!isEditing"
                  class="w-full pl-12 pr-5 py-4 rounded-2xl border-2 transition-all focus:outline-none text-lg"
                  :class="isEditing ? 'bg-white border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100' : 'bg-gray-50 border-gray-200 text-gray-600'"
                  placeholder="Enter username" />
              </div>
            </div>


            <div>
              <label class="block text-sm font-bold mb-3 text-gray-800 uppercase tracking-wide">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input v-model="user.email" type="email" :disabled="!isEditing"
                  class="w-full pl-12 pr-5 py-4 rounded-2xl border-2 transition-all focus:outline-none text-lg"
                  :class="isEditing ? 'bg-white border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100' : 'bg-gray-50 border-gray-200 text-gray-600'"
                  placeholder="Enter email" />
              </div>
            </div>

            <div v-if="isEditing" class="pt-6 border-t-2 border-gray-100">
              <label class="block text-sm font-bold mb-4 text-gray-800 uppercase tracking-wide flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </label>
              <div class="space-y-5 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl">
                <div class="relative">
                  <input v-model="passwordData.currentPassword" type="password"
                    class="w-full px-5 py-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 text-lg"
                    placeholder="Current password" />
                </div>
                <div class="relative">
                  <input v-model="passwordData.newPassword" type="password"
                    class="w-full px-5 py-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 text-lg"
                    placeholder="New password" />
                </div>
                <div class="relative">
                  <input v-model="passwordData.confirmPassword" type="password"
                    class="w-full px-5 py-4 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 text-lg"
                    placeholder="Confirm new password" />
                </div>
              </div>
            </div>

          </div>


          <div v-if="isEditing" class="flex justify-end space-x-4 pt-10 mt-10 border-t-2 border-gray-100">
            <button type="button" @click="isEditing = false"
              class="px-10 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all text-lg">
              Cancel
            </button>
            <button type="submit"
              class="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl text-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <!-- Current Cart -->
      <div class="bg-white rounded-3xl shadow-2xl p-10 mt-10">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart class="w-8 h-8 mr-3 text-indigo-600" />
            Current Cart
          </h2>
          <div class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-semibold">
            {{ cartStore.cartCount }} Items
          </div>
        </div>

        <div v-if="cartStore.loading" class="text-center py-8 text-gray-500">
          Loading cart...
        </div>

        <div v-else-if="cartStore.cart.length === 0" class="text-center py-12">
          <ShoppingCart class="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p class="text-gray-500 text-lg">Your cart is empty</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="item in cartStore.cart" :key="item.id"
            class="flex items-center space-x-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-indigo-200 transition-all">
            <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-xl" />
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ item.brand }}</p>
              <p class="text-sm text-gray-600">Qty: {{ item.quantity }}</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-bold text-indigo-600">${{ formatPrice(item.price * item.quantity) }}</p>
              <p class="text-sm text-gray-500">${{ formatPrice(item.price) }} each</p>
            </div>
          </div>

          <div class="border-t-2 border-gray-200 pt-4 mt-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-semibold">${{ formatPrice(cartStore.subtotal) }}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">Tax (8%):</span>
              <span class="font-semibold">${{ formatPrice(cartStore.tax) }}</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="text-gray-600">Shipping:</span>
              <span class="font-semibold">${{ cartStore.shipping === 0 ? 'FREE' : formatPrice(cartStore.shipping)
                }}</span>
            </div>
            <div
              class="flex justify-between items-center text-xl font-bold text-gray-900 pt-4 border-t-2 border-gray-200">
              <span>Total:</span>
              <span class="text-indigo-600">${{ formatPrice(cartStore.total) }}</span>
            </div>

            <button @click="goToCheckout" :disabled="cartStore.cart.length === 0"
              class="w-full mt-6 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center space-x-2">
              <ShoppingCart class="w-5 h-5" />
              <span>Proceed to Checkout</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Order History -->
      <div class="bg-white rounded-3xl shadow-2xl p-10 mt-10">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900 flex items-center">
            <Package class="w-8 h-8 mr-3 text-purple-600" />
            Order History
          </h2>
          <div class="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-semibold">
            {{ orderStore.orders.length }} Orders
          </div>
        </div>

        <div v-if="orderStore.loading" class="text-center py-8 text-gray-500">
          Loading orders...
        </div>

        <div v-else-if="orderStore.orders.length === 0" class="text-center py-12">
          <ShoppingBag class="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p class="text-gray-500 text-lg">No orders yet</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="order in orderStore.orders" :key="order.id"
            class="border-2 border-gray-100 rounded-2xl p-6 hover:border-purple-200 transition-all">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Order #{{ order.id }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ formatDate(order.createdAt) }}</p>
              </div>
              <span :class="[
                'px-4 py-2 rounded-full text-sm font-semibold',
                order.status === 'paid' || order.status === 'completed' ? 'bg-green-100 text-green-700' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
              ]">
                {{ order.status }}
              </span>
            </div>

            <div class="space-y-2 mb-4">
              <div v-for="item in order.orderItems" :key="item.id" class="flex justify-between text-sm">
                <span class="text-gray-600">{{ item.orderProduct?.name || 'Product' }} × {{ item.quantity }}</span>
                <span class="font-semibold">${{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>

            <div class="border-t-2 border-gray-100 pt-4 flex justify-between items-center">
              <span class="text-gray-600 font-semibold">Total Amount:</span>
              <span class="text-2xl font-bold text-purple-600">${{ formatPrice(order.totalAmount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { Edit2, ShoppingBag, ShoppingCart, Package } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useOrder } from '@/stores/order'
import { useCart } from '@/stores/carts'
import { useProfile } from '@/stores/profile'

const isEditing = ref(false)
const router = useRouter()
const orderStore = useOrder()
const cartStore = useCart()
const profileStore = useProfile()

const user = computed(() => ({
  username: profileStore.user.username,
  email: profileStore.user.email
}))

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const getInitials = (username) =>
  username ? username.charAt(0).toUpperCase() : 'U'

const loadUserData = async () => {
  // Load profile from server
  await profileStore.fetchProfile()

  // Load orders and cart
  await Promise.all([
    orderStore.fetchOrders(),
    cartStore.getCart()
  ])
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}

const goToCheckout = () => {
  router.push('/checkoutView')
}

const updateProfile = async () => {
  try {
    // Update password if provided
    if (passwordData.newPassword) {
      if (!passwordData.currentPassword) {
        alert('Please enter current password')
        return
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('New passwords do not match')
        return
      }

      await profileStore.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      )

      passwordData.currentPassword = ''
      passwordData.newPassword = ''
      passwordData.confirmPassword = ''
    }

    // Update profile
    await profileStore.updateProfile(
      user.value.username,
      user.value.email
    )

    isEditing.value = false
    alert('Profile updated successfully!')
  } catch (error) {
    alert('Failed to update profile: ' + (error.message || 'Server error'))
  }
}

const handleImageError = (event) => {
  event.target.style.display = 'none';
  event.target.parentElement.innerHTML = `
    <div class="w-full h-full flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600">
      ${getInitials(user.username)}
    </div>
  `;
}

onMounted(loadUserData)
</script>
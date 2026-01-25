<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Orders</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Total Orders" :value="orderStore.orders.length" change="+15.3% from last month"
        icon="ShoppingCart" icon-color="blue" />

      <StatCard title="Revenue" :value="orderStore.totalRevenue" change="+12.5% from last month" icon="DollarSign"
        icon-color="green" />

      <StatCard title="Avg. Order Value" :value="orderStore.avgOrderValue" change="+8.2% from last month"
        icon="TrendingUp" icon-color="purple" />
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="order in orderStore.orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-800 font-medium">#{{ order.id }}</td>
            <td class="px-6 py-4 text-gray-600">{{ order.userOrder?.username || order.userOrder?.email || 'N/A' }}</td>
            <td class="px-6 py-4 text-gray-800 font-semibold">${{ order.totalAmount }}</td>
            <td class="px-6 py-4">
              <span :class="['px-3 py-1 rounded-full text-sm', statusClasses[order.status]]">
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ new Date(order.createdAt).toLocaleDateString('en-US', {
              year:
                'numeric', month: 'short', day: 'numeric'
            }) }}</td>
            <td class="px-6 py-4">
              <button class="text-blue-600 hover:text-blue-800 text-sm" @click="openDetails(order)">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        <button class="absolute top-3 right-3 text-gray-500 hover:text-gray-700" @click="closeDetails">✕</button>
        <h2 class="text-2xl font-semibold mb-4">Order #{{ selectedOrder.id }}</h2>

        <div class="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-700">
          <div>
            <p class="font-semibold">Customer</p>
            <p>{{ selectedOrder.userOrder?.username || selectedOrder.userOrder?.email || 'N/A' }}</p>
          </div>
          <div>
            <p class="font-semibold">Status</p>
            <p class="inline-block px-3 py-1 rounded-full" :class="statusClasses[selectedOrder.status]">
              {{ selectedOrder.status }}
            </p>
          </div>
          <div>
            <p class="font-semibold">Total Amount</p>
            <p>${{ selectedOrder.totalAmount }}</p>
          </div>
          <div>
            <p class="font-semibold">Date</p>
            <p>{{ formatDate(selectedOrder.createdAt) }}</p>
          </div>
        </div>

        <div class="border rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Product</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Qty</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Price</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in selectedOrder.orderItems || []" :key="item.id">
                <td class="px-4 py-2 text-gray-800">{{ item.orderProduct?.name || 'Product' }}</td>
                <td class="px-4 py-2 text-gray-600">{{ item.quantity }}</td>
                <td class="px-4 py-2 text-gray-800">${{ item.price }}</td>
              </tr>
              <tr v-if="!selectedOrder.orderItems || selectedOrder.orderItems.length === 0">
                <td class="px-4 py-3 text-center text-gray-500" colspan="3">No items found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatCard from './StatCard.vue'
import { onMounted, ref } from 'vue'
import { useOrder } from '@/stores/order'

const orderStore = useOrder()
const selectedOrder = ref(null)

// Fetch orders when component mounts
onMounted(() => {
  orderStore.getAdminOrders()
})

const openDetails = (order) => {
  selectedOrder.value = order
}

const closeDetails = () => {
  selectedOrder.value = null
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Status CSS classes - match backend statuses
const statusClasses = {
  'paid': 'bg-green-100 text-green-700',
  'pending': 'bg-yellow-100 text-yellow-700',
  'processing': 'bg-blue-100 text-blue-700',
  'cancelled': 'bg-red-100 text-red-700',
  'completed': 'bg-green-100 text-green-700',
  'failed': 'bg-red-100 text-red-700',
}
</script>
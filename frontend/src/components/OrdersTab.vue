<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Orders</h1>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="Total Orders"
        value="1,234"
        change="+15.3% from last month"
        icon="ShoppingCart"
        icon-color="blue"
      />
      
      <StatCard 
        title="Revenue"
        value="$54,239"
        change="+12.5% from last month"
        icon="DollarSign"
        icon-color="green"
      />
      
      <StatCard 
        title="Avg. Order Value"
        value="$44.12"
        change="+8.2% from last month"
        icon="TrendingUp"
        icon-color="purple"
      />
    </div>
    
    <!-- Orders Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
           <th @click="handleSort('orderId')" class="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100">
           Order ID</th>
           <th @click="handleSort('customer')" class="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100">
          Customer</th>
           <th @click="handleSort('amount')" class="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100">
           Amount</th>
           <th @click="handleSort('status')" class="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100">
           Status</th>
           <th @click="handleSort('date')" class="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100">
           Date</th>
           <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="order in sortedOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-800 font-medium">{{ order.orderId }}</td>
            <td class="px-6 py-4 text-gray-600">{{ order.customer }}</td>
            <td class="px-6 py-4 text-gray-800 font-semibold">{{ order.amount }}</td>
            <td class="px-6 py-4">
              <span :class="['px-3 py-1 rounded-full text-sm', statusClasses[order.status]]">
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ order.date }}</td>
            <td class="px-6 py-4">
              <button class="text-blue-600 hover:text-blue-800 text-sm">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import StatCard from './StatCard.vue'
import { ref, computed } from 'vue'

// Mock orders data
const orders = ref([ // CHANGE to ref
  { id: 1, orderId: '#ORD-001', customer: 'Alice Cooper', amount: '$299.00', status: 'Delivered', date: 'Dec 8, 2025' },
  { id: 2, orderId: '#ORD-002', customer: 'Bob Wilson', amount: '$149.00', status: 'Processing', date: 'Dec 9, 2025' },
  { id: 3, orderId: '#ORD-003', customer: 'Carol Davis', amount: '$499.00', status: 'Pending', date: 'Dec 9, 2025' },
  { id: 4, orderId: '#ORD-004', customer: 'David Miller', amount: '$89.00', status: 'Delivered', date: 'Dec 7, 2025' },
  { id: 5, orderId: '#ORD-005', customer: 'Emma Wilson', amount: '$199.00', status: 'Cancelled', date: 'Dec 6, 2025' },
])

const sortBy = ref('date') 
const sortOrder = ref('desc')

const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) => {
    let aVal = a[sortBy.value]
    let bVal = b[sortBy.value]
    
    // Handle dates
    if (sortBy.value === 'date') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    
    // Handle amounts
    if (sortBy.value === 'amount') {
      aVal = parseFloat(aVal.replace('$', ''))
      bVal = parseFloat(bVal.replace('$', ''))
    }
    
    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
})

// Status CSS classes
const statusClasses = {
  'Delivered': 'bg-green-100 text-green-700',
  'Processing': 'bg-blue-100 text-blue-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Cancelled': 'bg-red-100 text-red-700',
}
const handleSort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'desc'
  }
}
</script>
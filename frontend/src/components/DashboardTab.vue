<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      <div class="flex items-center gap-2">
        <select
          class="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
        <button @click="refreshDashboard" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          ↻ Refresh
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          Export
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <StatCard title="Total Revenue" :value="formattedRevenue" change="From all paid orders" icon="DollarSign"
        icon-color="blue" />

      <StatCard title="Total Users" :value="formattedUsers" change="Active customers" icon="Users" icon-color="green" />

      <StatCard title="Total Orders" :value="formattedOrders" change="Successfully completed" icon="Package"
        icon-color="purple" />

      <StatCard title="Cart Abandonment" :value="formattedAbandonmentRate" change="Of total carts" icon="ShoppingCart"
        icon-color="orange" />
    </div>

    <!-- Two Column Layout for larger screens -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-2">
        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 h-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Recent Activity</h2>
            <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div v-if="loading" class="text-center py-8 text-gray-500">
            Loading...
          </div>
          <div v-else-if="recentOrders.length === 0" class="text-center py-8 text-gray-500">
            No recent activity
          </div>
          <div v-else class="space-y-3 sm:space-y-4">
            <ActivityItem v-for="order in recentOrders" :key="order.id"
              :title="`Order #${order.id} - $${parseFloat(order.totalAmount).toFixed(2)}`"
              :time="formatTimeAgo(order.createdAt)" :status="order.status"
              :status-color="getStatusColor(order.status)" />
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-gray-600">Conversion Rate</span>
              <span class="text-sm font-semibold text-green-600">4.7%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" style="width: 47%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-gray-600">Customer Satisfaction</span>
              <span class="text-sm font-semibold text-blue-600">92%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full" style="width: 92%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-gray-600">Avg. Response Time</span>
              <span class="text-sm font-semibold text-purple-600">12m</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full" style="width: 80%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <ChartContainer title="Revenue Overview">
        <div class="h-60 sm:h-80">
          <BarChart :data="revenueChartData" :title="''" />
        </div>
      </ChartContainer>

      <ChartContainer title="Sales by Category">
        <div class="h-60 sm:h-80">
          <PieChart :data="categoryChartData" :title="''" />
        </div>
      </ChartContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import StatCard from './StatCard.vue'
import ActivityItem from './ActivityItem.vue'
import ChartContainer from './ChartContainer.vue'
import BarChart from './BarChart.vue'
import PieChart from './PieChart.vue'
import { useAnalytics } from '@/stores/analytics'
const analytics = useAnalytics()
// Computed values from store
const loading = computed(() => analytics.loading)
const formattedRevenue = computed(() => `$${(analytics.keyMetrics.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
const formattedOrders = computed(() => Number(analytics.keyMetrics.totalOrders || 0).toLocaleString())
const formattedUsers = computed(() => Number(analytics.keyMetrics.totalUsers || 0).toLocaleString())
const formattedAbandonmentRate = computed(() => `${analytics.keyMetrics.cartAbandonmentRate || 0}%`)
// Use store outputs directly
const recentOrders = computed(() => analytics.recentOrders || [])

// Fetch all analytics data on mount
onMounted(() => {
  analytics.fetchAllAnalytics()
})

// Refresh handler
const refreshDashboard = async () => {
  await analytics.fetchAllAnalytics()
}

// Helper functions
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
}

const getStatusColor = (status) => {
  const colors = {
    'paid': 'green',
    'completed': 'green',
    'pending': 'yellow',
    'processing': 'blue',
    'cancelled': 'red',
    'failed': 'red'
  }
  return colors[status] || 'gray'
}

// Revenue Chart Data (computed from trend data)
// Charts: use store getters so data stays in one place
const revenueChartData = computed(() => analytics.revenueTrendChartData)

// Category Chart Data (computed from category revenue)
const categoryChartData = computed(() => analytics.categoryChartData)

</script>
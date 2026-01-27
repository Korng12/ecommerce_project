<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">
        Dashboard Overview
      </h1>

      <div class="flex items-center gap-2">
        <select
          class="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>

        <button
          class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <StatCard
        title="Total Revenue"
        :value="analyticsStore.loading ? '...' : formatRevenue(analyticsStore.keyMetrics.totalRevenue)"
        change="+12.5% from last month"
        icon="DollarSign"
        icon-color="blue"
      />

      <StatCard
        title="Total Users"
        :value="analyticsStore.loading ? '...' : formatNumber(analyticsStore.keyMetrics.totalUsers)"
        change="+8.2% from last month"
        icon="UserCheck"
        icon-color="green"
      />

      <StatCard
        title="Total Orders"
        :value="analyticsStore.loading ? '...' : formatNumber(analyticsStore.keyMetrics.totalOrders)"
        change="+15.3% from last month"
        icon="Package"
        icon-color="purple"
      />

      <StatCard
        title="Cart Abandonment"
        :value="analyticsStore.loading ? '...' : formatPercentage(analyticsStore.keyMetrics.cartAbandonmentRate)"
        change="Rate of abandoned carts"
        icon="TrendingUp"
        icon-color="orange"
      />
    </div>

    <!-- Activity + Quick Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="lg:col-span-2">
        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 h-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-800">
              Recent Activity
            </h2>
            <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>

          <div class="space-y-4">
            <ActivityItem 
              v-for="(order, index) in analyticsStore.dailyOrders.slice(0, 4)" 
              :key="index"
              :title="`${order.orders} orders | ${formatRevenue(order.revenue)}`" 
              :time="new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })" 
              :status="order.orders > 5 ? 'High' : 'Normal'" 
              :status-color="order.orders > 5 ? 'green' : 'blue'" 
            />
            <div v-if="analyticsStore.dailyOrders.length === 0" class="text-center text-gray-400 py-4">
              No recent activity
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Quick Stats
        </h2>

        <div class="space-y-4">
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-sm text-gray-600">Conversion Rate</span>
              <span class="text-sm font-semibold text-green-600">{{ conversionRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" :style="`width: ${Math.min(conversionRate, 100)}%`"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-1">
              <span class="text-sm text-gray-600">Customer Satisfaction</span>
              <span class="text-sm font-semibold text-blue-600">92%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full" style="width: 92%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <ChartContainer title="Revenue Overview">
        <div class="h-60 sm:h-80">
          <BarChart :data="analyticsStore.revenueTrendChartData" />
        </div>
      </ChartContainer>

      <ChartContainer title="Sales by Category">
        <div class="h-60 sm:h-80">
          <PieChart :data="analyticsStore.categoryChartData" />
        </div>
      </ChartContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAnalytics } from '@/stores/analytics'

import StatCard from '@/components/admin/StatCard.vue'
import ActivityItem from '@/components/admin/ActivityItem.vue'
import ChartContainer from '@/components/admin/ChartContainer.vue'
import BarChart from '@/components/admin/BarChart.vue'
import PieChart from '@/components/admin/PieChart.vue'

// ==========================
// STORE
// ==========================
const analyticsStore = useAnalytics()

// ==========================
// FORMATTING UTILITIES
// ==========================
const formatRevenue = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

const formatPercentage = (value) => {
  return `${parseFloat(value).toFixed(1)}%`
}

// ==========================
// COMPUTED PROPERTIES
// ==========================
const conversionRate = computed(() => {
  if (analyticsStore.keyMetrics.totalUsers > 0) {
    return ((analyticsStore.keyMetrics.totalOrders / analyticsStore.keyMetrics.totalUsers) * 100).toFixed(1)
  }
  return 0
})

// ==========================
// LIFECYCLE
// ==========================
onMounted(() => {
  analyticsStore.fetchAllAnalytics()
})
</script>

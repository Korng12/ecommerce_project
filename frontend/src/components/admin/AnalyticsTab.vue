<template>
  <div>
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>

    <!-- Loading State -->
    <div v-if="analyticsStore.loading" class="bg-blue-50 p-4 rounded-lg mb-6">
      <p class="text-blue-700">Loading analytics data...</p>
    </div>

    <!-- Error State -->
    <div v-if="analyticsStore.error" class="bg-red-50 p-4 rounded-lg mb-6">
      <p class="text-red-700">Error: {{ analyticsStore.error }}</p>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <StatCard title="Total Revenue" :value="formatRevenue(analyticsStore.keyMetrics.totalRevenue)"
        change="From completed orders" icon="DollarSign" icon-color="green" />

      <StatCard title="Total Orders" :value="formatNumber(analyticsStore.keyMetrics.totalOrders)"
        change="Completed orders" icon="ShoppingBag" icon-color="blue" />

      <StatCard title="Active Users" :value="formatNumber(analyticsStore.keyMetrics.totalUsers)"
        change="Users with orders" icon="Users" icon-color="purple" />

      <StatCard title="Cart Abandonment" :value="formatPercentage(analyticsStore.keyMetrics.cartAbandonmentRate)"
        change="Abandoned carts" icon="ShoppingCart" icon-color="red" />
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <ChartContainer title="Revenue by Brand">
        <div class="h-60 sm:h-80">
          <BarChart :data="brandChartData" :title="''" />
        </div>
      </ChartContainer>

      <ChartContainer title="Daily Orders (Last 7 Days)">
        <div class="h-60 sm:h-80">
          <LineChart :data="dailyOrdersChartData" :title="''" />
        </div>
      </ChartContainer>
    </div>

    <!-- Charts Row 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <ChartContainer title="Revenue by Category">
        <div class="h-60 sm:h-80">
          <DoughnutChart :data="categoryChartData" :title="''" />
        </div>
      </ChartContainer>

      <ChartContainer title="Revenue Trend (Last 6 Months)">
        <div class="h-60 sm:h-80">
          <LineChart :data="revenueTrendChartData" :title="''" />
        </div>
      </ChartContainer>
    </div>

    <!-- Performance Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800">Top Performing Products</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-max">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Product</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Sales</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Revenue</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Growth</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="product in topProducts" :key="product.id" class="hover:bg-gray-50">
              <td class="px-4 sm:px-6 py-4 text-gray-800 font-medium">{{ product.name }}</td>
              <td class="px-4 sm:px-6 py-4 text-gray-600">{{ product.sales }}</td>
              <td class="px-4 sm:px-6 py-4 text-gray-800 font-semibold">{{ product.revenue }}</td>
              <td class="px-4 sm:px-6 py-4">
                <span :class="['px-3 py-1 rounded-full text-xs sm:text-sm',
                  product.growth >= 10 ? 'bg-green-100 text-green-700' :
                    product.growth >= 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700']">
                  {{ product.growth > 0 ? '+' : '' }}{{ product.growth }}%
                </span>
              </td>
            </tr>
            <tr v-if="topProducts.length === 0">
              <td colspan="4" class="px-4 sm:px-6 py-8 text-center text-gray-500">
                No product data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAnalytics } from '@/stores/analytics'
import StatCard from '@/components/admin/StatCard.vue'
import ChartContainer from '@/components/admin/ChartContainer.vue'
import BarChart from '@/components/admin/BarChart.vue'
import LineChart from '@/components/admin/LineChart.vue'
import DoughnutChart from '@/components/admin/DoughnutChart.vue'

const analyticsStore = useAnalytics()

// Fetch all analytics data on mount
onMounted(() => {
  analyticsStore.fetchAllAnalytics()
})

// Computed properties for reactive data
const topProducts = computed(() => analyticsStore.topProducts)
const brandChartData = computed(() => analyticsStore.brandChartData)
const dailyOrdersChartData = computed(() => analyticsStore.dailyOrdersChartData)
const categoryChartData = computed(() => analyticsStore.categoryChartData)
const revenueTrendChartData = computed(() => analyticsStore.revenueTrendChartData)

// Format numbers for display
const formatRevenue = (value) => {
  return `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatNumber = (value) => {
  return parseFloat(value).toLocaleString('en-US')
}

const formatPercentage = (value) => {
  return `${parseFloat(value).toFixed(1)}%`
}
</script>
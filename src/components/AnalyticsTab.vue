<template>
  <div>
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
    
    <!-- Key Metrics -->
    <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <StatCard 
        title="Page Views"
        value="45.2K"
        change="+18.2% vs last week"
        icon="Activity"
        icon-color="blue"
      />
      
      <StatCard 
        title="Bounce Rate"
        value="32.5%"
        change="-5.1% improvement"
        icon="TrendingUp"
        icon-color="red"
      />
      
      <StatCard 
        title="Avg. Session"
        value="4m 32s"
        change="+22s increase"
        icon="Globe"
        icon-color="purple"
      />
      
      <StatCard 
        title="Conversions"
        value="1,234"
        change="+8.4% vs last week"
        icon="ShoppingBag"
        icon-color="green"
      />
    </div>
    
    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <ChartContainer title="Traffic Sources">
        <div class="h-60 sm:h-80">
          <BarChart :data="trafficChartData" :title="''" />
        </div>
      </ChartContainer>
      
      <ChartContainer title="Daily Visitors">
        <div class="h-60 sm:h-80">
          <LineChart :data="dailyVisitorsChartData" :title="''" />
        </div>
      </ChartContainer>
    </div>

    <!-- Charts Row 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <ChartContainer title="Sales by Region">
        <div class="h-60 sm:h-80">
          <DoughnutChart :data="regionChartData" :title="''" />
        </div>
      </ChartContainer>

      <ChartContainer title="Revenue Trend (6 Months)">
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
                             product.growth >= 10 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700']">
                  {{ product.growth > 0 ? '+' : '' }}{{ product.growth }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCard from './StatCard.vue'
import ChartContainer from './ChartContainer.vue'
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'
import DoughnutChart from './DoughnutChart.vue'

// Mock data
const topProducts = [
  { id: 1, name: 'Wireless Headphones', sales: '1,234', revenue: '$98,720', growth: 24 },
  { id: 2, name: 'Smart Watch Pro', sales: '892', revenue: '$71,360', growth: 18 },
  { id: 3, name: 'Laptop Stand', sales: '756', revenue: '$45,360', growth: 12 },
  { id: 4, name: 'USB-C Hub', sales: '623', revenue: '$31,150', growth: 5 },
  { id: 5, name: 'Wireless Mouse', sales: '512', revenue: '$20,480', growth: -2 },
]

// Traffic Sources Chart Data
const trafficChartData = ref({
  labels: ['Direct', 'Social Media', 'Search', 'Email', 'Referral'],
  datasets: [
    {
      label: 'Visitors',
      data: [4200, 3800, 3200, 2400, 1800],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6'
      ],
      borderRadius: 6,
    }
  ]
})

// Daily Visitors Chart Data
const dailyVisitorsChartData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Visitors',
      data: [320, 380, 290, 450, 520, 480, 410],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#3B82F6',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]
})

// Region Chart Data
const regionChartData = ref({
  labels: ['North America', 'Europe', 'Asia', 'South America', 'Africa'],
  datasets: [
    {
      data: [5200, 4100, 6800, 2300, 1500],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6'
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 15
    }
  ]
})

// Revenue Trend Chart Data
const revenueTrendChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [4200, 5100, 3800, 6200, 5800, 7200],
      borderColor: '#3B82F6',
      backgroundColor: 'transparent',
      borderWidth: 3,
      tension: 0.4,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#3B82F6',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    },
    {
      label: 'Profit',
      data: [1800, 2300, 1600, 3100, 2900, 3800],
      borderColor: '#10B981',
      backgroundColor: 'transparent',
      borderWidth: 3,
      tension: 0.4,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#10B981',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]
})
</script>
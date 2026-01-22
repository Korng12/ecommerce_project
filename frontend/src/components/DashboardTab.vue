<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      <div class="flex items-center gap-2">
        <select class="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
      <StatCard 
        title="Total Revenue"
        value="$54,239"
        change="+12.5% from last month"
        icon="DollarSign"
        icon-color="blue"
      />
      
      <StatCard
  title="Total Users"
  :value="totalUsers"
  change="+8.2% from last month"
  icon="UserCheck"
  icon-color="green"
/>

      
      <StatCard 
        title="Total Orders"
        value="1,234"
        change="+15.3% from last month"
        icon="Package"
        icon-color="purple"
      />
      
      <StatCard 
        title="Growth Rate"
        value="23.5%"
        change="+4.1% from last month"
        icon="TrendingUp"
        icon-color="orange"
      />
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
          <div class="space-y-3 sm:space-y-4">
            <ActivityItem 
              title="New order #1234"
              time="2 minutes ago"
              status="Completed"
              status-color="green"
            />
            <ActivityItem 
              title="User registration"
              time="15 minutes ago"
              status="New"
              status-color="blue"
            />
            <ActivityItem 
              title="Payment received"
              time="1 hour ago"
              status="Success"
              status-color="green"
            />
            <ActivityItem 
              title="Low stock alert"
              time="2 hours ago"
              status="Warning"
              status-color="yellow"
            />
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
import { ref } from 'vue'
import StatCard from './StatCard.vue'
import ActivityItem from './ActivityItem.vue'
import ChartContainer from './ChartContainer.vue'
import BarChart from './BarChart.vue'
import PieChart from './PieChart.vue'
import StatCard from '@/components/StatCard.vue'

import { ref, onMounted } from 'vue'
import axios from 'axios'

const totalUsers = ref(0)

const loadStats = async () => {
  try {
    const res = await axios.get(
      'http://localhost:3000/dashboard/stats',
      { withCredentials: true }
    )

    console.log('STATS RESPONSE 👉', res.data)

    totalUsers.value = res.data.totalUsers
  } catch (err) {
    console.error('Dashboard stats error:', err)
  }
}




const refreshDashboard = () => {
  console.log('Refreshing dashboard data...')
}

// Revenue Chart Data
const revenueChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [4200, 5100, 3800, 6200, 5800, 7200],
      backgroundColor: '#3B82F6',
      borderRadius: 6,
      borderSkipped: false,
    },
    {
      label: 'Expenses',
      data: [2400, 2800, 2200, 3100, 2900, 3400],
      backgroundColor: '#EF4444',
      borderRadius: 6,
      borderSkipped: false,
    },
    {
      label: 'Profit',
      data: [1800, 2300, 1600, 3100, 2900, 3800],
      backgroundColor: '#10B981',
      borderRadius: 6,
      borderSkipped: false,
    }
  ]
})

// Category Chart Data
const categoryChartData = ref({
  labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Others'],
  datasets: [
    {
      data: [4500, 3200, 2800, 1900, 1600],
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
onMounted(loadStats)
</script>
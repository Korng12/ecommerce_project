<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Revenue"
        value="$54,239"
        change="+12.5% from last month"
        icon="DollarSign"
        icon-color="blue"
      />
      
      <StatCard 
        title="Total Users"
        value="2,847"
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
    
    <!-- Recent Activity -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <div class="space-y-4">
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
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartContainer title="Revenue Overview">
        <div class="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center text-gray-500">
            <p class="text-lg font-semibold">Revenue Chart</p>
            <p class="text-sm mt-2">(Chart would appear here with Chart.js)</p>
          </div>
        </div>
      </ChartContainer>

      <ChartContainer title="Sales by Category">
        <div class="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center text-gray-500">
            <p class="text-lg font-semibold">Pie Chart</p>
            <p class="text-sm mt-2">(Chart would appear here with Chart.js)</p>
          </div>
        </div>
      </ChartContainer>
    </div>
  </div>
</template>

<script setup>
import StatCard from './StatCard.vue'
import ActivityItem from './ActivityItem.vue'
import ChartContainer from './ChartContainer.vue'
</script>
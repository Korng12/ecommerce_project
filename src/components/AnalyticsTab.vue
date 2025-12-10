<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
    
    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartContainer title="Traffic Sources">
        <div class="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center text-gray-500">
            <p class="text-lg font-semibold">Traffic Chart</p>
            <p class="text-sm mt-2">(Chart would appear here)</p>
          </div>
        </div>
      </ChartContainer>
      
      <ChartContainer title="Daily Visitors">
        <div class="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center text-gray-500">
            <p class="text-lg font-semibold">Visitors Chart</p>
            <p class="text-sm mt-2">(Chart would appear here)</p>
          </div>
        </div>
      </ChartContainer>
    </div>
    
    <!-- Performance Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800">Top Performing Products</h3>
      </div>
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sales</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Growth</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="product in topProducts" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-gray-800 font-medium">{{ product.name }}</td>
            <td class="px-6 py-4 text-gray-600">{{ product.sales }}</td>
            <td class="px-6 py-4 text-gray-800 font-semibold">{{ product.revenue }}</td>
            <td class="px-6 py-4">
              <span :class="['px-3 py-1 rounded-full text-sm', 
                           product.growth >= 10 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700']">
                {{ product.growth > 0 ? '+' : '' }}{{ product.growth }}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import StatCard from './StatCard.vue'
import ChartContainer from './ChartContainer.vue'

// Mock data
const topProducts = [
  { id: 1, name: 'Wireless Headphones', sales: '1,234', revenue: '$98,720', growth: 24 },
  { id: 2, name: 'Smart Watch Pro', sales: '892', revenue: '$71,360', growth: 18 },
  { id: 3, name: 'Laptop Stand', sales: '756', revenue: '$45,360', growth: 12 },
  { id: 4, name: 'USB-C Hub', sales: '623', revenue: '$31,150', growth: 5 },
  { id: 5, name: 'Wireless Mouse', sales: '512', revenue: '$20,480', growth: -2 },
]
</script>
 <template>
  
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar Component -->
    <Sidebar 
      :sidebar-open="sidebarOpen"
      :active-tab="activeTab"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
      @change-tab="activeTab = $event"
    />
    
    <!-- Main Content Area -->
    <div class="flex-1 overflow-auto">
      <!-- Top Navigation Bar Component -->
      <TopNav 
        :unread-count="unreadCount"
        :show-notifications="showNotifications"
        @toggle-notifications="showNotifications = !showNotifications"
      />
      <!-- Page Content -->
      <div class="p-8">
        <!-- Dynamic Content based on Active Tab -->
        <DashboardTab v-if="activeTab === 'dashboard'" />
        <UsersTab v-else-if="activeTab === 'users'" />
        <OrdersTab v-else-if="activeTab === 'orders'" />
        <AnalyticsTab v-else-if="activeTab === 'analytics'" />
        <SettingsTab v-else-if="activeTab === 'settings'" />
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from './components/Sidebar.vue'
import TopNav from './components/TopNav.vue'
import DashboardTab from './components/DashboardTab.vue'
import UsersTab from './components/UsersTab.vue'
import OrdersTab from './components/OrdersTab.vue'
import AnalyticsTab from './components/AnalyticsTab.vue'
import SettingsTab from './components/SettingsTab.vue'
import AuthForm from './components/AuthForm.vue'

// State
const sidebarOpen = ref(true)
const activeTab = ref('dashboard')
const showNotifications = ref(false)

// Mock notifications data
const notifications = ref([
  { id: 1, title: 'New Order Received', message: 'Order #1234 has been placed', time: '5 min ago', read: false },
  { id: 2, title: 'User Registration', message: 'New user signed up', time: '15 min ago', read: false },
  { id: 3, title: 'Payment Successful', message: 'Payment of $299 received', time: '1 hour ago', read: true },
  { id: 4, title: 'Low Stock Alert', message: 'Product XYZ running low', time: '2 hours ago', read: true },
  { id: 5, title: 'System Update', message: 'System maintenance scheduled', time: '1 day ago', read: true },
])

// Computed property
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
</script>

<style scoped>
/* Add global styles here if needed */
</style>

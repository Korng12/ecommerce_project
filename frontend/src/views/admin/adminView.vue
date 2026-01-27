<template>

  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar Component -->
    <Sidebar :sidebar-open="sidebarOpen" :active-tab="activeTab" @toggle-sidebar="sidebarOpen = !sidebarOpen"
      @change-tab="activeTab = $event" />

    <!-- Main Content Area -->
    <div class="flex-1 overflow-auto">
      <!-- Top Navigation Bar Component -->
      <TopNav :unread-count="notificationStore.unreadCount" :show-notifications="showNotifications"
        :notifications="notificationStore.notifications" @toggle-notifications="toggleNotifications"
        @view-all-notifications="viewAllNotifications" />
      <!-- Page Content -->
      <div class="p-8">
        <!-- Dynamic Content based on Active Tab -->
        <DashboardTab v-if="activeTab === 'dashboard'" />
        <UsersTab v-else-if="activeTab === 'users'" />
        <Products v-else-if="activeTab === 'products'" />
        <Promotions v-else-if="activeTab === 'promotions'" />
        <CategoriesTab v-else-if="activeTab === 'categories'" />
        <OrdersTab v-else-if="activeTab === 'orders'" />
        <NotificationsTab v-else-if="activeTab === 'notifications'" :notifications="notificationStore.notifications"
          :onUpdate="updateNotifications" />
        <AnalyticsTab v-else-if="activeTab === 'analytics'" />
        <SettingsTab v-else-if="activeTab === 'settings'" />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNotificationStore } from '@/stores/notifications'
import Sidebar from '@/components/admin/Sidebar.vue'
import TopNav from '@/components/admin/TopNav.vue'
import DashboardTab from '@/components/admin/DashboardTab.vue'
import UsersTab from '@/components/admin/UsersTab.vue'
import CategoriesTab from '@/components/admin/CategoriesTab.vue'
import OrdersTab from '@/components/admin/OrdersTab.vue'
import NotificationsTab from '@/components/admin/NotificationsTab.vue'
import AnalyticsTab from '@/components/admin/AnalyticsTab.vue'
import SettingsTab from '@/components/admin/SettingsTab.vue'
import Products from '@/components/admin/Products.vue'
import Promotions from '@/components/admin/Promotions.vue'

// Store
const notificationStore = useNotificationStore()

// State
const sidebarOpen = ref(true)
const activeTab = ref('dashboard')
const showNotifications = ref(false)

// Load read notification IDs from localStorage
const toggleNotifications = () => {
  if (!showNotifications.value && notificationStore.notifications.length > 0) {
    // If dropdown is closed and there are notifications, open it
    showNotifications.value = true
    notificationStore.markAllAsRead()
  } else if (showNotifications.value) {
    // If dropdown is open, close it
    showNotifications.value = false
  } else {
    // If dropdown is closed and no notifications, switch to notifications tab
    activeTab.value = 'notifications'
  }
}

const viewAllNotifications = () => {
  showNotifications.value = false
  activeTab.value = 'notifications'
}

const updateNotifications = (newNotifications) => {
  notificationStore.updateNotifications(newNotifications)
}

onMounted(() => {
  notificationStore.startPolling()
})

onBeforeUnmount(() => {
  notificationStore.stopPolling()
})
</script>

<style scoped>
/* Add global styles here if needed */
</style>

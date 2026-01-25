<template>

  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar Component -->
    <Sidebar :sidebar-open="sidebarOpen" :active-tab="activeTab" @toggle-sidebar="sidebarOpen = !sidebarOpen"
      @change-tab="activeTab = $event" />

    <!-- Main Content Area -->
    <div class="flex-1 overflow-auto">
      <!-- Top Navigation Bar Component -->
      <TopNav :unread-count="unreadCount" :show-notifications="showNotifications" :notifications="notifications"
        @toggle-notifications="toggleNotifications" @view-all-notifications="viewAllNotifications" />
      <!-- Page Content -->
      <div class="p-8">
        <!-- Dynamic Content based on Active Tab -->
        <DashboardTab v-if="activeTab === 'dashboard'" />
        <UsersTab v-else-if="activeTab === 'users'" />
        <CategoriesTab v-else-if="activeTab === 'categories'" />
        <OrdersTab v-else-if="activeTab === 'orders'" />
        <NotificationsTab v-else-if="activeTab === 'notifications'" :notifications="notifications"
          :onUpdate="updateNotifications" />
        <AnalyticsTab v-else-if="activeTab === 'analytics'" />
        <SettingsTab v-else-if="activeTab === 'settings'" />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Sidebar from '@/components/admin/Sidebar.vue'
import TopNav from '@/components/admin/TopNav.vue'
import DashboardTab from '@/components/admin/DashboardTab.vue'
import UsersTab from '@/components/admin/UsersTab.vue'
import CategoriesTab from '@/components/admin/CategoriesTab.vue'
import OrdersTab from '@/components/admin/OrdersTab.vue'
import NotificationsTab from '@/components/admin/NotificationsTab.vue'
import AnalyticsTab from '@/components/admin/AnalyticsTab.vue'
import SettingsTab from '@/components/admin/SettingsTab.vue'
import AuthForm from '@/components/AuthForm.vue'

// State
const sidebarOpen = ref(true)
const activeTab = ref('dashboard')
const showNotifications = ref(false)
const notifications = ref([])
const pollTimer = ref(null)

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

// LocalStorage key for read notifications
const STORAGE_KEY = 'admin_read_notifications'

// Load read notification IDs from localStorage
const loadReadNotifications = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch (err) {
    console.error('Error loading read notifications:', err)
    return new Set()
  }
}

// Save read notification IDs to localStorage
const saveReadNotifications = () => {
  try {
    const readIds = notifications.value
      .filter(n => n.read)
      .map(n => n.id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds))
  } catch (err) {
    console.error('Error saving read notifications:', err)
  }
}

const formatRelativeTime = (isoString) => {
  if (!isoString) return 'Unknown'

  const updatedAt = new Date(isoString)
  const now = new Date()
  const diffMs = now - updatedAt
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  // Show more granular time for recent updates
  if (diffSecs < 30) return 'just now'
  if (diffSecs < 60) return `${diffSecs}s ago`
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`

  // For older items, show actual date
  return updatedAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: updatedAt.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const mapLowStockToNotifications = (products) => {
  const readIds = loadReadNotifications()

  return products.map((p) => ({
    id: p.id,
    title: p.stock === 0 ? 'Out of Stock' : 'Low Stock Alert',
    message: p.stock === 0
      ? `${p.name} is out of stock`
      : `${p.name} has only ${p.stock} left`,
    time: formatRelativeTime(p.updatedAt),
    read: readIds.has(p.id), // Restore read status from localStorage
    priority: p.stock === 0 ? 'high' : 'medium',
  }))
}

const fetchLowStock = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/products/low-stock')
    if (!res.ok) throw new Error('Failed to load low stock products')

    const data = await res.json()
    notifications.value = mapLowStockToNotifications(data.products || [])
  } catch (err) {
    console.error('Low stock fetch error:', err)
  }
}

const startPolling = () => {
  // Poll every 2 minutes to keep it light
  pollTimer.value = setInterval(fetchLowStock, 120000)
}

const stopPolling = () => {
  if (pollTimer.value) {
    clearInterval(pollTimer.value)
    pollTimer.value = null
  }
}

const toggleNotifications = () => {
  if (!showNotifications.value && notifications.value.length > 0) {
    // If dropdown is closed and there are notifications, open it
    showNotifications.value = true
    notifications.value = notifications.value.map((n) => ({ ...n, read: true }))
    saveReadNotifications() // Persist read status
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
  notifications.value = newNotifications
  saveReadNotifications() // Persist read status when notifications are updated
}

onMounted(() => {
  fetchLowStock()
  startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<style scoped>
/* Add global styles here if needed */
</style>

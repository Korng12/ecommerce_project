<template>
  <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div class="flex items-center justify-between px-8 py-4">
      <!-- Search Bar -->
      <div class="flex-1 max-w-2xl">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
          <input
            type="text"
            placeholder="Search anything..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Right Side - Notifications & Profile -->
      <div class="flex items-center gap-4 ml-6">
        <!-- Notification Bell -->
        <div class="relative">
          <button 
            @click="$emit('toggle-notifications')"
            class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell :size="24" />
            <span v-if="unreadCount > 0" class="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {{ unreadCount }}
            </span>
          </button>

          <!-- Notification Dropdown -->
          <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div class="p-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">Notifications</h3>
                <span v-if="unreadCount > 0" class="text-sm text-blue-600 font-medium">{{ unreadCount }} new</span>
              </div>
            </div>
            <div class="max-h-96 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                :class="['p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer', 
                         !notification.read ? 'bg-blue-50' : '']"
              >
                <div class="flex items-start gap-3">
                  <div :class="['mt-1 h-2 w-2 rounded-full', !notification.read ? 'bg-blue-500' : 'bg-gray-300']"></div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-800 text-sm">{{ notification.title }}</p>
                    <p class="text-gray-600 text-sm mt-1">{{ notification.message }}</p>
                    <p class="text-gray-400 text-xs mt-1">{{ notification.time }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-3 border-t border-gray-200">
              <button class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Notifications
              </button>
            </div>
          </div>
        </div>

        <!-- Profile -->
        <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-800">John Doe</p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            JD
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { Search, Bell } from 'lucide-vue-next'

defineProps({
  unreadCount: Number,
  showNotifications: Boolean
})

defineEmits(['toggle-notifications'])

// Mock notifications data
const notifications = [
  { id: 1, title: 'New Order Received', message: 'Order #1234 has been placed', time: '5 min ago', read: false },
  { id: 2, title: 'User Registration', message: 'New user signed up', time: '15 min ago', read: false },
  { id: 3, title: 'Payment Successful', message: 'Payment of $299 received', time: '1 hour ago', read: true },
  { id: 4, title: 'Low Stock Alert', message: 'Product XYZ running low', time: '2 hours ago', read: true },
  { id: 5, title: 'System Update', message: 'System maintenance scheduled', time: '1 day ago', read: true },
]
</script>
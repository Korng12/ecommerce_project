<template>
  <div
    :class="['bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col', sidebarOpen ? 'w-64' : 'w-20']">
    <div class="p-4 flex items-center justify-between border-b border-slate-700">
      <h2 v-if="sidebarOpen" class="text-xl font-bold">Admin Panel</h2>
      <button @click="$emit('toggle-sidebar')" class="p-2 hover:bg-slate-700 rounded-lg transition-colors">
        <X v-if="sidebarOpen" :size="24" />
        <Menu v-else :size="24" />
      </button>
    </div>

    <nav class="flex-1 p-4">
      <button 
        v-for="item in menuItems" 
        :key="item.id" 
        @click="navigateTo(item.id)"
        :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all',
          isActive(item.id)
            ? 'bg-blue-600 text-white shadow-lg'
            : 'hover:bg-slate-700 text-gray-300']">
        <component :is="item.icon" :size="22" />
        <span v-if="sidebarOpen" class="font-medium">{{ item.label }}</span>
      </button>
    </nav>

    <div class="p-4 border-t border-slate-700">
      <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-gray-300">
        <LogOut :size="22" />
        <span v-if="sidebarOpen" class="font-medium">Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, markRaw, computed } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, BarChart3, Settings, LogOut, Menu, X, Folder, Bell, Image
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore();

defineProps({
  sidebarOpen: Boolean
})

defineEmits(['toggle-sidebar'])

// Menu items configuration
const menuItems = [
  { id: 'adminDashboard', label: 'Dashboard', icon: markRaw(LayoutDashboard) },
  { id: 'adminUsers', label: 'Users', icon: markRaw(Users) },
  { id: 'adminCategories', label: 'Categories', icon: markRaw(Folder) },
  { id: 'adminBanners', label: 'Banners', icon: markRaw(Image) },
  { id: 'adminProducts', label: 'Products', icon: markRaw(Package) },
  { id: 'adminPromotions', label: 'Promotions', icon: markRaw(Package) },
  { id: 'adminOrders', label: 'Orders', icon: markRaw(ShoppingCart) },
  { id: 'adminNotifications', label: 'Notifications', icon: markRaw(Bell) },
  { id: 'adminAnalytics', label: 'Analytics', icon: markRaw(BarChart3) },
  { id: 'adminSettings', label: 'Settings', icon: markRaw(Settings) },
]

const navigateTo = (routeName) => {
  router.push({ name: routeName })
}

const isActive = (routeName) => {
  return route.name === routeName
}

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'login' });
};
</script>
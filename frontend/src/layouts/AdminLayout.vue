<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar
      :sidebar-open="sidebarOpen"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
    />

    <div class="flex-1 overflow-auto">
      <TopNav
        @toggle-notifications="toggleNotifications"
        :unread-count="unreadCount"
      />

      <div class="p-8">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Sidebar from "@/components/admin/Sidebar.vue";
import TopNav from "@/components/admin/TopNav.vue";

// Notifications / polling can stay here if desired
const sidebarOpen = ref(true);
const notifications = ref([]);
const unreadCount = computed(
  () => notifications.value.filter((n) => !n.read).length,
);

// const toggleNotifications = () => {
//   // placeholder - child pages or TopNav may manage actual notification actions
// };

// onMounted(() => {
//   // optionally fetch notifications
// });

// onBeforeUnmount(() => {});
</script>
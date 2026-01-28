import { defineStore } from "pinia";
import { ref, computed } from "vue";

const API_URL = "http://localhost:3000/api";
const STORAGE_KEY = "admin_read_notifications";

export const useNotificationStore = defineStore("notifications", () => {
  const notifications = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const pollTimer = ref(null);

  // Computed
  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.read).length,
  );

  // Load read notification IDs from localStorage
  const loadReadNotifications = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (err) {
      console.error("Error loading read notifications:", err);
      return new Set();
    }
  };

  // Save read notification IDs to localStorage
  const saveReadNotifications = () => {
    try {
      const readIds = notifications.value
        .filter((n) => n.read)
        .map((n) => n.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
    } catch (err) {
      console.error("Error saving read notifications:", err);
    }
  };

  // Format relative time
  const formatRelativeTime = (isoString) => {
    if (!isoString) return "Unknown";

    const updatedAt = new Date(isoString);
    const now = new Date();
    const diffMs = now - updatedAt;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffSecs < 30) return "just now";
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return updatedAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        updatedAt.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Map low stock products to notifications
  const mapLowStockToNotifications = (products) => {
    const readIds = loadReadNotifications();

    return products.map((p) => ({
      id: p.id,
      title: p.stock === 0 ? "Out of Stock" : "Low Stock Alert",
      message:
        p.stock === 0
          ? `${p.name} is out of stock`
          : `${p.name} has only ${p.stock} left`,
      time: formatRelativeTime(p.updatedAt),
      read: readIds.has(p.id),
      priority: p.stock === 0 ? "high" : "medium",
    }));
  };

  // Fetch low stock products
  const fetchLowStockNotifications = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${API_URL}/products/low-stock`);

      if (!res.ok) {
        throw new Error(
          `Failed to load low stock products: ${res.status} ${res.statusText}`,
        );
      }

      const data = await res.json();
      notifications.value = mapLowStockToNotifications(data.products || []);
    } catch (err) {
      console.error("Low stock fetch error:", err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Mark all as read
  const markAllAsRead = () => {
    notifications.value = notifications.value.map((n) => ({
      ...n,
      read: true,
    }));
    saveReadNotifications();
  };

  // Mark specific notification as read
  const markAsRead = (notificationId) => {
    const notification = notifications.value.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
      saveReadNotifications();
    }
  };

  // Update notifications
  const updateNotifications = (newNotifications) => {
    notifications.value = newNotifications;
    saveReadNotifications();
  };

  // Start polling
  const startPolling = (intervalMs = 120000) => {
    stopPolling(); // Clear any existing timer
    fetchLowStockNotifications(); // Initial fetch
    pollTimer.value = setInterval(fetchLowStockNotifications, intervalMs);
  };

  // Stop polling
  const stopPolling = () => {
    if (pollTimer.value) {
      clearInterval(pollTimer.value);
      pollTimer.value = null;
    }
  };

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchLowStockNotifications,
    markAllAsRead,
    markAsRead,
    updateNotifications,
    startPolling,
    stopPolling,
  };
});

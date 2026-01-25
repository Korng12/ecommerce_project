<template>
    <div>
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-800">Notifications</h1>
            <p class="text-gray-600 mt-2">Manage all your inventory alerts and notifications</p>
        </div>

        <!-- Filter Tabs -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex gap-4 border-b border-gray-200">
                <button v-for="filter in filters" :key="filter.key" @click="activeFilter = filter.key" :class="[
                    'pb-3 px-4 font-medium text-sm transition-colors border-b-2',
                    activeFilter === filter.key
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-600 border-transparent hover:text-gray-800'
                ]">
                    {{ filter.label }}
                    <span v-if="filter.count > 0" :class="[
                        'ml-2 px-2 py-0.5 rounded-full text-xs font-semibold',
                        activeFilter === filter.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    ]">
                        {{ filter.count }}
                    </span>
                </button>
            </div>
        </div>

        <!-- Notifications List -->
        <div class="bg-white rounded-lg shadow-sm">
            <div v-if="filteredNotifications.length === 0" class="p-12 text-center">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                    <Bell :size="40" class="text-gray-400" />
                </div>
                <p class="text-gray-500 font-medium text-lg">No notifications</p>
                <p class="text-gray-400 mt-1">You're all caught up with {{ activeFilter }} notifications!</p>
            </div>

            <div v-else>
                <!-- Notification Items -->
                <div v-for="(notification, index) in filteredNotifications" :key="notification.id" :class="[
                    'p-6 hover:bg-gray-50 transition-colors cursor-pointer',
                    index !== filteredNotifications.length - 1 ? 'border-b border-gray-200' : '',
                    !notification.read ? 'bg-blue-50/50' : '',
                    notification.priority === 'high' ? 'border-l-4 border-l-red-500' : ''
                ]" @click="markAsRead(notification.id)">
                    <div class="flex items-start gap-4">
                        <!-- Icon -->
                        <div :class="[
                            'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                            notification.priority === 'high'
                                ? 'bg-red-100'
                                : notification.read
                                    ? 'bg-gray-100'
                                    : 'bg-blue-100'
                        ]">
                            <AlertCircle v-if="notification.priority === 'high'" :size="24" class="text-red-600" />
                            <Package v-else :size="24" :class="notification.read ? 'text-gray-600' : 'text-blue-600'" />
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1">
                                    <h3 :class="[
                                        'font-semibold text-base',
                                        notification.priority === 'high' ? 'text-red-700' : 'text-gray-800'
                                    ]">
                                        {{ notification.title }}
                                    </h3>
                                    <p class="text-gray-600 mt-1">{{ notification.message }}</p>
                                    <div class="flex items-center gap-4 mt-2">
                                        <span class="text-sm text-gray-500">{{ notification.time }}</span>
                                        <span v-if="!notification.read"
                                            class="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                                            <div class="w-2 h-2 rounded-full bg-blue-600"></div>
                                            Unread
                                        </span>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="flex items-center gap-2">
                                    <button v-if="!notification.read" @click.stop="markAsRead(notification.id)"
                                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Mark as read">
                                        <Check :size="18" />
                                    </button>
                                    <button @click.stop="deleteNotification(notification.id)"
                                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete">
                                        <Trash2 :size="18" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bulk Actions -->
        <div v-if="filteredNotifications.length > 0" class="mt-6 flex justify-end gap-3">
            <button v-if="unreadNotifications.length > 0" @click="markAllAsRead"
                class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                Mark All as Read
            </button>
            <button @click="clearAllNotifications"
                class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                Clear All
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { Bell, Package, AlertCircle, Check, Trash2 } from 'lucide-vue-next'

const props = defineProps({
    notifications: {
        type: Array,
        default: () => []
    },
    onUpdate: {
        type: Function,
        default: () => { }
    }
})

const activeFilter = ref('all')

const filters = computed(() => [
    { key: 'all', label: 'All', count: props.notifications.length },
    { key: 'unread', label: 'Unread', count: unreadNotifications.value.length },
    { key: 'critical', label: 'Critical', count: criticalNotifications.value.length },
    { key: 'read', label: 'Read', count: readNotifications.value.length }
])

const filteredNotifications = computed(() => {
    switch (activeFilter.value) {
        case 'unread':
            return unreadNotifications.value
        case 'critical':
            return criticalNotifications.value
        case 'read':
            return readNotifications.value
        default:
            return props.notifications
    }
})

const unreadNotifications = computed(() =>
    props.notifications.filter(n => !n.read)
)

const readNotifications = computed(() =>
    props.notifications.filter(n => n.read)
)

const criticalNotifications = computed(() =>
    props.notifications.filter(n => n.priority === 'high')
)

const markAsRead = (id) => {
    const notification = props.notifications.find(n => n.id === id)
    if (notification) {
        notification.read = true
        props.onUpdate([...props.notifications])
    }
}

const markAllAsRead = () => {
    props.notifications.forEach(n => n.read = true)
    props.onUpdate([...props.notifications])
}

const deleteNotification = (id) => {
    const filtered = props.notifications.filter(n => n.id !== id)
    props.onUpdate(filtered)
}

const clearAllNotifications = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
        props.onUpdate([])
    }
}
</script>

<template>
  <div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div>
      <p class="font-medium text-gray-800">{{ title }}</p>
      <p class="text-sm text-gray-500">{{ time }}</p>
    </div>
    <span :class="[statusColorClasses[statusColor], 'px-3 py-1 rounded-full text-sm']">
      {{ status }}
    </span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: String,
  time: String,
  status: String,
  statusColor: {
    type: String,
    default: 'green'
  }
})

const statusColorClasses = {
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700'
}
</script>
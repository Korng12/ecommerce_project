<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: String
})
</script>
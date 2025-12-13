<script setup>
import khqr from '@/assets/image/khqr.png';
defineProps({ modelValue: String });
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-col gap-4">

    <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer"
      :class="modelValue === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'"
      @click="emit('update:modelValue','card')"
    >
      <input type="radio" :checked="modelValue === 'card'" /> Credit / Debit Card
    </label>

    <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer"
      :class="modelValue === 'khqr' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'"
      @click="emit('update:modelValue','khqr')"
    >
      <input type="radio" :checked="modelValue === 'khqr'" /> KHQR Payment
      <img :src="khqr" class="w-12 ml-3">
    </label>

    <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer"
      :class="modelValue === 'bank' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'"
      @click="emit('update:modelValue','bank')"
    >
      <input type="radio" :checked="modelValue === 'bank'" /> Bank Transfer
    </label>
  </div>
</template>

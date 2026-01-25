<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-500 text-sm">{{ title }}</p>

        <!-- VALUE -->
        <p class="text-2xl font-bold text-gray-800 mt-1">
          {{ value }}
        </p>
      </div>

      <!-- ICON -->
      <div
        :class="[
          iconColorClasses[iconColor] || iconColorClasses.blue,
          'p-3 rounded-lg'
        ]"
      >
        <component :is="iconComponent" class="text-white" :size="24" />
      </div>
    </div>

    <!-- CHANGE -->
    <p
      v-if="change"
      :class="[
        change.startsWith('-') ? 'text-red-600' : 'text-green-600',
        'text-sm mt-4'
      ]"
    >
      {{ change }}
    </p>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

// lucide icons
import {
  DollarSign,
  UserCheck,
  Package,
  TrendingUp,
  ShoppingCart,
  Activity,
  Globe,
  ShoppingBag
} from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number], // ✅ FIX: accept Number
    required: true
  },
  change: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'DollarSign'
  },
  iconColor: {
    type: String,
    default: 'blue'
  }
})

// ICON MAP
const iconComponent = computed(() => {
  const icons = {
    DollarSign,
    UserCheck,
    Package,
    TrendingUp,
    ShoppingCart,
    Activity,
    Globe,
    ShoppingBag
  }

  return icons[props.icon] || DollarSign
})

// COLOR MAP
const iconColorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500'
}
</script>
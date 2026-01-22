<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-500 text-sm">{{ title }}</p>
        <h2 class="text-3xl font-bold">
      {{ formattedValue }}
    </h2>
        <p class="text-2xl font-bold text-gray-800 mt-1">{{ value }}</p>
      </div>
      <div :class="[iconColorClasses[iconColor], 'p-3 rounded-lg']">
        <component :is="iconComponent" class="text-white" :size="24" />
      </div>
    </div>
    <p :class="[change.includes('-') ? 'text-red-600' : 'text-green-600', 'text-sm mt-4']">
      {{ change }}
    </p>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

// this icon use lucide-vue-text "run: npm lucide-vue-next"
import { 
  DollarSign, UserCheck, Package, TrendingUp, ShoppingCart, 
  Activity, Globe, ShoppingBag 
} from 'lucide-vue-next'

const props = defineProps({
  title: String,
  value: String,
  change: String,
  icon: String,
  iconColor: {
    type: String,
    default: 'blue'
  }
})

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


const formattedValue = computed(() =>
  Number(props.value).toLocaleString()
)

const iconColorClasses = {
  blue: 'bg-blue-400 text-blue-600',
  green: 'bg-green-400 text-green-600',
  purple: 'bg-purple-400 text-purple-600',
  orange: 'bg-orange-400 text-orange-600',
  red: 'bg-red-400 text-red-600'
}
</script>
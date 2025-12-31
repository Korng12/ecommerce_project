<template>
  <div>
    <div class="text-center mb-10">
    </div>

    <div class="text-center mx-2 space-y-2 mb-10">
      <h2 class="text-2xl font-bold text-black-400">Enjoy</h2>
      <div class="flex flex-1 flex-wrap justify-center gap-4 dark:text-neutral-50">
        <div
          v-for="item in items"
          :key="item.id"
          class="p-6 shadow hover:shadow-lg text-300 box"
          :style="{ backgroundColor: item.color }"
        >
          <div v-if="item.id === 1">
            <img
              :src="item.icon"
              alt="Free Shipping Icon"
              class="w-10 h-10 mb-2 text-600"
            />
          </div>
          <div v-else-if="item.id === 2">
            <img
              :src="item.icon"
              alt="50% Off Icon"
              class="w-10 h-10 mb-2 text-600"
            />
          </div>
            <div v-else-if="item.id === 3">
            <img
              :src="item.icon"
              alt="promotional Icon"
              class="w-10 h-10 mb-2 text-600"
            />
          </div>
          <svg
            v-else
            class="w-10 h-10 mb-2 text-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path :d="item.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          </svg>
          <p class="font-semibold">{{ item.label }}</p>
          <p class="text-sm">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <div class="text-center">
    </div>
  </div>
</template>

<script>
import freeShippingIcon from '../assets/icon/FreeShipping.png';
import fiftyPercentOffIcon from '../assets/icon/fiftyPercentOff.png';
import popularProductIcon from '../assets/icon/gift.png'; 

export default {
  name: 'HoverBoxShadowDemo',
  data() {
    return {
      items: [
        {
          id: 1,
          label: 'Free Shipping',
          description: 'Enjoy free shipping on all orders!',
          color: 'rgba(0, 123, 255, 0.8)',
          icon: freeShippingIcon, 
        },
        {
          id: 2,
          label: '50% Off',
          description: 'Enjoy a discount on selected items!',
          color: 'rgba(40, 167, 69, 0.8)',
          icon: fiftyPercentOffIcon, 
        },
        {
          id: 3,
          label: 'Add Accessories',
          description: 'add more with accessories!',
          color: 'rgba(255, 193, 7, 0.8)',
          icon: popularProductIcon,  
        },
      ]
    };
  }
};
</script>

<style scoped>
.box {
  width: 200px;
  height: 200px; /* Increased height for longer boxes */
}
</style>
<template>
  <div class=" border-t bg-black items-center relative">
    <div class="flex gap-12 ">
      <div 
        v-for="(brand, index) in brands" 
        :key="brand.in"
        class="brand-item absolute"
        :style="{ left: brand.position + 'px' }"
        @mouseenter="pause = true"
        @mouseleave="pause = false"
      >
        <img :src="brand.image" class="h-20 w-auto object-contain" alt="brand"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBrand } from '@/stores/brands';

const brandsStore = useBrand();
const pause = ref(false);
const brands = ref([]);

// Settings
const speed = 1; // pixels per frame

onMounted(() => {
  const containerWidth = window.innerWidth;
  
  // Initialize positions for each brand, spaced evenly
  brands.value = brandsStore.brands.map((b, i) => ({
    ...b,
    position: containerWidth + i * 250 // initial x-position
  }));

  function animate() {
    if (!pause.value) {
      brands.value.forEach(brand => {
        brand.position -= speed;
        // If fully left, move it to the right side
        if (brand.position < -200) { // assuming image width ~200px
          brand.position = containerWidth;
        }
      });
    }
    requestAnimationFrame(animate);
  }
  animate();
});
</script>

<style scoped>
.brand-item {
  transition: transform 0.1s linear;
}
</style>

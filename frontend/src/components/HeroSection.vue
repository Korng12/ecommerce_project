<template>
  <section
    v-if="currentBanner"
    class="bg-gray-50 px-8 md:px-16 py-20 overflow-hidden"
  >
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      <!-- TEXT -->
      <div class="space-y-6">

        <!-- Typing Animation -->
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
          <span ref="typingText"></span>
        </h1>

        <p class="text-xl md:text-2xl text-gray-700">
          {{ currentBanner.title }}
        </p>

        <!-- BUTTON -->
        <router-link
          v-if="currentBanner.link"
          :to="currentBanner.link"
        >
          <button
            class="mt-4 px-8 py-3 text-lg bg-blue-600 text-white rounded-xl
                   hover:scale-105 transition-all duration-300 animate-btn-glow"
          >
            Shop Now
          </button>
        </router-link>
      </div>

      <!-- IMAGE -->
      <div class="relative flex justify-center items-center">
        <div class="absolute w-[450px] h-[450px] bg-blue-300 blur-[140px] opacity-40"></div>

        <img
          :src="`http://localhost:3000/uploads/banners/${currentBanner.image_url}`"
          class="relative w-full max-w-xl rounded-2xl shadow-lg object-cover float-anim"
        />
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBannerStore } from '@/stores/banners'

const bannerStore = useBannerStore()
const typingText = ref(null)
const currentIndex = ref(0)

onMounted(async () => {
  await bannerStore.fetchBanners()
  startTyping()
})

const activeBanners = computed(() =>
  bannerStore.activeBanners.sort((a, b) => a.position - b.position)
)

const currentBanner = computed(() =>
  activeBanners.value[currentIndex.value]
)

// animate typing effect
const startTyping = () => {
  if (!currentBanner.value) return

  let index = 0
  const text = 'Welcome to Our Store'
  typingText.value.textContent = ''

  const type = () => {
    if (index < text.length) {
      typingText.value.textContent += text[index++]
      setTimeout(type, 60)
    }
  }
  type()
}

// Auto rotate banner
setInterval(() => {
  if (activeBanners.value.length > 1) {
    currentIndex.value =
      (currentIndex.value + 1) % activeBanners.value.length
    startTyping()
  }
}, 6000)
</script>

<style scoped>
@keyframes btnPulse {
  0% { box-shadow: 0 0 0px rgba(59,130,246,.4); }
  50% { box-shadow: 0 0 12px rgba(59,130,246,.6); }
  100% { box-shadow: 0 0 0px rgba(59,130,246,.4); }
}
.animate-btn-glow {
  animation: btnPulse 2s infinite;
}

@keyframes floatUpDown {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
.float-anim {
  animation: floatUpDown 4s ease-in-out infinite;
}
</style>

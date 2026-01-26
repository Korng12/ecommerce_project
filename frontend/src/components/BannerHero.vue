<template>
  <section class="w-full relative overflow-hidden">
    <Swiper
      :modules="[Pagination, Autoplay]"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{ delay: 7000, disableOnInteraction: false }"
      navigation
      pagination
      class="w-full h-[90vh] lg:h-[700px]"
    >
      <SwiperSlide
        v-for="(slide, i) in bannerStore.banners"
        :key="i"
        class="relative w-full h-full"
      >
        <!-- Background Image -->
        <img
          :src="slide.banner"
          class="absolute w-full h-full object-cover"
        />
        <!-- Dark Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

        <!-- Text Content (Left Side) -->
        <div class="relative z-10 flex flex-col justify-center h-full px-6 lg:px-16 max-w-lg text-left">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg animate-slideUp">
            {{ slide.title || 'Experience the Power' }}
          </h1>
          <p class="mt-4 text-lg md:text-2xl text-gray-200 drop-shadow-md opacity-0 translate-y-6 animate-slideUp delay-200">
            {{ slide.description || 'Discover premium electronics with exclusive deals — laptops, smartphones, and more.' }}
          </p>

          <div class="mt-6 flex space-x-4 opacity-0 translate-y-6 animate-slideUp delay-400">
            <button
              class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:scale-105 hover:shadow-blue-400 transition-all duration-300"
            >
              Shop Now
            </button>
            <button
              class="px-6 py-3 bg-gray-700 text-white rounded-lg shadow-lg hover:scale-105 hover:shadow-gray-400 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { useBannerStore } from '@/stores/banners'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

const bannerStore = useBannerStore()
// const fixImage = (path) => new URL(path, import.meta.url).href
</script>

<style scoped>
/* Slide-up animation for text */
@keyframes slideUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-slideUp {
  animation: slideUp 0.8s ease-out forwards;
}
.delay-200 { animation-delay: 0.2s; }
.delay-400 { animation-delay: 0.4s; }

/* Customize Swiper arrows */
.swiper-button-next,
.swiper-button-prev {
  color: #fff; /* white arrows */
  background: rgba(0,0,0,0.4); /* semi-transparent background */
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s;
}
.swiper-button-next:hover,
.swiper-button-prev:hover {
  background: rgba(0,113,227,0.7); /* blue glow on hover */
  color: #fff;
  transform: scale(1.1);
}
.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
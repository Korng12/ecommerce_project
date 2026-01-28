<template>
  <section class="w-full relative overflow-hidden">
    <Swiper
      :modules="[Pagination, Autoplay]"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{ delay: 7000, disableOnInteraction: false }"
      pagination
      navigation
      class="w-full h-[90vh] lg:h-[700px]"
    >
      <SwiperSlide
        v-for="(slide, i) in bannerStore.activeBanners"
        :key="i"
        class="relative w-full h-full"
      >
        <!-- ✅ Background Image -->
        <img
          :src="`http://localhost:3000/uploads/banners/${slide.image_url}`"
          class="absolute w-full h-full object-cover"
        />

        <!-- Dark Overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

        <!-- Text Content -->
        <div class="relative z-10 flex flex-col justify-center h-full px-6 lg:px-16 max-w-lg">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            {{ slide.title }}
          </h1>

          <p class="mt-4 text-lg md:text-2xl text-gray-200">
            {{ slide.description || 'Discover premium electronics with exclusive deals.' }}
          </p>

          <div class="mt-6 flex gap-4">
            <router-link v-if="slide.link" :to="slide.link">
              <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:scale-105 transition">
                Shop Now
              </button>
            </router-link>

            <button class="px-6 py-3 bg-gray-700 text-white rounded-lg hover:scale-105 transition">
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

import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { useBannerStore } from '@/stores/banners'

const bannerStore = useBannerStore()
</script>

<style scoped>
.swiper-button-next,
.swiper-button-prev {
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.5rem;
  border-radius: 50%;
}
</style>

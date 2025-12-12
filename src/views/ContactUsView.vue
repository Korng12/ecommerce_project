<template>
  <div>
    <Header></Header>
    <h1>Contact Us</h1>
    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi dolorum modi dolorem voluptatibus tempora beatae. Accusamus placeat ipsum qui eveniet veritatis sunt fugit modi corrupti. Labore corporis dolorem odit debitis!</p>
    <div class="mt-32 h-96">
      <div class="relative h-full flex flex-col items-center justify-center">
      <img :src="store_img" alt="" class="absolute  w-full h-full object-cover blur-sm">
      <div class="text-center z-10 relative">
        <h1 class="text-4xl text-white font-bold">We’re here to help you level up</h1>
        <h1 class="text-4xl text-white font-bold">We’re just one click away to help you take your brand or product from great to incredible </h1>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Header from '@/components/Header.vue';
  import store_img from '@/assets/large_img/store.jpg'
</script>

<style>

</style>
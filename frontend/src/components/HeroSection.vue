<template>
  <section class="bg-gray-50 px-8 md:px-16 py-20 overflow-hidden">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      <!-- TEXT -->
      <div class="space-y-6">

        <!-- Typing Animation -->
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
          <span ref="typingText"></span>
        </h1>

        <!-- Description -->
        <p class="text-xl md:text-2xl leading-relaxed text-gray-700 opacity-0 translate-y-4 pop-up">
          <span class="font-semibold text-gray-900">Discover premium</span>
          laptops, smartphones, and components built for performance and style.
        </p>

        <p class="text-gray-600 text-lg opacity-0 translate-y-4 pop-up delay-200">
          Get the products you love — with exclusive promotions today.
        </p>

        <!-- Animated Button -->
        <button
          class="mt-4 px-8 py-3 text-lg bg-blue-600 text-white rounded-xl shadow-md 
          hover:shadow-blue-400/60 hover:scale-105 active:scale-95
          transition-all duration-300 animate-btn-glow"
        >
          Shop Now
        </button>
      </div>

      <!-- IMAGE FULL-WIDTH WITH BLUR BACKGROUND -->
      <div class="relative flex justify-center items-center h-full bg-bla">
        
        <!-- Blur Glow Background -->
        <div class="absolute w-[450px] h-[450px] bg-blue-300 blur-[140px] opacity-40"></div>

        <!-- Full Width Product Image -->
        <img
          src="../assets/mac_book_hero.jpg"
          class="relative w-full max-w-xl rounded-2xl shadow-lg object-cover float-anim"
        />

      </div>

    </div>
  </section>
</template>
<script setup>
import { onMounted, ref } from "vue";

const typingText = ref(null);

onMounted(() => {
  const text = "Welcome to Our Store";
  let index = 0;

  function typeLetter() {
    if (index < text.length) {
      typingText.value.textContent = text.slice(0, index + 1);
      index++;
      setTimeout(typeLetter, 55);
    }
  }

  typeLetter();

  const popUps = document.querySelectorAll(".pop-up");
  popUps.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("pop-up-show");
    }, 300 + i * 150);
  });
});
</script>
<style scoped>
.pop-up {
  transition: all 0.7s ease-out;
}
.pop-up-show {
  opacity: 1;
  transform: translateY(0);
}

/* Button Glow */
@keyframes btnPulse {
  0% { box-shadow: 0 0 0px rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.6); }
  100% { box-shadow: 0 0 0px rgba(59, 130, 246, 0.4); }
}
.animate-btn-glow {
  animation: btnPulse 2s infinite ease-in-out;
}

/* Image Float */
@keyframes floatUpDown {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
.float-anim {
  animation: floatUpDown 4s ease-in-out infinite;
}
</style>

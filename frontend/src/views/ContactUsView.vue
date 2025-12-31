<template>
  <div class="min-h-screen bg-gray-50">
    <!-- <Header /> -->

    <!-- HERO -->
    <section class="relative mt-24 h-[380px] flex items-center justify-center">
      <img
        :src="store_img"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- <div class="absolute inset-0 bg-black/70"></div> -->

      <div class="animate-floating slide-fade-in relative z-10 text-center max-w-4xl px-6">
        <h1 class="text-4xl text-white font-bold">Contact Us</h1>
        <h2 class="text-3xl text-white font-bold mt-2">We provide high-quality tech products at honest prices</h2>
      </div>
    </section>

    <!-- CONTACT ROW -->
    <section class="max-w-7xl mx-auto px-6 py-24">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <!-- MAP -->
        <div class="rounded-2xl overflow-hidden shadow-lg">
          <img
            src="@/assets/map.png"
            class="w-full h-full object-cover"
            alt="Map"
          />
        </div>

        <!-- CONTACT INFO -->
        <div class="bg-white rounded-2xl p-10 shadow-lg flex flex-col justify-center gap-6">
          <h2 class="text-2xl font-bold mb-4">Get in Touch</h2>

          <div class="flex items-start gap-4">
            <span class="text-2xl"><FontAwesomeIcon icon="location"></FontAwesomeIcon></span>
            <p class="text-gray-600">
              Phnom Penh, Cambodia
            </p>
          </div>

          <div class="flex items-start gap-4">
            <span class="text-2xl"><FontAwesomeIcon icon="phone"></FontAwesomeIcon></span>
            <p class="text-gray-600">
              +855 12 345 678
            </p>
          </div>

          <div class="flex items-start gap-4">
            <span class="text-2xl"><FontAwesomeIcon icon="envelope"></FontAwesomeIcon></span>
            <p class="text-gray-600">
              support@yourstore.com
            </p>
          </div>

          <div class="pt-6">
            <p class="text-gray-500 text-sm">
              Available Monday – Friday, 9:00 AM – 6:00 PM
            </p>
          </div>
        </div>

        <!-- CONTACT FORM -->
        <div class="bg-white rounded-2xl p-10 shadow-lg">
          <h2 class="text-2xl font-bold mb-6">Send a Message</h2>

          <form class="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Your Name"
              class="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              class="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none"
            />

            <textarea
              rows="4"
              placeholder="Your Message"
              class="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none"
            ></textarea>

            <button
              class="bg-[#0071E3] text-white py-3 rounded-xl font-semibold
                     hover:opacity-80 transition"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </section>
    <!-- <Footer></Footer> -->
  </div>
</template>

<script setup>
import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue'
import store_img from '@/assets/store.jpg'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>
<style scoped>
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-30px); }
}


@keyframes slideFadeIn {
  0% {
    transform: translateY(-50px); /* start above */
    opacity: 0;                  /* invisible */
  }
  60% {
    transform: translateY(10px); /* overshoot a little for bounce */
    opacity: 1;                  /* visible */
  }
  100% {
    transform: translateY(0);    /* final position */
  }
}

.animate-floating {
  animation: float 3s linear infinite;
}

.slide-fade-in {
  animation: slideFadeIn 1s ease-out forwards;
}

</style>

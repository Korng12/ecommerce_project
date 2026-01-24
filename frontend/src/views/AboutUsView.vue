<template>
  <div class="min-h-screen">
    <Header></Header>
    <div class="relative h-[380px] mt-32 flex flex-col items-center justify-center ">

      <img :src="store_img" class="absolute inset-0 w-full h-full object-cover " alt="Store Background">
      <!-- <div class="absolute inset-0 bg-black/70"></div> -->
      
      <div class="relative z-10 text-center px-4 animate-floating slide-fade-in">
        <h1 class="text-4xl text-white font-bold">Your Trusted Destination for the Latest Electronics</h1>
        <h2 class="text-3xl text-white font-bold mt-2">We provide high-quality tech products at honest prices</h2>
      </div>
    </div>


    <div class="w-full py-20 px-6 md:px-16 bg-gray-50">

      <!-- About Us -->
      <div class="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          About Us
        </h1>
        <p class="text-lg md:text-xl text-gray-600 leading-relaxed">
          Founded in <span class="font-semibold text-gray-900">2025</span>, E-Store was built with a simple vision:<br>
          <span class="font-semibold text-gray-900">make high-quality electronics accessible to everyone.</span>
          We saw customers struggling with overpriced gadgets, limited availability, and slow delivery — so we created a platform where
          <span class="font-semibold">trust, affordability, and speed</span> come first.
        </p>

        <!-- Quote -->
        <blockquote class="mt-6 text-xl italic text-gray-700 border-l-4 border-blue-500 pl-6">
          “Technology should empower your life — not empty your wallet.”
        </blockquote>
      </div>

      <!-- Mission -->
      <div class="flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Our Mission
        </h1>
        <p class="text-lg md:text-xl text-gray-600 leading-relaxed">
          Our mission is to deliver <span class="font-semibold">affordable, reliable, and innovative</span> electronics to every customer.
          We work endlessly to ensure you enjoy the latest tech with fast shipping,
          exceptional service, and a smooth shopping experience — every single time.
        </p>

        <!-- Extra Quote -->
        <blockquote class="mt-6 text-xl italic text-gray-700 border-l-4 border-blue-500 pl-6">
          “We don’t just sell products — we deliver possibilities.”
        </blockquote>

        <!-- Bonus Quote -->
        <blockquote class="mt-4 text-lg italic text-gray-600">
          “Your satisfaction is not an option — it’s our priority.”
        </blockquote>
      </div>

    </div>

    <section class="bg-gray-50 px-8 md:px-16 py-20 overflow-hidden">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      <!-- TEXT -->
      <div class="space-y-6">

        <!-- Typing Animation -->
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
          <span ref="typingText"></span>
        </h1>

        <p class="text-xl md:text-2xl leading-relaxed text-gray-700 opacity-0 translate-y-4 pop-up">
          At <span class="font-semibold text-gray-900">PTC Computer</span>, we are committed to delivering
          technology that improves your life — from personal gadgets to business-grade solutions.
        </p>


        <p class="text-gray-600 text-lg opacity-0 translate-y-4 pop-up delay-200">
          With trusted partnerships, expert support, and a passion for innovation, we continue to
          empower customers across Cambodia with reliable tech and exceptional service.
        </p>

        <!-- Animated Button -->
        <button
          class="mt-4 px-8 py-3 text-lg bg-blue-600 text-white rounded-xl shadow-md 
          hover:shadow-blue-400/60 hover:scale-105 active:scale-95
          transition-all duration-300 animate-btn-glow"
        >
          Learn More About Us
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
      <div>

      </div>
    </div>
    </section>
    
    <div class="flex flex-col items-center px-16 py-20 bg-gray-50">

      <!-- Title -->
      <h1 class="text-4xl font-bold mb-12 tracking-tight">Our Core Values</h1>

      <!-- Value Cards -->
      <div class="core-values grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">

        <!-- Trust -->
        <div class="flex flex-col items-center  text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
          <img :src="medal" alt="trust" class="w-20 h-20 mb-4">
          <h2 class="text-2xl font-semibold mb-2">Trust</h2>
          <p class="text-lg text-gray-600">
            We build trust with clients and partners through transparency, honesty,
            and consistent delivery. Every interaction reflects our commitment to
            long-term relationships and customer satisfaction.
          </p>
        </div>

        <!-- Quality -->
        <div class="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
          <img :src="medal" alt="quality" class="w-20 h-20 mb-4">
          <h2 class="text-2xl font-semibold mb-2">Quality</h2>
          <p class="text-lg text-gray-600">
            Quality is at the heart of everything we do. From our products to our
            customer service, we follow strict standards to ensure reliability,
            performance, and lasting value.
          </p>
        </div>

        <!-- Innovation -->
        <div class="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
          <img :src="medal" alt="innovation" class="w-20 h-20 mb-4">
          <h2 class="text-2xl font-semibold mb-2">Innovation</h2>
          <p class="text-lg text-gray-600">
            We embrace new ideas and emerging technologies to deliver modern
            solutions. Innovation keeps us ahead and allows us to provide smarter,
            more efficient experiences for our customers.
          </p>
        </div>

      </div>

    </div>


    <div class="w-full py-20 px-6 md:px-16 bg-white overflow-hidden">

      <div 
        class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        ref="sectionRef"
      >

        <!-- Left Content -->
        <div 
          class="opacity-0 translate-y-6 transition-all duration-700"
          :class="visible ? 'opacity-100 translate-y-0' : ''"
        >
          <h1 class="text-4xl font-extrabold text-gray-900 mb-6">
            Why Choose <span class="text-blue-600">E Store?</span>
          </h1>

          <ul class="space-y-8 text-gray-700 text-lg leading-relaxed">

            <!-- Expertise -->
            <li class="flex items-start gap-4 group transition-all duration-500"
                :class="[ 'fade-in-item delay-200', visible ? 'visible-item' : '' ]">

              <div class="p-3 bg-blue-100 text-blue-600 rounded-xl 
                          group-hover:scale-110 transition">
                <font-awesome-icon :icon="['fas','microchip']" />
              </div>

              <p>
                <span class="font-semibold text-gray-900">Expertise:</span>
                Experienced professionals offering reliable, expert guidance for all your computing needs.
              </p>
            </li>

            <!-- Pricing -->
            <li class="flex items-start gap-4 group transition-all duration-500"
                :class="[ 'fade-in-item delay-200', visible ? 'visible-item' : '' ]">

              <div class="p-3 bg-green-100 text-green-600 rounded-xl 
                          group-hover:scale-110 transition">
                <font-awesome-icon :icon="['fas','tags']" />
              </div>

              <p>
                <span class="font-semibold text-gray-900">Competitive Pricing:</span>
                We deliver top-tier products at prices that give you the highest long-term value.
              </p>
            </li>

            <!-- Convenience -->
            <li class="flex items-start gap-4 group transition-all duration-500"
                :class="[ 'fade-in-item delay-200', visible ? 'visible-item' : '' ]">

              <div class="p-3 bg-purple-100 text-purple-600 rounded-xl 
                          group-hover:scale-110 transition">
                <font-awesome-icon :icon="['fas','truck-fast']" />
              </div>

              <p>
                <span class="font-semibold text-gray-900">Convenience:</span>
                Enjoy seamless browsing, fast checkout, and reliable nationwide delivery.
              </p>
            </li>

          </ul>
        </div>

        <!-- Right Image -->
        <div 
          class="relative opacity-0 scale-95 transition-all duration-700"
          :class="visible ? 'opacity-100 scale-100' : ''"
        >
          <!-- Glow background -->
          <div class="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>

          <!-- Image -->
          <img
            :src="phone"
            alt=""
            class="relative z-10 w-full max-w-2xl mx-auto drop-shadow-2xl rounded-2xl
                  animate-floating"
          />
        </div>

      </div>
    </div>
    <div>
      Ours Founder

    </div>



    <!-- <Footer>

    </Footer> -->

  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { onMounted, ref } from "vue";
import medal from '@/assets/medal.jpg'
import phone from '/category_img/phone_banner.jpg'
import store_img from '@/assets/store.jpg'
const typingText = ref(null);
const visible = ref(false)
const sectionRef = ref(null)
onMounted(() => {
  const text = "Trusted by Thousands Across Cambodia";
  let index = 0;

  function typeLetter() {
    if (index < text.length) {
      typingText.value.textContent = text.slice(0, index + 1);
      index++;
      setTimeout(typeLetter, 55);
    }
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting){
         visible.value = true
         observer.disconnect()
      }
    },
    { threshold: 0.2 }
  )
  observer.observe(sectionRef.value)

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
.medal-img{
  width: 350px;

}
.core-values  p{
  color: gray;
}
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

.fade-in-item {
  opacity: 0;
  transform: translateY(15px);
}

.visible-item {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.fade-in-item.delay-100 {
  transition: all 0.7s ease 0.1s;
}
.fade-in-item.delay-200 {
  transition: all 0.7s ease 0.2s;
}
.fade-in-item.delay-300 {
  transition: all 0.7s ease 0.3s;
}

/* floating image */
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-10px); }
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
  animation: float 6s ease-in-out infinite;
}
.slide-fade-in {
  animation: slideFadeIn 1s ease-out forwards;
}

</style>

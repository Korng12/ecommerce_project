<template>
  <div class="w-full bg-white">
    <!-- Hero Section -->
    <div class="mt-24">
      <HeroSection></HeroSection>
    </div>

    <!-- Banner Hero -->
    <div class="mt-16">
      <BannerHero></BannerHero>
    </div>

    <!-- Category Preview -->
    <div class="mt-16">
      <CategoryPreview></CategoryPreview>
    </div>

    <!-- Inspiring Quote Section -->
    <div class="mt-16 px-4 md:px-8 py-12 bg-white border-t border-b border-gray-100">
      <div class="max-w-4xl mx-auto text-center">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5C5.37 0 3 2.55 3 7v13zm14 0c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5-1.63 0-3 2.55-3 7v13z"></path>
        </svg>
        <p class="text-2xl md:text-3xl font-bold mb-6 leading-relaxed text-gray-900">"The best products at unbeatable prices. Your shopping destination for quality and value."</p>
        <p class="text-gray-600 text-lg">Join thousands of satisfied customers worldwide</p>
      </div>
    </div>

    <!-- Register / Login CTA Section -->
    <div class="mt-16 px-4 md:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Sign Up Card -->
          <div class="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex justify-center mb-6">
              <svg class="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 text-center mb-3">Create an Account</h3>
            <p class="text-gray-600 text-center mb-6">Get exclusive deals, faster checkout, and track your orders.</p>
            <router-link to="/register" class="block w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
              Sign Up Now
            </router-link>
            <p class="text-center text-gray-600 mt-4 text-sm">Already have an account? <router-link to="/login" class="text-gray-900 font-semibold hover:underline">Sign In</router-link></p>
          </div>

          <!-- Login Card -->
          <div class="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex justify-center mb-6">
              <svg class="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 text-center mb-3">Welcome Back</h3>
            <p class="text-gray-600 text-center mb-6">Sign in to view your saved items and personalized recommendations.</p>
            <router-link to="/login" class="block w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
              Sign In
            </router-link>
            <p class="text-center text-gray-600 mt-4 text-sm">New here? <router-link to="/register" class="text-gray-900 font-semibold hover:underline">Create Account</router-link></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Flash Sale / Featured Products Section -->
    <div class="mt-16">
      <ProductSection 
        title="🔥 Trending Now" 
        :products="productsStore.getPopularProducts" 
        :show="true" 
        viewMorePath="/products?sort=popular"
      />
    </div>

    <!-- Best Selling Products -->
    <div class="mt-16">
      <ProductSection 
        title="Best Sellers" 
        :products="productsStore.products.slice().sort((a,b) => b.totalReviews - a.totalReviews)" 
        :show="true"
        viewMorePath="/products?sort=bestselling"
      />
    </div>

    <!-- Recommended Products -->
    <div class="mt-16">
      <ProductSection 
        title="⭐ Recommended For You" 
        :products="productsStore.products.slice(0, Math.min(30, productsStore.products.length))" 
        :show="true"
        viewMorePath="/products"
      />
    </div>

    <!-- Category-Specific Section -->
    <div class="mt-16" v-if="productsStore.getByCategory('Accessories').length > 0">
      <ProductSection 
        title="Accessories & Gear" 
        :products="productsStore.getByCategory('Accessories')" 
        :show="true"
        viewMorePath="/products?category=Accessories"
      />
    </div>

    <!-- Benefits Section -->
    <div class="mt-20 bg-gray-50 py-16 px-4 md:px-8">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Why Shop With Us?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Fast Shipping -->
          <div class="text-center">
            <div class="mb-4 flex justify-center">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-lg text-gray-900 mb-2">Fast Shipping</h3>
            <p class="text-gray-600">Free shipping on orders over $50. Delivery in 3-5 business days.</p>
          </div>

          <!-- Secure Payment -->
          <div class="text-center">
            <div class="mb-4 flex justify-center">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-lg text-gray-900 mb-2">Secure Payment</h3>
            <p class="text-gray-600">100% secure & encrypted. Your data is always protected.</p>
          </div>

          <!-- Easy Returns -->
          <div class="text-center">
            <div class="mb-4 flex justify-center">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-lg text-gray-900 mb-2">Easy Returns</h3>
            <p class="text-gray-600">30-day money-back guarantee. Hassle-free returns process.</p>
          </div>

          <!-- 24/7 Support -->
          <div class="text-center">
            <div class="mb-4 flex justify-center">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5-4a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-lg text-gray-900 mb-2">24/7 Support</h3>
            <p class="text-gray-600">Dedicated customer service team ready to help anytime.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Testimonials Section -->
    <div class="mt-20 px-4 md:px-8 py-16">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">What Our Customers Say</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Testimonial 1 -->
          <div class="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center mb-4">
              <div class="flex text-gray-300">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            <p class="text-gray-700 mb-6 italic">"Amazing quality and super fast shipping! I received my order in just 3 days. Will definitely shop again."</p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold mr-4 text-sm">SR</div>
              <div>
                <p class="font-semibold text-gray-900">Sarah Roberts</p>
                <p class="text-sm text-gray-500">Verified Buyer</p>
              </div>
            </div>
          </div>

          <!-- Testimonial 2 -->
          <div class="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center mb-4">
              <div class="flex text-gray-300">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            <p class="text-gray-700 mb-6 italic">"Great prices and excellent customer service. They helped me with my questions immediately. Highly recommended!"</p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold mr-4 text-sm">MK</div>
              <div>
                <p class="font-semibold text-gray-900">Michael Khan</p>
                <p class="text-sm text-gray-500">Verified Buyer</p>
              </div>
            </div>
          </div>

          <!-- Testimonial 3 -->
          <div class="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center mb-4">
              <div class="flex text-gray-300">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            <p class="text-gray-700 mb-6 italic">"The product quality exceeded my expectations. Best online shopping experience I've had. Perfect!"</p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold mr-4 text-sm">EM</div>
              <div>
                <p class="font-semibold text-gray-900">Emma Martinez</p>
                <p class="text-sm text-gray-500">Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trust Badges Section -->
    <div class="mt-16 bg-white py-12 px-4 md:px-8 border-t border-gray-200">
      <div class="max-w-6xl mx-auto">
        <p class="text-center text-gray-600 mb-8 text-lg">Trusted by millions worldwide</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          <!-- Badge 1 -->
          <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">10M+</div>
            <p class="text-gray-600">Happy Customers</p>
          </div>
          <!-- Badge 2 -->
          <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">100%</div>
            <p class="text-gray-600">Secure Checkout</p>
          </div>
          <!-- Badge 3 -->
          <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">30 Days</div>
            <p class="text-gray-600">Money Back</p>
          </div>
          <!-- Badge 4 -->
          <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">24/7</div>
            <p class="text-gray-600">Customer Support</p>
          </div>
        </div>
      </div>
    </div>

 


  </div>
</template>

<script setup>
import ProductSection from '@/components/product/ProductSection.vue';
import BannerHero from '@/components/BannerHero.vue';
import HeroSection from '@/components/HeroSection.vue';
import CategoryPreview from '@/components/CategoryPreview.vue';
import { onMounted } from 'vue';
import { useProduct } from '@/stores/products';
const productsStore = useProduct();
onMounted(async () => {
  if (!productsStore.products?.length) {
    try { await productsStore.fetchAllProducts() } catch (e) { /* noop */ }
  }
});
</script>

<style>

</style>
<script setup>
import { onMounted, ref } from 'vue';
import { useCheckoutStore } from '@/stores/checkout';
import { useCart } from '@/stores/carts';

const checkoutStore = useCheckoutStore();
const cartStore = useCart();
const isSuccess = ref(false);
const orderInfo = ref(null);

onMounted(async () => {
    // Get payment_intent from URL
    const params = new URLSearchParams(window.location.search);
    const intent = params.get('payment_intent');

    isSuccess.value = intent && intent.includes('pi_');

    if (isSuccess.value && checkoutStore.orderId) {
        orderInfo.value = {
            orderId: checkoutStore.orderId,
            amount: checkoutStore.orderTotal,
        };

        // Refresh cart to clear items after successful payment
        await cartStore.getCart();
    }
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">

            <!-- Success State -->
            <div v-if="isSuccess" class="space-y-4">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h1 class="text-2xl font-bold text-gray-900">Payment Successful!</h1>
                <p class="text-gray-600">Thank you for your order. Your payment has been processed.</p>

                <div v-if="orderInfo" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p class="text-sm text-gray-600">Order ID:</p>
                    <p class="text-lg font-semibold text-blue-600">{{ orderInfo.orderId }}</p>
                    <p class="text-sm text-gray-600 mt-2">Amount:</p>
                    <p class="text-lg font-semibold text-blue-600">${{ orderInfo.amount?.toFixed(2) }}</p>
                </div>

                <p class="text-sm text-gray-500">You will receive a confirmation email shortly.</p>

                <RouterLink to="/" class="block mt-6">
                    <button class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                        Continue Shopping
                    </button>
                </RouterLink>
            </div>

            <!-- Failed/Pending State -->
            <div v-else class="space-y-4">
                <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>

                <h1 class="text-2xl font-bold text-gray-900">Payment Processing</h1>
                <p class="text-gray-600">Your payment is being processed. Please wait...</p>

                <p class="text-sm text-gray-500">If you are not redirected, check your email for confirmation.</p>

                <RouterLink to="/checkoutView" class="block mt-6">
                    <button class="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition">
                        Back to Checkout
                    </button>
                </RouterLink>
            </div>

        </div>
    </div>
</template>

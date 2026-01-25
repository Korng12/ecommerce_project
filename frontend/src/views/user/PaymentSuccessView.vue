<script setup>
import { onMounted, ref } from 'vue';
import { useCheckoutStore } from '@/stores/checkout';
import { useCart } from '@/stores/carts';
import { useOrder } from '@/stores/order';
import Receipt from '@/components/order/Receipt.vue';

const checkoutStore = useCheckoutStore();
const cartStore = useCart();
const orderStore = useOrder();
const isSuccess = ref(false);
const orderInfo = ref(null);
const showReceipt = ref(false);

onMounted(async () => {
    // Get payment_intent from URL
    const params = new URLSearchParams(window.location.search);
    const intent = params.get('payment_intent');

    isSuccess.value = intent && intent.includes('pi_');

    if (isSuccess.value) {
        // Try to get orderId from checkout store or fetch recent orders
        let orderId = checkoutStore.orderId;
        let amount = checkoutStore.orderTotal;

        if (!orderId || !amount) {
            // If state was lost after reload, pull latest order as a fallback
            await orderStore.fetchOrders();
            const latestOrder = orderStore.orders.reduce((latest, order) => {
                if (!latest) return order;
                const latestDate = new Date(latest.createdAt || 0);
                const orderDate = new Date(order.createdAt || 0);
                return orderDate > latestDate ? order : latest;
            }, null);

            if (latestOrder) {
                orderId = latestOrder.id;
                amount = Number(latestOrder.totalAmount) || amount;
            }
        }

        if (orderId) {
            orderInfo.value = {
                orderId: orderId,
                amount: Number(amount) || 0,
            };
        }

        // Refresh cart to clear items after successful payment
        await cartStore.getCart();
    }
});

const toggleReceipt = () => {
    showReceipt.value = !showReceipt.value;
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <!-- Success Card -->
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center mb-8">

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

                <div class="flex gap-3">
                    <button @click="toggleReceipt"
                        class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                        View Receipt
                    </button>
                    <RouterLink to="/" class="flex-1">
                        <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                            Continue Shopping
                        </button>
                    </RouterLink>
                </div>
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
<<<<<<< HEAD
        </div>

        <!-- Receipt -->
        <div v-if="isSuccess && showReceipt && orderInfo">
            <Receipt :orderId="orderInfo.orderId" />
=======

>>>>>>> main
        </div>
    </div>
</template>

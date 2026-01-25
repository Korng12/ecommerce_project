<script setup>
import { ref, watch, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/stores/carts";
import { useCheckoutStore } from "@/stores/checkout";
import qr from "@/assets/image/qr.png";

const cartStore = useCart();
const checkoutStore = useCheckoutStore();

const props = defineProps({
  modelValue: String, // card, khqr, bank
  clientSecret: String, // Stripe client secret
  loading: Boolean,
  error: String,
});

// Stripe setup
const stripe = ref(null);
const elements = ref(null);
const paymentElement = ref(null);
const paymentElementReady = ref(false);
const paymentProcessing = ref(false);
const paymentError = ref(null);
const paymentSuccess = ref(false);

// Load Stripe on mount
onMounted(async () => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!stripeKey) {
    console.error("Missing VITE_STRIPE_PUBLISHABLE_KEY in .env");
    return;
  }
  stripe.value = await loadStripe(stripeKey);
  console.log('Stripe loaded');
});

// Watch for clientSecret and mount Stripe Elements
watch(
  () => props.clientSecret,
  async (newSecret) => {
    if (!newSecret || !stripe.value) {
      console.log('Missing clientSecret or stripe not loaded yet');
      return;
    }


    console.log('Mounting payment element with clientSecret:', newSecret);

    // Reset ready state
    paymentElementReady.value = false;
    paymentError.value = null;

    try {
      // Unmount previous element if exists
      if (paymentElement.value) {
        paymentElement.value.unmount();
        paymentElement.value = null;
      }

      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create Elements instance
      elements.value = stripe.value.elements({
        clientSecret: newSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#2563eb",
            colorBackground: "#ffffff",
            colorText: "#30313d",
            colorDanger: "#fa755a",
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: "4px",
            borderRadius: "4px",
          },
        },
      });

      // Create PAYMENT element - configure to show only card fields, hide optional
      const paymentElementInstance = elements.value.create("payment");

      // Mount the element
      paymentElementInstance.mount("#payment-element");

      paymentElement.value = paymentElementInstance;

      // Set ready after a short delay to ensure element is actually mounted
      setTimeout(() => {
        paymentElementReady.value = true;
        console.log('Card element ready');
      }, 300);

    } catch (err) {
      console.error('Mount error:', err);
      paymentError.value = "Failed to load payment form: " + (err.message || err);
    }
  },
  { immediate: true }
);

const handlePayment = async () => {
  if (!stripe.value || !elements.value) {
    paymentError.value = "Stripe not loaded";
    return;
  }

  if (!paymentElementReady.value) {
    paymentError.value = "Payment form loading";
    return;
  }

  paymentProcessing.value = true;
  paymentError.value = null;

  try {
    console.log('Confirming payment...');
    const { paymentIntent, error } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "if_required",
    });

    if (error) {
      console.error('Payment error:', error);
      paymentError.value = error.message;
      paymentProcessing.value = false;
    } else if (paymentIntent) {
      console.log('Payment confirmed:', paymentIntent.status);
      paymentSuccess.value = true;

      // For testing without webhooks: manually confirm payment on backend
      try {
        await checkoutStore.confirmPaymentSuccess();
        console.log('Payment confirmed on backend');

        // Clear cart after backend confirmation
        await cartStore.clearCart();
        console.log('Cart cleared successfully');
      } catch (err) {
        console.error('Failed to confirm payment on backend:', err);
      }

      // Redirect with payment intent ID in URL (no client_secret for security)
      setTimeout(() => {
        window.location.href = `/payment-success?payment_intent=${paymentIntent.id}`;
      }, 1000);
    }
  } catch (err) {
    console.error('Confirm payment error:', err);
    paymentError.value = "Payment failed. Please try again.";
    paymentProcessing.value = false;
  }
};
</script>

<template>

  <!-- CARD PAYMENT -->
  <div v-if="modelValue === 'card'"
    class="transition-all duration-300 p-6 border border-gray-300 rounded-xl shadow-sm bg-white">
    <p class="font-medium text-lg mb-4">Card Payment</p>

    <!-- Loading state while creating order/intent -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Preparing payment...</p>
    </div>

    <!-- Show error from checkout store -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      {{ error }}
    </div>

    <!-- Stripe Payment Element -->
    <div v-else-if="clientSecret">
      <div id="payment-element" class="mb-4"></div>

      <!-- Payment error -->
      <div v-if="paymentError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        {{ paymentError }}
      </div>

      <!-- Success message -->
      <div v-if="paymentSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
        Payment successful! Redirecting...
      </div>

      <button @click="handlePayment" :disabled="!paymentElementReady || paymentProcessing || paymentSuccess"
        class="bg-blue-600 text-white w-full py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition">
        {{ !paymentElementReady ? 'Loading...' : paymentProcessing ? 'Processing...' : paymentSuccess ?
          'PaymentComplete' : 'Confirm Payment' }}
      </button>
    </div>

    <!-- Initial state - waiting for order creation -->
    <div v-else class="text-center py-8 text-gray-500">
      <p>Click "Pay Now" in the order summary to continue</p>
    </div>
  </div>

  <!-- KHQR PAYMENT -->
  <div v-if="modelValue === 'khqr'"
    class="flex flex-col gap-4 p-6 border border-gray-300 rounded-xl shadow-sm bg-white transition-all duration-300">
    <p class="font-medium text-lg">Scan this QR to pay</p>

    <img :src="qr" class="w-48 mx-auto" />

    <div>
      <p class="text-sm font-medium">Upload payment slip</p>
      <input type="file" class="border border-gray-300 p-2 rounded-lg w-full mt-1" />
    </div>

    <button class="bg-blue-600 text-white w-full py-3 rounded-lg">
      Confirm Payment
    </button>
  </div>

  <!-- BANK PAYMENT -->
  <div v-if="modelValue === 'bank'"
    class="flex flex-col gap-4 p-6 border border-gray-300 rounded-xl shadow-sm bg-white transition-all duration-300">
    <p class="font-medium text-lg">Bank Information</p>

    <p class="text-gray-600 text-sm"><strong>Bank:</strong> ABA Bank</p>
    <p class="text-gray-600 text-sm"><strong>Account Name:</strong> E-shop</p>
    <p class="text-gray-600 text-sm mb-4"><strong>Account Number:</strong> 000 123 456</p>

    <p class="text-sm font-medium">Upload transfer slip</p>
    <input type="file" class="border border-gray-300 p-2 rounded-lg w-full" />

    <button class="bg-blue-600 text-white w-full py-3 rounded-lg">
      Confirm Transfer
    </button>
  </div>

</template>

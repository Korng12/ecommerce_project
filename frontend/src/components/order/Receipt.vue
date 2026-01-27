<template>
    <div v-if="receipt" class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <!-- Header -->
        <div class="text-center border-b-2 pb-6 mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Receipt</h1>
            <p class="text-gray-600 mt-1">Order #{{ receipt.orderId }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(receipt.orderDate) }}</p>
        </div>

        <!-- Customer Info -->
        <div class="grid grid-cols-2 gap-6 mb-8">
            <div>
                <p class="text-sm text-gray-600 uppercase">Bill To</p>
                <p class="text-lg font-semibold text-gray-900">{{ receipt.customer.name }}</p>
                <p class="text-gray-600">{{ receipt.customer.email }}</p>
            </div>
            <div class="text-right">
                <p class="text-sm text-gray-600 uppercase">Order Status</p>
                <p class="text-lg font-semibold" :class="statusColor(receipt.orderStatus)">
                    {{ receipt.orderStatus.toUpperCase() }}
                </p>
            </div>
        </div>

        <!-- Items Table -->
        <div class="mb-8">
            <table class="w-full">
                <thead class="border-b-2 border-gray-300">
                    <tr>
                        <th class="text-left py-3 text-gray-700 font-semibold">Item</th>
                        <th class="text-right py-3 text-gray-700 font-semibold">Qty</th>
                        <th class="text-right py-3 text-gray-700 font-semibold">Unit Price</th>
                        <th class="text-right py-3 text-gray-700 font-semibold">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in receipt.items" :key="item.productId" class="border-b border-gray-200">
                        <td class="py-4 text-gray-900">{{ item.productName }}</td>
                        <td class="py-4 text-right text-gray-900">{{ item.quantity }}</td>
                        <td class="py-4 text-right text-gray-900">${{ item.price.toFixed(2) }}</td>
                        <td class="py-4 text-right text-gray-900 font-semibold">${{ item.subtotal.toFixed(2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Summary -->
        <div class="flex justify-end mb-8">
            <div class="w-64">
                <div class="flex justify-between py-2 text-gray-700">
                    <span>Subtotal:</span>
                    <span>${{ receipt.summary.subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between py-2 text-gray-700 border-b-2 pb-2">
                    <span>Tax (8%):</span>
                    <span>${{ receipt.summary.tax.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between py-3 text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>${{ receipt.summary.total.toFixed(2) }}</span>
                </div>
            </div>
        </div>

        <!-- Payment Info -->
        <div class="bg-gray-50 p-4 rounded-lg mb-8">
            <p class="text-sm text-gray-600 uppercase font-semibold mb-2">Payment Details</p>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                    <p class="text-gray-600">Method:</p>
                    <p class="font-semibold capitalize">{{ receipt.payment.method }}</p>
                </div>
                <div>
                    <p class="text-gray-600">Status:</p>
                    <p class="font-semibold capitalize" :class="paymentStatusColor(receipt.payment.status)">
                        {{ receipt.payment.status }}
                    </p>
                </div>
                <div v-if="receipt.payment.transactionId" class="col-span-2">
                    <p class="text-gray-600">Transaction ID:</p>
                    <p class="font-mono text-xs break-all">{{ receipt.payment.transactionId }}</p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="text-center border-t pt-6">
            <p class="text-sm text-gray-600 mb-4">Thank you for your purchase!</p>
            <div class="flex gap-4 justify-center">
                <button @click="printReceipt"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Print Receipt
                </button>
                <button @click="downloadReceipt"
                    class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                    Download PDF
                </button>
            </div>
        </div>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="text-center py-8">
        <p class="text-gray-600">Loading receipt...</p>
    </div>

    <!-- Error state -->
    <div v-else class="text-center py-8">
        <p class="text-red-600">Unable to load receipt. Please try again.</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    orderId: {
        type: [Number, String],
        required: false,
    },
});

const route = useRoute();
const orderId = props.orderId || route.params.orderId;

const receipt = ref(null);

onMounted(async () => {
    if (!orderId) {
        console.error('No orderId provided');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}/receipt`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch receipt');
        }

        receipt.value = await response.json();
    } catch (err) {
        console.error('Error loading receipt:', err);
    }
});

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const statusColor = (status) => {
    const colors = {
        paid: 'text-green-600',
        pending: 'text-yellow-600',
        processing: 'text-blue-600',
        shipped: 'text-blue-600',
        delivered: 'text-green-600',
        cancelled: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
};

const paymentStatusColor = (status) => {
    const colors = {
        success: 'text-green-600',
        pending: 'text-yellow-600',
        failed: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
};

const printReceipt = () => {
    window.print();
};

const downloadReceipt = () => {
    // This would require html2pdf library
    alert('PDF download feature coming soon. Use Print → Save as PDF for now.');
};
</script>

<style scoped>
@media print {
    body {
        margin: 0;
        padding: 0;
    }

    button {
        display: none;
    }

    .bg-gray-50 {
        background-color: #f9fafb;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
</style>

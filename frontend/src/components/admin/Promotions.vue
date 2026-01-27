<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Promotions</h1>
          <p class="text-gray-600">Manage your active and upcoming promotions</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          + Add Promotion
        </button>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <p class="text-gray-600 text-sm mb-1">Total Promotions</p>
          <p class="text-2xl font-bold text-gray-900">{{ promotionStore.promotions.length }}</p>
        </div>
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <p class="text-gray-600 text-sm mb-1">Active Now</p>
          <p class="text-2xl font-bold text-green-600">{{ activeCount }}</p>
        </div>
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <p class="text-gray-600 text-sm mb-1">Upcoming</p>
          <p class="text-2xl font-bold text-blue-600">{{ upcomingCount }}</p>
        </div>
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <p class="text-gray-600 text-sm mb-1">Expired</p>
          <p class="text-2xl font-bold text-gray-500">{{ expiredCount }}</p>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="mb-6 flex gap-3 flex-wrap">
      <button
        v-for="status in ['all', 'active', 'upcoming', 'expired']"
        :key="status"
        @click="filterStatus = status"
        :class="[
          'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
          filterStatus === status
            ? 'bg-gray-900 text-white'
            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
        ]"
      >
        {{ status.charAt(0).toUpperCase() + status.slice(1) }}
      </button>
    </div>

    <!-- Main Table -->
    <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div v-if="promotionStore.promotions.length === 0" class="p-8 text-center">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 012 12V7a2 2 0 012-2z"></path>
        </svg>
        <p class="text-gray-600 text-lg">No promotions yet. Create one to get started!</p>
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="p-4 text-left font-semibold text-gray-900">Name</th>
            <th class="p-4 text-left font-semibold text-gray-900">Type & Value</th>
            <th class="p-4 text-left font-semibold text-gray-900">Products</th>
            <th class="p-4 text-left font-semibold text-gray-900">Valid Period</th>
            <th class="p-4 text-left font-semibold text-gray-900">Status</th>
            <th class="p-4 text-left font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="promo in filteredPromotions"
            :key="promo.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Name -->
            <td class="p-4">
              <div>
                <p class="font-semibold text-gray-900">{{ promo.name }}</p>
                <p class="text-xs text-gray-500 mt-1">ID: {{ promo.id }}</p>
              </div>
            </td>

            <!-- Type & Value -->
            <td class="p-4">
              <div class="flex items-center gap-2">
                <span v-if="promo.type === 'percentage'" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                  {{ promo.value }}%
                </span>
                <span v-else class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                  ${{ promo.value }}
                </span>
              </div>
            </td>

            <!-- Products Count -->
            <td class="p-4">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-700">{{ promo.products?.length || 0 }} products</span>
              </div>
            </td>

            <!-- Valid Period -->
            <td class="p-4">
              <div class="text-sm">
                <p class="text-gray-900">{{ formatDate(promo.startDate) }}</p>
                <p class="text-gray-500">→ {{ formatDate(promo.endDate) }}</p>
              </div>
            </td>

            <!-- Status Badge -->
            <td class="p-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold inline-block',
                  getStatusClass(promo)
                ]"
              >
                {{ getStatusText(promo) }}
              </span>
            </td>

            <!-- Actions -->
            <td class="p-4">
              <div class="flex gap-2">
                <button class="text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-100 transition-colors" title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button class="text-gray-600 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors" title="Delete">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading State -->
    <div v-if="promotionStore.loading" class="mt-6 text-center">
      <p class="text-gray-600">Loading promotions...</p>
    </div>

    <!-- Create Promotion Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">Create New Promotion</h2>
          <button
            @click="showCreateModal = false"
            class="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          <!-- Promotion Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Promotion Name</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="e.g., Summer Sale 2026, Black Friday"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <p class="text-xs text-gray-500 mt-1">A clear, descriptive name for your promotion</p>
          </div>

          <!-- Discount Type & Value -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Type -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Discount Type</label>
              <select
                v-model="formData.type"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed_amount">Fixed Amount ($)</option>
              </select>
            </div>

            <!-- Value -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Discount Value</label>
              <div class="relative">
                <input
                  v-model.number="formData.value"
                  type="number"
                  :placeholder="formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 50'"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  min="0"
                />
                <span class="absolute right-4 top-2.5 text-gray-500 font-semibold">
                  {{ formData.type === 'percentage' ? '%' : '$' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Date Range -->
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <!-- Start Date -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Start Date & Time</label>
                <input
                  v-model="formData.startDate"
                  type="datetime-local"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <div class="flex gap-2 mt-2 flex-wrap">
                  <button
                    type="button"
                    @click="setStartDateToday"
                    class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    @click="setStartDateTomorrow"
                    class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    @click="setStartDate(7)"
                    class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    In 7 days
                  </button>
                </div>
              </div>

              <!-- End Date -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">End Date & Time</label>
                <input
                  v-model="formData.endDate"
                  type="datetime-local"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400',
                    dateValidationError ? 'border-red-300 focus:ring-red-400' : 'border-gray-300'
                  ]"
                />
                <div class="flex gap-2 mt-2 flex-wrap">
                  <button
                    type="button"
                    @click="setEndDate(7)"
                    class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    +7 days
                  </button>
                  <button
                    type="button"
                    @click="setEndDate(14)"
                    class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    +14 days
                  </button>
                  <button
                    type="button"
                    @click="setEndDate(30)"
                    class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    +30 days
                  </button>
                </div>
                <p v-if="dateValidationError" class="text-xs text-red-600 mt-2">
                  {{ dateValidationError }}
                </p>
              </div>
            </div>

            <!-- Duration Summary -->
            <div v-if="formData.startDate && formData.endDate && !dateValidationError" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="text-sm text-blue-900">
                <span class="font-semibold">Duration:</span> {{ formatFullDate(formData.startDate) }} to {{ formatFullDate(formData.endDate) }}
                <span class="ml-2 text-blue-700">({{ durationDays }} days)</span>
              </p>
            </div>
          </div>

          <!-- Product Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Select Products</label>
            <div class="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div class="space-y-2">
                <div v-if="availableProducts.length === 0" class="text-gray-500 text-sm py-4">
                  No products available
                </div>
                <label
                  v-for="product in availableProducts"
                  :key="product.id"
                  class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="formData.productIds.includes(product.id)"
                    @change="toggleProduct(product.id)"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-xs text-gray-500">${{ product.price }}</p>
                  </div>
                </label>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">{{ formData.productIds.length }} product(s) selected</p>
          </div>

          <!-- Description (Optional) -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Description (Optional)</label>
            <textarea
              v-model="formData.description"
              placeholder="Add details about your promotion..."
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <!-- Preview -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p class="text-sm font-semibold text-gray-900 mb-3">Preview</p>
            <div class="space-y-2 text-sm">
              <p><span class="text-gray-600">Name:</span> <span class="font-medium">{{ formData.name || 'Not set' }}</span></p>
              <p><span class="text-gray-600">Discount:</span> <span class="font-medium">{{ formData.value }}{{ formData.type === 'percentage' ? '%' : '$' }}</span></p>
              <p><span class="text-gray-600">Valid:</span> <span class="font-medium">{{ formData.startDate || 'Not set' }} to {{ formData.endDate || 'Not set' }}</span></p>
              <p><span class="text-gray-600">Products:</span> <span class="font-medium">{{ formData.productIds.length }} selected</span></p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            @click="showCreateModal = false"
            :disabled="isSubmitting"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="createPromotion"
            :disabled="!isFormValid || isSubmitting"
            :class="[
              'px-6 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2',
              (isFormValid && !isSubmitting)
                ? 'bg-gray-900 hover:bg-gray-800'
                : 'bg-gray-400 cursor-not-allowed'
            ]"
          >
            <span v-if="isSubmitting">Creating...</span>
            <span v-else>Create Promotion</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePromotion } from '@/stores/promotions';
import { useProduct } from '@/stores/products';

const promotionStore = usePromotion();
const productStore = useProduct();
const filterStatus = ref('all');
const showCreateModal = ref(false);

// Form data for creating promotion
const formData = ref({
  name: '',
  type: 'percentage',
  value: null,
  startDate: '',
  endDate: '',
  productIds: [],
  description: ''
});

const isSubmitting = ref(false);

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Format full date with time
const formatFullDate = (dateString) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Set start date to today at 00:00
const setStartDateToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  formData.value.startDate = today.toISOString().slice(0, 16);
};

// Set start date to tomorrow at 00:00
const setStartDateTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  formData.value.startDate = tomorrow.toISOString().slice(0, 16);
};

// Set start date to N days from now
const setStartDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  formData.value.startDate = date.toISOString().slice(0, 16);
};

// Set end date to N days from start date
const setEndDate = (days) => {
  if (!formData.value.startDate) {
    // If no start date, use today
    setStartDateToday();
  }
  const startDate = new Date(formData.value.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);
  endDate.setHours(23, 59, 59, 0);
  formData.value.endDate = endDate.toISOString().slice(0, 16);
};

// Validate date range
const dateValidationError = computed(() => {
  if (!formData.value.startDate || !formData.value.endDate) return null;
  const startDate = new Date(formData.value.startDate);
  const endDate = new Date(formData.value.endDate);
  if (endDate <= startDate) {
    return 'End date must be after start date';
  }
  return null;
});

// Calculate duration in days
const durationDays = computed(() => {
  if (!formData.value.startDate || !formData.value.endDate) return 0;
  const startDate = new Date(formData.value.startDate);
  const endDate = new Date(formData.value.endDate);
  const diffMs = endDate - startDate;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Helper function to get promotion status
const getPromotionStatus = (promo) => {
  const now = new Date();
  const startDate = new Date(promo.startDate);
  const endDate = new Date(promo.endDate);

  if (now < startDate) return 'upcoming';
  if (now > endDate) return 'expired';
  return 'active';
};

// Get status class for badge styling
const getStatusClass = (promo) => {
  const status = getPromotionStatus(promo);
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'upcoming':
      return 'bg-blue-100 text-blue-700';
    case 'expired':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Get status text
const getStatusText = (promo) => {
  const status = getPromotionStatus(promo);
  switch (status) {
    case 'active':
      return '✓ Active';
    case 'upcoming':
      return '⏰ Upcoming';
    case 'expired':
      return '✕ Expired';
    default:
      return 'Unknown';
  }
};

// Computed properties for stats
const activeCount = computed(() => {
  return promotionStore.promotions.filter(p => getPromotionStatus(p) === 'active').length;
});

const upcomingCount = computed(() => {
  return promotionStore.promotions.filter(p => getPromotionStatus(p) === 'upcoming').length;
});

const expiredCount = computed(() => {
  return promotionStore.promotions.filter(p => getPromotionStatus(p) === 'expired').length;
});

// Filter promotions based on selected status
const filteredPromotions = computed(() => {
  if (filterStatus.value === 'all') {
    return promotionStore.promotions;
  }
  return promotionStore.promotions.filter(p => getPromotionStatus(p) === filterStatus.value);
});

// Available products for selection
const availableProducts = computed(() => {
  return productStore.products || [];
});

// Check if form is valid
const isFormValid = computed(() => {
  return (
    formData.value.name?.trim() &&
    formData.value.value &&
    formData.value.startDate &&
    formData.value.endDate &&
    formData.value.productIds.length > 0 &&
    !dateValidationError.value
  );
});

// Toggle product selection
const toggleProduct = (productId) => {
  const index = formData.value.productIds.indexOf(productId);
  if (index > -1) {
    formData.value.productIds.splice(index, 1);
  } else {
    formData.value.productIds.push(productId);
  }
};

// Create promotion
const createPromotion = async () => {
  if (!isFormValid.value || isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    const promotionData = {
      name: formData.value.name,
      type: formData.value.type,
      value: formData.value.value,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      productIds: formData.value.productIds,
      isActive: true // New promotions are active by default
    };

    // Call the store's createPromotion action
    await promotionStore.createPromotion(promotionData);

    // Show success message (you can add toast notification here)
    alert('Promotion created successfully!');

    // Reset form and close modal
    resetForm();
    showCreateModal.value = false;
  } catch (e) {
    console.error('Error creating promotion:', e);
    alert('Failed to create promotion: ' + e.message);
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form
const resetForm = () => {
  formData.value = {
    name: '',
    type: 'percentage',
    value: null,
    startDate: '',
    endDate: '',
    productIds: [],
    description: ''
  };
};

onMounted(async () => {
  if (!promotionStore.promotions?.length) {
    try {
      await promotionStore.fetchAllPromotions();
    } catch (e) {
      /* noop */
    }
  }
  
  // Load products if not already loaded
  if (!productStore.products?.length) {
    try {
      await productStore.fetchAllProducts();
    } catch (e) {
      /* noop */
    }
  }
});
</script>

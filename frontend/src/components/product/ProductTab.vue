<script setup>
import { ref } from 'vue'

const props = defineProps({
    activeTab: { type: String, default: 'overview' },
    reviews: { type: Array, default: () => [] },
    rating: { type: Number, default: 0 },
    comment: { type: String, default: '' },
    isAuthenticated: { type: Boolean, default: false },
    currentUserId: { type: Number, default: null },
    pagination: { type: Object, default: () => ({ page: 1, limit: 10, total: 0, pages: 0 }) },
    specifications: { type: Array, default: () => [] },
    description: { type: String, default: '' }
})

const emit = defineEmits(['update:activeTab', 'update:rating', 'update:comment', 'submit-review', 'delete-review', 'edit-review', 'update-page', 'close-form'])

const showReviewForm = ref(false)
const editingReviewId = ref(null)
const editingRating = ref(0)
const editingComment = ref('')

const startEdit = (review) => {
    editingReviewId.value = review.id
    editingRating.value = review.rating
    editingComment.value = review.comment
    showReviewForm.value = false
}

const cancelEdit = () => {
    editingReviewId.value = null
    editingRating.value = 0
    editingComment.value = ''
}

const submitEdit = () => {
    if (editingRating.value < 1) return alert('Please select rating (1-5)')
    if (!editingComment.value.trim()) return alert('Please write comment')

    emit('edit-review', {
        reviewId: editingReviewId.value,
        rating: editingRating.value,
        comment: editingComment.value
    })
    cancelEdit()
}
</script>


<template>
    <!-- TAB HEADER (UI) -->
    <div class="border-b-2 border-gray-200 flex gap-8">
        <button type="button" @click="emit('update:activeTab', 'overview')"
            class="py-4 font-semibold text-sm tracking-wide transition-colors duration-200" :class="props.activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-2'
                : 'text-gray-500 hover:text-gray-700'">
            Overview
        </button>

        <button type="button" @click="emit('update:activeTab', 'reviews')"
            class="py-4 font-semibold text-sm tracking-wide transition-colors duration-200" :class="props.activeTab === 'reviews'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-2'
                : 'text-gray-500 hover:text-gray-700'">
            Reviews ({{ reviews.length }})
        </button>
    </div>

    <!-- TAB CONTENT -->
    <div class="mt-8">
        <!-- OVERVIEW TAB -->
        <div v-if="props.activeTab === 'overview'" class="space-y-6">

            <!-- Specifications Table -->
            <div v-if="specifications.length > 0" class="mt-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <table class="w-full">
                        <tbody>
                            <tr v-for="(spec, index) in specifications" :key="spec.id"
                                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                <td class="px-6 py-4 text-sm font-semibold text-gray-700 w-1/3">{{ spec.key }}</td>
                                <td class="px-6 py-4 text-sm text-gray-600">{{ spec.value }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-else class="text-gray-500 italic">
                No specifications available for this product.
            </div>
        </div>

        <!-- REVIEWS TAB -->
        <div v-else class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900">Customer Reviews</h2>

            <!-- LOGIN PROMPT FOR VISITORS -->
            <div v-if="!isAuthenticated" class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded">
                <p class="text-blue-900 font-medium">
                    Sign in to write a review and share your experience with other customers.
                </p>
            </div>

            <!-- WRITE REVIEW BUTTON (only for logged-in users) -->
            <div v-else-if="!showReviewForm" class="flex justify-start">
                <button type="button"
                    class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 active:scale-95"
                    @click="showReviewForm = true">
                    Write a Review
                </button>
            </div>

            <!-- REVIEW FORM (only when user clicks "Write Review") -->
            <div v-if="isAuthenticated && showReviewForm" class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Share Your Review</h3>

                <!-- Rating Stars -->
                <div class="mb-5">
                    <label class="block text-sm font-medium text-gray-700 mb-3">Your Rating</label>
                    <div class="flex items-center gap-3">
                        <button v-for="i in 5" :key="i" type="button"
                            class="text-3xl transition-transform duration-100 hover:scale-125"
                            @click="emit('update:rating', i)">
                            <span :class="i <= rating ? 'text-yellow-400' : 'text-gray-300'">★</span>
                        </button>
                        <span v-if="rating" class="ml-2 text-sm font-medium text-gray-600">
                            {{ rating }} out of 5
                        </span>
                    </div>
                </div>

                <!-- Comment Textarea -->
                <div class="mb-5">
                    <label for="review" class="block text-sm font-medium text-gray-700 mb-2">Your Comment</label>
                    <textarea id="review" rows="4"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Share your experience with this product..." :value="comment"
                        @input="emit('update:comment', $event.target.value)" />
                </div>

                <!-- Submit Button -->
                <div class="flex gap-3">
                    <button type="button"
                        class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 active:scale-95"
                        @click="() => { emit('submit-review'); showReviewForm = false; }">
                        Submit Review
                    </button>
                    <button type="button"
                        class="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
                        @click="showReviewForm = false">
                        Cancel
                    </button>
                </div>
            </div>

            <!-- EXISTING REVIEWS -->
            <div class="mt-8">
                <div v-if="reviews.length === 0" class="text-center py-8">
                    <p class="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </div>

                <div v-else class="space-y-4">
                    <div v-for="r in reviews" :key="r.id"
                        class="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">

                        <!-- Review Header -->
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <p class="font-semibold text-gray-900">{{ r.user?.username || 'Anonymous' }}</p>
                                <p class="text-xs text-gray-500 mt-1">
                                    {{ new Date(r.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month:
                                            'long', day: 'numeric'
                                    }) }}
                                </p>
                            </div>

                            <!-- Edit/Delete Buttons (only for review owner) -->
                            <div v-if="isAuthenticated && currentUserId === r.userId" class="flex gap-2">
                                <button type="button"
                                    class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                    @click="startEdit(r)" title="Edit this review">
                                    Edit
                                </button>
                                <button type="button"
                                    class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                    @click="emit('delete-review', r.id)" title="Delete this review">
                                    Delete
                                </button>
                            </div>
                        </div>

                        <!-- Rating Stars -->
                        <div class="flex gap-1 mb-3">
                            <span v-for="i in 5" :key="i">
                                <span :class="i <= r.rating ? 'text-yellow-400' : 'text-gray-300'">★</span>
                            </span>
                        </div>

                        <!-- Comment Text -->
                        <p class="text-gray-700 leading-relaxed">{{ r.comment }}</p>
                    </div>
                </div>

                <!-- PAGINATION CONTROLS -->
                <div v-if="pagination.pages > 1" class="mt-6 flex items-center justify-center gap-2">
                    <button type="button" :disabled="pagination.page === 1"
                        @click="emit('update-page', pagination.page - 1)"
                        class="px-3 py-1 text-sm font-medium rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Previous
                    </button>
                    <span class="text-sm text-gray-600">
                        Page {{ pagination.page }} of {{ pagination.pages }}
                    </span>
                    <button type="button" :disabled="pagination.page === pagination.pages"
                        @click="emit('update-page', pagination.page + 1)"
                        class="px-3 py-1 text-sm font-medium rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Next
                    </button>
                </div>
            </div>

            <!-- EDIT REVIEW MODAL -->
            <div v-if="editingReviewId"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit Your Review</h3>

                    <!-- Rating Stars -->
                    <div class="mb-5">
                        <label class="block text-sm font-medium text-gray-700 mb-3">Your Rating</label>
                        <div class="flex items-center gap-3">
                            <button v-for="i in 5" :key="i" type="button"
                                class="text-3xl transition-transform duration-100 hover:scale-125"
                                @click="editingRating = i">
                                <span :class="i <= editingRating ? 'text-yellow-400' : 'text-gray-300'">★</span>
                            </button>
                            <span v-if="editingRating" class="ml-2 text-sm font-medium text-gray-600">
                                {{ editingRating }} out of 5
                            </span>
                        </div>
                    </div>

                    <!-- Comment Textarea -->
                    <div class="mb-5">
                        <label for="edit-review" class="block text-sm font-medium text-gray-700 mb-2">Your
                            Comment</label>
                        <textarea id="edit-review" rows="4" v-model="editingComment"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Update your review..." />
                    </div>

                    <!-- Buttons -->
                    <div class="flex gap-3">
                        <button type="button"
                            class="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            @click="submitEdit">
                            Save Changes
                        </button>
                        <button type="button"
                            class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
                            @click="cancelEdit">
                            Cancel
                        </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

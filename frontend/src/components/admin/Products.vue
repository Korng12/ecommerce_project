<template>
  <div class="h-screen bg-gray-50 ">
    <div class="h-full overflow-y-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Product Inventory</h1>
        <p class="text-gray-600 mt-2">Manage your products and stock levels</p>
      </div>

      <!-- Search and Action Bar -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="relative flex-1 max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="search"
              placeholder="Search products by name or SKU..."
              class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
            />
          </div>

          <button
            @click="openModal"
            class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr class="border-b border-gray-200">
                <th class="py-4 pl-6 pr-4 text-left text-sm font-semibold text-gray-900 tracking-wide">IMAGE</th>
                <th class="py-4 px-4 text-left text-sm font-semibold text-gray-900 tracking-wide">PRODUCT</th>
                <th class="py-4 px-4 text-left text-sm font-semibold text-gray-900 tracking-wide">SKU</th>
                <th class="py-4 px-4 text-left text-sm font-semibold text-gray-900 tracking-wide">CATEGORY</th>
                <th class="py-4 px-4 text-left text-sm font-semibold text-gray-900 tracking-wide">PRICE</th>
                <th class="py-4 px-4 text-left text-sm font-semibold text-gray-900 tracking-wide">STOCK</th>
                <th class="py-4 px-4 text-left text-sm font-semibold text-gray-900 tracking-wide">STATUS</th>
                <th class="py-4 px-4 text-left text-sm font-semibold text-gray-900 tracking-wide">ACTIONS</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="p in filteredProducts"
                :key="p.sku"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <!-- Image Column -->
                <td class="py-4 pl-6 pr-4">
                  <div class="relative">
                    <img
                      :src="p.imageUrl || 'https://via.placeholder.com/48'"
                      :alt="p.name"
                      class="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      @error="p.imageUrl = ''"
                    />
                    <div v-if="!p.imageUrl" class="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span class="text-gray-400 text-sm">No image</span>
                    </div>
                  </div>
                </td>

                <!-- Product Name & Description -->
                <td class="py-4 px-4">
                  <div>
                    <span class="font-medium text-gray-900 block">{{ p.name }}</span>
                    <span v-if="p.description" class="text-sm text-gray-500 line-clamp-2 max-w-xs">{{ p.description }}</span>
                  </div>
                </td>

                <!-- SKU -->
                <td class="py-4 px-4">
                  <span class="font-mono text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-md">{{ p.sku }}</span>
                </td>

                <!-- Category -->
                <td class="py-4 px-4">
                  <span class="text-gray-700">{{ p.category || '—' }}</span>
                </td>

                <!-- Price -->
                <td class="py-4 px-4">
                  <span class="font-semibold text-gray-900">${{ Number(p.price).toFixed(2) }}</span>
                </td>

                <!-- Stock -->
                <td class="py-4 px-4">
                  <div class="flex items-center gap-2">
                    <div
                      :class="[
                        'w-2 h-2 rounded-full',
                        p.stock > 10 ? 'bg-green-500' : 
                        p.stock > 0 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      ]"
                    ></div>
                    <span
                      :class="[
                        'font-medium',
                        p.stock > 10 ? 'text-green-700' : 
                        p.stock > 0 ? 'text-yellow-700' : 
                        'text-red-700'
                      ]"
                    >
                      {{ p.stock }}
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td class="py-4 px-4">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      p.stock > 0 
                        ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' 
                        : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                    ]"
                  >
                    {{ p.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </td>

                <!-- Actions Column -->
                <td class="py-4 px-4">
                  <div class="flex items-center gap-2">
                    <button
                      @click="editProduct(p)"
                      class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Edit"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button
                      @click="deleteProduct(p)"
                      class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="py-12 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p class="text-gray-500">No products found</p>
          <p v-if="search" class="text-gray-400 text-sm mt-1">Try adjusting your search</p>
          <button
            v-else
            @click="openModal"
            class="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add your first product
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

      <!-- Modal Content -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl">
          <!-- Header -->
          <div class="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-200 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold text-gray-900" id="modal-title">
                  {{ isEditing ? 'Edit Product' : 'Add New Product' }}
                </h3>
                <p class="text-gray-500 text-sm mt-1">Fill in the product details below</p>
              </div>
              <button
                @click="closeModal"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Form -->
          <div class="px-6 py-4">
            <div class="space-y-6">
              <!-- Image URL -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  Product Image URL
                </label>
                <div class="flex items-center gap-4">
                  <div class="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                    <img
                      v-if="newProduct.imageUrl"
                      :src="newProduct.imageUrl"
                      class="w-full h-full object-cover"
                      @error="newProduct.imageUrl = ''"
                    />
                    <div v-else class="text-gray-400">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <input
                      v-model="newProduct.imageUrl"
                      placeholder="https://example.com/image.jpg"
                      class="w-full text-gray-400 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                    />
                    <p class="text-gray-400 text-sm mt-2">Enter a valid image URL or leave blank for placeholder</p>
                  </div>
                </div>
              </div>

              <!-- Grid Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    Product Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="newProduct.name"
                    placeholder="e.g., Wireless Headphones"
                    class="w-full text-gray-400 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    SKU
                  </label>
                  <input
                    v-model="newProduct.sku"
                    placeholder="Will auto-generate if empty"
                    class="w-full text-gray-400 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    Category
                  </label>
                  <select
                    v-model="newProduct.category"
                    class="w-full text-gray-400 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                  >
                    <option value="">Select category</option>
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Accessories</option>
                    <option>Home & Garden</option>
                    <option>Sports</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    Price <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      v-model.number="newProduct.price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    Stock Quantity <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="newProduct.stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full text-gray-400 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  v-model="newProduct.description"
                  placeholder="Describe the product features, specifications..."
                  rows="3"
                  class="w-full text-gray-400 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-2xl">
            <div class="flex items-center justify-end gap-3">
              <button
                @click="closeModal"
                class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                @click="saveProduct"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                {{ isEditing ? 'Update Product' : 'Add Product' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      showModal: false,
      isEditing: false,
      editingIndex: -1,

      newProduct: {
        imageUrl: "",
        name: "",
        sku: "",
        category: "",
        price: null,
        stock: null,
        description: "",
      },

      products: [
        // Sample data for testing
        {
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
          name: "Wireless Headphones",
          sku: "HP-001",
          category: "Electronics",
          price: 199.99,
          stock: 25,
          description: "Noise-cancelling wireless headphones with premium sound quality",
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=400&fit=crop",
          name: "Smart Watch",
          sku: "SW-002",
          category: "Electronics",
          price: 299.99,
          stock: 5,
          description: "Advanced smartwatch with health monitoring features",
        },
      ],
    };
  },

  computed: {
    filteredProducts() {
      return this.products.filter(
        (p) =>
          p.name.toLowerCase().includes(this.search.toLowerCase()) ||
          p.sku.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },

  methods: {
    openModal() {
      this.isEditing = false;
      this.editingIndex = -1;
      this.showModal = true;
    },

    editProduct(product) {
      this.isEditing = true;
      this.editingIndex = this.products.findIndex(p => p.sku === product.sku);
      this.newProduct = { ...product };
      this.showModal = true;
    },

    deleteProduct(product) {
      if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        this.products = this.products.filter(p => p.sku !== product.sku);
      }
    },

    viewProduct(product) {
      alert(`Viewing: ${product.name}\nDescription: ${product.description}\nPrice: $${product.price}\nStock: ${product.stock}`);
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    saveProduct() {
      if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.stock) {
        alert("Please fill all required fields");
        return;
      }

      if (!this.newProduct.sku) {
        this.newProduct.sku =
          this.newProduct.name.substring(0, 2).toUpperCase() +
          "-" +
          Math.floor(Math.random() * 1000);
      }

      if (this.isEditing && this.editingIndex !== -1) {
        // Update existing product
        this.products[this.editingIndex] = { ...this.newProduct };
      } else {
        // Add new product
        this.products.push({ ...this.newProduct });
      }
      
      this.closeModal();
    },

    resetForm() {
      this.newProduct = {
        imageUrl: "",
        name: "",
        sku: "",
        category: "",
        price: null,
        stock: null,
        description: "",
      };
      this.isEditing = false;
      this.editingIndex = -1;
    },
  },
};
</script>
import { defineStore } from 'pinia'
import getImageUrl from '@/utils/convertImagePath'

const API_URL = '/api/products' // ✅ use Vite proxy

export const useProduct = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),

  /* ================= GETTERS ================= */
  getters: {
    getByCategory: (state) => (catName) => {
      if (!catName) return state.products
      return state.products.filter(
        p =>
          (p.category || '')
            .toLowerCase() === catName.toLowerCase()
      )
    },

    searchSuggestions: (state) => (query) => {
      if (!query) return []
      return state.products
        .filter(p =>
          (p.name || '')
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .slice(0, 5)
    }
  },

  /* ================= ACTIONS ================= */
  actions: {
    normalizeProduct(p) {
      const primaryImage =
        p.images?.find(i => i.isPrimary) || p.images?.[0]

      return {
        id: p.id,
        name: p.name,
        description: p.description || '',
        price: p.price,
        stock: p.stock,

        image: primaryImage?.imageUrl
          ? getImageUrl(primaryImage.imageUrl)
          : '',

        brand: p.brand?.name || '',
        brandId: p.brand?.id ?? null,

        category: p.category?.name || '',
        categoryId: p.category?.id ?? null,

        rating: p.rating || 0
      }
    },

    async fetchAllProducts() {
      this.loading = true
      this.error = null

      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error('Failed to fetch products')

        const data = await res.json()

        // ✅ keep `this` context
        this.products = Array.isArray(data)
          ? data.map(p => this.normalizeProduct(p))
          : []
      } catch (err) {
        console.error(err)
        this.error = err.message
        this.products = []
      } finally {
        this.loading = false
      }
    },

    async createProduct(form, imageFile) {
      this.error = null

      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('price', Number(form.price))
      fd.append('stock', Number(form.stock))
      fd.append('categoryId', Number(form.categoryId))
      fd.append('description', form.description || '')

      if (form.brandId) fd.append('brandId', Number(form.brandId))
      if (imageFile) fd.append('image', imageFile)

      const res = await fetch(API_URL, {
        method: 'POST',
        body: fd
      })

      if (!res.ok) throw new Error('Create product failed')

      const newProduct = await res.json()
      this.products.unshift(this.normalizeProduct(newProduct))
    },

    async updateProduct(id, form, imageFile) {
      this.error = null

      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('price', Number(form.price))
      fd.append('stock', Number(form.stock))
      fd.append('categoryId', Number(form.categoryId))
      fd.append('description', form.description || '')

      if (form.brandId) fd.append('brandId', Number(form.brandId))
      if (imageFile) fd.append('image', imageFile)

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: fd
      })

      if (!res.ok) throw new Error('Update failed')

      const updated = await res.json()
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) {
        this.products[index] = this.normalizeProduct(updated)
      }
    },

    async deleteProduct(id) {
      this.error = null

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Delete failed')

      this.products = this.products.filter(p => p.id !== id)
    }
  }
})

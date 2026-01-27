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
      return state.products.filter(p => (p.name || '').toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    },
    getProductsByBrand: (state) => (brandName) => {
      if (!brandName) return state.products
      return state.products.filter(p => (p.brand || '').toLowerCase() === brandName.toLowerCase())
    },
    getPopularProducts: (state) => {
      return state.products
        .slice()
        .sort((a, b) => b.totalReviews - a.totalReviews)
      // .slice(0,10)
    }

  },
  actions: {
    async fetchAllProducts() {
      try {
        const res = await fetch('http://localhost:3000/api/products')
        if (!res.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await res.json()
        // Normalize backend shape to what the UI expects
        this.products = Array.isArray(data) ? data.map(p => {
          const primaryImage = (p.images && Array.isArray(p.images)) ? (p.images.find(i => i.isPrimary) || p.images[0]) : null
          // Construct full backend URL for images
          const imageUrl = primaryImage?.imageUrl || ''
          const image = imageUrl ? getImageUrl(imageUrl) : ''

          // Get active promotion if available
          const activePromotion = p.promotions && Array.isArray(p.promotions)
            ? p.promotions.find(promo => promo.isActive && new Date(promo.startDate) <= new Date() && new Date() <= new Date(promo.endDate))
            : null

          // Format promotion text based on type
          let promotionText = ''
          let promotionDiscount = null
          if (activePromotion) {
            if (activePromotion.type === 'percentage') {
              promotionDiscount = parseFloat(activePromotion.value)
              promotionText = `${activePromotion.value}% OFF`
            } else if (activePromotion.type === 'fixed_amount') {
              promotionDiscount = parseFloat(activePromotion.value)
              promotionText = `$${activePromotion.value} OFF`
            }
            // Add name if available
            if (activePromotion.name) {
              promotionText = `${activePromotion.name} - ${promotionText}`
            }
          }

          return {
            id: p.id,
            name: p.name,
            price: p.price,
            image,
            brand: p.brand?.name || '',
            category: p.category?.name || '',
            rating: Number(p.averageRating || 0),
            totalReviews: p.totalReviews || 0,
            description: p.description || '',
            promotion: promotionText || null,
            promotionDiscount: promotionDiscount,
            promotionType: activePromotion?.type || null,
            stock: p.stock || 0
          }
        }) : []
      } catch (err) {
        console.error('Failed to fetch products:', err)
        this.products = []
        throw err
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
        this.products = data.map(p => {
          const primaryImage = p.images?.find(i => i.isPrimary) || p.images?.[0]
          return {
            id: p.id,
            name: p.name,
            description: p.description || '',
            price: p.price,
            stock: p.stock,
            image: primaryImage?.imageUrl ? getImageUrl(primaryImage.imageUrl) : '',
            brand: p.brand?.name || '',
            brandId: p.brand?.id ?? null,
            category: p.category?.name || '',
            categoryId: p.category?.id ?? null,
            rating: p.rating || 0
          }
        })
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

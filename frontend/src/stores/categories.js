import { defineStore } from 'pinia'
import getImageUrl from '@/utils/convertImagePath'

const API_URL = '/api/categories'

export const useCategory = defineStore('categories', {
  state: () => ({
    categories: [],
    loading: false,
    error: null
  }),

  getters: {
    getCategoryById: (state) => (id) =>
      state.categories.find(c => c.id === id),

    totalCategories: (state) => state.categories.length
  },

  actions: {
    /* ================= FETCH ================= */
    async fetchAllCategories() {
      this.loading = true
      this.error = null

      try {
        const res = await fetch(API_URL, {
          credentials: 'include' // Include cookies for auth
        })
        if (!res.ok) throw new Error('Failed to fetch categories')

        const data = await res.json()

        this.categories = Array.isArray(data)
          ? data.map(c => ({
              id: c.id,
              name: c.name,
              description: c.description || '',
              image: c.image ? getImageUrl(c.image) : '',
              products: c.products ? c.products : []
            }))
          : []
      } catch (err) {
        console.error('❌ Failed to fetch categories:', err)
        this.categories = []
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    /* ================= CREATE ================= */
    async createCategory(categoryData) {
      this.loading = true
      this.error = null

      try {
        const options = { 
          method: 'POST',
          credentials: 'include' // Important: send cookies for auth
        }

        // Don't set Content-Type header for FormData - browser will set it with boundary
        if (!(categoryData instanceof FormData)) {
          options.headers = { 'Content-Type': 'application/json' }
          options.body = JSON.stringify(categoryData)
        } else {
          options.body = categoryData
        }

        const res = await fetch(API_URL, options)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Failed to create category' }))
          throw new Error(errorData.message || 'Failed to create category')
        }

        const responseData = await res.json()
        // Backend returns { message: '...', category: {...} }
        const newCategory = responseData.category || responseData
        
        const normalizedCategory = {
          id: newCategory.id,
          name: newCategory.name,
          description: newCategory.description || '',
          image: newCategory.image ? getImageUrl(newCategory.image) : ''
        }
        
        this.categories.push(normalizedCategory)
        return normalizedCategory
      } catch (err) {
        console.error('❌ Failed to create category:', err)
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /* ================= UPDATE ================= */
    async updateCategory(id, categoryData) {
      this.loading = true
      this.error = null

      try {
        const options = { 
          method: 'PUT',
          credentials: 'include' // Important: send cookies for auth
        }

        // Don't set Content-Type header for FormData
        if (!(categoryData instanceof FormData)) {
          options.headers = { 'Content-Type': 'application/json' }
          options.body = JSON.stringify(categoryData)
        } else {
          options.body = categoryData
        }

        const res = await fetch(`${API_URL}/${id}`, options)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Failed to update category' }))
          throw new Error(errorData.message || 'Failed to update category')
        }


        const responseData = await res.json()
        // Backend returns { message: '...', category: {...} }
        const updated = responseData.category || responseData
        
        const normalizedCategory = {
          id: updated.id,
          name: updated.name,
          description: updated.description || '',
          image: updated.image ? getImageUrl(updated.image) : ''
        }

        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) {
          this.categories[index] = normalizedCategory
        }

        return normalizedCategory
      } catch (err) {
        console.error('❌ Failed to update category:', err)
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    /* ================= DELETE ================= */
    async deleteCategory(id) {
      this.loading = true
      this.error = null

      try {
        const res = await fetch(`${API_URL}/${id}`, { 
          method: 'DELETE',
          credentials: 'include' // Important: send cookies for auth
        })
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Failed to delete category' }))
          throw new Error(errorData.message || 'Failed to delete category')
        }

        this.categories = this.categories.filter(c => c.id !== id)
        return true
      } catch (err) {
        console.error('❌ Failed to delete category:', err)
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})

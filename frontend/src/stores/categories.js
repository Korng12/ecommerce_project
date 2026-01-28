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
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error('Failed to fetch categories')

        const data = await res.json()

        this.categories = Array.isArray(data)
          ? data.map(c => ({
              id: c.id,
              name: c.name,
              description: c.description || '',
              image: c.image ? getImageUrl(c.image) : ''
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
        const options = { method: 'POST' }

        if (categoryData instanceof FormData) {
          options.body = categoryData
        } else {
          options.headers = { 'Content-Type': 'application/json' }
          options.body = JSON.stringify(categoryData)
        }

        const res = await fetch(`${API_URL}?subdir=categories`, options)
        if (!res.ok) throw new Error('Failed to create category')

        const newCategory = await res.json()
        const normalizedCategory = {...newCategory, image: newCategory.image ? getImageUrl(newCategory.image) : ''}
        this.categories.push(normalizedCategory)
      

        this.categories.push({
          id: newCategory.id,
          name: newCategory.name,
          description: newCategory.description || '',
          image: newCategory.image ? getImageUrl(newCategory.image) : ''
        })

        return newCategory
      } catch (err) {
        console.error('❌ Failed to create category:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    /* ================= UPDATE ================= */
    async updateCategory(id, categoryData) {
      this.loading = true
      this.error = null

      try {
        const options = { method: 'PUT' }

        if (categoryData instanceof FormData) {
          options.body = categoryData
        } else {
          options.headers = { 'Content-Type': 'application/json' }
          options.body = JSON.stringify(categoryData)
        }

        const res = await fetch(`${API_URL}/${id}?subdir=categories`, options)
        if (!res.ok) throw new Error('Failed to update category')

        const updated = await res.json()

        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) {
          this.categories[index] = {
            id: updated.id,
            name: updated.name,
            description: updated.description || '',
            image: updated.image ? getImageUrl(updated.image) : ''
          }
        }

        return updated
      } catch (err) {
        console.error('❌ Failed to update category:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    /* ================= DELETE ================= */
    async deleteCategory(id) {
      this.loading = true
      this.error = null

      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete category')

        this.categories = this.categories.filter(c => c.id !== id)
        return true
      } catch (err) {
        console.error('❌ Failed to delete category:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})

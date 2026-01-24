
import { defineStore } from "pinia";

const API_URL = 'http://localhost:3000/api';

export const useCategory=defineStore('categoryStore',{
  state:()=>({
    categories:[],
    loading: false,
    error: null
  }),
  getters:{
    getCategoryById: (state) => (id) => {
      return state.categories.find(c => c.id === id)
    },
    totalCategories: (state) => state.categories.length
  },
  actions:{
    async fetchAllCategories(){
      this.loading = true
      this.error = null
      try{
        const res = await fetch(`${API_URL}/categories`)
        if(!res.ok){
          throw new Error('Failed to fetch categories')
        }
        const data = await res.json()
        this.categories = Array.isArray(data) ? data.map(c=>({
          id:c.id,
          name:c.name,
          description:c.description,
          image:c.image
        })) : []
      }catch(err){
        console.error('Failed to fetch categories:',err)
        this.error = err.message
        this.categories=[]
        throw err
      } finally {
        this.loading = false
      }
    },

    async createCategory(categoryData) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API_URL}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData)
        })
        
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message || 'Failed to create category')
        }
        
        const newCategory = await res.json()
        this.categories.push(newCategory)
        return newCategory
      } catch (err) {
        console.error('Failed to create category:', err)
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateCategory(id, categoryData) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API_URL}/categories/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData)
        })
        
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message || 'Failed to update category')
        }
        
        const updatedCategory = await res.json()
        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) {
          this.categories[index] = updatedCategory
        }
        return updatedCategory
      } catch (err) {
        console.error('Failed to update category:', err)
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(id) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API_URL}/categories/${id}`, {
          method: 'DELETE'
        })
        
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message || 'Failed to delete category')
        }
        
        this.categories = this.categories.filter(c => c.id !== id)
        return true
      } catch (err) {
        console.error('Failed to delete category:', err)
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
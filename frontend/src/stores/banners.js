import { defineStore } from 'pinia'

const API_URL = '/api/banners'

export const useBannerStore = defineStore('banners', {
  state: () => ({
    banners: [],
    loading: false,
    error: null
  }),

  /* ================= GETTERS ================= */
  getters: {
    totalBanners: (state) => state.banners.length,

    activeBanners: (state) =>
      state.banners.filter(b => b.status === 'active')
  },

  /* ================= ACTIONS ================= */
  actions: {
    async fetchBanners() {
      this.loading = true
      this.error = null

      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error('Failed to fetch banners')

        const data = await res.json()

        // normalize data (safe)
        this.banners = Array.isArray(data) ? data : []
      } catch (err) {
        this.error = err.message
        this.banners = []
      } finally {
        this.loading = false
      }
    },

    async createBanner(form) {
      this.error = null

      try {
        const fd = new FormData()
        Object.entries(form).forEach(([key, value]) => {
          if (value !== null && value !== '') {
            fd.append(key, value)
          }
        })

        const res = await fetch(API_URL, {
          method: 'POST',
          body: fd
        })

        if (!res.ok) throw new Error('Create banner failed')

        const banner = await res.json()
        this.banners.unshift(banner)

        return banner
      } catch (err) {
        this.error = err.message
        throw err
      }
    },

    async updateBanner(id, form) {
      this.error = null

      try {
        const fd = new FormData()
        Object.entries(form).forEach(([key, value]) => {
          if (value !== null && value !== '') {
            fd.append(key, value)
          }
        })

        const res = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          body: fd
        })

        if (!res.ok) throw new Error('Update banner failed')

        const updated = await res.json()
        const index = this.banners.findIndex(b => b.id === id)

        if (index !== -1) {
          this.banners[index] = updated
        }

        return updated
      } catch (err) {
        this.error = err.message
        throw err
      }
    },

    async deleteBanner(id) {
      this.error = null

      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        })

        if (!res.ok) throw new Error('Delete banner failed')

        this.banners = this.banners.filter(b => b.id !== id)
      } catch (err) {
        this.error = err.message
        throw err
      }
    }
  }
})

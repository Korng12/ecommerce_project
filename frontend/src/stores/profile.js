import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const useProfile = defineStore('profile', {
  state: () => ({
    user: {
      id: null,
      username: '',
      email: '',
      roleId: null,
      role: null
    },
    loading: false,
    error: null
  }),

  getters: {
    isProfileLoaded: (state) => state.user.id !== null
  },

  actions: {
    async fetchProfile() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/profile`, {
          withCredentials: true
        })
        this.user = response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch profile'
        console.error('Fetch profile error:', err)
      } finally {
        this.loading = false
      }
    },

    async updateProfile(username, email) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.put(`${API_URL}/profile`, {
          username,
          email
        }, {
          withCredentials: true
        })
        this.user = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update profile'
        console.error('Update profile error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updatePassword(currentPassword, newPassword) {
      this.loading = true
      this.error = null
      try {
        await axios.put(`${API_URL}/profile/password`, {
          currentPassword,
          newPassword
        }, {
          withCredentials: true
        })
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update password'
        console.error('Update password error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    clearProfile() {
      this.user = {
        id: null,
        username: '',
        email: '',
        roleId: null,
        role: null
      }
      this.error = null
    }
  }
})

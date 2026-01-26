import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class FooterService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 30000 // 30 seconds
  }

  // Get cached data or fetch fresh data
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const data = await fetchFunction()
      this.cache.set(key, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        return cached.data
      }
      throw error
    }
  }

  // Get public footer data
  async getPublicFooterData(page = 'home') {
    return await this.getCachedData(`public-${page}`, async () => {
      const response = await axios.get(`${API_URL}/api/footer/public?page=${page}`)
      return response.data.data
    })
  }

  // Get admin footer data
  async getAdminFooterData(page = 'dashboard') {
    return await this.getCachedData(`admin-${page}`, async () => {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/footer/admin?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data.data
    })
  }

  // Get footer statistics
  async getFooterStats(context = 'public') {
    return await this.getCachedData(`stats-${context}`, async () => {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      const response = await axios.get(`${API_URL}/api/footer/stats?context=${context}`, {
        headers
      })
      return response.data.data
    })
  }

  // Get contextual navigation
  async getContextualNavigation(page) {
    return await this.getCachedData(`nav-${page}`, async () => {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      const response = await axios.get(`${API_URL}/api/footer/navigation/${page}`, {
        headers
      })
      return response.data.data
    })
  }

  // Get social media links
  async getSocialLinks() {
    return await this.getCachedData('social', async () => {
      const response = await axios.get(`${API_URL}/api/footer/social`)
      return response.data.data
    })
  }

  // Get system announcements
  async getSystemAnnouncements() {
    return await this.getCachedData('announcements', async () => {
      const response = await axios.get(`${API_URL}/api/footer/announcements`)
      return response.data.data
    })
  }

  // Subscribe to newsletter
  async subscribeToNewsletter(email, preferences = []) {
    try {
      const response = await axios.post(`${API_URL}/api/footer/newsletter/subscribe`, {
        email,
        preferences
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to subscribe to newsletter')
    }
  }

  // Get newsletter statistics (admin only)
  async getNewsletterStats() {
    return await this.getCachedData('newsletter-stats', async () => {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/footer/newsletter/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data.data
    })
  }

  // Get system health (admin only)
  async getSystemHealth() {
    return await this.getCachedData('system-health', async () => {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/footer/health`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data.data
    })
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Clear specific cache entry
  clearCacheEntry(key) {
    this.cache.delete(key)
  }

  // Get comprehensive footer data based on context
  async getFooterData(context = 'public', page = 'home') {
    try {
      if (context === 'admin') {
        return await this.getAdminFooterData(page)
      } else {
        return await this.getPublicFooterData(page)
      }
    } catch (error) {
      console.error('Failed to fetch footer data:', error)
      // Return minimal fallback data
      return {
        stats: {
          totalEvents: 0,
          totalUsers: 0,
          todayRegistrations: 0,
          onlineUsers: 0
        },
        links: {},
        socialLinks: [],
        contextualNavigation: [],
        announcements: [],
        timestamp: new Date()
      }
    }
  }
}

export default new FooterService()
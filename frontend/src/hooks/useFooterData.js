import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import footerService from '../services/footerService'

export const useFooterData = (refreshInterval = 60000) => {
  const location = useLocation()
  const [footerData, setFooterData] = useState({
    stats: {
      totalEvents: 0,
      totalUsers: 0,
      todayRegistrations: 0,
      onlineUsers: 0,
      systemLoad: 0
    },
    links: {},
    socialLinks: [],
    contextualNavigation: [],
    announcements: [],
    newsletterStats: null,
    systemHealth: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Determine context and page from current location
  const getContextAndPage = useCallback(() => {
    const path = location.pathname
    
    if (path.startsWith('/admin')) {
      const page = path.split('/')[2] || 'dashboard'
      return { context: 'admin', page }
    }
    
    if (path.startsWith('/events')) {
      return { context: 'public', page: 'events' }
    }
    
    if (path.startsWith('/profile')) {
      return { context: 'public', page: 'profile' }
    }
    
    return { context: 'public', page: 'home' }
  }, [location.pathname])

  // Fetch footer data
  const fetchFooterData = useCallback(async () => {
    try {
      setError(null)
      const { context, page } = getContextAndPage()
      
      const data = await footerService.getFooterData(context, page)
      
      setFooterData(prevData => ({
        ...prevData,
        ...data,
        stats: {
          ...prevData.stats,
          ...data.stats
        }
      }))
      
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch footer data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getContextAndPage])

  // Fetch only stats (lighter request)
  const fetchStats = useCallback(async () => {
    try {
      const { context } = getContextAndPage()
      const stats = await footerService.getFooterStats(context)
      
      setFooterData(prevData => ({
        ...prevData,
        stats: {
          ...prevData.stats,
          ...stats
        }
      }))
      
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch footer stats:', err)
    }
  }, [getContextAndPage])

  // Subscribe to newsletter
  const subscribeToNewsletter = useCallback(async (email, preferences = []) => {
    try {
      const result = await footerService.subscribeToNewsletter(email, preferences)
      return result
    } catch (err) {
      throw new Error(err.message)
    }
  }, [])

  // Refresh all data
  const refreshData = useCallback(() => {
    setLoading(true)
    fetchFooterData()
  }, [fetchFooterData])

  // Clear cache
  const clearCache = useCallback(() => {
    footerService.clearCache()
    refreshData()
  }, [refreshData])

  // Initial load
  useEffect(() => {
    fetchFooterData()
  }, [fetchFooterData])

  // Set up periodic refresh for stats
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchStats, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchStats, refreshInterval])

  // Refetch when location changes
  useEffect(() => {
    fetchFooterData()
  }, [location.pathname, fetchFooterData])

  return {
    footerData,
    loading,
    error,
    lastUpdated,
    refreshData,
    fetchStats,
    subscribeToNewsletter,
    clearCache,
    // Computed values
    isAdminContext: getContextAndPage().context === 'admin',
    currentPage: getContextAndPage().page,
    hasAnnouncements: footerData.announcements?.length > 0
  }
}
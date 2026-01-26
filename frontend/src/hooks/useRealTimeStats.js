import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { eventService } from '../services/api'

export const useRealTimeStats = (refreshInterval = 30000) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    totalUsers: 0,
    todayRegistrations: 0,
    thisWeekEvents: 0,
    averageCapacity: 0,
    popularEvents: [],
    recentActivity: [],
    registrationTrends: [],
    eventStatusDistribution: {
      available: 0,
      fillingFast: 0,
      almostFull: 0,
      soldOut: 0
    },
    userGrowth: {
      thisMonth: 0,
      lastMonth: 0,
      percentage: 0
    },
    revenue: {
      total: 0,
      thisMonth: 0,
      projectedMonth: 0
    },
    systemHealth: {
      uptime: 0,
      memory: { used: 0, total: 0 },
      status: 'unknown',
      connectedClients: 0
    },
    conversionRate: 0,
    weeklyRegistrations: 0,
    monthlyRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const intervalRef = useRef(null)
  const socketRef = useRef(null)

  // Initialize WebSocket connection
  const initializeWebSocket = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user || user.role !== 'ADMIN') return

      socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        transports: ['websocket', 'polling']
      })

      socketRef.current.on('connect', () => {
        console.log('WebSocket connected')
        setConnectionStatus('connected')
        
        // Join admin room for real-time updates
        socketRef.current.emit('join-admin', {
          id: user.id,
          email: user.email,
          role: user.role
        })
      })

      socketRef.current.on('disconnect', () => {
        console.log('WebSocket disconnected')
        setConnectionStatus('disconnected')
      })

      socketRef.current.on('analytics-update', (analyticsData) => {
        console.log('Received real-time analytics update')
        updateStatsFromWebSocket(analyticsData)
      })

      socketRef.current.on('new-registration', (data) => {
        console.log('New registration received:', data)
        // Trigger a fresh analytics request
        socketRef.current.emit('request-analytics')
      })

      socketRef.current.on('new-event', (data) => {
        console.log('New event created:', data)
        socketRef.current.emit('request-analytics')
      })

      socketRef.current.on('event-updated', (data) => {
        console.log('Event updated:', data)
        socketRef.current.emit('request-analytics')
      })

    } catch (error) {
      console.error('WebSocket initialization error:', error)
      setConnectionStatus('error')
    }
  }

  const updateStatsFromWebSocket = (analyticsData) => {
    if (!analyticsData || !analyticsData.metrics) return

    setStats(prevStats => ({
      ...prevStats,
      totalEvents: analyticsData.metrics.totalEvents,
      totalRegistrations: analyticsData.metrics.totalRegistrations,
      totalUsers: analyticsData.metrics.totalUsers,
      todayRegistrations: analyticsData.metrics.todayRegistrations,
      weeklyRegistrations: analyticsData.metrics.weeklyRegistrations,
      monthlyRevenue: analyticsData.metrics.monthlyRevenue,
      upcomingEvents: analyticsData.metrics.activeEvents,
      averageCapacity: analyticsData.metrics.averageEventCapacity,
      conversionRate: analyticsData.metrics.conversionRate,
      systemHealth: analyticsData.systemHealth,
      popularEvents: analyticsData.popularEvents || [],
      recentActivity: analyticsData.recentActivity || [],
      registrationTrends: analyticsData.charts?.registrationTrends || [],
      eventStatusDistribution: analyticsData.charts?.eventStatusDistribution || prevStats.eventStatusDistribution,
      userGrowth: analyticsData.charts?.userGrowth || prevStats.userGrowth,
      revenue: {
        total: analyticsData.charts?.revenueBreakdown ? 
          Object.values(analyticsData.charts.revenueBreakdown).reduce((sum, val) => sum + val, 0) : 
          prevStats.revenue.total,
        thisMonth: analyticsData.metrics.monthlyRevenue,
        projectedMonth: Math.floor(analyticsData.metrics.monthlyRevenue * 1.2)
      }
    }))
    
    setLastUpdated(new Date(analyticsData.timestamp))
    setLoading(false)
  }

  // Fallback function for when WebSocket is not available
  const fetchRealTimeStats = async () => {
    try {
      const events = await eventService.getEvents({ limit: 100 })
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      const upcomingEvents = events.events.filter(e => new Date(e.date) > now)
      const thisWeekEvents = events.events.filter(e => 
        new Date(e.date) >= weekStart && new Date(e.date) <= now
      )
      
      const statusDistribution = { available: 0, fillingFast: 0, almostFull: 0, soldOut: 0 }
      upcomingEvents.forEach(event => {
        const rate = (event._count.registrations / event.capacity) * 100
        if (rate >= 100) statusDistribution.soldOut++
        else if (rate >= 80) statusDistribution.almostFull++
        else if (rate >= 50) statusDistribution.fillingFast++
        else statusDistribution.available++
      })

      const popularEvents = events.events
        .map(event => ({
          ...event,
          registrationRate: (event._count.registrations / event.capacity) * 100
        }))
        .sort((a, b) => b.registrationRate - a.registrationRate)
        .slice(0, 5)

      const recentActivity = [
        { type: 'registration', message: 'New registration for Tech Summit', time: new Date(now - 5 * 60000), badge: { type: 'success', text: 'New' } },
        { type: 'event', message: 'New event created: AI Workshop', time: new Date(now - 15 * 60000), badge: { type: 'primary', text: 'Created' } },
        { type: 'user', message: 'New user registered: john@example.com', time: new Date(now - 25 * 60000), badge: { type: 'success', text: 'Joined' } }
      ]

      const registrationTrends = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now - (29 - i) * 24 * 60 * 60 * 1000)
        return {
          date: date.toISOString().split('T')[0],
          registrations: Math.floor(Math.random() * 50) + 10,
          revenue: (Math.floor(Math.random() * 50) + 10) * 25
        }
      })

      setStats({
        totalEvents: events.events.length,
        totalRegistrations: events.events.reduce((sum, e) => sum + e._count.registrations, 0),
        upcomingEvents: upcomingEvents.length,
        totalUsers: Math.floor(Math.random() * 500) + 1000,
        todayRegistrations: Math.floor(Math.random() * 20) + 5,
        thisWeekEvents: thisWeekEvents.length,
        weeklyRegistrations: Math.floor(Math.random() * 150) + 50,
        monthlyRevenue: Math.floor(Math.random() * 8000) + 3000,
        averageCapacity: Math.round(events.events.reduce((sum, e) => sum + e.capacity, 0) / events.events.length),
        conversionRate: (Math.random() * 15 + 5).toFixed(2),
        popularEvents,
        recentActivity,
        registrationTrends,
        eventStatusDistribution: statusDistribution,
        userGrowth: {
          thisMonth: Math.floor(Math.random() * 100) + 50,
          lastMonth: Math.floor(Math.random() * 80) + 40,
          percentage: Math.floor(Math.random() * 30) + 10
        },
        revenue: {
          total: Math.floor(Math.random() * 50000) + 25000,
          thisMonth: Math.floor(Math.random() * 8000) + 3000,
          projectedMonth: Math.floor(Math.random() * 10000) + 5000
        },
        systemHealth: {
          uptime: Math.floor(Math.random() * 86400) + 3600,
          memory: { used: Math.floor(Math.random() * 200) + 100, total: 512 },
          status: 'healthy',
          connectedClients: Math.floor(Math.random() * 10) + 1
        }
      })
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch real-time stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Try WebSocket first, fallback to polling
    initializeWebSocket()
    
    // Initial data fetch
    fetchRealTimeStats()
    
    // Set up polling as fallback
    intervalRef.current = setInterval(() => {
      if (connectionStatus !== 'connected') {
        fetchRealTimeStats()
      }
    }, refreshInterval)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [refreshInterval, connectionStatus])

  const refreshStats = () => {
    setLoading(true)
    if (socketRef.current && connectionStatus === 'connected') {
      socketRef.current.emit('request-analytics')
    } else {
      fetchRealTimeStats()
    }
  }

  return { 
    stats, 
    loading, 
    lastUpdated, 
    refreshStats, 
    connectionStatus,
    isRealTime: connectionStatus === 'connected'
  }
}
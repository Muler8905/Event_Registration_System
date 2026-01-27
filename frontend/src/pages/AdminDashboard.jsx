import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Plus, Edit, Trash2, Calendar, Users, TrendingUp, Eye, BarChart3, X, 
  UserCheck, Settings as SettingsIcon, FileText, RefreshCw, Download,
  Zap, Bell, Activity, Clock, ArrowUp, ArrowDown
} from 'lucide-react'
import { eventService } from '../services/api'
import StatsCard from '../components/StatsCard'
import LoadingSpinner from '../components/LoadingSpinner'
import UserManagement from './UserManagement'
import RegistrationManagement from './RegistrationManagement'
import SystemSettings from './SystemSettings'
import NavigationBreadcrumb from '../components/NavigationBreadcrumb'
import RealTimeChart from '../components/RealTimeChart'
import ActivityFeed from '../components/ActivityFeed'
import QuickActions from '../components/QuickActions'
import DynamicFooter from '../components/DynamicFooter'
import { useRealTimeStats } from '../hooks/useRealTimeStats'
import toast from 'react-hot-toast'

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal(''))
})

const AdminDashboard = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [navigationHistory, setNavigationHistory] = useState(['overview'])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)

  // Real-time stats hook
  const { 
    stats: realTimeStats, 
    loading: statsLoading, 
    lastUpdated, 
    refreshStats, 
    connectionStatus, 
    isRealTime 
  } = useRealTimeStats(30000)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(eventSchema)
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await eventService.getEvents({ limit: 50 })
      setEvents(response.events)
    } catch (error) {
      toast.error('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      // Update navigation history
      const newHistory = navigationHistory.slice(0, currentHistoryIndex + 1)
      newHistory.push(newTab)
      setNavigationHistory(newHistory)
      setCurrentHistoryIndex(newHistory.length - 1)
      setActiveTab(newTab)
    }
  }

  const handleNavigationBack = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1
      setCurrentHistoryIndex(newIndex)
      setActiveTab(navigationHistory[newIndex])
    }
  }

  const handleNavigationForward = () => {
    if (currentHistoryIndex < navigationHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1
      setCurrentHistoryIndex(newIndex)
      setActiveTab(navigationHistory[newIndex])
    }
  }

  const onSubmit = async (data) => {
    try {
      const eventData = {
        ...data,
        capacity: parseInt(data.capacity),
        imageUrl: data.imageUrl || null
      }

      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, eventData)
        toast.success('Event updated successfully! 🎉')
      } else {
        await eventService.createEvent(eventData)
        toast.success('Event created successfully! 🚀')
      }

      setShowForm(false)
      setEditingEvent(null)
      reset()
      fetchEvents()
      refreshStats()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed')
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    reset({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().slice(0, 16),
      capacity: event.capacity,
      imageUrl: event.imageUrl || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    try {
      await eventService.deleteEvent(eventId)
      setEvents(prev => prev.filter(event => event.id !== eventId))
      toast.success('Event deleted successfully')
      refreshStats()
    } catch (error) {
      toast.error('Failed to delete event')
    }
  }

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'create-event':
        setShowForm(true)
        setEditingEvent(null)
        reset()
        break
      case 'manage-users':
        handleTabChange('users')
        break
      case 'view-registrations':
        handleTabChange('registrations')
        break
      case 'system-settings':
        handleTabChange('settings')
        break
      case 'export-data':
        exportAllData()
        break
      case 'send-newsletter':
        toast.info('Newsletter feature coming soon!')
        break
      case 'analytics':
        toast.info('Advanced analytics coming soon!')
        break
      case 'quick-setup':
        toast.info('Quick setup wizard coming soon!')
        break
      default:
        toast.info(`${actionId} feature coming soon!`)
    }
  }

  const exportAllData = () => {
    // Mock export functionality
    const data = {
      events: events.length,
      registrations: realTimeStats.totalRegistrations,
      users: realTimeStats.totalUsers,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `eventhub-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Data exported successfully!')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEventStatus = (event) => {
    const now = new Date()
    const eventDate = new Date(event.date)
    const registrationRate = (event._count.registrations / event.capacity) * 100

    if (eventDate < now) return { text: 'Completed', color: 'bg-gray-500' }
    if (registrationRate >= 100) return { text: 'Sold Out', color: 'bg-danger-500' }
    if (registrationRate >= 80) return { text: 'Almost Full', color: 'bg-warning-500' }
    if (registrationRate >= 50) return { text: 'Filling Fast', color: 'bg-primary-500' }
    return { text: 'Available', color: 'bg-success-500' }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'users', name: 'Users', icon: UserCheck },
    { id: 'registrations', name: 'Registrations', icon: FileText },
    { id: 'settings', name: 'Settings', icon: SettingsIcon }
  ]

  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: tabs.find(t => t.id === activeTab)?.name || 'Dashboard' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-6 text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Breadcrumb */}
      <NavigationBreadcrumb
        items={breadcrumbItems}
        onBack={handleNavigationBack}
        onForward={handleNavigationForward}
        canGoBack={currentHistoryIndex > 0}
        canGoForward={currentHistoryIndex < navigationHistory.length - 1}
      />

      <div className="flex-1 space-y-8 animate-fade-in p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient mb-2">Admin Dashboard</h1>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-gray-600 text-lg">Manage your events and monitor performance</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <div className={`flex items-center space-x-1 ml-2 ${
                  connectionStatus === 'connected' ? 'text-success-600' : 
                  connectionStatus === 'error' ? 'text-danger-600' : 'text-warning-600'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    connectionStatus === 'connected' ? 'status-online' : 
                    connectionStatus === 'error' ? 'status-error' : 'status-warning'
                  }`}></div>
                  <span className="text-xs font-medium">
                    {connectionStatus === 'connected' ? 'Live' : 
                     connectionStatus === 'error' ? 'Offline' : 'Connecting...'}
                  </span>
                </div>
                <button
                  onClick={refreshStats}
                  className="text-primary-600 hover:text-primary-700 ml-2 p-1 rounded-lg hover:bg-primary-50 transition-all duration-200"
                  title="Refresh data"
                >
                  <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {activeTab === 'events' && (
              <button
                onClick={() => handleQuickAction('create-event')}
                className="btn btn-primary flex items-center space-x-2 shadow-glow"
              >
                <Plus className="h-5 w-5" />
                <span>Create Event</span>
              </button>
            )}
            
            <button
              onClick={exportAllData}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="border-b border-gray-200 bg-white rounded-t-2xl shadow-soft">
          <nav className="-mb-px flex space-x-8 overflow-x-auto px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-3 font-semibold text-sm transition-all duration-300 whitespace-nowrap relative group ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-700 bg-gradient-to-t from-primary-50 to-transparent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gradient-to-t hover:from-gray-50 hover:to-transparent'
                }`}
              >
                <tab.icon className={`h-5 w-5 transition-all duration-300 ${
                  activeTab === tab.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <span>{tab.name}</span>
                {tab.id === 'overview' && !statsLoading && (
                  <div className="status-online"></div>
                )}
                {/* Tab indicator */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform transition-all duration-300 ${
                  activeTab === tab.id ? 'scale-x-100' : 'scale-x-0'
                }`}></div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-slide-up">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Events"
                value={realTimeStats.totalEvents}
                change={`+${realTimeStats.userGrowth.percentage}%`}
                changeType="increase"
                icon={Calendar}
                color="primary"
                isRealTime={isRealTime}
                loading={statsLoading}
                subtitle="Active & Upcoming"
              />
              <StatsCard
                title="Total Registrations"
                value={realTimeStats.totalRegistrations}
                change="+23%"
                changeType="increase"
                icon={Users}
                color="success"
                isRealTime={isRealTime}
                loading={statsLoading}
                subtitle="All-time registrations"
              />
              <StatsCard
                title="Today's Registrations"
                value={realTimeStats.todayRegistrations}
                change="+8%"
                changeType="increase"
                icon={TrendingUp}
                color="warning"
                isRealTime={isRealTime}
                loading={statsLoading}
                subtitle="New today"
              />
              <StatsCard
                title="Active Users"
                value={realTimeStats.totalUsers}
                change="+15%"
                changeType="increase"
                icon={UserCheck}
                color="secondary"
                isRealTime={isRealTime}
                loading={statsLoading}
                subtitle="Registered users"
              />
            </div>

            {/* Additional Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Conversion Rate"
                value={`${realTimeStats.conversionRate}%`}
                change="+2.1%"
                changeType="increase"
                icon={Activity}
                color="primary"
                isRealTime={isRealTime}
                loading={statsLoading}
                subtitle="Visitor to registration"
              />
              <StatsCard
                title="Weekly Registrations"
                value={realTimeStats.weeklyRegistrations}
                change="+12%"
                changeType="increase"
                icon={Calendar}
                color="success"
                isRealTime={isRealTime}
                loading={statsLoading}
                subtitle="Last 7 days"
              />
              <StatsCard
                title="Monthly Revenue"
                value={`$${realTimeStats.monthlyRevenue?.toLocaleString()}`}
                change="+18%"
                changeType="increase"
                icon={TrendingUp}
                color="warning"
                isRealTime={isRealTime}
                loading={statsLoading}
                subtitle="This month"
              />
              <StatsCard
                title="Avg. Event Capacity"
                value={realTimeStats.averageCapacity}
                change="Stable"
                changeType="neutral"
                icon={Users}
                color="secondary"
                isRealTime={isRealTime}
                loading={statsLoading}
                subtitle="Per event"
              />
            </div>

            {/* Real-time Charts and Analytics */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <RealTimeChart
                  data={realTimeStats.registrationTrends}
                  type="line"
                  title="Registration & Revenue Trends (Last 30 Days)"
                  height={350}
                  showLegend={true}
                  animated={true}
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <RealTimeChart
                    data={realTimeStats.eventStatusDistribution}
                    type="pie"
                    title="Event Status Distribution"
                    height={280}
                    showLegend={true}
                    animated={true}
                  />
                  
                  <div className="card-success">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-success-600" />
                      <span>Revenue Overview</span>
                      {isRealTime && (
                        <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                      )}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Total Revenue</span>
                        <span className="text-2xl font-bold text-gray-900">
                          ${realTimeStats.revenue.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-success-50 rounded-lg">
                        <span className="text-gray-600 font-medium">This Month</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-success-600">
                            ${realTimeStats.revenue.thisMonth.toLocaleString()}
                          </span>
                          <ArrowUp className="h-4 w-4 text-success-500" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Projected</span>
                        <span className="font-semibold text-primary-600">
                          ${realTimeStats.revenue.projectedMonth.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Revenue progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Monthly Goal Progress</span>
                          <span>{((realTimeStats.revenue.thisMonth / realTimeStats.revenue.projectedMonth) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 bg-gradient-to-r from-success-500 to-success-600 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min((realTimeStats.revenue.thisMonth / realTimeStats.revenue.projectedMonth) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Health Dashboard */}
                <div className="card-primary">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary-600" />
                    <span>System Health</span>
                    <div className={`w-2 h-2 rounded-full ${
                      realTimeStats.systemHealth?.status === 'healthy' ? 'bg-success-500 animate-pulse' : 'bg-warning-500'
                    }`}></div>
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.floor((realTimeStats.systemHealth?.uptime || 0) / 3600)}h
                      </div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {realTimeStats.systemHealth?.memory?.used || 0}MB
                      </div>
                      <div className="text-sm text-gray-600">Memory Used</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                          style={{ 
                            width: `${((realTimeStats.systemHealth?.memory?.used || 0) / (realTimeStats.systemHealth?.memory?.total || 1)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {realTimeStats.systemHealth?.connectedClients || 0}
                      </div>
                      <div className="text-sm text-gray-600">Active Connections</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <ActivityFeed activities={realTimeStats.recentActivity} />
                <QuickActions onAction={handleQuickAction} />
              </div>
            </div>

            {/* Popular Events */}
            <div className="card-secondary">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Popular Events</h2>
                <button
                  onClick={() => handleTabChange('events')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {realTimeStats.popularEvents.slice(0, 5).map((event, index) => {
                  const status = getEventStatus(event)
                  return (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                        </div>
                        <div className="flex-shrink-0">
                          {event.imageUrl ? (
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-primary-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {event.registrationRate.toFixed(1)}% Full
                          </div>
                          <div className="text-xs text-gray-500">
                            {event._count.registrations} / {event.capacity}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-slide-up">
            <div className="card-elevated">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">All Events</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {events.length} total events
                  </div>
                  <button
                    onClick={fetchEvents}
                    className="text-primary-600 hover:text-primary-700"
                    title="Refresh events"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">No events created yet.</p>
                  <button
                    onClick={() => handleQuickAction('create-event')}
                    className="btn btn-primary"
                  >
                    Create Your First Event
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Event</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Registrations</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => {
                        const status = getEventStatus(event)
                        return (
                          <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                {event.imageUrl ? (
                                  <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-primary-600" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">{event.title}</p>
                                  <p className="text-sm text-gray-500 line-clamp-1">
                                    {event.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-900">
                                {formatDate(event.date)}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {event.location}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium">
                                  {event._count.registrations} / {event.capacity}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                                {status.text}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => window.open(`/events/${event.id}`, '_blank')}
                                  className="text-gray-400 hover:text-primary-600 p-1 transition-colors"
                                  title="View event"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(event)}
                                  className="text-gray-400 hover:text-primary-600 p-1 transition-colors"
                                  title="Edit event"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(event.id)}
                                  className="text-gray-400 hover:text-danger-600 p-1 transition-colors"
                                  title="Delete event"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && <UserManagement />}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && <RegistrationManagement />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <SystemSettings />}

        {/* Event Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto animate-bounce-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingEvent(null)
                    reset()
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      {...register('title')}
                      className={`input ${errors.title ? 'input-error' : ''}`}
                      placeholder="Enter event title"
                    />
                    {errors.title && (
                      <p className="text-danger-600 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className={`input ${errors.description ? 'input-error' : ''}`}
                      placeholder="Describe your event..."
                    />
                    {errors.description && (
                      <p className="text-danger-600 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      {...register('location')}
                      className={`input ${errors.location ? 'input-error' : ''}`}
                      placeholder="Event location"
                    />
                    {errors.location && (
                      <p className="text-danger-600 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date & Time *
                    </label>
                    <input
                      {...register('date')}
                      type="datetime-local"
                      className={`input ${errors.date ? 'input-error' : ''}`}
                    />
                    {errors.date && (
                      <p className="text-danger-600 text-sm mt-1">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity *
                    </label>
                    <input
                      {...register('capacity', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className={`input ${errors.capacity ? 'input-error' : ''}`}
                      placeholder="Maximum attendees"
                    />
                    {errors.capacity && (
                      <p className="text-danger-600 text-sm mt-1">{errors.capacity.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (optional)
                    </label>
                    <input
                      {...register('imageUrl')}
                      type="url"
                      className={`input ${errors.imageUrl ? 'input-error' : ''}`}
                      placeholder="https://example.com/image.jpg"
                    />
                    {errors.imageUrl && (
                      <p className="text-danger-600 text-sm mt-1">{errors.imageUrl.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary flex-1"
                  >
                    {isSubmitting
                      ? 'Saving...'
                      : editingEvent
                      ? 'Update Event'
                      : 'Create Event'
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingEvent(null)
                      reset()
                    }}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Footer */}
      <DynamicFooter 
        currentTab={activeTab} 
        onTabChange={handleTabChange}
        systemStats={realTimeStats}
        connectionStatus={connectionStatus}
      />
    </div>
  )
}

export default AdminDashboard
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit, Trash2, Calendar, Users, TrendingUp, Eye, BarChart3, X } from 'lucide-react'
import { eventService } from '../services/api'
import StatsCard from '../components/StatsCard'
import LoadingSpinner from '../components/LoadingSpinner'
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
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    totalUsers: 0
  })
  const [activeTab, setActiveTab] = useState('overview')

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
    fetchStats()
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

  const fetchStats = async () => {
    // Mock stats - in real app, this would come from stats API
    setStats({
      totalEvents: events.length || 150,
      totalRegistrations: 2847,
      upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length || 45,
      totalUsers: 1250
    })
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
      fetchStats()
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
      fetchStats()
    } catch (error) {
      toast.error('Failed to delete event')
    }
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
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your events and monitor performance</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingEvent(null)
            reset()
          }}
          className="btn btn-primary flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-slide-up">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Events"
              value={stats.totalEvents}
              change="+12%"
              changeType="increase"
              icon={Calendar}
              color="primary"
            />
            <StatsCard
              title="Total Registrations"
              value={stats.totalRegistrations.toLocaleString()}
              change="+23%"
              changeType="increase"
              icon={Users}
              color="success"
            />
            <StatsCard
              title="Upcoming Events"
              value={stats.upcomingEvents}
              change="+8%"
              changeType="increase"
              icon={TrendingUp}
              color="warning"
            />
            <StatsCard
              title="Active Users"
              value={stats.totalUsers.toLocaleString()}
              change="+15%"
              changeType="increase"
              icon={Users}
              color="secondary"
            />
          </div>

          {/* Recent Events */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
              <button
                onClick={() => setActiveTab('events')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {events.slice(0, 5).map((event) => {
                const status = getEventStatus(event)
                return (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
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
                          {event._count.registrations} / {event.capacity}
                        </div>
                        <div className="text-xs text-gray-500">registrations</div>
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
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">All Events</h2>
              <div className="text-sm text-gray-500">
                {events.length} total events
              </div>
            </div>
            
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">No events created yet.</p>
                <button
                  onClick={() => {
                    setShowForm(true)
                    setEditingEvent(null)
                    reset()
                  }}
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

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-slide-up">
          <div className="card text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-600">
              Detailed analytics and reporting features will be available in the next update.
            </p>
          </div>
        </div>
      )}

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
  )
}

export default AdminDashboard
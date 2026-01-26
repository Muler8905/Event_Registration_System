import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit, Trash2, Calendar, Users } from 'lucide-react'
import { eventService } from '../services/api'
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
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

  const onSubmit = async (data) => {
    try {
      const eventData = {
        ...data,
        capacity: parseInt(data.capacity),
        imageUrl: data.imageUrl || null
      }

      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, eventData)
        toast.success('Event updated successfully')
      } else {
        await eventService.createEvent(eventData)
        toast.success('Event created successfully')
      }

      setShowForm(false)
      setEditingEvent(null)
      reset()
      fetchEvents()
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
    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      await eventService.deleteEvent(eventId)
      setEvents(prev => prev.filter(event => event.id !== eventId))
      toast.success('Event deleted successfully')
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingEvent(null)
            reset()
          }}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  {...register('title')}
                  className="input"
                  placeholder="Event title"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input"
                  placeholder="Event description"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  {...register('location')}
                  className="input"
                  placeholder="Event location"
                />
                {errors.location && (
                  <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time
                </label>
                <input
                  {...register('date')}
                  type="datetime-local"
                  className="input"
                />
                {errors.date && (
                  <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  {...register('capacity', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="input"
                  placeholder="Maximum attendees"
                />
                {errors.capacity && (
                  <p className="text-red-600 text-sm mt-1">{errors.capacity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  {...register('imageUrl')}
                  type="url"
                  className="input"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && (
                  <p className="text-red-600 text-sm mt-1">{errors.imageUrl.message}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingEvent ? 'Update Event' : 'Create Event'}
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

      {/* Events List */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">All Events</h2>
        
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No events created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Title</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Location</th>
                  <th className="text-left py-2">Registrations</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b">
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {event.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {event.location}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {event._count.registrations} / {event.capacity}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-primary-600 hover:text-primary-700 p-1"
                          title="Edit event"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Delete event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
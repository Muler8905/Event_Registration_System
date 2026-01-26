import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react'
import { eventService, registrationService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const EventDetails = () => {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    fetchEvent()
    if (isAuthenticated) {
      checkRegistrationStatus()
    }
  }, [id, isAuthenticated])

  const fetchEvent = async () => {
    try {
      const response = await eventService.getEvent(id)
      setEvent(response)
    } catch (error) {
      toast.error('Failed to fetch event details')
    } finally {
      setLoading(false)
    }
  }

  const checkRegistrationStatus = async () => {
    try {
      const registrations = await registrationService.getMyRegistrations()
      const registered = registrations.some(reg => reg.event.id === id)
      setIsRegistered(registered)
    } catch (error) {
      // Ignore error - user might not be authenticated
    }
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events')
      return
    }

    try {
      setRegistering(true)
      await registrationService.register(id)
      setIsRegistered(true)
      toast.success('Registration successful!')
      // Refresh event data to update registration count
      fetchEvent()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isEventFull = event && event._count.registrations >= event.capacity
  const isEventPast = event && new Date(event.date) < new Date()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Event not found.</p>
        <Link to="/events" className="btn btn-primary mt-4">
          Back to Events
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        to="/events"
        className="inline-flex items-center text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-3" />
                {formatDate(event.date)}
              </div>
              
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3" />
                {event.location}
              </div>
              
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-3" />
                {event._count.registrations} / {event.capacity} registered
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-3">About this event</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Event Registration</h3>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>Organized by: <span className="font-medium">{event.creator.name}</span></p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Availability</span>
                  <span className="text-sm font-medium">
                    {event.capacity - event._count.registrations} spots left
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{
                      width: `${(event._count.registrations / event.capacity) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {isAuthenticated ? (
                <div>
                  {isRegistered ? (
                    <div className="text-center">
                      <div className="bg-green-50 text-green-800 p-3 rounded-lg mb-3">
                        ✓ You are registered for this event
                      </div>
                      <Link to="/profile" className="btn btn-secondary w-full">
                        Manage Registrations
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering || isEventFull || isEventPast}
                      className="btn btn-primary w-full"
                    >
                      {registering
                        ? 'Registering...'
                        : isEventPast
                        ? 'Event has passed'
                        : isEventFull
                        ? 'Event is full'
                        : 'Register Now'
                      }
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Please login to register for this event
                  </p>
                  <Link to="/login" className="btn btn-primary w-full">
                    Login to Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
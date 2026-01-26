import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, X } from 'lucide-react'
import { registrationService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const response = await registrationService.getMyRegistrations()
      setRegistrations(response)
    } catch (error) {
      toast.error('Failed to fetch registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRegistration = async (registrationId) => {
    if (!confirm('Are you sure you want to cancel this registration?')) {
      return
    }

    try {
      await registrationService.cancelRegistration(registrationId)
      setRegistrations(prev => prev.filter(reg => reg.id !== registrationId))
      toast.success('Registration cancelled successfully')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel registration')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const upcomingEvents = registrations.filter(reg => new Date(reg.event.date) > new Date())
  const pastEvents = registrations.filter(reg => new Date(reg.event.date) <= new Date())

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {user?.name}</p>
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Role:</span> {user?.role}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <Link to="/events" className="btn btn-primary">
              Browse Events
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500 mb-4">No upcoming events registered.</p>
              <Link to="/events" className="btn btn-primary">
                Find Events
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingEvents.map((registration) => (
                <div key={registration.id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">
                      {registration.event.title}
                    </h3>
                    <button
                      onClick={() => handleCancelRegistration(registration.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Cancel registration"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {registration.event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(registration.event.date)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {registration.event.location}
                    </div>
                  </div>
                  
                  <Link
                    to={`/events/${registration.event.id}`}
                    className="btn btn-secondary w-full"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Past Events</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {pastEvents.map((registration) => (
                <div key={registration.id} className="card opacity-75">
                  <h3 className="font-semibold text-lg mb-2">
                    {registration.event.title}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(registration.event.date)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {registration.event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
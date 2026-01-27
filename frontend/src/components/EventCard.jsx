import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, Star } from 'lucide-react'

const EventCard = ({ event, featured = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAvailabilityStatus = () => {
    const registered = event._count.registrations
    const capacity = event.capacity
    const percentage = (registered / capacity) * 100

    if (percentage >= 100) return { text: 'Sold Out', color: 'danger', icon: '🔴' }
    if (percentage >= 80) return { text: 'Almost Full', color: 'warning', icon: '🟡' }
    if (percentage >= 50) return { text: 'Filling Fast', color: 'primary', icon: '🔵' }
    return { text: 'Available', color: 'success', icon: '🟢' }
  }

  const availability = getAvailabilityStatus()
  const isEventPast = new Date(event.date) < new Date()

  return (
    <div className={`card-interactive card-hover animate-fade-in relative ${featured ? 'card-elevated ring-2 ring-primary-400 ring-opacity-30' : 'card-stats'}`}>
      {featured && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-gradient-to-r from-warning-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
            <Star className="h-4 w-4 mr-1 animate-pulse" />
            Featured
          </div>
        </div>
      )}

      <div className="relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover rounded-xl mb-4 shadow-medium"
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&crop=center`
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 via-white to-secondary-100 rounded-xl mb-4 flex items-center justify-center shadow-soft">
            <Calendar className="h-16 w-16 text-primary-500 opacity-60" />
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <div className={`badge badge-${availability.color} backdrop-blur-md bg-white bg-opacity-90 shadow-lg border border-white border-opacity-30`}>
            <span className="mr-1">{availability.icon}</span>
            {availability.text}
          </div>
        </div>

        {isEventPast && (
          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white bg-opacity-95 px-6 py-3 rounded-xl shadow-lg">
              <span className="text-gray-800 font-semibold">Event Ended</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors duration-200">
          {event.title}
        </h3>
        
        <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
          {event.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
            <Calendar className="h-4 w-4 mr-2 text-primary-500" />
            <span className="font-semibold text-primary-700">{formatDate(event.date)}</span>
            <Clock className="h-4 w-4 ml-4 mr-2 text-gray-500" />
            <span className="font-medium">{formatTime(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
            <MapPin className="h-4 w-4 mr-2 text-secondary-500" />
            <span className="truncate font-medium">{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-success-500" />
              <span className="font-medium">{event._count.registrations} / {event.capacity} registered</span>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-gray-500 font-medium">by {event.creator.name}</div>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Link
            to={`/events/${event.id}`}
            className="btn btn-primary w-full text-center shadow-glow hover:shadow-glow-lg"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard
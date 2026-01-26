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
    <div className={`card card-hover animate-fade-in ${featured ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}`}>
      {featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-gradient-to-r from-warning-400 to-warning-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="h-4 w-4 mr-1" />
            Featured
          </div>
        </div>
      )}

      <div className="relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover rounded-xl mb-4"
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&crop=center`
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-primary-400" />
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <div className={`badge badge-${availability.color} glass-effect`}>
            {availability.icon} {availability.text}
          </div>
        </div>

        {isEventPast && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
            <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg">
              <span className="text-gray-800 font-medium">Event Ended</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
          {event.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 text-primary-500" />
            <span className="font-medium text-primary-600">{formatDate(event.date)}</span>
            <Clock className="h-4 w-4 ml-4 mr-2 text-gray-400" />
            <span>{formatTime(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 text-secondary-500" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2 text-success-500" />
              <span>{event._count.registrations} / {event.capacity} registered</span>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-gray-400">by {event.creator.name}</div>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Link
            to={`/events/${event.id}`}
            className="btn btn-primary w-full text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard
import { Calendar, Users, UserPlus, UserMinus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'

const ActivityFeed = ({ activities = [], title = "Recent Activity" }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration':
        return <UserPlus className="h-4 w-4 text-success-500" />
      case 'cancellation':
        return <UserMinus className="h-4 w-4 text-danger-500" />
      case 'event':
        return <Calendar className="h-4 w-4 text-primary-500" />
      case 'user':
        return <Users className="h-4 w-4 text-secondary-500" />
      case 'edit':
        return <Edit className="h-4 w-4 text-warning-500" />
      case 'delete':
        return <Trash2 className="h-4 w-4 text-danger-500" />
      case 'confirm':
        return <CheckCircle className="h-4 w-4 text-success-500" />
      case 'reject':
        return <XCircle className="h-4 w-4 text-danger-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'registration':
      case 'confirm':
        return 'border-success-200 bg-success-50'
      case 'cancellation':
      case 'delete':
      case 'reject':
        return 'border-danger-200 bg-danger-50'
      case 'event':
        return 'border-primary-200 bg-primary-50'
      case 'user':
        return 'border-secondary-200 bg-secondary-50'
      case 'edit':
        return 'border-warning-200 bg-warning-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const formatTime = (time) => {
    const now = new Date()
    const activityTime = new Date(time)
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return activityTime.toLocaleDateString()
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getActivityColor(activity.type)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(activity.time)}
                </p>
              </div>
              
              {activity.badge && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.badge.type === 'success' 
                    ? 'bg-success-100 text-success-800'
                    : activity.badge.type === 'warning'
                    ? 'bg-warning-100 text-warning-800'
                    : 'bg-primary-100 text-primary-800'
                }`}>
                  {activity.badge.text}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all activity →
          </button>
        </div>
      )}
    </div>
  )
}

export default ActivityFeed
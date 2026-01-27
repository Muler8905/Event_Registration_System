import { Plus, Users, Calendar, Settings, Download, Mail, BarChart3, FileText, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'create-event',
      label: 'Create Event',
      icon: Plus,
      color: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800',
      description: 'Add a new event',
      badge: 'New'
    },
    {
      id: 'manage-users',
      label: 'Manage Users',
      icon: Users,
      color: 'bg-gradient-to-r from-success-600 to-emerald-600 hover:from-success-700 hover:to-emerald-700',
      description: 'User administration',
      badge: 'Admin'
    },
    {
      id: 'view-registrations',
      label: 'Registrations',
      icon: FileText,
      color: 'bg-gradient-to-r from-warning-600 to-amber-600 hover:from-warning-700 hover:to-amber-700',
      description: 'View all registrations',
      badge: 'Reports'
    },
    {
      id: 'export-data',
      label: 'Export Data',
      icon: Download,
      color: 'bg-gradient-to-r from-secondary-600 to-purple-600 hover:from-secondary-700 hover:to-purple-700',
      description: 'Download reports',
      badge: 'Export'
    },
    {
      id: 'send-newsletter',
      label: 'Send Newsletter',
      icon: Mail,
      color: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700',
      description: 'Email all users',
      badge: 'Email'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      description: 'View detailed analytics',
      badge: 'Pro'
    },
    {
      id: 'system-settings',
      label: 'Settings',
      icon: Settings,
      color: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
      description: 'System configuration',
      badge: 'Config'
    },
    {
      id: 'quick-setup',
      label: 'Quick Setup',
      icon: Zap,
      color: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
      description: 'Setup wizard',
      badge: 'Quick'
    }
  ]

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId)
    }
  }

  return (
    <div className="card-primary">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary-600" />
          <span>Quick Actions</span>
        </h3>
        <div className="text-sm text-gray-500 font-medium">Choose an action</div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={`group relative p-5 rounded-2xl text-white transition-all duration-300 transform hover:scale-105 hover:shadow-glow shadow-lg ${action.color} overflow-hidden`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-white opacity-10 transform -skew-y-6 scale-150"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <action.icon className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold">{action.label}</div>
              
              {/* Badge */}
              <div className="absolute -top-2 -right-2 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                {action.badge}
              </div>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
            
            {/* Enhanced Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
              {action.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Need help?</span>
          <Link to="/admin/help" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all duration-200">
            View Documentation →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default QuickActions
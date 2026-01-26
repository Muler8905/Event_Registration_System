import { Plus, Users, Calendar, Settings, Download, Mail, BarChart3, FileText, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'create-event',
      label: 'Create Event',
      icon: Plus,
      color: 'bg-primary-600 hover:bg-primary-700',
      description: 'Add a new event'
    },
    {
      id: 'manage-users',
      label: 'Manage Users',
      icon: Users,
      color: 'bg-success-600 hover:bg-success-700',
      description: 'User administration'
    },
    {
      id: 'view-registrations',
      label: 'Registrations',
      icon: FileText,
      color: 'bg-warning-600 hover:bg-warning-700',
      description: 'View all registrations'
    },
    {
      id: 'export-data',
      label: 'Export Data',
      icon: Download,
      color: 'bg-secondary-600 hover:bg-secondary-700',
      description: 'Download reports'
    },
    {
      id: 'send-newsletter',
      label: 'Send Newsletter',
      icon: Mail,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      description: 'Email all users'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'View detailed analytics'
    },
    {
      id: 'system-settings',
      label: 'Settings',
      icon: Settings,
      color: 'bg-gray-600 hover:bg-gray-700',
      description: 'System configuration'
    },
    {
      id: 'quick-setup',
      label: 'Quick Setup',
      icon: Zap,
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Setup wizard'
    }
  ]

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="text-sm text-gray-500">Choose an action</div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={`group relative p-4 rounded-xl text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${action.color}`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <action.icon className="h-6 w-6" />
              <div className="text-sm font-medium">{action.label}</div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {action.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Need help?</span>
          <Link to="/admin/help" className="text-primary-600 hover:text-primary-700 font-medium">
            View Documentation →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default QuickActions
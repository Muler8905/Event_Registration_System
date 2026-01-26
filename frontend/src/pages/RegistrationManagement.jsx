import { useState, useEffect } from 'react'
import { Calendar, Users, Download, Mail, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [eventFilter, setEventFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedRegistrations, setSelectedRegistrations] = useState([])

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockEvents = [
      { id: '1', title: 'Tech Innovation Summit 2024' },
      { id: '2', title: 'Digital Marketing Masterclass' },
      { id: '3', title: 'Startup Pitch Competition' }
    ]

    const mockRegistrations = [
      {
        id: '1',
        user: { name: 'John Doe', email: 'john@example.com' },
        event: { id: '1', title: 'Tech Innovation Summit 2024', date: '2024-02-15T10:00:00Z' },
        status: 'CONFIRMED',
        registeredAt: '2024-01-20T14:30:00Z'
      },
      {
        id: '2',
        user: { name: 'Jane Smith', email: 'jane@example.com' },
        event: { id: '1', title: 'Tech Innovation Summit 2024', date: '2024-02-15T10:00:00Z' },
        status: 'CONFIRMED',
        registeredAt: '2024-01-21T09:15:00Z'
      },
      {
        id: '3',
        user: { name: 'Demo User', email: 'demo@example.com' },
        event: { id: '2', title: 'Digital Marketing Masterclass', date: '2024-02-20T14:00:00Z' },
        status: 'PENDING',
        registeredAt: '2024-01-22T16:45:00Z'
      },
      {
        id: '4',
        user: { name: 'Alice Johnson', email: 'alice@example.com' },
        event: { id: '3', title: 'Startup Pitch Competition', date: '2024-02-25T18:00:00Z' },
        status: 'CANCELLED',
        registeredAt: '2024-01-18T11:20:00Z'
      }
    ]
    
    setTimeout(() => {
      setEvents(mockEvents)
      setRegistrations(mockRegistrations)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEvent = eventFilter === '' || registration.event.id === eventFilter
    const matchesStatus = statusFilter === '' || registration.status === statusFilter
    return matchesSearch && matchesEvent && matchesStatus
  })

  const handleStatusChange = async (registrationId, newStatus) => {
    try {
      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId ? { ...reg, status: newStatus } : reg
      ))
      toast.success(`Registration status updated to ${newStatus.toLowerCase()}`)
    } catch (error) {
      toast.error('Failed to update registration status')
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedRegistrations.length === 0) {
      toast.error('Please select registrations first')
      return
    }

    try {
      switch (action) {
        case 'confirm':
          setRegistrations(prev => prev.map(reg => 
            selectedRegistrations.includes(reg.id) ? { ...reg, status: 'CONFIRMED' } : reg
          ))
          toast.success(`${selectedRegistrations.length} registrations confirmed`)
          break
        case 'cancel':
          setRegistrations(prev => prev.map(reg => 
            selectedRegistrations.includes(reg.id) ? { ...reg, status: 'CANCELLED' } : reg
          ))
          toast.success(`${selectedRegistrations.length} registrations cancelled`)
          break
        case 'email':
          toast.success(`Email sent to ${selectedRegistrations.length} registrants`)
          break
        case 'export':
          toast.success(`Exported ${selectedRegistrations.length} registrations`)
          break
      }
      setSelectedRegistrations([])
    } catch (error) {
      toast.error('Bulk action failed')
    }
  }

  const exportRegistrations = (eventId = null) => {
    const dataToExport = eventId 
      ? registrations.filter(reg => reg.event.id === eventId)
      : filteredRegistrations

    // Create CSV content
    const csvContent = [
      ['Name', 'Email', 'Event', 'Status', 'Registration Date'].join(','),
      ...dataToExport.map(reg => [
        reg.user.name,
        reg.user.email,
        reg.event.title,
        reg.status,
        new Date(reg.registeredAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registrations-${eventId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Registration data exported successfully')
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-success-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-danger-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-warning-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-success-100 text-success-800'
      case 'CANCELLED':
        return 'bg-danger-100 text-danger-800'
      case 'PENDING':
        return 'bg-warning-100 text-warning-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-6 text-xl text-gray-600">Loading registrations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Registration Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage event registrations</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportRegistrations()}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">
            {registrations.filter(r => r.status === 'CONFIRMED').length}
          </div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-warning-600 mb-2">
            {registrations.filter(r => r.status === 'PENDING').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-danger-600 mb-2">
            {registrations.filter(r => r.status === 'CANCELLED').length}
          </div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {registrations.length}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user name, email, or event..."
              className="input pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="input py-2 px-3 w-full sm:w-auto"
            >
              <option value="">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input py-2 px-3 w-full sm:w-auto"
            >
              <option value="">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            
            {selectedRegistrations.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {selectedRegistrations.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('confirm')}
                  className="btn btn-success py-1 px-3 text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleBulkAction('cancel')}
                  className="btn btn-danger py-1 px-3 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBulkAction('email')}
                  className="btn btn-primary py-1 px-3 text-sm"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedRegistrations.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRegistrations(filteredRegistrations.map(r => r.id))
                      } else {
                        setSelectedRegistrations([])
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Event</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Registered</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedRegistrations.includes(registration.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRegistrations(prev => [...prev, registration.id])
                        } else {
                          setSelectedRegistrations(prev => prev.filter(id => id !== registration.id))
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                        {registration.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{registration.user.name}</p>
                        <p className="text-sm text-gray-500">{registration.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{registration.event.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(registration.event.date)}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={registration.status}
                      onChange={(e) => handleStatusChange(registration.id, e.target.value)}
                      className={`text-sm rounded-full px-3 py-1 font-medium border-0 ${getStatusColor(registration.status)}`}
                    >
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PENDING">Pending</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatDate(registration.registeredAt)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toast.info(`Sending email to ${registration.user.name}`)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Email
                      </button>
                      <button
                        onClick={() => exportRegistrations(registration.event.id)}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No registrations found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegistrationManagement
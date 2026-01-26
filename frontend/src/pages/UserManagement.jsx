import { useState, useEffect } from 'react'
import { Users, Shield, UserCheck, UserX, Mail, Calendar, Search, Filter } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-01-25T14:20:00Z',
        registrations: 5,
        status: 'active'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'USER',
        createdAt: '2024-01-10T09:15:00Z',
        lastLogin: '2024-01-24T16:45:00Z',
        registrations: 3,
        status: 'active'
      },
      {
        id: '3',
        name: 'Admin User',
        email: 'admin@eventhub.com',
        role: 'ADMIN',
        createdAt: '2024-01-01T08:00:00Z',
        lastLogin: '2024-01-25T18:30:00Z',
        registrations: 0,
        status: 'active'
      },
      {
        id: '4',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'USER',
        createdAt: '2024-01-20T11:45:00Z',
        lastLogin: '2024-01-23T12:10:00Z',
        registrations: 8,
        status: 'active'
      }
    ]
    
    setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === '' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleRoleChange = async (userId, newRole) => {
    try {
      // In real app, this would be an API call
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
      toast.success(`User role updated to ${newRole}`)
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // In real app, this would be an API call
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ))
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first')
      return
    }

    try {
      // In real app, this would be an API call
      switch (action) {
        case 'activate':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
          ))
          toast.success(`${selectedUsers.length} users activated`)
          break
        case 'deactivate':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'inactive' } : user
          ))
          toast.success(`${selectedUsers.length} users deactivated`)
          break
        case 'email':
          toast.success(`Email sent to ${selectedUsers.length} users`)
          break
      }
      setSelectedUsers([])
    } catch (error) {
      toast.error('Bulk action failed')
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-6 text-xl text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email..."
              className="input pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input py-2 px-3"
            >
              <option value="">All Roles</option>
              <option value="USER">Users</option>
              <option value="ADMIN">Admins</option>
            </select>
            
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="btn btn-success py-1 px-3 text-sm"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="btn btn-warning py-1 px-3 text-sm"
                >
                  Deactivate
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

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Registrations</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(prev => [...prev, user.id])
                        } else {
                          setSelectedUsers(prev => prev.filter(id => id !== user.id))
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`text-sm rounded-full px-3 py-1 font-medium border-0 ${
                        user.role === 'ADMIN' 
                          ? 'bg-primary-100 text-primary-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-success-100 text-success-800'
                          : 'bg-danger-100 text-danger-800'
                      }`}
                    >
                      {user.status === 'active' ? (
                        <>
                          <UserCheck className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <UserX className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {user.registrations}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toast.info(`Viewing ${user.name}'s profile`)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => toast.info(`Sending email to ${user.name}`)}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
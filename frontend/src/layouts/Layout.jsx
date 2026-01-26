import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Calendar, User, LogOut, Settings, Bell, Menu, X } from 'lucide-react'
import { useState } from 'react'
import DynamicFooter from '../components/DynamicFooter'

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path
  const isAdminPage = location.pathname.startsWith('/admin')

  const navigation = [
    { name: 'Home', href: '/', icon: Calendar },
    { name: 'Events', href: '/events', icon: Calendar },
  ]

  // Don't render layout for admin pages (they have their own layout)
  if (isAdminPage) {
    return children
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-soft border-b border-gray-100 sticky top-0 z-50">
        <div className="container-max">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-display font-bold text-gradient">EventHub</span>
                <div className="text-xs text-gray-500 -mt-1">Professional Events</div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive(item.href) 
                      ? 'bg-primary-50 text-primary-700 shadow-sm' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {/* User Info */}
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user?.role?.toLowerCase()}
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0)}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="hidden md:flex items-center space-x-2">
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="btn btn-secondary py-2 px-4 flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    )}
                    
                    <Link
                      to="/profile"
                      className="btn btn-secondary py-2 px-4 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    
                    <button
                      onClick={logout}
                      className="btn btn-danger py-2 px-4 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="btn btn-secondary py-2 px-6"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary py-2 px-6"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-600"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-slide-up">
            <div className="px-4 py-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive(item.href) 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                        {user?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user?.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{user?.role?.toLowerCase()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-danger-600 hover:bg-danger-50 rounded-xl w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full btn btn-secondary text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full btn btn-primary text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 section-padding">
        <div className="container-max">
          {children}
        </div>
      </main>

      {/* Dynamic Footer */}
      <DynamicFooter />
    </div>
  )
}

export default Layout
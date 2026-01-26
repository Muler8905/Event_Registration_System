import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Calendar, User, LogOut, Settings } from 'lucide-react'

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">EventHub</span>
              </Link>
              
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  to="/"
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive('/') 
                      ? 'text-primary-600 border-b-2 border-primary-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/events"
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive('/events') 
                      ? 'text-primary-600 border-b-2 border-primary-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Events
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700">
                    Welcome, {user?.name}
                  </span>
                  
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary text-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
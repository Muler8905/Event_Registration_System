import { ChevronRight, Home, ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const NavigationBreadcrumb = ({ 
  items = [], 
  showBackForward = true, 
  onBack, 
  onForward, 
  canGoBack = false, 
  canGoForward = false 
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  const handleForward = () => {
    if (onForward) {
      onForward()
    } else {
      navigate(1)
    }
  }

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center space-x-4">
        {/* Back/Forward Navigation */}
        {showBackForward && (
          <div className="flex items-center space-x-1">
            <button
              onClick={handleBack}
              disabled={!canGoBack}
              className={`p-2 rounded-lg transition-colors ${
                canGoBack 
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleForward}
              disabled={!canGoForward}
              className={`p-2 rounded-lg transition-colors ${
                canGoForward 
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title="Go forward"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2">
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {item.href ? (
                <Link
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    index === items.length - 1
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`text-sm font-medium ${
                  index === items.length - 1
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Additional Actions */}
      <div className="flex items-center space-x-3">
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default NavigationBreadcrumb
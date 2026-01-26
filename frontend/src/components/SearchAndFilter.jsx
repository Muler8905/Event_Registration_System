import { useState } from 'react'
import { Search, Filter, Calendar, MapPin, Users, X } from 'lucide-react'

const SearchAndFilter = ({ onSearch, onFilter, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: '',
    location: '',
    capacity: '',
    availability: ''
  })

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      dateRange: '',
      location: '',
      capacity: '',
      availability: ''
    }
    setFilters(emptyFilters)
    onFilter(emptyFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events by title, description, or location..."
            className="input pl-12 pr-32 text-lg py-4 shadow-medium"
            disabled={loading}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} py-2 px-4 flex items-center space-x-2`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-danger-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary py-2 px-6"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card animate-slide-up max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Events</h3>
            <div className="flex space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-danger-600 hover:text-danger-700 flex items-center space-x-1"
                >
                  <X className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="input"
              >
                <option value="">All dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this-week">This week</option>
                <option value="this-month">This month</option>
                <option value="next-month">Next month</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Enter city or venue"
                className="input"
              />
            </div>

            {/* Capacity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Event Size
              </label>
              <select
                value={filters.capacity}
                onChange={(e) => handleFilterChange('capacity', e.target.value)}
                className="input"
              >
                <option value="">Any size</option>
                <option value="small">Small (1-50)</option>
                <option value="medium">Medium (51-200)</option>
                <option value="large">Large (201-500)</option>
                <option value="xlarge">Extra Large (500+)</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="input"
              >
                <option value="">All events</option>
                <option value="available">Available spots</option>
                <option value="filling-fast">Filling fast</option>
                <option value="almost-full">Almost full</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchAndFilter
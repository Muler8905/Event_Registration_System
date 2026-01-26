import { useState, useEffect } from 'react'
import { Search, Filter, SlidersHorizontal, Grid, List } from 'lucide-react'
import { eventService } from '../services/api'
import EventCard from '../components/EventCard'
import SearchAndFilter from '../components/SearchAndFilter'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [pagination, setPagination] = useState({})
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('date') // 'date', 'popularity', 'title'

  useEffect(() => {
    fetchEvents()
  }, [searchTerm, filters, sortBy])

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true)
      const params = { 
        page, 
        limit: 12,
        sortBy
      }
      
      if (searchTerm) params.search = searchTerm
      
      // Apply filters
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params[key] = filters[key]
        }
      })

      const response = await eventService.getEvents(params)
      setEvents(response.events)
      setPagination(response.pagination)
    } catch (error) {
      toast.error('Failed to fetch events')
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page) => {
    fetchEvents(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = [
    { name: 'All Events', value: '', count: events.length },
    { name: 'Technology', value: 'tech', count: 45 },
    { name: 'Business', value: 'business', count: 32 },
    { name: 'Design', value: 'design', count: 28 },
    { name: 'Marketing', value: 'marketing', count: 24 },
    { name: 'Startup', value: 'startup', count: 18 }
  ]

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-6 text-xl text-gray-600">Discovering amazing events for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Search className="h-4 w-4" />
          <span>Discover Events</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
          Find Your Next Amazing Event
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore professional events, conferences, and workshops designed to accelerate your career and expand your network.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="animate-slide-up">
        <SearchAndFilter 
          onSearch={handleSearch}
          onFilter={handleFilter}
          loading={loading}
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleFilter({ ...filters, category: category.value })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filters.category === category.value
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
            }`}
          >
            {category.name}
            <span className="ml-2 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            {pagination.total ? `${pagination.total} events found` : 'Loading...'}
          </span>
          
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input py-2 px-3 text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Events Grid/List */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No events found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We couldn't find any events matching your criteria. Try adjusting your search or filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setFilters({})
            }}
            className="btn btn-primary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={`animate-fade-in ${
          viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-6'
        }`}>
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 animate-fade-in">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    page === pagination.page
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            
            {pagination.pages > 5 && (
              <>
                <span className="px-2 py-2 text-gray-500">...</span>
                <button
                  onClick={() => handlePageChange(pagination.pages)}
                  className="px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200"
                >
                  {pagination.pages}
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Events
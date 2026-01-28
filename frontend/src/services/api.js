import axios from 'axios'

// API Configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'
  }
  
  // Production environment
  return (import.meta.env.VITE_API_URL || 'https://eventregistrationsystem-production.up.railway.app') + '/api'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data)
}

// Event services
export const eventService = {
  getEvents: (params = {}) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`)
}

// Registration services
export const registrationService = {
  register: (eventId) => api.post('/registrations', { eventId }),
  getMyRegistrations: () => api.get('/registrations/me'),
  cancelRegistration: (id) => api.delete(`/registrations/${id}`)
}

export default api
import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        isAuthenticated: true 
      }
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user data
      authService.getProfile()
        .then(user => {
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user, token } 
          })
        })
        .catch(() => {
          localStorage.removeItem('token')
          dispatch({ type: 'LOGOUT' })
        })
    }
  }, [])

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await authService.login(email, password)
      localStorage.setItem('token', response.token)
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: response 
      })
      return response
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_ERROR', 
        payload: error.response?.data?.error || 'Login failed' 
      })
      throw error
    }
  }

  const register = async (name, email, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await authService.register(name, email, password)
      localStorage.setItem('token', response.token)
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: response 
      })
      return response
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_ERROR', 
        payload: error.response?.data?.error || 'Registration failed' 
      })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (user) => {
    dispatch({ type: 'UPDATE_USER', payload: user })
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
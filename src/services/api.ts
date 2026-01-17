import axios from 'axios'
import { User, LoginCredentials, RegisterData, Ride, RideBooking, SearchFilters } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('poolo-auth')
  if (stored) {
    const { state } = JSON.parse(stored)
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`
    }
  }
  return config
})

// Handle 401/403 errors (invalid/expired token) - but not for auth endpoints
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/')
    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthEndpoint) {
      localStorage.removeItem('poolo-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', data)
    return response.data
  },
}

// Rides API
export const ridesApi = {
  search: async (filters: SearchFilters): Promise<Ride[]> => {
    const response = await api.get('/rides/search', { params: filters })
    return response.data
  },

  getAvailable: async (): Promise<Ride[]> => {
    const response = await api.get('/rides/available')
    return response.data
  },

  getById: async (id: string): Promise<Ride> => {
    const response = await api.get(`/rides/${id}`)
    return response.data
  },

  create: async (data: Partial<Ride>): Promise<Ride> => {
    const response = await api.post('/rides', data)
    return response.data
  },

  getMyPublished: async (): Promise<Ride[]> => {
    const response = await api.get('/rides/my/published')
    return response.data
  },

  updateStatus: async (id: string, status: string): Promise<Ride> => {
    const response = await api.patch(`/rides/${id}/status`, { status })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/rides/${id}`)
  },
}

// Bookings API
export const bookingsApi = {
  create: async (data: { ride_id: string; seats_booked: number }): Promise<RideBooking> => {
    const response = await api.post('/bookings', data)
    return response.data
  },

  getMyBookings: async (): Promise<RideBooking[]> => {
    const response = await api.get('/bookings/my')
    return response.data
  },

  cancel: async (id: string): Promise<RideBooking> => {
    const response = await api.patch(`/bookings/${id}/cancel`)
    return response.data
  },

  getByRide: async (rideId: string): Promise<RideBooking[]> => {
    const response = await api.get(`/bookings/ride/${rideId}`)
    return response.data
  },
}

// Messages API
export const messagesApi = {
  getConversations: async (): Promise<any[]> => {
    const response = await api.get('/messages/conversations')
    return response.data
  },

  getMessages: async (conversationId: string): Promise<any[]> => {
    const response = await api.get(`/messages/${conversationId}`)
    return response.data
  },

  send: async (data: { receiver_id: string; ride_id: string; message: string }): Promise<any> => {
    const response = await api.post('/messages', data)
    return response.data
  },

  markAsRead: async (messageId: string): Promise<void> => {
    await api.patch(`/messages/${messageId}/read`)
  },
}

export default api

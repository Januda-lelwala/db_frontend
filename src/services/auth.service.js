import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls for all user types
 */

export const authService = {
  // ============ User Authentication ============
  /**
   * Register a new user
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get user profile (authenticated)
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // ============ Admin Authentication ============
  /**
   * Register a new admin (admin only)
   */
  adminRegister: async (adminData) => {
    const response = await api.post('/auth/admin/register', adminData);
    return response.data;
  },

  /**
   * Admin login
   */
  adminLogin: async (credentials) => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },

  /**
   * Get admin profile (admin only)
   */
  getAdminProfile: async () => {
    const response = await api.get('/auth/admin/profile');
    return response.data;
  },

  // ============ Driver Authentication ============
  /**
   * Register a new driver
   */
  driverRegister: async (driverData) => {
    const response = await api.post('/auth/driver/register', driverData);
    return response.data;
  },

  /**
   * Driver login
   */
  driverLogin: async (credentials) => {
    const response = await api.post('/auth/driver/login', credentials);
    return response.data;
  },

  // ============ Assistant Authentication ============
  /**
   * Register a new assistant
   */
  assistantRegister: async (assistantData) => {
    const response = await api.post('/auth/assistant/register', assistantData);
    return response.data;
  },

  /**
   * Assistant login
   */
  assistantLogin: async (credentials) => {
    const response = await api.post('/auth/assistant/login', credentials);
    return response.data;
  },

  // ============ Common Operations ============
  /**
   * Logout user
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};

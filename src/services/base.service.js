import api from './api';

/**
 * Base Service
 * Handles base API endpoints
 */

export const baseService = {
  /**
   * Get welcome message with API information
   */
  getWelcome: async () => {
    const response = await api.get('/');
    return response.data;
  },

  /**
   * Health check endpoint
   */
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

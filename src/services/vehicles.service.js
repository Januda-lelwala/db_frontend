import api from './api';

/**
 * Vehicles Service
 * Handles all vehicle-related API calls (trucks and trains)
 * All endpoints require admin authentication
 */

export const vehiclesService = {
  // ============ Trucks ============
  trucks: {
    /**
     * Get all trucks (admin only)
     * @param {Object} params - Query parameters
     */
    getAll: async (params = {}) => {
      const response = await api.get('/trucks', { params });
      return response.data;
    },

    /**
     * Search trucks (admin only)
     * @param {Object} params - Search parameters
     */
    search: async (params) => {
      const response = await api.get('/trucks/search', { params });
      return response.data;
    },

    /**
     * Get trucks by capacity (admin only)
     * @param {Object} params - Capacity parameters (e.g., minCapacity, maxCapacity)
     */
    getByCapacity: async (params) => {
      const response = await api.get('/trucks/capacity', { params });
      return response.data;
    },

    /**
     * Get truck by ID (admin only)
     * @param {string} id - Truck ID
     */
    getById: async (id) => {
      const response = await api.get(`/trucks/${id}`);
      return response.data;
    },

    /**
     * Create new truck (admin only)
     * @param {Object} truckData - Truck data
     */
    create: async (truckData) => {
      const response = await api.post('/trucks', truckData);
      return response.data;
    },

    /**
     * Update truck (admin only)
     * @param {string} id - Truck ID
     * @param {Object} truckData - Updated truck data
     */
    update: async (id, truckData) => {
      const response = await api.put(`/trucks/${id}`, truckData);
      return response.data;
    },

    /**
     * Delete truck (admin only, requires manage_vehicles permission)
     * @param {string} id - Truck ID
     */
    delete: async (id) => {
      const response = await api.delete(`/trucks/${id}`);
      return response.data;
    }
  },

  // ============ Trains ============
  trains: {
    /**
     * Get all trains (admin only)
     * @param {Object} params - Query parameters
     */
    getAll: async (params = {}) => {
      const response = await api.get('/trains', { params });
      return response.data;
    },

    /**
     * Get trains by capacity (admin only)
     * @param {Object} params - Capacity parameters (e.g., minCapacity, maxCapacity)
     */
    getByCapacity: async (params) => {
      const response = await api.get('/trains/capacity', { params });
      return response.data;
    },

    /**
     * Get train by ID (admin only)
     * @param {string} id - Train ID
     */
    getById: async (id) => {
      const response = await api.get(`/trains/${id}`);
      return response.data;
    },

    /**
     * Create new train (admin only)
     * @param {Object} trainData - Train data
     */
    create: async (trainData) => {
      const response = await api.post('/trains', trainData);
      return response.data;
    },

    /**
     * Update train (admin only)
     * @param {string} id - Train ID
     * @param {Object} trainData - Updated train data
     */
    update: async (id, trainData) => {
      const response = await api.put(`/trains/${id}`, trainData);
      return response.data;
    },

    /**
     * Delete train (admin only, requires manage_vehicles permission)
     * @param {string} id - Train ID
     */
    delete: async (id) => {
      const response = await api.delete(`/trains/${id}`);
      return response.data;
    }
  }
};

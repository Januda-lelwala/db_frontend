import api from './api';

/**
 * Stores Service
 * Handles all store-related API calls
 */

export const storesService = {
  // ============ Public Endpoints ============
  /**
   * Get all stores (public)
   * @param {Object} params - Query parameters
   */
  getAll: async (params = {}) => {
    const response = await api.get('/stores', { params });
    return response.data;
  },

  /**
   * Get available cities (public)
   */
  getCities: async () => {
    const response = await api.get('/stores/cities');
    return response.data;
  },

  /**
   * Search stores by city (public)
   * @param {Object} params - Search parameters (e.g., city)
   */
  search: async (params) => {
    const response = await api.get('/stores/search', { params });
    return response.data;
  },

  /**
   * Get store by ID (public)
   * @param {string} id - Store ID
   */
  getById: async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  /**
   * Get store products (public)
   * @param {string} id - Store ID
   * @param {Object} params - Query parameters
   */
  getProducts: async (id, params = {}) => {
    const response = await api.get(`/stores/${id}/products`, { params });
    return response.data;
  },

  // ============ Admin Endpoints ============
  /**
   * Create new store (admin only)
   * @param {Object} storeData - Store data
   */
  create: async (storeData) => {
    const response = await api.post('/stores', storeData);
    return response.data;
  },

  /**
   * Update store (admin only)
   * @param {string} id - Store ID
   * @param {Object} storeData - Updated store data
   */
  update: async (id, storeData) => {
    const response = await api.put(`/stores/${id}`, storeData);
    return response.data;
  },

  /**
   * Delete store (admin only)
   * @param {string} id - Store ID
   */
  delete: async (id) => {
    const response = await api.delete(`/stores/${id}`);
    return response.data;
  },

  /**
   * Get store inventory (admin only)
   * @param {string} id - Store ID
   */
  getInventory: async (id) => {
    const response = await api.get(`/stores/${id}/inventory`);
    return response.data;
  },

  /**
   * Update store inventory (admin only)
   * @param {string} id - Store ID
   * @param {Object} inventoryData - Inventory data
   */
  updateInventory: async (id, inventoryData) => {
    const response = await api.patch(`/stores/${id}/inventory`, inventoryData);
    return response.data;
  },

  /**
   * Get store orders (admin only)
   * @param {string} id - Store ID
   * @param {Object} params - Query parameters
   */
  getOrders: async (id, params = {}) => {
    const response = await api.get(`/stores/${id}/orders`, { params });
    return response.data;
  }
};

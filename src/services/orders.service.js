import api from './api';

/**
 * Orders Service
 * Handles all order-related API calls
 */

export const ordersService = {
  /**
   * Get all orders (admin only)
   * @param {Object} params - Query parameters (e.g., status, date)
   */
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  /**
   * Get order by ID (authenticated)
   * @param {string} id - Order ID
   */
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Create new order (authenticated)
   * @param {Object} orderData - Order data
   */
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  /**
   * Update order (authenticated)
   * @param {string} id - Order ID
   * @param {Object} orderData - Updated order data
   */
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  /**
   * Delete order (admin only)
   * @param {string} id - Order ID
   */
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  /**
   * Get order items (authenticated)
   * @param {string} id - Order ID
   */
  getItems: async (id) => {
    const response = await api.get(`/orders/${id}/items`);
    return response.data;
  },

  /**
   * Update order status (admin only)
   * @param {string} id - Order ID
   * @param {Object} statusData - Status update data (e.g., { status: 'shipped' })
   */
  updateStatus: async (id, statusData) => {
    const response = await api.patch(`/orders/${id}/status`, statusData);
    return response.data;
  }
};

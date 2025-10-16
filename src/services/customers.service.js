import api from './api';

/**
 * Customers Service
 * Handles all customer-related API calls
 */

export const customersService = {
  /**
   * Get all customers (admin only)
   */
  getAll: async () => {
    const response = await api.get('/customers');
    return response.data;
  },

  /**
   * Search customers (admin only)
   * @param {Object} params - Search parameters (e.g., name, email, phone)
   */
  search: async (params) => {
    const response = await api.get('/customers/search', { params });
    return response.data;
  },

  /**
   * Get customer by ID (authenticated)
   * @param {string} id - Customer ID
   */
  getById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  /**
   * Create new customer (admin only)
   * @param {Object} customerData - Customer data
   */
  create: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  /**
   * Update customer (authenticated)
   * @param {string} id - Customer ID
   * @param {Object} customerData - Updated customer data
   */
  update: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  /**
   * Delete customer (admin only)
   * @param {string} id - Customer ID
   */
  delete: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  /**
   * Get customer orders (authenticated)
   * @param {string} id - Customer ID
   */
  getOrders: async (id) => {
    const response = await api.get(`/customers/${id}/orders`);
    return response.data;
  }
};

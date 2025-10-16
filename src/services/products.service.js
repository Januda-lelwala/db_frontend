import api from './api';

/**
 * Products Service
 * Handles all product-related API calls
 */

export const productsService = {
  // ============ Public Endpoints ============
  /**
   * Get all products (public)
   * @param {Object} params - Query parameters (e.g., page, limit, sort)
   */
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Search products (public)
   * @param {Object} params - Search parameters (e.g., query, category, price range)
   */
  search: async (params) => {
    const response = await api.get('/products/search', { params });
    return response.data;
  },

  /**
   * Get products by category (public)
   * @param {string} categoryId - Category ID
   * @param {Object} params - Query parameters
   */
  getByCategory: async (categoryId, params = {}) => {
    const response = await api.get(`/products/category/${categoryId}`, { params });
    return response.data;
  },

  /**
   * Get product by ID (public)
   * @param {string} id - Product ID
   */
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // ============ Admin Endpoints ============
  /**
   * Get low stock products (admin only)
   * @param {Object} params - Query parameters (e.g., threshold)
   */
  getLowStock: async (params = {}) => {
    const response = await api.get('/products/low-stock', { params });
    return response.data;
  },

  /**
   * Create new product (admin only)
   * @param {Object} productData - Product data
   */
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Update product (admin only)
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product data
   */
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete product (admin only)
   * @param {string} id - Product ID
   */
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Update product stock (admin only)
   * @param {string} id - Product ID
   * @param {Object} stockData - Stock update data (e.g., { quantity: 100 })
   */
  updateStock: async (id, stockData) => {
    const response = await api.patch(`/products/${id}/stock`, stockData);
    return response.data;
  }
};

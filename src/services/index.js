/**
 * Services Index
 * Central export point for all API services
 */

export { baseService } from './base.service';
export { authService } from './auth.service';
export { customersService } from './customers.service';
export { ordersService } from './orders.service';
export { productsService } from './products.service';
export { storesService } from './stores.service';
export { vehiclesService } from './vehicles.service';
export { handleAPIError } from './api';
export { default as api } from './api';

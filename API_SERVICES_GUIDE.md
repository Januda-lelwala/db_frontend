# API Services Usage Guide

This guide explains how to use the API services in your React components.

## Table of Contents
1. [Import Services](#import-services)
2. [Authentication](#authentication)
3. [Customers](#customers)
4. [Orders](#orders)
5. [Products](#products)
6. [Stores](#stores)
7. [Vehicles (Trucks & Trains)](#vehicles)
8. [Error Handling](#error-handling)

---

## Import Services

You can import services individually or all at once:

```javascript
// Import individual services
import { authService, productsService, ordersService } from '../services';

// Or import from specific files
import { authService } from '../services/auth.service';
import { productsService } from '../services/products.service';
```

---

## Authentication

### User Authentication

```javascript
import { authService, handleAPIError } from '../services';

// Register new user
const handleRegister = async (userData) => {
  try {
    const response = await authService.register({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890'
    });
    console.log('Registration successful:', response);
    // Store token: localStorage.setItem('authToken', response.token);
  } catch (error) {
    console.error('Registration failed:', handleAPIError(error));
  }
};

// User login
const handleLogin = async (credentials) => {
  try {
    const response = await authService.login({
      email: 'john@example.com',
      password: 'password123'
    });
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  } catch (error) {
    console.error('Login failed:', handleAPIError(error));
  }
};

// Get user profile
const getUserProfile = async () => {
  try {
    const profile = await authService.getProfile();
    console.log('User profile:', profile);
  } catch (error) {
    console.error('Failed to fetch profile:', handleAPIError(error));
  }
};
```

### Admin Authentication

```javascript
// Admin login
const handleAdminLogin = async (credentials) => {
  try {
    const response = await authService.adminLogin({
      email: 'admin@example.com',
      password: 'adminpass123'
    });
    localStorage.setItem('authToken', response.token);
  } catch (error) {
    console.error('Admin login failed:', handleAPIError(error));
  }
};

// Get admin profile
const getAdminProfile = async () => {
  try {
    const profile = await authService.getAdminProfile();
    console.log('Admin profile:', profile);
  } catch (error) {
    console.error('Failed to fetch admin profile:', handleAPIError(error));
  }
};

// Register new admin (admin only)
const registerAdmin = async (adminData) => {
  try {
    const response = await authService.adminRegister(adminData);
    console.log('Admin registered:', response);
  } catch (error) {
    console.error('Admin registration failed:', handleAPIError(error));
  }
};
```

### Driver & Assistant Authentication

```javascript
// Driver login
const handleDriverLogin = async () => {
  try {
    const response = await authService.driverLogin({
      email: 'driver@example.com',
      password: 'driverpass123'
    });
    localStorage.setItem('authToken', response.token);
  } catch (error) {
    console.error('Driver login failed:', handleAPIError(error));
  }
};

// Assistant login
const handleAssistantLogin = async () => {
  try {
    const response = await authService.assistantLogin({
      email: 'assistant@example.com',
      password: 'assistantpass123'
    });
    localStorage.setItem('authToken', response.token);
  } catch (error) {
    console.error('Assistant login failed:', handleAPIError(error));
  }
};
```

---

## Customers

```javascript
import { customersService, handleAPIError } from '../services';

// Get all customers (admin only)
const fetchCustomers = async () => {
  try {
    const customers = await customersService.getAll();
    console.log('Customers:', customers);
  } catch (error) {
    console.error('Failed to fetch customers:', handleAPIError(error));
  }
};

// Search customers (admin only)
const searchCustomers = async (searchTerm) => {
  try {
    const results = await customersService.search({ 
      name: searchTerm 
      // or email: searchTerm, phone: searchTerm
    });
    console.log('Search results:', results);
  } catch (error) {
    console.error('Search failed:', handleAPIError(error));
  }
};

// Get customer by ID
const getCustomer = async (customerId) => {
  try {
    const customer = await customersService.getById(customerId);
    console.log('Customer:', customer);
  } catch (error) {
    console.error('Failed to fetch customer:', handleAPIError(error));
  }
};

// Create customer (admin only)
const createCustomer = async (customerData) => {
  try {
    const newCustomer = await customersService.create(customerData);
    console.log('Customer created:', newCustomer);
  } catch (error) {
    console.error('Failed to create customer:', handleAPIError(error));
  }
};

// Update customer
const updateCustomer = async (customerId, updates) => {
  try {
    const updated = await customersService.update(customerId, updates);
    console.log('Customer updated:', updated);
  } catch (error) {
    console.error('Failed to update customer:', handleAPIError(error));
  }
};

// Delete customer (admin only)
const deleteCustomer = async (customerId) => {
  try {
    await customersService.delete(customerId);
    console.log('Customer deleted');
  } catch (error) {
    console.error('Failed to delete customer:', handleAPIError(error));
  }
};

// Get customer orders
const getCustomerOrders = async (customerId) => {
  try {
    const orders = await customersService.getOrders(customerId);
    console.log('Customer orders:', orders);
  } catch (error) {
    console.error('Failed to fetch orders:', handleAPIError(error));
  }
};
```

---

## Orders

```javascript
import { ordersService, handleAPIError } from '../services';

// Get all orders (admin only)
const fetchOrders = async () => {
  try {
    const orders = await ordersService.getAll({ status: 'pending' });
    console.log('Orders:', orders);
  } catch (error) {
    console.error('Failed to fetch orders:', handleAPIError(error));
  }
};

// Get order by ID
const getOrder = async (orderId) => {
  try {
    const order = await ordersService.getById(orderId);
    console.log('Order:', order);
  } catch (error) {
    console.error('Failed to fetch order:', handleAPIError(error));
  }
};

// Create new order
const createOrder = async (orderData) => {
  try {
    const newOrder = await ordersService.create({
      customerId: '123',
      items: [
        { productId: 'prod1', quantity: 2 },
        { productId: 'prod2', quantity: 1 }
      ],
      deliveryAddress: '123 Main St',
      // ... other order data
    });
    console.log('Order created:', newOrder);
  } catch (error) {
    console.error('Failed to create order:', handleAPIError(error));
  }
};

// Update order
const updateOrder = async (orderId, updates) => {
  try {
    const updated = await ordersService.update(orderId, updates);
    console.log('Order updated:', updated);
  } catch (error) {
    console.error('Failed to update order:', handleAPIError(error));
  }
};

// Get order items
const getOrderItems = async (orderId) => {
  try {
    const items = await ordersService.getItems(orderId);
    console.log('Order items:', items);
  } catch (error) {
    console.error('Failed to fetch items:', handleAPIError(error));
  }
};

// Update order status (admin only)
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const updated = await ordersService.updateStatus(orderId, { 
      status: newStatus 
    });
    console.log('Order status updated:', updated);
  } catch (error) {
    console.error('Failed to update status:', handleAPIError(error));
  }
};
```

---

## Products

```javascript
import { productsService, handleAPIError } from '../services';

// Get all products (public)
const fetchProducts = async () => {
  try {
    const products = await productsService.getAll({ 
      page: 1, 
      limit: 20,
      sort: 'name'
    });
    console.log('Products:', products);
  } catch (error) {
    console.error('Failed to fetch products:', handleAPIError(error));
  }
};

// Search products (public)
const searchProducts = async (searchTerm) => {
  try {
    const results = await productsService.search({ 
      query: searchTerm,
      minPrice: 10,
      maxPrice: 100
    });
    console.log('Search results:', results);
  } catch (error) {
    console.error('Search failed:', handleAPIError(error));
  }
};

// Get products by category (public)
const getProductsByCategory = async (categoryId) => {
  try {
    const products = await productsService.getByCategory(categoryId);
    console.log('Category products:', products);
  } catch (error) {
    console.error('Failed to fetch products:', handleAPIError(error));
  }
};

// Get product by ID (public)
const getProduct = async (productId) => {
  try {
    const product = await productsService.getById(productId);
    console.log('Product:', product);
  } catch (error) {
    console.error('Failed to fetch product:', handleAPIError(error));
  }
};

// Get low stock products (admin only)
const getLowStockProducts = async () => {
  try {
    const products = await productsService.getLowStock({ threshold: 10 });
    console.log('Low stock products:', products);
  } catch (error) {
    console.error('Failed to fetch low stock:', handleAPIError(error));
  }
};

// Create product (admin only)
const createProduct = async (productData) => {
  try {
    const newProduct = await productsService.create(productData);
    console.log('Product created:', newProduct);
  } catch (error) {
    console.error('Failed to create product:', handleAPIError(error));
  }
};

// Update product (admin only)
const updateProduct = async (productId, updates) => {
  try {
    const updated = await productsService.update(productId, updates);
    console.log('Product updated:', updated);
  } catch (error) {
    console.error('Failed to update product:', handleAPIError(error));
  }
};

// Update product stock (admin only)
const updateStock = async (productId, quantity) => {
  try {
    const updated = await productsService.updateStock(productId, { quantity });
    console.log('Stock updated:', updated);
  } catch (error) {
    console.error('Failed to update stock:', handleAPIError(error));
  }
};
```

---

## Stores

```javascript
import { storesService, handleAPIError } from '../services';

// Get all stores (public)
const fetchStores = async () => {
  try {
    const stores = await storesService.getAll();
    console.log('Stores:', stores);
  } catch (error) {
    console.error('Failed to fetch stores:', handleAPIError(error));
  }
};

// Get available cities (public)
const getCities = async () => {
  try {
    const cities = await storesService.getCities();
    console.log('Cities:', cities);
  } catch (error) {
    console.error('Failed to fetch cities:', handleAPIError(error));
  }
};

// Search stores by city (public)
const searchStores = async (city) => {
  try {
    const results = await storesService.search({ city });
    console.log('Stores in city:', results);
  } catch (error) {
    console.error('Search failed:', handleAPIError(error));
  }
};

// Get store by ID (public)
const getStore = async (storeId) => {
  try {
    const store = await storesService.getById(storeId);
    console.log('Store:', store);
  } catch (error) {
    console.error('Failed to fetch store:', handleAPIError(error));
  }
};

// Get store products (public)
const getStoreProducts = async (storeId) => {
  try {
    const products = await storesService.getProducts(storeId);
    console.log('Store products:', products);
  } catch (error) {
    console.error('Failed to fetch products:', handleAPIError(error));
  }
};

// Create store (admin only)
const createStore = async (storeData) => {
  try {
    const newStore = await storesService.create(storeData);
    console.log('Store created:', newStore);
  } catch (error) {
    console.error('Failed to create store:', handleAPIError(error));
  }
};

// Get store inventory (admin only)
const getStoreInventory = async (storeId) => {
  try {
    const inventory = await storesService.getInventory(storeId);
    console.log('Store inventory:', inventory);
  } catch (error) {
    console.error('Failed to fetch inventory:', handleAPIError(error));
  }
};

// Update store inventory (admin only)
const updateStoreInventory = async (storeId, inventoryData) => {
  try {
    const updated = await storesService.updateInventory(storeId, inventoryData);
    console.log('Inventory updated:', updated);
  } catch (error) {
    console.error('Failed to update inventory:', handleAPIError(error));
  }
};

// Get store orders (admin only)
const getStoreOrders = async (storeId) => {
  try {
    const orders = await storesService.getOrders(storeId);
    console.log('Store orders:', orders);
  } catch (error) {
    console.error('Failed to fetch orders:', handleAPIError(error));
  }
};
```

---

## Vehicles

### Trucks

```javascript
import { vehiclesService, handleAPIError } from '../services';

// Get all trucks (admin only)
const fetchTrucks = async () => {
  try {
    const trucks = await vehiclesService.trucks.getAll();
    console.log('Trucks:', trucks);
  } catch (error) {
    console.error('Failed to fetch trucks:', handleAPIError(error));
  }
};

// Search trucks (admin only)
const searchTrucks = async (searchParams) => {
  try {
    const results = await vehiclesService.trucks.search({ 
      status: 'available',
      location: 'warehouse1'
    });
    console.log('Search results:', results);
  } catch (error) {
    console.error('Search failed:', handleAPIError(error));
  }
};

// Get trucks by capacity (admin only)
const getTrucksByCapacity = async () => {
  try {
    const trucks = await vehiclesService.trucks.getByCapacity({ 
      minCapacity: 1000,
      maxCapacity: 5000
    });
    console.log('Trucks by capacity:', trucks);
  } catch (error) {
    console.error('Failed to fetch trucks:', handleAPIError(error));
  }
};

// Create truck (admin only)
const createTruck = async (truckData) => {
  try {
    const newTruck = await vehiclesService.trucks.create(truckData);
    console.log('Truck created:', newTruck);
  } catch (error) {
    console.error('Failed to create truck:', handleAPIError(error));
  }
};

// Update truck (admin only)
const updateTruck = async (truckId, updates) => {
  try {
    const updated = await vehiclesService.trucks.update(truckId, updates);
    console.log('Truck updated:', updated);
  } catch (error) {
    console.error('Failed to update truck:', handleAPIError(error));
  }
};

// Delete truck (admin only, requires manage_vehicles permission)
const deleteTruck = async (truckId) => {
  try {
    await vehiclesService.trucks.delete(truckId);
    console.log('Truck deleted');
  } catch (error) {
    console.error('Failed to delete truck:', handleAPIError(error));
  }
};
```

### Trains

```javascript
// Get all trains (admin only)
const fetchTrains = async () => {
  try {
    const trains = await vehiclesService.trains.getAll();
    console.log('Trains:', trains);
  } catch (error) {
    console.error('Failed to fetch trains:', handleAPIError(error));
  }
};

// Get trains by capacity (admin only)
const getTrainsByCapacity = async () => {
  try {
    const trains = await vehiclesService.trains.getByCapacity({ 
      minCapacity: 10000,
      maxCapacity: 50000
    });
    console.log('Trains by capacity:', trains);
  } catch (error) {
    console.error('Failed to fetch trains:', handleAPIError(error));
  }
};

// Create train (admin only)
const createTrain = async (trainData) => {
  try {
    const newTrain = await vehiclesService.trains.create(trainData);
    console.log('Train created:', newTrain);
  } catch (error) {
    console.error('Failed to create train:', handleAPIError(error));
  }
};

// Update train (admin only)
const updateTrain = async (trainId, updates) => {
  try {
    const updated = await vehiclesService.trains.update(trainId, updates);
    console.log('Train updated:', updated);
  } catch (error) {
    console.error('Failed to update train:', handleAPIError(error));
  }
};
```

---

## Error Handling

All API calls should be wrapped in try-catch blocks. Use the `handleAPIError` function for consistent error messages:

```javascript
import { productsService, handleAPIError } from '../services';

const fetchData = async () => {
  try {
    const products = await productsService.getAll();
    // Handle success
  } catch (error) {
    const errorMessage = handleAPIError(error);
    // Display error to user (toast, alert, etc.)
    console.error(errorMessage);
  }
};
```

---

## React Component Example

Here's a complete example of using services in a React component:

```javascript
import React, { useState, useEffect } from 'react';
import { productsService, handleAPIError } from '../services';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsService.getAll({ page: 1, limit: 20 });
        setProducts(data.products || data);
        setError(null);
      } catch (err) {
        setError(handleAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
```

---

## Notes

1. **Authentication**: Most endpoints require authentication. The token is automatically included in requests via the axios interceptor in `api.js`.

2. **Admin Routes**: Routes marked as "admin only" require admin authentication.

3. **Base URL**: Configure the API base URL in `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Token Storage**: Tokens are stored in localStorage with the key `authToken`. This is handled automatically by the axios interceptor.

5. **Error Responses**: The API returns errors in the format `{ error: "message" }` or `{ message: "message" }`. Use `handleAPIError()` to extract the appropriate error message.

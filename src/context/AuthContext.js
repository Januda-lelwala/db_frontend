import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth.service';
import { handleAPIError } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, role: 'customer'|'admin'|'driver'|'assistant', portalType: 'customer'|'employee' }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Restore user from localStorage
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('User restore failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password, role, portalType = 'auto') => {
    try {
      let response;
      let credentials;
      
      // Route to appropriate login endpoint based on role with correct credential format
      switch (role) {
        case 'admin':
          credentials = { admin_id: username, password };
          response = await authService.admin.login(credentials);
          break;
        case 'driver':
          credentials = { driver_id: username, password };
          response = await authService.driver.login(credentials);
          break;
        case 'assistant':
          credentials = { assistant_id: username, password };
          response = await authService.assistant.login(credentials);
          break;
        case 'customer':
        default:
          credentials = { user_name: username, password };
          response = await authService.login(credentials);
          break;
      }
      
      // Handle new backend response format: { success: true, data: { admin/customer: {...}, token: "..." } }
      const token = response.data?.token || response.token;
      const userData = response.data?.admin || response.data?.customer || response.data?.driver || response.data?.assistant || response.user || response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Determine portal type based on role if not specified
      const finalPortalType = portalType === 'auto' 
        ? (role === 'customer' ? 'customer' : 'employee')
        : portalType;
      
      const userWithPortal = { ...userData, role, portalType: finalPortalType };
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithPortal));
      setUser(userWithPortal);
      
      return userWithPortal;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  const register = async (userData, portalType = 'customer') => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, token } = response;
      
      const userWithPortal = { ...newUser, role: 'customer', portalType: 'customer' };
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithPortal));
      setUser(userWithPortal);
      
      return userWithPortal;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = useMemo(() => ({ 
    user, 
    loading, 
    login, 
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    isDriver: user?.role === 'driver',
    isAssistant: user?.role === 'assistant',
    isEmployee: user?.portalType === 'employee',
    portalType: user?.portalType || null
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

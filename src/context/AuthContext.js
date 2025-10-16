import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { handleAPIError } from '../services/api';
import { STORAGE_KEYS } from '../config/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        try {
          const response = await authService.verify();
          setUser(response.user);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = async (username, password, role, portalType = 'auto') => {
    try {
      const response = await authService.login({ 
        username, 
        password, 
        role, 
        portalType 
      });
      
      const { user: userData, token } = response;
      
      // Determine portal type
      const finalPortalType = portalType === 'auto' 
        ? (userData.role === 'customer' ? 'customer' : 'employee')
        : portalType;
      
      const userWithPortal = { ...userData, portalType: finalPortalType };
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userWithPortal));
      
      setUser(userWithPortal);
      return userWithPortal;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  /**
   * Register new customer
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, token } = response;
      
      const userWithPortal = { 
        ...newUser, 
        role: 'customer', 
        portalType: 'customer' 
      };
      
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userWithPortal));
      
      setUser(userWithPortal);
      return userWithPortal;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      setUser(null);
    }
  };

  const value = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
      
      console.log('🔄 AuthContext initializing...');
      console.log('📦 localStorage check:', { hasToken: !!token, hasUser: !!savedUser });
      
      if (token && savedUser) {
        try {
          // Restore user from localStorage
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('✅ User restored from localStorage:', parsedUser.role);
        } catch (error) {
          console.error('❌ User restore failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      } else {
        console.log('ℹ️ No saved session found');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password, role, portalType = 'auto') => {
    console.log('🔐 Login attempt:', { username, role, portalType });
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
      
      // Debug: Log raw backend response
      console.log('📡 Raw login response:', response);
      console.log('📦 Response.data:', response.data);
      
      // Handle backend response format: { success: true, data: { customer/admin/driver/assistant: {...}, token: "..." } }
      // Axios wraps the response, so the actual data is at response.data.data
      const responseData = response.data?.data || response.data;
      const token = responseData?.token || response.data?.token || response.token;
      const userData = responseData?.admin || responseData?.customer || responseData?.driver || responseData?.assistant || response.data?.user || response.user || responseData;
      
      console.log('🔍 Extracted token:', token ? token.substring(0, 20) + '...' : 'NULL');
      console.log('🔍 Extracted userData:', userData);
      
      if (!token) {
        console.error('❌ No token in response! Full response:', JSON.stringify(response, null, 2));
        throw new Error('No token received from server');
      }
      
      // Determine portal type based on role if not specified
      const finalPortalType = portalType === 'auto' 
        ? (role === 'customer' ? 'customer' : 'employee')
        : portalType;
      
      const userWithPortal = { ...userData, role, portalType: finalPortalType };
      
      // Save token and user to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithPortal));
      console.log('✅ Login successful - Token and user saved to localStorage');
      console.log('🔑 Token preview:', token.substring(0, 20) + '...');
      console.log('👤 User:', { ...userWithPortal, password: undefined });
      
      setUser(userWithPortal);
      
      return userWithPortal;
    } catch (error) {
      console.error('❌ Login failed:', error);
      console.error('Error response:', error?.response?.data);
      throw new Error(handleAPIError(error));
    }
  };

  const register = async (userData, portalType = 'customer') => {
    try {
      const response = await authService.register(userData);
      
      // Handle backend response format: { success: true, data: { customer: {...}, token: "..." } }
      const responseData = response.data?.data || response.data;
      const token = responseData?.token || response.data?.token || response.token;
      const newUser = responseData?.customer || response.data?.user || response.user || responseData;
      
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

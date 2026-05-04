import React, { createContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

const demoUser = {
  _id: 'demo-user-id',
  name: 'Demo Student',
  username: 'Demo Student',
  email: 'demo@demo.com',
  department: 'Computer Science',
  year: 'Freshman',
  points: 435,
  streak: 7,
  badges: [],
  rank: 1,
  activityLog: []
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(demoUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Authentication disabled for development - always use demo user
    setUser(demoUser);
    setLoading(false);
  }, [demoUser]);

  const extractUserFromResponse = (response) => {
    return response?.data?.data?.user || response?.data?.user || null;
  };

  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      const userData = extractUserFromResponse(response);
      if (userData) {
        setUser(userData);
        return { success: true, user: userData };
      }
      throw new Error('Invalid login response');
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup
  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signup(userData);
      const registeredUser = extractUserFromResponse(response);
      if (registeredUser) {
        setUser(registeredUser);
        return { success: true, user: registeredUser };
      }
      throw new Error('Invalid signup response');
    } catch (err) {
      setError(err.message || 'Signup failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(profileData);
      const updatedUser = extractUserFromResponse(response);
      if (updatedUser) {
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }
      throw new Error('Invalid update response');
    } catch (err) {
      setError(err.message || 'Update failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    updateUser,
    isAuthenticated: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

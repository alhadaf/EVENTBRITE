import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { User } from '../types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      // In a real app, validate token with backend
      let mockUser: User;
      
      // Determine user based on token
      try {
        if (token === 'mock-jwt-token') {
        mockUser = {
          id: '1',
          email: 'admin@eventmanager.com',
          name: 'Admin User',
          role: 'admin',
          organizationId: 'org-1',
        };
      } else if (token === 'mock-jwt-token-scanner') {
        mockUser = {
          id: '2',
          email: 'scanner@eventmanager.com',
          name: 'Scanner User',
          role: 'scanner',
          organizationId: 'org-1',
        };
      } else if (token === 'mock-jwt-token-organizer') {
        mockUser = {
          id: '3',
          email: 'organizer@eventmanager.com',
          name: 'Event Organizer',
          role: 'organizer',
          organizationId: 'org-1',
        };
      } else if (token === 'mock-jwt-token-staff') {
        mockUser = {
          id: '4',
          email: 'staff@eventmanager.com',
          name: 'Staff Member',
          role: 'staff',
          organizationId: 'org-1',
        };
      } else {
        // Default to admin if token doesn't match known tokens
        mockUser = {
          id: '1',
          email: 'admin@eventmanager.com',
          name: 'Admin User',
          role: 'admin',
          organizationId: 'org-1',
        };
      }
      
      setUser(mockUser);
      } catch (error) {
        console.error('Error parsing auth token:', error);
        // Clear invalid token
        Cookies.remove('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in real app, make API call
      let user: User;
      let token: string;
      
      const emailLower = email?.toLowerCase() || '';
      
      if (emailLower === 'admin@eventmanager.com' && password === 'admin') {
        token = 'mock-jwt-token';
        user = {
          id: '1',
          email,
          name: 'Admin User',
          role: 'admin',
          organizationId: 'org-1',
        };
      } else if (emailLower === 'scanner@eventmanager.com' && password === 'scanner') {
        token = 'mock-jwt-token-scanner';
        user = {
          id: '2',
          email,
          name: 'Scanner User',
          role: 'scanner',
          organizationId: 'org-1',
        };
      } else if (emailLower === 'organizer@eventmanager.com' && password === 'organizer') {
        token = 'mock-jwt-token-organizer';
        user = {
          id: '3',
          email,
          name: 'Event Organizer',
          role: 'organizer',
          organizationId: 'org-1',
        };
      } else if (emailLower === 'staff@eventmanager.com' && password === 'staff') {
        token = 'mock-jwt-token-staff';
        user = {
          id: '4',
          email,
          name: 'Staff Member',
          role: 'staff',
          organizationId: 'org-1',
        };
      } else {
        throw new Error('Invalid credentials');
      }
      
      // Set cookie first, then update user state
      Cookies.set('auth_token', token, { expires: 7, path: '/' });
      
      // Set user state
      setUser(user);
      
      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      Cookies.remove('auth_token', { path: '/' });
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
    setUser(null);
    // Force page reload to redirect to login page
    window.location.href = '/';
  };

  const refreshToken = async () => {
    // Implementation for token refresh
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken,
  };
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/index.js';
import { AuthAPI } from '../api/client.js';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await AuthAPI.getMe();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await AuthAPI.login(credentials);
    if (data.token) {
      localStorage.setItem('chowkichiwadi_token', data.token);
    }
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } finally {
      localStorage.removeItem('chowkichiwadi_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

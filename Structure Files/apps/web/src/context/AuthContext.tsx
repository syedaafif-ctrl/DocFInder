'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, loginApi, registerApi, getProfileApi, RegisterPayload } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'docfinder_token';
const REFRESH_STORAGE_KEY = 'docfinder_refresh_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  // Hydrate user on mount
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    setToken(savedToken);
    getProfileApi(savedToken)
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        // Token invalid or expired
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(REFRESH_STORAGE_KEY);
        }
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginApi(email, password);
      setUser(response.user);
      setToken(response.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
        localStorage.setItem(REFRESH_STORAGE_KEY, response.refreshToken);
      }
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await registerApi(payload);
      setUser(response.user);
      setToken(response.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
        localStorage.setItem(REFRESH_STORAGE_KEY, response.refreshToken);
      }
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        updateUser,
        logout,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

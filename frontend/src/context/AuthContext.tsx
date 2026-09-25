import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { User } from '../types';
import { clearApiCache } from '../config/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readUser = (): User | null => {
  try {
    const saved = localStorage.getItem('subhadarshini_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(readUser);

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('subhadarshini_token');
  });

  // Stable identities: other providers (the wishlist sync) depend on these,
  // and a new function every render would restart their effects.
  const login = useCallback((newToken: string, newUser: User) => {
    // Nothing fetched for the previous visitor should be reused for this one.
    clearApiCache();
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('subhadarshini_token', newToken);
    localStorage.setItem('subhadarshini_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    clearApiCache();
    setToken(null);
    setUser(null);
    localStorage.removeItem('subhadarshini_token');
    localStorage.removeItem('subhadarshini_user');
  }, []);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const value = useMemo(
    () => ({ user, token, login, logout, isAuthenticated: !!token, isAdmin }),
    [user, token, login, logout, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

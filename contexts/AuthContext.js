import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setApiToken, setOnUnauthorized } from '../services/api';

const STORAGE_TOKEN = '@flood_rescue_token';
const STORAGE_USER = '@flood_rescue_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  const setToken = useCallback((newToken) => {
    setTokenState(newToken);
    setApiToken(newToken);
    if (newToken) AsyncStorage.setItem(STORAGE_TOKEN, newToken);
    else AsyncStorage.removeItem(STORAGE_TOKEN);
  }, []);

  const persistUser = useCallback((u) => {
    setUser(u);
    if (u) AsyncStorage.setItem(STORAGE_USER, JSON.stringify(u));
    else AsyncStorage.removeItem(STORAGE_USER);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    persistUser(null);
  }, [setToken, persistUser]);

  useEffect(() => {
    setOnUnauthorized(logout);
  }, [logout]);

  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_TOKEN),
          AsyncStorage.getItem(STORAGE_USER),
        ]);
        if (storedToken) {
          setApiToken(storedToken);
          setTokenState(storedToken);
        }
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (_) {}
        }
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    const t = res.data?.token;
    const u = res.data?.user;
    if (!t || !u) throw new Error(res.message || 'Đăng nhập thất bại');
    setToken(t);
    persistUser(u);
    return { user: u, token: t };
  }, [setToken, persistUser]);

  const register = useCallback(async (username, email, password, role = 'user') => {
    const res = await api.post('/users/register', { username, email, password, role });
    const u = res.data;
    if (!u) throw new Error(res.message || 'Đăng ký thất bại');
    return u;
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isCitizen: user?.role === 'user' || !user?.role,
    isRescueOrCoordinator: user?.role === 'coordinator' || user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

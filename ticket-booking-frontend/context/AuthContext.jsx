'use client';
import { createContext, useState, useEffect } from 'react';
import api from '../lib/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's an existing session on mount
    const checkSession = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        // No active session
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const signup = async (email, password, username) => {
    const res = await api.post('/auth/signup', { username, email, password });
    setUser(res.data.user);
    return res.data;
  };

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

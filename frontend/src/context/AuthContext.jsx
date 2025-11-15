// frontend/src/context/AuthContext.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

// Create context moved to AuthContextValue.js

// AuthProvider (named export) — wrap your app with this
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  });

  useEffect(() => {
    // ensure axios has auth header if user exists
    if (user && user.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const saveUser = (u) => {
    setUser(u);
    try { localStorage.setItem('user', JSON.stringify(u)); } catch {}
    if (u && u.token) api.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
  };

  const login = async (email, password) => {
    // returns user object or throws
    const { data } = await api.post('/users/login', { email, password });
    saveUser(data);
    return data;
  };

  const register = async (payload) => {
    // payload: { name, email, password }
    const { data } = await api.post('/users/register', payload);
    saveUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem('user'); } catch {}
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, setUser: saveUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


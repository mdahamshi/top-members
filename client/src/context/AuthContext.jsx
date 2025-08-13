import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/urls';
const USER_STORAGE_KEY = 'auth_user';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuth = !!user;
  const isMember = isAuth && user.membership_status;
  const isAdmin = isAuth && user.role === 'admin';

  const request = async (url, options = {}) => {
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (res.status !== 204) return res.json();
    return null;
  };

  // Login (POST /auth)
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await request(api.auth, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      const userData = data.user || data;
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.message);
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // joinClub (PUT /auth or another endpoint) with passcode
  const joinClub = async (passcode) => {
    setLoading(true);
    setError(null);
    try {
      const data = await request(api.auth, {
        method: 'PUT',
        body: JSON.stringify({ passcode }),
      });
      if (data.user) {
        setUser(data.user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const search = async (term) => {
    setLoading(true);
    try {
      const data = await request(
        `${api.users}/check-username?search=${encodeURIComponent(term)}`,
        {
          method: 'GET',
        }
      );
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Register (POST /users)
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await request(api.users, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (data.user) {
        setUser(data.user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await request(api.auth, {
        method: 'GET',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  useEffect(() => {}, []);
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        error,
        login,
        logout,
        register,
        joinClub,
        clearError,
        search,
        isMember,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

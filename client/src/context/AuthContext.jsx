import React, { createContext, useContext, useState } from 'react';
import { useCrud } from '@sarawebs/sb-hooks';
import api from '../api/urls';

const USER_STORAGE_KEY = 'auth_user';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const { loading, error, create, loadOne, search, update, clearError } =
    useCrud(api.auth);

  const isAuth = !!user;
  const isMember = isAuth && user.membership_status;
  const isAdmin = isAuth && user.role === 'admin';
  const updateUSer = (user) => {
    if (user) {
      setUser(user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  };
  const login = async (credentials) => {
    const res = await create(credentials);
    updateUSer(res?.data);
    return res;
  };
  const joinClub = async (passcode) => {
    const res = await update('', { passcode });

    updateUSer(res?.data?.user);
    return res;
  };
  const register = async (userData) => {
    const res = await create(userData, api.users);
    updateUSer(res?.data?.user);
    return res;
  };

  const logout = async () => {
    await loadOne('logout'); // or create(api.logout) if you have a logout POST
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const searchUser = async (term) => {
    return await search(term, `${api.users}/check-username`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isMember,
        isAdmin,
        loading,
        error,
        login,
        logout,
        register,
        searchUser,
        clearError,
        joinClub,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useMemo, useState } from "react";
import { api, getStoredToken, setStoredToken } from "../services/api";

const AuthContext = createContext(null);
const USER_STORAGE_KEY = "cobrador_admin_user";

function getStoredUser() {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());

  async function login(credentials) {
    const response = await api.post("/auth/login", credentials);

    setStoredToken(response.data.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
    setToken(response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    setStoredToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
      token,
      user,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

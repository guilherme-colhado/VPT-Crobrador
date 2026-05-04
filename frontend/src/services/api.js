import axios from "axios";

const STORAGE_KEY = "cobrador_admin_token";

export const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost" ? "http://localhost:3001" : ""),
});

export function getStoredToken() {
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

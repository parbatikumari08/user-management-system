import axios from "axios";

// Use environment variable for production, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
});

// Add request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// Users
export const getUsers = (token, params) =>
  API.get("/users", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserById = (id, token) =>
  API.get(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createUser = (data, token) =>
  API.post("/users", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUser = (id, data, token) =>
  API.put(`/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUser = (id, token) =>
  API.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = (data, token) =>
  API.put("/users/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
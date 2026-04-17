import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

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
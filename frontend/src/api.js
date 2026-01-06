import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:2000/api/v1/", // your backend URL
});

// Add JWT token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

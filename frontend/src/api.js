import axios from "axios";
//https://blogs-app-admin.onrender.com/

const API = axios.create({
  baseURL: "http://blogs-app-admin.onrender.com/api/v1/", // your backend URL
});

// Add JWT token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

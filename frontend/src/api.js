import axios from "axios";
//https://blogs-app-admin.onrender.com/api/v1/
//http://localhost:2000/api/v1/

const API = axios.create({
  baseURL: "https://blogs-app-admin.onrender.com/api/v1/", 
});

// Add JWT token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

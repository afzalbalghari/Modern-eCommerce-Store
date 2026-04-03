import axios from "axios";

// ── Axios instance ────────────────────────────────────────
const API = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout:         15000,
});

// ── Request interceptor: attach JWT ───────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);



export default API;
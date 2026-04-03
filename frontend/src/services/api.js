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

// ── Response interceptor: handle 401 globally ─────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ═════════════════════════════════════════════════════════
//  AUTH
// ═════════════════════════════════════════════════════════
export const authAPI = {
  register:        (data)          => API.post("/auth/register", data),
  login:           (data)          => API.post("/auth/login", data),
  logout:          ()              => API.get("/auth/logout"),
  getMe:           ()              => API.get("/auth/me"),
  updateDetails:   (data)          => API.put("/auth/updatedetails", data),
  updatePassword:  (data)          => API.put("/auth/updatepassword", data),
  forgotPassword:  (email)         => API.post("/auth/forgotpassword", { email }),
  resetPassword:   (token, data)   => API.put(`/auth/resetpassword/${token}`, data),
  toggleWishlist:  (productId)     => API.put(`/auth/wishlist/${productId}`),
};

export default API;
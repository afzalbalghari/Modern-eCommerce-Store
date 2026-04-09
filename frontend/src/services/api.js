import axios from "axios";

// ── Axios instance ────────────────────────────────────────
const API = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || "https://modern-ecommerce-store-production.up.railway.app/api",
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

// ═════════════════════════════════════════════════════════
//  PRODUCTS
// ═════════════════════════════════════════════════════════
export const productAPI = {
  /** GET /api/products
   *  Params: category, price[gte], price[lte], sort, page, limit, search, badge
   */
  getAll:          (params)        => API.get("/products", { params }),
  getOne:          (id)            => API.get(`/products/${id}`),
  getTop:          (limit = 8)     => API.get("/products/top", { params: { limit } }),
  getFeatured:     ()              => API.get("/products/featured"),
  getByCategory:   (cat)           => API.get(`/products/category/${cat}`),
  search:          (q)             => API.get("/products/search", { params: { q } }),
  getStats:        ()              => API.get("/products/stats"),

  // Admin
  create:          (data)          => API.post("/products", data),
  update:          (id, data)      => API.put(`/products/${id}`, data),
  remove:          (id)            => API.delete(`/products/${id}`),
  uploadPhoto:     (id, formData)  => API.put(`/products/${id}/photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

  // Reviews
  addReview:       (id, data)      => API.post(`/products/${id}/reviews`, data),
  updateReview:    (id, rid, data) => API.put(`/products/${id}/reviews/${rid}`, data),
  deleteReview:    (id, rid)       => API.delete(`/products/${id}/reviews/${rid}`),
};

// ═════════════════════════════════════════════════════════
//  ORDERS
// ═════════════════════════════════════════════════════════
export const orderAPI = {
  create:          (data)          => API.post("/orders", data),
  getMyOrders:     (params)        => API.get("/orders/mine", { params }),
  getOne:          (id)            => API.get(`/orders/${id}`),
  pay:             (id, data)      => API.put(`/orders/${id}/pay`, data),
  cancel:          (id, reason)    => API.put(`/orders/${id}/cancel`, { reason }),

  // Admin
  getAll:          (params)        => API.get("/orders", { params }),
  getStats:        ()              => API.get("/orders/stats/summary"),
  updateStatus:    (id, data)      => API.put(`/orders/${id}/status`, data),
};

// ═════════════════════════════════════════════════════════
//  USERS  (admin)
// ═════════════════════════════════════════════════════════
export const userAPI = {
  getProfile:      ()              => API.get("/users/profile"),
  getStats:        ()              => API.get("/users/stats"),

  // Admin
  getAll:          (params)        => API.get("/users", { params }),
  getOne:          (id)            => API.get(`/users/${id}`),
  create:          (data)          => API.post("/users", data),
  update:          (id, data)      => API.put(`/users/${id}`, data),
  remove:          (id)            => API.delete(`/users/${id}`),
};

// ── Health check ──────────────────────────────────────────
export const healthCheck = () => API.get("/health");

export default API;
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request if it exists
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["x-auth-token"] = token;
}

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle expired tokens, etc.
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["x-auth-token"];
      // Redirect to login if needed
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        api.defaults.headers.common["x-auth-token"] = token;

        try {
          const res = await api.get("/api/auth/me");
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          // If token is invalid, clear everything
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          delete api.defaults.headers.common["x-auth-token"];
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (formData) => {
    try {
      const res = await api.post("/api/auth/register", formData);
      toast.success(res.data.message);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await api.post("/api/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      api.defaults.headers.common["x-auth-token"] = res.data.token;

      toast.success("Login successful");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["x-auth-token"];
    toast.info("You have been logged out");
  };

  // Request password reset
  const forgotPassword = async (email) => {
    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      toast.success(res.data.message);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Password reset request failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Reset password with token
  const resetPassword = async (token, password) => {
    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, {
        password,
        confirmPassword: password,
      });
      toast.success(res.data.message);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Password reset failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Update user profile (non-sensitive info)
  const updateProfile = async (formData) => {
    try {
      const res = await api.put("/api/users/profile", formData);
      setUser(res.data.user);
      toast.success(res.data.message);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Profile update failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Request update for sensitive information (email or phone)
  const requestSensitiveUpdate = async (field, value) => {
    try {
      const res = await api.post("/api/users/request-update", { field, value });
      toast.success(res.data.message);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Update request failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Verify email with token
  const verifyEmail = async (token) => {
    try {
      const res = await api.get(`/api/auth/verify/${token}`);
      toast.success(res.data.message);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Email verification failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Confirm sensitive update
  const confirmSensitiveUpdate = async (field, token) => {
    try {
      const res = await api.get(`/api/users/confirm-update/${field}/${token}`);
      toast.success(res.data.message);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Update confirmation failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // Get all users (admin only)
  const getAllUsers = async () => {
    try {
      const res = await api.get("/api/users");
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to get users";
      toast.error(errorMessage);
      return [];
    }
  };

  // Get user count (admin only)
  const getUserCount = async () => {
    try {
      const res = await api.get("/api/users/count");
      return res.data.count;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to get user count";
      toast.error(errorMessage);
      return 0;
    }
  };

  // Get user history (admin only)
  const getUserHistory = async (userId) => {
    try {
      const res = await api.get(`/api/users/history/${userId}`);
      return res.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to get user history";
      toast.error(errorMessage);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        requestSensitiveUpdate,
        verifyEmail,
        confirmSensitiveUpdate,
        getAllUsers,
        getUserCount,
        getUserHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

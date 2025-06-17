import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

export const authService = {
  register: async (userData) => {
    return await apiClient.post(
      API_ENDPOINTS.STUDENT_REGISTRATION.REGISTER,
      userData
    );
  },
  // Login chung
  login: async (credentials, userType = "student") => {
    const endpoint =
      userType === "staff"
        ? API_ENDPOINTS.STAFF.LOGIN
        : API_ENDPOINTS.STUDENT.LOGIN;

    return await apiClient.post(endpoint, credentials);
  },

  // Logout
  logout: async (token) => {
    return await apiClient.post(
      API_ENDPOINTS.AUTH.LOGOUT,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  // Lưu token vào localStorage
  setToken: (token) => {
    localStorage.setItem("auth_token", token);
  },

  // Lấy token từ localStorage
  getToken: () => {
    return localStorage.getItem("auth_token");
  },

  // Xóa token
  removeToken: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_info");
  },

  // Lưu thông tin user
  setUserInfo: (userInfo, userType) => {
    localStorage.setItem("user_info", JSON.stringify(userInfo));
    localStorage.setItem("user_type", userType);
  },

  // Lấy thông tin user
  getUserInfo: () => {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // Lấy loại user
  getUserType: () => {
    return localStorage.getItem("user_type");
  },

  // Kiểm tra đã login chưa
  isAuthenticated: () => {
    return !!localStorage.getItem("auth_token");
  },
};

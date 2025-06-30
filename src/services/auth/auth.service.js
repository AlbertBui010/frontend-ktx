import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";


const TOKEN_KEY = "auth_token";
const USER_KEY = "user_info";
const TYPE_KEY = "user_type";


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

  getProfile: async () => {
    const res = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return res.data; // Giả sử API trả về { user: {...} }
  },
  // Logout
  logout: async () => {
    try {
      // interceptor đã tự gắn Authorization
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (e) {
      // nếu access‑token hết hạn, vẫn tiếp tục xoá localStorage
      console.warn("Logout API error (ignored):", e.message);
    } finally {
      // Xoá toàn bộ dấu vết local
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TYPE_KEY);

      // Gửi sự kiện cho các tab khác (Header đang lắng nghe 'storage')
      window.dispatchEvent(new Event("storage"));
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  // Lưu token vào localStorage
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Lấy token từ localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Xóa token
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TYPE_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Lưu thông tin user
  setUserInfo: (userInfo, userType) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    localStorage.setItem(TYPE_KEY, userType);
  },

  // Lấy thông tin user
  getUserInfo: () => {
    const userInfo = localStorage.getItem(USER_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // Lấy loại user
  getUserType: () => {
    return localStorage.getItem(TYPE_KEY);
  },

  // Kiểm tra đã login chưa
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

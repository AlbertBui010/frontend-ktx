import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:3001/api";

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // hoặc sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `Making ${config.method?.toUpperCase()} request to:`,
      `${config.baseURL}${config.url}`
    );
    console.log("Request data:", config.data);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("Response error:", error);

    if (error.response) {
      // Server responded with error status
      console.log("Error response data:", error.response.data);

      // Return error response data instead of throwing
      return error.response.data;
    } else if (error.request) {
      // Network error
      console.error("Network error:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      // Other error
      console.error("Unknown error:", error.message);
      throw new Error(error.message);
    }
  }
);

export const apiClient = {
  // Get method
  get: (url, config = {}) => {
    return axiosInstance.get(url, config);
  },

  // Post method
  post: (url, data, config = {}) => {
    return axiosInstance.post(url, data, config);
  },

  // Put method
  put: (url, data, config = {}) => {
    return axiosInstance.put(url, data, config);
  },

  // Delete method
  delete: (url, config = {}) => {
    return axiosInstance.delete(url, config);
  },

  // Patch method
  patch: (url, data, config = {}) => {
    return axiosInstance.patch(url, data, config);
  },
};

// Export axios instance for advanced usage
export { axiosInstance };

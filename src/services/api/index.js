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
    // Nếu response thành công, trả về data
    return response.data;
  },
  (error) => {
    console.error("Response error:", error); // Log lỗi đầy đủ để debug

    let errorMessage = "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";

    if (error.response) {
      // Lỗi từ server có phản hồi (status code 4xx, 5xx)
      const { data, status } = error.response;

      // Ưu tiên lấy thông báo từ cấu trúc `message` hoặc `error.message` từ backend
      if (data && data.message) {
        errorMessage = data.message;
      } else if (data && data.error && data.error.message) {
        errorMessage = data.error.message;
      } else {
        // Fallback cho các status code cụ thể hoặc thông báo chung
        switch (status) {
          case 400:
            errorMessage = "Yêu cầu không hợp lệ. Vui lòng kiểm tra dữ liệu đầu vào.";
            break;
          case 401:
            errorMessage = "Không được phép. Vui lòng đăng nhập lại.";
            // Bạn có thể thêm logic redirect đến trang login ở đây
            // window.location.href = '/login';
            break;
          case 403:
            errorMessage = "Bạn không có quyền thực hiện hành động này.";
            break;
          case 404:
            errorMessage = "Không tìm thấy tài nguyên.";
            break;
          case 409: // Conflict, như trường hợp đã tồn tại
            errorMessage = "Dữ liệu đã tồn tại hoặc có xung đột.";
            break;
          case 500:
            errorMessage = "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage = `Lỗi từ Server (${status}): ${error.response.statusText || "Không xác định"}`;
        }
      }
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không nhận được phản hồi (lỗi mạng, server offline)
      errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.";
    } else {
      // Lỗi xảy ra trong quá trình thiết lập request (lỗi client-side)
      errorMessage = `Lỗi Client: ${error.message}`;
    }

    // Ném một Promise.reject() với đối tượng Error mới chứa thông báo đã chuẩn hóa
    const customError = new Error(errorMessage);
    customError.originalError = error; // Giữ lại lỗi gốc để debug sâu hơn nếu cần
    return Promise.reject(customError);
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
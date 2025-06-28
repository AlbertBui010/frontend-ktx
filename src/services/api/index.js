// src/services/api/index.js
import axios from "axios";
import { authService } from "../auth/auth.service";

/* ────────────────────────────────────────────────────────────
 * Cấu hình axios instance
 * ──────────────────────────────────────────────────────────── */
const API_BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000, // 10 s
});

/* ────────────────────────────────────────────────────────────
 * Interceptor: Request
 * ──────────────────────────────────────────────────────────── */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken(); // << luôn đọc cùng một key
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Bạn có thể bật console.log dưới đây khi cần debug
    // console.log(`[${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

/* ────────────────────────────────────────────────────────────
 * Interceptor: Response
 * Trả về `response.data` nếu thành công,
 * còn lỗi thì chuẩn hoá thông báo và reject.
 * ──────────────────────────────────────────────────────────── */
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";

    if (error.response) {
      // Có phản hồi từ server (4xx / 5xx)
      const { status, data } = error.response;
      if (data?.message) message = data.message;
      else if (data?.error?.message) message = data.error.message;
      else {
        switch (status) {
          case 400:
            message = "Yêu cầu không hợp lệ. Vui lòng kiểm tra dữ liệu.";
            break;
          case 401:
            message = "Hết phiên đăng nhập. Vui lòng đăng nhập lại.";
            break;
          case 403:
            message = "Bạn không có quyền thực hiện hành động này.";
            break;
          case 404:
            message = "Không tìm thấy tài nguyên.";
            break;
          case 409:
            message = "Dữ liệu đã tồn tại hoặc xung đột.";
            break;
          case 500:
            message = "Lỗi máy chủ. Vui lòng thử lại sau.";
            break;
          default:
            message = `Lỗi server (${status}).`;
        }
      }
    } else if (error.request) {
      // Không nhận được phản hồi
      message =
        "Không thể kết nối máy chủ. Kiểm tra đường truyền mạng của bạn.";
    } else {
      // Lỗi thiết lập request
      message = `Lỗi client: ${error.message}`;
    }

    const customError = new Error(message);
    customError.originalError = error;
    return Promise.reject(customError);
  },
);

/* ────────────────────────────────────────────────────────────
 * Export
 * ──────────────────────────────────────────────────────────── */
export const apiClient = axiosInstance; // Dùng ở mọi service
export { axiosInstance };               // Nếu cần cấu hình nâng cao

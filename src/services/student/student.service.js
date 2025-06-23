import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

export const studentService = {
  // Lấy danh sách sinh viên (GET /api/students/)
  getAll: async (params) => {
    return await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL, { params });
  },

  // Thêm sinh viên mới (POST /api/students/)
  create: async (studentData) => {
    return await apiClient.post(API_ENDPOINTS.STUDENT.CREATE, studentData);
  },

  // Sửa thông tin sinh viên (PUT /api/students/:id)
  update: async (id, studentData) => {
    return await apiClient.put(API_ENDPOINTS.STUDENT.UPDATE(id), studentData);
  },

  // Xóa sinh viên (DELETE /api/students/:id)
  delete: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.STUDENT.DELETE(id));
  },

  // Đăng ký sinh viên mới và sinh phiếu đăng ký KTX
  registerStudent: async (studentData) => {
    return await apiClient.post(
      API_ENDPOINTS.STUDENT_REGISTRATION.REGISTER, // Sửa từ STUDENT.REGISTER sang STUDENT_REGISTRATION.REGISTER
      studentData
    );
  },

  // Setup password
  setupPassword: async (token, password) => {
  return await apiClient.post(
    API_ENDPOINTS.STUDENT_REGISTRATION.SETUP_PASSWORD,
    {
      token,
      new_password: password,
    }
  );
  },
};

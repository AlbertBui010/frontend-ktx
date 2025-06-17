import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

export const studentService = {
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

import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

export const studentService = {
  // Setup password
  setupPassword: async (token, password) => {
    return await apiClient.post(
      API_ENDPOINTS.STUDENT_REGISTRATION.SETUP_PASSWORD,
      {
        token,
        password,
      }
    );
  },
};

import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

export const registrationService = {
  /**
   * Fetches all registrations with optional pagination, status filter, and search query.
   * @param {object} params - Query parameters.
   * @param {number} params.page - The page number.
   * @param {number} params.limit - The number of items per page.
   * @param {string} params.trang_thai - The status of the registration (e.g., 'pending', 'approved').
   * @param {string} params.search - Search term for student name or MSSV.
   * @returns {Promise<object>} A promise that resolves to the API response.
   */
  getAllRegistrations: async (params) => {
    return await apiClient.get(API_ENDPOINTS.REGISTRATION.GET_ALL, { params });
  },

  /**
   * Creates a new registration.
   * @param {object} registrationData - The data for the new registration.
   * @returns {Promise<object>} A promise that resolves to the API response.
   */
  createRegistration: async (registrationData) => {
    return await apiClient.post(API_ENDPOINTS.REGISTRATION.CREATE, registrationData);
  },

  /**
   * Fetches a single registration by its ID.
   * @param {number} id - The ID of the registration.
   * @returns {Promise<object>} A promise that resolves to the API response.
   */
  getRegistrationById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.REGISTRATION.GET_BY_ID(id));
  },

  /**
   * Approves a registration and assigns a bed.
   * @param {number} id - The ID of the registration to approve.
   * @param {object} approvalData - Data containing the bed ID and optional notes.
   * @param {number} approvalData.id_giuong - The ID of the bed to assign.
   * @param {string} [approvalData.ghi_chu] - Optional notes for the approval.
   * @returns {Promise<object>} A promise that resolves to the API response.
   */
  approveRegistration: async (id, approvalData) => {
    return await apiClient.post(API_ENDPOINTS.REGISTRATION.APPROVE(id), approvalData);
  },

  /**
   * Rejects a registration.
   * @param {number} id - The ID of the registration to reject.
   * @param {object} rejectionData - Data containing the reason for rejection.
   * @param {string} rejectionData.ly_do_tu_choi - The reason for rejecting the registration.
   * @returns {Promise<object>} A promise that resolves to the API response.
   */
  rejectRegistration: async (id, rejectionData) => {
    return await apiClient.post(API_ENDPOINTS.REGISTRATION.REJECT(id), rejectionData);
  },

  /**
   * Cancels a registration.
   * @param {number} id - The ID of the registration to cancel.
   * @returns {Promise<object>} A promise that resolves to the API response.
   */
  cancelRegistration: async (id) => {
    return await apiClient.post(API_ENDPOINTS.REGISTRATION.CANCEL(id));
  },

  /**
   * Fetches registrations for the currently authenticated student.
   * @returns {Promise<object>} A promise that resolves to the API response.
   */
  getMyRegistrations: async () => {
    return await apiClient.get(API_ENDPOINTS.REGISTRATION.GET_MY_REGISTRATIONS);
  },
};
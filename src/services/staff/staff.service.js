import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

export const staffService = {
  getAll: async (params) => {
    return await apiClient.get(API_ENDPOINTS.STAFF.GET_ALL, { params });
  },
  create: async (staffData) => {
    return await apiClient.post(API_ENDPOINTS.STAFF.CREATE, staffData);
  },
  update: async (id, staffData) => {
    return await apiClient.put(API_ENDPOINTS.STAFF.UPDATE(id), staffData);
  },
  delete: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.STAFF.DELETE(id));
  },
};
import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

export const roomAllocationService = {
  getAll: (params) => apiClient.get(API_ENDPOINTS.ROOM_ALLOCATION.GET_ALL, { params }),
  getById: (id) => apiClient.get(API_ENDPOINTS.ROOM_ALLOCATION.GET_BY_ID(id)),
  create: (data) => apiClient.post(API_ENDPOINTS.ROOM_ALLOCATION.CREATE, data),
  update: (id, data) => apiClient.put(API_ENDPOINTS.ROOM_ALLOCATION.UPDATE(id), data),
  delete: (id) => apiClient.delete(API_ENDPOINTS.ROOM_ALLOCATION.DELETE(id)),
};
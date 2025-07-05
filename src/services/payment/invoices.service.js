import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

export const invoiceService = {
  // getAll: async (page) => {
  //   return await apiClient.get(`API_ENDPOINTS.INVOICE.GET_ALL?page=${page}`);
  // }, 
  getAll: async () => {
    return await apiClient.get(API_ENDPOINTS.INVOICE.GET_ALL);
  },
  getMy: () => apiClient.get(API_ENDPOINTS.INVOICE.GET_MY),
  getOne: (id) => apiClient.get(API_ENDPOINTS.INVOICE.GET_ONE(id)).then(r => r.data),
  checkout: (id) => apiClient.post(API_ENDPOINTS.INVOICE.CHECKOUT(id)).then(r => r.data),
};

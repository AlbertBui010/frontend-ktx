import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

// Chủ đề (Topic)
export const topicService = {
  getAll: () => apiClient.get(API_ENDPOINTS.TOPIC.GET_ALL),
  create: (data) => apiClient.post(API_ENDPOINTS.TOPIC.CREATE, data),
  update: (id, data) => apiClient.put(API_ENDPOINTS.TOPIC.UPDATE(id), data),
  delete: (id) => apiClient.delete(API_ENDPOINTS.TOPIC.DELETE(id)),
};

// Bảng tin (News)
export const newsService = {
  getAll: () => apiClient.get(API_ENDPOINTS.NEWS.GET_ALL),
  create: (data) => apiClient.post(API_ENDPOINTS.NEWS.CREATE, data),
  update: (id, data) => apiClient.put(API_ENDPOINTS.NEWS.UPDATE(id), data),
  delete: (id) => apiClient.delete(API_ENDPOINTS.NEWS.DELETE(id)),
};

// Liên kết bảng tin - chủ đề
export const newsTopicLinkService = {
  getAll: () => apiClient.get(API_ENDPOINTS.NEWS_TOPIC_LINK.GET_ALL),
  create: (data) => apiClient.post(API_ENDPOINTS.NEWS_TOPIC_LINK.CREATE, data),
  update: (id, data) => apiClient.put(API_ENDPOINTS.NEWS_TOPIC_LINK.UPDATE(id), data),
  delete: (id) => apiClient.delete(API_ENDPOINTS.NEWS_TOPIC_LINK.DELETE(id)),
};
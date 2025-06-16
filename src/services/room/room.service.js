//src\services\room\room.service.js
import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

// Room Type Services
export const roomTypeService = {
  getAll: (params) =>
    apiClient.get("/rooms/room-types", { params }), // params: { page, limit, search }
  create: (data) =>
    apiClient.post("/rooms/room-types", data),
  update: (id, data) =>
    apiClient.put(`/rooms/room-types/${id}`, data),
  delete: (id) =>
    apiClient.delete(`/rooms/room-types/${id}`),
};

// Room Services
export const roomService = {
  getAll: (params) =>
    apiClient.get("/rooms/rooms", { params }),
  create: (data) =>
    apiClient.post("/rooms/rooms", data),
  update: (id, data) =>
    apiClient.put(`/rooms/rooms/${id}`, data),
  delete: (id) =>
    apiClient.delete(`/rooms/rooms/${id}`),
  getBeds: (roomId) =>
    apiClient.get(API_ENDPOINTS.ROOM.GET_BEDS(roomId)),
  createBed: (roomId, data) =>
    apiClient.post(API_ENDPOINTS.BED.CREATE(roomId), data),
  updateBed: (roomId, bedId, data) =>
    apiClient.put(API_ENDPOINTS.BED.UPDATE(roomId, bedId), data), // <-- FIX: Use endpoint definition
  deleteBed: (roomId, bedId) =>
    apiClient.delete(API_ENDPOINTS.BED.DELETE(roomId, bedId)), // <-- FIX: Pass roomId and use endpoint definition
  getAvailable: (params) =>
    apiClient.get("/rooms/rooms/available", { params }),
};
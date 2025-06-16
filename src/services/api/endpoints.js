//src\services\api\endpoints.js
import { Bed } from "lucide-react";

export const API_ENDPOINTS = {
  // Authentication

  // Student Registration
  STUDENT_REGISTRATION: {
    REGISTER: "/api/student-registration/register",
    SETUP_PASSWORD: "/api/student-registration/setup-password",
  },

  // Login
  STUDENT: {
    LOGIN: "/auth/login/student",
  },
  STAFF: {
    LOGIN: "/auth/login/staff",
  },

  // Room & RoomType
  ROOM: {
    GET_ALL: "/rooms/rooms",
    CREATE: "/rooms/rooms",
    UPDATE: (id) => `/rooms/rooms/${id}`,
    DELETE: (id) => `/rooms/rooms/${id}`,
    GET_BEDS: (roomId) => `/rooms/rooms/${roomId}/beds`,
    GET_AVAILABLE: "/rooms/rooms/available",
  },
  ROOM_TYPE: {
    GET_ALL: "/rooms/room-types",
    CREATE: "/rooms/room-types",
    UPDATE: (id) => `/rooms/room-types/${id}`,
    DELETE: (id) => `/rooms/room-types/${id}`,
  },

  BED: {
    GET_ALL_BEDS_BY_ROOM_ID:(roomId) => `/rooms/rooms/${roomId}/beds`,
    CREATE: (roomId) => `/rooms/rooms/${roomId}/beds`,
    UPDATE: (roomId, bedId) => `rooms/rooms/${roomId}/beds/${bedId}`, // <-- FIX: Add roomId parameter
    DELETE: (roomId, bedId) => `rooms/rooms/${roomId}/beds/${bedId}`, // <-- FIX: Add roomId parameter and use bedId for consistency
  },
  TOPIC: {
    GET_ALL: "topics/topics",
    CREATE: "topics/topics",
    UPDATE: (id) => `topics/topics/${id}`,
    DELETE: (id) => `topics/topics/${id}`,
  },
  NEWS: {
    GET_ALL: "topics/news",
    CREATE: "topics/news",
    UPDATE: (id) => `topics/news/${id}`,
    DELETE: (id) => `topics/news/${id}`,
  },
  NEWS_TOPIC_LINK: {
    GET_ALL: "/news-topic-links",
    CREATE: "/news-topic-links",
    UPDATE: (id) => `/news-topic-links/${id}`,
    DELETE: (id) => `/news-topic-links/${id}`,
  },
};



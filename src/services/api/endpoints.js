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
};



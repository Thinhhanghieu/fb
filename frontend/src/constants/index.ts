export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  SETTINGS: '/settings',
  MARKETPLACE: '/marketplace',
  GROUPS: '/groups',
  VIDEO: '/video',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    LOGOUT: '/v1/auth/logout',
    ME: '/v1/auth/me',
  },
  POSTS: {
    LIST: '/v1/posts',
    DETAIL: (id: string) => `/v1/posts/${id}`,
    CREATE: '/v1/posts',
    LIKE: (id: string) => `/v1/posts/${id}/like`,
    COMMENTS: (id: string) => `/v1/posts/${id}/comments`,
  },
  USERS: {
    PROFILE: (id: string) => `/users/${id}`,
    FRIENDS: (id: string) => `/users/${id}/friends`,
  },
  NOTIFICATIONS: '/notifications',
  MESSAGES: {
    LIST: '/messages',
    CONVERSATION: (id: string) => `/messages/${id}`,
  },
  STORAGE: '/v1/storage',
} as const;

export const QUERY_KEYS = {
  POSTS: 'posts',
  USER: 'user',
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
} as const;

export const APP_NAME = 'Pulse';
export const APP_DESCRIPTION = 'Kết nối với thế giới theo cách của bạn.';

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
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  POSTS: {
    LIST: '/posts',
    DETAIL: (id: string) => `/posts/${id}`,
    CREATE: '/posts',
    LIKE: (id: string) => `/posts/${id}/like`,
    COMMENTS: (id: string) => `/posts/${id}/comments`,
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

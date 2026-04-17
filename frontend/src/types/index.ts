export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type FriendshipStatus = 'NONE' | 'PENDING' | 'ACCEPTED' | 'BLOCKED';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  joinedAt: string;
  friendsCount: number;
  isOnline?: boolean;
  friendshipStatus?: FriendshipStatus;
  requestId?: string; // If there's a pending request, this is the ID
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface PostComment {
  id: string;
  author: User;
  content: string;
  likesCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'LIKE_POST' | 'COMMENT_POST' | 'FRIEND_REQUEST' | 'FRIEND_ACCEPT';
  actor: User;
  targetId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  type?: 'TEXT' | 'IMAGE';
  attachmentUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  birthday?: string;
  gender?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

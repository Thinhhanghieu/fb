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

export interface Comment {
  id: string;
  author: User;
  content: string;
  likesCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'friend_request' | 'share' | 'mention';
  actor: User;
  post?: Post;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
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
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string;
  gender: 'male' | 'female' | 'other';
}

export interface AuthResponse {
  user: User;
  token: string;
}

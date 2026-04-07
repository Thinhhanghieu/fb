import { Post, User, Notification, Conversation } from '@/types';

export const MOCK_USER: User = {
  id: '1',
  name: 'Elena Rodriguez',
  username: 'elena.rodriguez',
  email: 'elena@example.com',
  avatar: 'https://i.pravatar.cc/150?img=47',
  coverPhoto: 'https://picsum.photos/1280/400?random=1',
  bio: 'Digital Curator & Visual Artist. Exploring the intersection of human connection and minimalist digital aesthetics.',
  location: 'Hanoi, Vietnam',
  joinedAt: '2024-01-01',
  friendsCount: 312,
  isOnline: true,
};

export const MOCK_FRIENDS: User[] = [
  { id: '2', name: 'Sarah Jenkins', username: 'sarah.j', email: '', avatar: 'https://i.pravatar.cc/150?img=1', joinedAt: '', friendsCount: 150, isOnline: true },
  { id: '3', name: 'David Chen', username: 'david.c', email: '', avatar: 'https://i.pravatar.cc/150?img=8', joinedAt: '', friendsCount: 230, isOnline: false },
  { id: '4', name: 'Aisha Patel', username: 'aisha.p', email: '', avatar: 'https://i.pravatar.cc/150?img=5', joinedAt: '', friendsCount: 89, isOnline: true },
  { id: '5', name: 'Marcus Lee', username: 'marcus.l', email: '', avatar: 'https://i.pravatar.cc/150?img=12', joinedAt: '', friendsCount: 411, isOnline: true },
  { id: '6', name: 'Chloe Martin', username: 'chloe.m', email: '', avatar: 'https://i.pravatar.cc/150?img=9', joinedAt: '', friendsCount: 178, isOnline: false },
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: MOCK_FRIENDS[0],
    content: 'Just finished the latest project wrap-up. The architectural designs are looking incredible. Can\'t wait to see the physical structure start taking shape in Seattle! 🏗️🏙️',
    images: ['https://picsum.photos/780/400?random=10'],
    likesCount: 47,
    commentsCount: 12,
    sharesCount: 5,
    isLiked: false,
    createdAt: '2024-04-06T08:00:00Z',
  },
  {
    id: '2',
    author: MOCK_FRIENDS[1],
    content: 'Is there anything better than a morning hike in the mountains? The air is crisp, the coffee tastes better, and the view is unmatched. ⛰️☕️',
    images: ['https://picsum.photos/780/400?random=20'],
    likesCount: 134,
    commentsCount: 28,
    sharesCount: 14,
    isLiked: true,
    createdAt: '2024-04-06T06:30:00Z',
  },
  {
    id: '3',
    author: MOCK_USER,
    content: 'The way the light hits the studio in the morning is just something else. Current mood: monochromatic and focused. ☁️',
    likesCount: 89,
    commentsCount: 7,
    sharesCount: 2,
    isLiked: false,
    createdAt: '2024-04-05T10:00:00Z',
  },
  {
    id: '4',
    author: MOCK_FRIENDS[2],
    content: 'Highlights from last week\'s exhibition. So much inspiration and beautiful work from everyone.',
    images: ['https://picsum.photos/780/400?random=30', 'https://picsum.photos/780/400?random=31'],
    likesCount: 203,
    commentsCount: 45,
    sharesCount: 31,
    isLiked: false,
    createdAt: '2024-04-05T07:00:00Z',
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'like',
    actor: MOCK_FRIENDS[0],
    message: 'đã thích bài viết của bạn.',
    isRead: false,
    createdAt: '2024-04-06T09:00:00Z',
  },
  {
    id: '2',
    type: 'comment',
    actor: MOCK_FRIENDS[1],
    message: 'đã bình luận bài viết của bạn: "Thật tuyệt vời! 🔥"',
    isRead: false,
    createdAt: '2024-04-06T08:15:00Z',
  },
  {
    id: '3',
    type: 'friend_request',
    actor: MOCK_FRIENDS[2],
    message: 'đã gửi lời mời kết bạn.',
    isRead: true,
    createdAt: '2024-04-05T14:00:00Z',
  },
  {
    id: '4',
    type: 'share',
    actor: MOCK_FRIENDS[3],
    message: 'đã chia sẻ bài viết của bạn.',
    isRead: true,
    createdAt: '2024-04-05T11:30:00Z',
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participants: [MOCK_FRIENDS[0]],
    lastMessage: {
      id: 'm1',
      sender: MOCK_FRIENDS[0],
      content: 'Dự án tuần này ra sao rồi? 😊',
      createdAt: '2024-04-06T09:30:00Z',
      isRead: false,
    },
    unreadCount: 3,
    updatedAt: '2024-04-06T09:30:00Z',
  },
  {
    id: '2',
    participants: [MOCK_FRIENDS[1]],
    lastMessage: {
      id: 'm2',
      sender: MOCK_FRIENDS[1],
      content: 'Còn nhớ chuyến đi hồi tháng trước không?',
      createdAt: '2024-04-05T20:00:00Z',
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: '2024-04-05T20:00:00Z',
  },
  {
    id: '3',
    participants: [MOCK_FRIENDS[2]],
    lastMessage: {
      id: 'm3',
      sender: MOCK_USER,
      content: 'Mình sẽ có mặt lúc 7 giờ nhé!',
      createdAt: '2024-04-05T17:00:00Z',
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: '2024-04-05T17:00:00Z',
  },
];

export const MOCK_PRODUCTS = [
  { id: '1', title: 'iPhone 15 Pro Max - Blue Titanium', price: 28500000, category: 'Điện tử', location: 'Hà Nội', image: 'https://picsum.photos/400/400?random=100' },
  { id: '2', title: 'Bàn phím cơ Custom cực êm', price: 1200000, category: 'Điện tử', location: 'Đà Nẵng', image: 'https://picsum.photos/400/400?random=101' },
  { id: '3', title: 'Máy pha cà phê Breville 870', price: 15400000, category: 'Gia dụng', location: 'TP. HCM', image: 'https://picsum.photos/400/400?random=102' },
  { id: '4', title: 'Giày Nike Air Jordan 1 Low', price: 3200000, category: 'Thời trang', location: 'Hà Nội', image: 'https://picsum.photos/400/400?random=103' },
  { id: '5', title: 'Đèn bàn Pixar phong cách Retro', price: 450000, category: 'Gia dụng', location: 'Hải Phòng', image: 'https://picsum.photos/400/400?random=104' },
  { id: '6', title: 'Tai nghe Sony WH-1000XM5', price: 6800000, category: 'Điện tử', location: 'Cần Thơ', image: 'https://picsum.photos/400/400?random=105' },
];

export const MOCK_GROUPS = [
  { id: '1', name: 'Cộng đồng UI/UX Việt Nam', members: '45K', cover: 'https://picsum.photos/800/300?random=200', category: 'Thiết kế' },
  { id: '2', name: 'Nghiện Setup - Góc Làm Việc', members: '128K', cover: 'https://picsum.photos/800/300?random=201', category: 'Lối sống' },
  { id: '3', name: 'Kế toán & Thuế 4.0', members: '12K', cover: 'https://picsum.photos/800/300?random=202', category: 'Nghề nghiệp' },
];

export const MOCK_VIDEOS = [
  { id: '1', title: 'Hướng dẫn thiết kế Glassmorphism trong 10 phút', views: '12K', time: '2 giờ trước', thumbnail: 'https://picsum.photos/800/450?random=300', author: MOCK_FRIENDS[0] },
  { id: '2', title: 'Review chi tiết iPhone 15 Pro Max sau 6 tháng sử dụng', views: '250K', time: '1 ngày trước', thumbnail: 'https://picsum.photos/800/450?random=301', author: MOCK_FRIENDS[2] },
];

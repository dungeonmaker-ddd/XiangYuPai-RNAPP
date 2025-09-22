/**
 * GroupCenter 页面组类型定义
 * 
 * 定义页面组级别的通用类型和接口
 */

// 页面组导航参数类型
export interface GroupCenterNavigationParams {
  tab?: 'main' | 'publish';
  groupId?: string;
  groupType?: string;
  publishData?: GroupPublishData;
  filter?: GroupFilterOptions;
}

// 页面组状态类型
export interface GroupCenterPageGroupState {
  currentFilter: GroupFilterOptions;
  currentGroupId: string | null;
  publishData: GroupPublishData | null;
  isLoading: boolean;
  error: string | null;
}

// 筛选选项类型
export interface GroupFilterOptions {
  gameType?: string[];
  location?: string;
  ageRange?: string;
  gender?: 'all' | 'male' | 'female';
  groupType?: 'casual' | 'competitive' | 'learning' | 'all';
  timeRange?: 'today' | 'tomorrow' | 'week' | 'all';
  sortBy?: 'time' | 'distance' | 'popularity' | 'price';
  priceRange?: [number, number];
}

// 组局信息类型
export interface GroupInfo {
  id: string;
  title: string;
  description: string;
  gameType: string;
  gameIcon?: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar?: string;
  organizerRating: number;
  location: string;
  address?: string;
  startTime: string;
  endTime?: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  currency: string;
  status: 'open' | 'full' | 'closed' | 'cancelled' | 'completed';
  tags: string[];
  requirements?: string[];
  images?: string[];
  participants: GroupParticipant[];
  createdAt: string;
  updatedAt: string;
  isJoined: boolean;
  isOwner: boolean;
  isFavorite: boolean;
}

// 参与者信息类型
export interface GroupParticipant {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRating: number;
  joinedAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  note?: string;
}

// 发布组局数据类型
export interface GroupPublishData {
  title?: string;
  description?: string;
  gameType?: string;
  location?: string;
  address?: string;
  startTime?: string;
  endTime?: string;
  maxParticipants?: number;
  price?: number;
  currency?: string;
  tags?: string[];
  requirements?: string[];
  images?: string[];
  isPrivate?: boolean;
  autoConfirm?: boolean;
}

// 支付信息类型
export interface GroupPaymentInfo {
  orderId: string;
  groupId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: 'wechat' | 'alipay' | 'card' | 'balance';
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
}

// 组局统计信息类型
export interface GroupStatistics {
  totalGroups: number;
  activeGroups: number;
  completedGroups: number;
  totalParticipants: number;
  averageRating: number;
  totalRevenue: number;
  popularGameTypes: Array<{
    gameType: string;
    count: number;
    percentage: number;
  }>;
  popularLocations: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
}

// 从子页面导入的类型（重新导出）
export * from './MainPage/types';
export * from './PublishPage/types';

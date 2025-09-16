/**
 * 组局中心模块 - 类型定义
 * 基于架构设计文档的完整类型系统
 */

// ══════════════════════════════════════════════════════════════
// 1. 基础类型定义
// ══════════════════════════════════════════════════════════════

export type ActivityType = 'explore' | 'movie' | 'billiards' | 'ktv' | 'drink' | 'massage';

export type SortType = 'smart' | 'latest' | 'nearest' | 'cheapest';

export type GenderFilter = 'all' | 'female' | 'male';

export type RegistrationStatus = 'waiting' | 'approved' | 'rejected' | 'pending';

export type PaymentStatus = 'pending' | 'paid' | 'refunding' | 'refunded' | 'failed';

// ══════════════════════════════════════════════════════════════
// 2. 用户相关类型
// ══════════════════════════════════════════════════════════════

export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  isOnline: boolean;
  isVerified: boolean;
  creditScore: number;
  totalActivities: number;
  bio?: string;
  tags: string[];
  location?: {
    city: string;
    district: string;
  };
}

export interface Participant {
  user: UserInfo;
  joinedAt: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  message?: string;
}

// ══════════════════════════════════════════════════════════════
// 3. 组局活动类型
// ══════════════════════════════════════════════════════════════

export interface GroupActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  backgroundImage: string;
  
  // 发起者信息
  organizer: UserInfo;
  
  // 活动详情
  details: {
    datetime: string;
    location: {
      name: string;
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    price: {
      amount: number;
      unit: 'hour' | 'person' | 'total';
      currency: 'coins';
    };
    maxParticipants: number;
    registrationDeadline: string;
  };
  
  // 参与者
  participants: Participant[];
  waitingList: Participant[];
  
  // 状态
  status: 'active' | 'full' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  
  // 统计
  stats: {
    viewCount: number;
    registrationCount: number;
    distance?: number; // 距离用户的距离(km)
  };
  
  // 标签
  tags: string[];
  
  // 规则
  rules?: {
    ageRange?: [number, number];
    genderPreference?: GenderFilter;
    requirements?: string[];
    paymentMethod: 'prepay' | 'onsite';
    refundPolicy: string;
  };
}

// ══════════════════════════════════════════════════════════════
// 4. 筛选相关类型
// ══════════════════════════════════════════════════════════════

export interface FilterOptions {
  // 快速筛选
  sort: SortType;
  gender: GenderFilter;
  activityType: ActivityType | 'all';
  
  // 高级筛选
  advanced: {
    priceRange?: {
      min: number;
      max: number;
    };
    distanceRange?: {
      max: number; // km
    };
    timeRange?: {
      start: string;
      end: string;
    };
    tags?: string[];
  };
}

export interface FilterState {
  options: FilterOptions;
  isAdvancedVisible: boolean;
  activeFiltersCount: number;
}

// ══════════════════════════════════════════════════════════════
// 5. 发布组局类型
// ══════════════════════════════════════════════════════════════

export interface CreateGroupForm {
  type: ActivityType;
  title: string;
  description: string;
  parameters: string; // 系数项
  agreement: {
    datetime: string;
    location: string;
    price: number;
    maxParticipants: number;
    registrationDeadline: string;
  };
  payment: {
    pricePerUnit: number;
    unit: 'hour' | 'person';
    method: 'prepay' | 'onsite';
    refundPolicy: string;
  };
  images?: string[];
}

// ══════════════════════════════════════════════════════════════
// 6. 报名流程类型
// ══════════════════════════════════════════════════════════════

export interface RegistrationRequest {
  activityId: string;
  userId: string;
  message?: string;
  paymentAmount: number;
}

export interface PaymentInfo {
  amount: number;
  currency: 'coins';
  balance: number;
  serviceFee: number;
  total: number;
  method: 'balance' | 'recharge';
}

// ══════════════════════════════════════════════════════════════
// 7. 状态管理类型
// ══════════════════════════════════════════════════════════════

export interface GroupCenterState {
  // 列表数据
  activities: GroupActivity[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;
  
  // 筛选状态
  filter: FilterState;
  
  // 当前选中的活动
  selectedActivity: GroupActivity | null;
  
  // 用户位置
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

// ══════════════════════════════════════════════════════════════
// 8. 组件Props类型
// ══════════════════════════════════════════════════════════════

export interface GroupCardProps {
  activity: GroupActivity;
  onPress: (activity: GroupActivity) => void;
  onAvatarPress?: (user: UserInfo) => void;
}

export interface FilterTabsProps {
  filter: FilterOptions;
  onFilterChange: (filter: Partial<FilterOptions>) => void;
  onAdvancedPress: () => void;
}

export interface QuickFiltersProps {
  sort: SortType;
  gender: GenderFilter;
  activityType: ActivityType | 'all';
  onSortChange: (sort: SortType) => void;
  onGenderChange: (gender: GenderFilter) => void;
  onActivityTypeChange: (type: ActivityType | 'all') => void;
}

export interface GroupDetailProps {
  activity: GroupActivity;
  onBack: () => void;
  onContact: (user: UserInfo) => void;
  onRegister: (activity: GroupActivity) => void;
}

export interface PublishGroupProps {
  onCancel: () => void;
  onSave?: (form: CreateGroupForm) => void;
  onPublish: (form: CreateGroupForm) => void;
}

export interface RegistrationFlowProps {
  activity: GroupActivity;
  onCancel: () => void;
  onConfirm: (request: RegistrationRequest) => void;
}

export interface PaymentConfirmProps {
  activity: GroupActivity;
  paymentInfo: PaymentInfo;
  onCancel: () => void;
  onPay: () => void;
}

export interface StatusPageProps {
  activity: GroupActivity;
  status: RegistrationStatus;
  onBack: () => void;
  onContact?: () => void;
  onRetry?: () => void;
}

// ══════════════════════════════════════════════════════════════
// 9. API相关类型
// ══════════════════════════════════════════════════════════════

export interface GroupCenterAPI {
  // 获取活动列表
  getActivities: (params: {
    page: number;
    filter: FilterOptions;
    location?: { latitude: number; longitude: number };
  }) => Promise<{
    data: GroupActivity[];
    hasMore: boolean;
    total: number;
  }>;
  
  // 获取活动详情
  getActivityDetail: (id: string) => Promise<GroupActivity>;
  
  // 创建活动
  createActivity: (form: CreateGroupForm) => Promise<GroupActivity>;
  
  // 报名活动
  registerActivity: (request: RegistrationRequest) => Promise<{
    success: boolean;
    registrationId: string;
    paymentRequired: boolean;
  }>;
  
  // 支付
  processPayment: (params: {
    registrationId: string;
    amount: number;
  }) => Promise<{
    success: boolean;
    transactionId: string;
  }>;
  
  // 获取报名状态
  getRegistrationStatus: (registrationId: string) => Promise<{
    status: RegistrationStatus;
    paymentStatus: PaymentStatus;
  }>;
}

/**
 * 我的页面模块 - 类型定义
 * 基于设计文档的完整类型系统
 */

import React from 'react';

// 用户信息相关类型
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar: string | null;
  bio: string;
  phone?: string;
  email?: string;
  status: UserStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// 用户状态枚举
export type UserStatus = 'online' | 'busy' | 'away' | 'offline';

// 用户信息更新请求
export interface UserUpdateRequest {
  nickname?: string;
  bio?: string;
  status?: UserStatus;
}

// 头像上传结果
export interface UploadResult {
  url: string;
  size: number;
  format: string;
}

// 交易统计数据
export interface TransactionCounts {
  publishCount: number;
  orderCount: number;
  purchaseCount: number;
  enrollmentCount: number;
  newOrdersCount?: number; // 新订单角标
  newEnrollmentCount?: number; // 新报名状态角标
}

// 钱包信息
export interface WalletInfo {
  balance: number;
  frozenBalance: number;
  coinBalance: number;
  totalEarning: number;
  totalSpending: number;
}

// 功能卡片配置类型
export interface FunctionConfig {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
  badge?: number; // 角标数量
}

// 页面状态类型
export interface ProfilePageState {
  userInfo: UserInfo | null;
  transactionCounts: TransactionCounts | null;
  walletInfo: WalletInfo | null;
  isLoading: boolean;
  error: string | null;
  refreshing: boolean;
}

// 组件Props类型 - 基于新的嵌套化架构
export interface UserInfoAreaProps {
  userInfo: UserInfo | null;
  onAvatarPress: () => void;
  onEditNickname: () => void;
  onEditBio: () => void;
  onViewProfile: () => void;
}

export interface TransactionAreaProps {
  transactionCounts: TransactionCounts | null;
  onFunctionPress: (functionId: string) => void;
}

export interface ToolsAreaProps {
  walletInfo: WalletInfo | null;
  onFunctionPress: (functionId: string) => void;
}

// 保持向后兼容的类型别名
export interface UserHeaderProps extends UserInfoAreaProps {}
export interface TransactionSectionProps extends TransactionAreaProps {}
export interface ToolsSectionProps extends ToolsAreaProps {}

export interface FunctionCardProps {
  config: FunctionConfig;
  onPress: () => void;
  badge?: number;
  iconRenderer?: {
    render: (iconName: string, size: number) => React.ReactNode;
  };
}

// API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// 编辑模态框类型
export interface EditModalProps {
  visible: boolean;
  title: string;
  value: string;
  placeholder: string;
  maxLength: number;
  multiline?: boolean;
  onSave: (value: string) => Promise<void>;
  onCancel: () => void;
}

// 头像选择选项类型
export interface AvatarOption {
  id: string;
  title: string;
  icon: string;
  action: () => void;
}

// 导航参数类型
export interface ProfileStackParamList {
  ProfileScreen: undefined;
  ProfileCenter: undefined;
  MyPublish: undefined;
  MyOrders: undefined;
  MyPurchase: undefined;
  MyEnrollment: undefined;
  Wallet: undefined;
  Coins: undefined;
  Settings: undefined;
  CustomerService: undefined;
  Verification: undefined;
  Status: undefined;
}

// 事件类型
export type ProfileEvent = 
  | { type: 'LOAD_USER_INFO' }
  | { type: 'UPDATE_USER_INFO'; payload: Partial<UserInfo> }
  | { type: 'UPLOAD_AVATAR'; payload: { file: any } }
  | { type: 'REFRESH_DATA' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// 服务接口类型
export interface ProfileService {
  getUserProfile(): Promise<UserInfo>;
  updateUserProfile(data: UserUpdateRequest): Promise<UserInfo>;
  uploadAvatar(file: any): Promise<UploadResult>;
  getTransactionCounts(): Promise<TransactionCounts>;
  getWalletInfo(): Promise<WalletInfo>;
}

// Hook返回类型
export interface UseProfileReturn {
  state: ProfilePageState;
  actions: {
    loadUserInfo: () => Promise<void>;
    updateUserInfo: (data: UserUpdateRequest) => Promise<void>;
    uploadAvatar: (file: any) => Promise<void>;
    refreshData: () => Promise<void>;
    navigateToFunction: (functionId: string) => void;
  };
}
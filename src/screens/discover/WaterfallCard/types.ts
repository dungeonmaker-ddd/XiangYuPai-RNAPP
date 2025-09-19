/**
 * 瀑布流卡片组件类型定义
 * 基于通用组件架构核心标准 - 类型定义层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

import { ViewStyle } from 'react-native';

// 临时类型定义（应该从外部导入）
export interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  width?: number;
  height?: number;
  type: 'image' | 'video' | 'live';
  likeCount: number;
  isLiked: boolean;
  commentCount?: number;
  shareCount?: number;
  createdAt: string;
  user: UserInfo;
  liveRoomId?: string; // 直播间ID
}

export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  verified?: boolean;
  level?: number;
  isFollowing?: boolean;
}

export type TabType = 'recommend' | 'following' | 'nearby' | 'hot' | string;

/**
 * 瀑布流卡片组件Props接口
 * 符合通用组件架构标准的接口设计
 */
export interface WaterfallCardProps {
  // 核心数据
  item: ContentItem;
  index: number;
  tabType: TabType;
  
  // UI配置
  style?: ViewStyle;
  imageQuality?: WaterfallCardImageQuality;
  
  // 事件处理依赖注入
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
  
  // 可选回调函数
  onLike?: () => void;
  onLongPress?: () => void;
}

/**
 * 图片质量类型定义
 * 支持三种不同质量级别的图片加载
 */
export type WaterfallCardImageQuality = 'high' | 'standard' | 'low';

/**
 * 媒体类型定义
 * 用于区分不同类型的内容展示
 */
export type WaterfallCardMediaType = 'image' | 'video' | 'live';

/**
 * 媒体类型指示器Props接口
 */
export interface MediaTypeIndicatorProps {
  type: WaterfallCardMediaType;
}

/**
 * 用户点击类型定义
 * 区分不同的用户交互区域
 */
export type WaterfallCardUserClickType = 'avatar' | 'nickname' | 'userInfo';

/**
 * 卡片事件处理器参数接口
 * 标准化事件处理器的参数结构
 */
export interface WaterfallCardEventParams {
  item: ContentItem;
  index: number;
  tabType: TabType;
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}

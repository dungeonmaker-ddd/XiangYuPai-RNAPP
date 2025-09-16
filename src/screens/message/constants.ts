/**
 * 消息系统模块 - 全局常量定义
 */

import { MessageType } from './types';

// 消息分类配置
export const MESSAGE_CATEGORIES = [
  {
    id: 'like_collect',
    type: MessageType.LIKE_COLLECT,
    title: '赞和收藏',
    icon: '💖',
    iconColor: '#FF69B4',
    route: 'LikeCollectScreen'
  },
  {
    id: 'comment', 
    type: MessageType.COMMENT,
    title: '评论',
    icon: '💬',
    iconColor: '#4A90E2',
    route: 'CommentScreen'
  },
  {
    id: 'follower',
    type: MessageType.FOLLOWER, 
    title: '粉丝',
    icon: '👥',
    iconColor: '#FF8C00',
    route: 'FollowerScreen'
  },
  {
    id: 'system',
    type: MessageType.SYSTEM_NOTIFICATION,
    title: '系统通知',
    icon: '🔔',
    iconColor: '#8A2BE2',
    route: 'SystemNotificationScreen'
  }
];

// 样式常量
export const STYLES = {
  // 颜色
  COLORS: {
    PRIMARY: '#8A2BE2',
    SECONDARY: '#9370DB',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GRAY: '#999999',
    LIGHT_GRAY: '#F5F5F5',
    BORDER_GRAY: '#E0E0E0',
    RED: '#FF4444',
    GREEN: '#00C851',
    BLUE: '#4A90E2',
    ORANGE: '#FF8C00',
    PINK: '#FF69B4'
  },
  
  // 尺寸
  SIZES: {
    HEADER_HEIGHT: 56,
    CATEGORY_GRID_HEIGHT: 120,
    CHAT_ITEM_HEIGHT: 80,
    MESSAGE_ITEM_HEIGHT: 100,
    FOLLOWER_ITEM_HEIGHT: 80,
    INPUT_AREA_HEIGHT: 60,
    SAFE_AREA_BOTTOM: 34,
    
    // 头像尺寸
    AVATAR_LARGE: 48,
    AVATAR_MEDIUM: 36,
    AVATAR_SMALL: 24,
    
    // 图标尺寸
    ICON_LARGE: 32,
    ICON_MEDIUM: 24,
    ICON_SMALL: 16,
    
    // 圆角
    BORDER_RADIUS: {
      SMALL: 6,
      MEDIUM: 12,
      LARGE: 20,
      ROUND: 24
    }
  },
  
  // 字体
  FONTS: {
    SIZE: {
      SMALL: 12,
      MEDIUM: 14,
      LARGE: 16,
      TITLE: 18
    },
    WEIGHT: {
      NORMAL: '400',
      MEDIUM: '500', 
      BOLD: '600'
    }
  },
  
  // 间距
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 24,
    XXL: 32
  }
};

// 动画配置
export const ANIMATIONS = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500
  },
  EASING: {
    EASE_IN_OUT: 'ease-in-out',
    EASE_OUT: 'ease-out'
  }
};

// 消息相关配置
export const MESSAGE_CONFIG = {
  // 分页配置
  PAGE_SIZE: 20,
  MAX_MESSAGE_LENGTH: 1000,
  
  // 缓存配置
  CACHE_SIZE: 100,
  CACHE_EXPIRE_TIME: 5 * 60 * 1000, // 5分钟
  
  // 实时更新间隔
  UPDATE_INTERVAL: 30 * 1000, // 30秒
  
  // 图片配置
  IMAGE_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  IMAGE_QUALITY: 0.8
};

// 时间格式化配置
export const TIME_FORMATS = {
  JUST_NOW: '刚刚',
  MINUTES_AGO: (n: number) => `${n}分钟前`,
  HOURS_AGO: (n: number) => `${n}小时前`,
  YESTERDAY: '昨天',
  DATE_FORMAT: 'MM-DD',
  TIME_FORMAT: 'HH:mm'
};

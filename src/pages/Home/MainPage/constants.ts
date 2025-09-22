import { Dimensions } from 'react-native';

// 屏幕尺寸
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 颜色常量
export const COLORS = {
  primary: '#8B5CF6',
  primaryLight: '#A855F7',
  white: '#FFFFFF',
  gray50: '#F8F8F8',
  gray100: '#F3F4F6',
  gray500: '#6B7280',
  gray900: '#111827',
  red: '#EF4444',
  green: '#10B981',
  orange: '#F59E0B',
  pink: '#EC4899',
  // 渐变色定义
  gradientStart: 'rgba(115, 127, 225, 1)', // 蓝紫色起始
  gradientEnd: 'rgba(175, 56, 217, 1)',    // 粉紫色结束
} as const;

// 渐变色配置
export const GRADIENTS = {
  primary: [COLORS.gradientStart, COLORS.gradientEnd], // 主要渐变
  primaryReverse: [COLORS.gradientEnd, COLORS.gradientStart], // 反向渐变
} as const;

/**
 * 全局图标组件 - 支持动态路径加载
 * 功能: 统一的图标显示、状态管理、动态路径支持
 * 使用: <Icon source="action-icons/点赞.png" state="active" size={16} />
 */

import React, { memo } from 'react';
import { Image, StyleSheet, ImageStyle, ViewStyle } from 'react-native';

// #region 类型定义
export interface IconProps {
  /** 图片路径（从assets开始，如: "action-icons/点赞.png"） */
  source: string;
  /** 图标状态 */
  state?: 'default' | 'active';
  /** 图标类型（用于确定激活状态的颜色） */
  type?: 'like' | 'collect' | 'share' | 'default';
  /** 自定义尺寸 */
  size?: number;
  /** 自定义颜色（会覆盖状态颜色） */
  tintColor?: string;
  /** 自定义样式 */
  style?: ImageStyle;
  /** 容器样式 */
  containerStyle?: ViewStyle;
}

// 状态颜色配置
const STATE_COLORS = {
  default: '#999999',
  like: '#FF4757',
  collect: '#FFA502',
  share: '#999999',
} as const;
// #endregion

// #region 图片资源映射
/**
 * 静态图片资源映射
 * React Native require() 需要静态路径，无法动态拼接
 */
const IMAGE_SOURCE_MAP: Record<string, any> = {
  // 操作图标
  'action-icons/点赞.png': require('../../assets/action-icons/点赞.png'),
  'action-icons/收藏.png': require('../../assets/action-icons/收藏.png'),
  'action-icons/分享.png': require('../../assets/action-icons/分享.png'),
  
  // 功能图标
  'icons/K歌.png': require('../../assets/icons/K歌.png'),
  'icons/台球.png': require('../../assets/icons/台球.png'),
  'icons/和平精英.png': require('../../assets/icons/和平精英.png'),
  'icons/喝酒.png': require('../../assets/icons/喝酒.png'),
  'icons/按摩.png': require('../../assets/icons/按摩.png'),
  'icons/探店.png': require('../../assets/icons/探店.png'),
  'icons/王者荣耀.png': require('../../assets/icons/王者荣耀.png'),
  'icons/私影.png': require('../../assets/icons/私影.png'),
  'icons/英雄联盟.png': require('../../assets/icons/英雄联盟.png'),
  'icons/荒野乱斗.png': require('../../assets/icons/荒野乱斗.png'),
  
  // 通用图片 - 默认头像已移除，使用纯色占位符替代
  // 渐变背景已移除 - 使用纯色背景替代
  
  // 首页图标
  'images/home/header/定位.png': require('../../assets/images/home/header/定位.png'),
  'images/home/header/搜索icon.png': require('../../assets/images/home/header/搜索icon.png'),
  'images/home/banner/assassin-creed-4-poster.png': require('../../assets/images/home/banner/assassin-creed-4-poster.png'),
  'images/home/team-party/组局中心.png': require('../../assets/images/home/team-party/组局中心.png'),
  'images/home/team-party/组局中心字幕.png': require('../../assets/images/home/team-party/组局中心字幕.png'),
  'images/home/limited-offers/限时专享.png': require('../../assets/images/home/limited-offers/限时专享.png'),
  
  // 底部导航图标
  'images/home/bottom-navigation/home-active.png': require('../../assets/images/home/bottom-navigation/home-active.png'),
  'images/home/bottom-navigation/home-inactive.png': require('../../assets/images/home/bottom-navigation/home-inactive.png'),
  'images/home/bottom-navigation/discover-active.png': require('../../assets/images/home/bottom-navigation/discover-active.png'),
  'images/home/bottom-navigation/discover-inactive.png': require('../../assets/images/home/bottom-navigation/discover-inactive.png'),
  'images/home/bottom-navigation/message-active.png': require('../../assets/images/home/bottom-navigation/message-active.png'),
  'images/home/bottom-navigation/message-inactive.png': require('../../assets/images/home/bottom-navigation/message-inactive.png'),
  'images/home/bottom-navigation/profile-active.png': require('../../assets/images/home/bottom-navigation/profile-active.png'),
  'images/home/bottom-navigation/profile-inactive.png': require('../../assets/images/home/bottom-navigation/profile-inactive.png'),
};

/**
 * 获取图片资源
 * @param source - 从assets开始的相对路径
 * @returns 图片资源对象
 */
const getImageSource = (source: string) => {
  const imageSource = IMAGE_SOURCE_MAP[source];
  if (!imageSource) {
    console.warn(`图标未找到: ${source}，请确保已在IMAGE_SOURCE_MAP中注册`);
    return null;
  }
  return imageSource;
};

/**
 * 计算图标颜色
 * @param state - 状态
 * @param type - 类型
 * @param customColor - 自定义颜色
 * @returns 最终颜色
 */
const getIconColor = (
  state: 'default' | 'active' = 'default',
  type: IconProps['type'] = 'default',
  customColor?: string
): string => {
  if (customColor) return customColor;
  
  if (state === 'active' && type && type !== 'default') {
    return STATE_COLORS[type];
  }
  
  return STATE_COLORS.default;
};
// #endregion

// #region 主组件
/**
 * 全局图标组件
 * @param source - 图片路径（从assets开始）
 * @param state - 图标状态
 * @param type - 图标类型（影响激活颜色）
 * @param size - 图标尺寸
 * @param tintColor - 自定义颜色
 * @param style - 自定义样式
 * @param containerStyle - 容器样式
 */
const Icon: React.FC<IconProps> = ({
  source,
  state = 'default',
  type = 'default',
  size = 16,
  tintColor,
  style,
  containerStyle,
}) => {
  const imageSource = getImageSource(source);
  const iconColor = getIconColor(state, type, tintColor);

  // 如果图片加载失败，返回null或占位符
  if (!imageSource) {
    return null;
  }

  return (
    <Image
      source={imageSource}
      style={[
        styles.icon,
        {
          width: size,
          height: size,
          tintColor: iconColor,
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
};
// #endregion

// #region 样式
const styles = StyleSheet.create({
  icon: {
    // 基础样式由props动态设置
  },
});
// #endregion

export default memo(Icon);

// #region 预设图标常量（可选，便于使用）
export const ICON_PATHS = {
  // 操作图标
  LIKE: 'action-icons/点赞.png',
  COLLECT: 'action-icons/收藏.png',
  SHARE: 'action-icons/分享.png',
  
  // 功能图标
  K_SONG: 'icons/K歌.png',
  BILLIARDS: 'icons/台球.png',
  PEACE_ELITE: 'icons/和平精英.png',
  DRINK: 'icons/喝酒.png',
  MASSAGE: 'icons/按摩.png',
  EXPLORE: 'icons/探店.png',
  KING_GLORY: 'icons/王者荣耀.png',
  PRIVATE_MOVIE: 'icons/私影.png',
  LOL: 'icons/英雄联盟.png',
  BRAWL_STARS: 'icons/荒野乱斗.png',
  
  // 通用图标 - 默认头像已移除，使用纯色占位符
  // DEFAULT_AVATAR: 'images/common/default-avatar.png', // 已移除
  LOCATION: 'images/home/header/定位.png',
  SEARCH: 'images/home/header/搜索icon.png',
  
  // 导航图标
  HOME_ACTIVE: 'images/home/bottom-navigation/home-active.png',
  HOME_INACTIVE: 'images/home/bottom-navigation/home-inactive.png',
  DISCOVER_ACTIVE: 'images/home/bottom-navigation/discover-active.png',
  DISCOVER_INACTIVE: 'images/home/bottom-navigation/discover-inactive.png',
  MESSAGE_ACTIVE: 'images/home/bottom-navigation/message-active.png',
  MESSAGE_INACTIVE: 'images/home/bottom-navigation/message-inactive.png',
  PROFILE_ACTIVE: 'images/home/bottom-navigation/profile-active.png',
  PROFILE_INACTIVE: 'images/home/bottom-navigation/profile-inactive.png',
} as const;
// #endregion

// #region 1. File Banner & TOC
/**
 * 消息分类功能区域组件 - 主要内容区域
 * 4宫格布局 - 水平居中分布
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MessageCategoryAreaProps, MessageCategory } from '../types';
import { STYLES } from '../constants';
// #endregion

// #region 3. Types & Schema
interface CategoryCardProps {
  category: MessageCategory;
  onPress: (category: MessageCategory) => void;
}

interface UnreadBadgeProps {
  count: number;
}
// #endregion

// #region 4. Constants & Config
const CATEGORY_CONFIG = {
  GRID_HEIGHT: STYLES.SIZES.CATEGORY_GRID_HEIGHT,
  CARD_SIZE: 72,
  ICON_SIZE: 60,
  BADGE_MIN_SIZE: 16,
  MAX_UNREAD_DISPLAY: 99
};

const CARD_LAYOUT = {
  HORIZONTAL_PADDING: 32,
  VERTICAL_PADDING: STYLES.SPACING.MD,
  SPACE_BETWEEN: true
};
// #endregion

// #region 5. Utils & Helpers
const getFunctionIcon = (title: string) => {
  const iconMap: { [key: string]: any } = {
    '赞和收藏': require('./functionBtn/赞和收藏.png'),
    '评论': require('./functionBtn/评论.png'),
    '粉丝': require('./functionBtn/粉丝.png'),
    '系统通知': require('./functionBtn/系统通知.png'),
  };
  return iconMap[title];
};

const formatUnreadCount = (count: number): string => {
  return count > CATEGORY_CONFIG.MAX_UNREAD_DISPLAY 
    ? `${CATEGORY_CONFIG.MAX_UNREAD_DISPLAY}+` 
    : count.toString();
};

const shouldShowBadge = (count: number): boolean => {
  return count > 0;
};
// #endregion

// #region 6. State Management
// 无需复杂状态管理，通过props传递数据
// #endregion

// #region 7. Domain Logic
const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count }) => {
  if (!shouldShowBadge(count)) return null;

  return (
    <View style={styles.unreadBadge}>
      <Text style={styles.unreadText}>
        {formatUnreadCount(count)}
      </Text>
    </View>
  );
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const handlePress = () => {
    onPress(category);
  };

  return (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* 功能图标容器 */}
      <View style={styles.iconContainer}>
        <Image 
          source={getFunctionIcon(category.title)}
          style={styles.iconImage}
          resizeMode="contain"
        />
        
        {/* 未读角标 */}
        <UnreadBadge count={category.unreadCount} />
      </View>
      
      {/* 功能标题 */}
      <Text style={styles.categoryTitle}>{category.title}</Text>
    </TouchableOpacity>
  );
};

const MessageCategoryArea: React.FC<MessageCategoryAreaProps> = ({
  categories,
  onCategoryPress
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onPress={onCategoryPress}
          />
        ))}
      </View>
    </View>
  );
};
// #endregion

// #region 8. UI Components & Rendering
const styles = StyleSheet.create({
  // 容器样式
  container: {
    height: CATEGORY_CONFIG.GRID_HEIGHT,
    backgroundColor: STYLES.COLORS.WHITE,
    paddingHorizontal: CARD_LAYOUT.HORIZONTAL_PADDING,
    paddingVertical: CARD_LAYOUT.VERTICAL_PADDING,
    justifyContent: 'center'
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  // 卡片样式
  categoryCard: {
    width: CATEGORY_CONFIG.CARD_SIZE,
    height: CATEGORY_CONFIG.CARD_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: STYLES.COLORS.WHITE
  },
  
  // 图标样式
  iconContainer: {
    width: CATEGORY_CONFIG.ICON_SIZE,
    height: CATEGORY_CONFIG.ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 0
  },
  iconImage: {
    width: CATEGORY_CONFIG.ICON_SIZE,
    height: CATEGORY_CONFIG.ICON_SIZE,
  },
  
  // 未读角标样式
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: STYLES.COLORS.RED,
    borderRadius: CATEGORY_CONFIG.BADGE_MIN_SIZE / 2,
    minWidth: CATEGORY_CONFIG.BADGE_MIN_SIZE,
    height: CATEGORY_CONFIG.BADGE_MIN_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  unreadText: {
    color: STYLES.COLORS.WHITE,
    fontSize: 10,
    fontWeight: STYLES.FONTS.WEIGHT.BOLD as any
  },
  
  // 标题样式
  categoryTitle: {
    fontSize: STYLES.FONTS.SIZE.MEDIUM,
    color: STYLES.COLORS.BLACK,
    fontWeight: STYLES.FONTS.WEIGHT.MEDIUM as any,
    textAlign: 'center'
  }
});
// #endregion

// #region 9. Exports
export default MessageCategoryArea;
// #endregion

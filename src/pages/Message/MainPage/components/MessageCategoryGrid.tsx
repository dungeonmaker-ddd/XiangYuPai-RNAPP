/**
 * 消息分类功能区组件
 * 4宫格布局 - 水平居中分布
 * 包含赞和收藏、评论、粉丝、系统通知四个功能卡片
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MessageCategory } from '../types';
import { STYLES } from '../constants';

interface MessageCategoryGridProps {
  categories: MessageCategory[];
  onCategoryPress: (category: MessageCategory) => void;
}

// 功能图标映射
const getFunctionIcon = (title: string) => {
  const iconMap: { [key: string]: any } = {
    '赞和收藏': require('./functionBtn/赞和收藏.png'),
    '评论': require('./functionBtn/评论.png'),
    '粉丝': require('./functionBtn/粉丝.png'),
    '系统通知': require('./functionBtn/系统通知.png'),
  };
  return iconMap[title];
};

const MessageCategoryGrid: React.FC<MessageCategoryGridProps> = ({
  categories,
  onCategoryPress
}) => {
  const renderCategoryCard = (category: MessageCategory) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => onCategoryPress(category)}
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
        {category.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {category.unreadCount > 99 ? '99+' : category.unreadCount.toString()}
            </Text>
          </View>
        )}
      </View>
      
      {/* 功能标题 */}
      <Text style={styles.categoryTitle}>{category.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {categories.map(renderCategoryCard)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 容器样式
  container: {
    height: STYLES.SIZES.CATEGORY_GRID_HEIGHT,
    backgroundColor: STYLES.COLORS.WHITE,
    paddingHorizontal: 32,
    paddingVertical: STYLES.SPACING.MD,
    justifyContent: 'center'
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  // 卡片样式
  categoryCard: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: STYLES.COLORS.WHITE
  },
  
  // 图标样式
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 0
  },
  iconImage: {
    width: 60,
    height: 60,
  },
  
  // 未读角标样式
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: STYLES.COLORS.RED,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
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

export default MessageCategoryGrid;

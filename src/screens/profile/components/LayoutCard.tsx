/**
 * 布局卡片组件
 * 可复用的卡片容器组件，提供统一的背景、阴影和内边距
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { COLORS, SIZES, FONT_SIZES } from '../constants';

export interface LayoutCardProps {
  /** 卡片标题 */
  title?: string;
  /** 子组件 */
  children: React.ReactNode;
  /** 自定义容器样式 */
  containerStyle?: ViewStyle;
  /** 自定义卡片样式 */
  cardStyle?: ViewStyle;
  /** 自定义标题样式 */
  titleStyle?: ViewStyle;
  /** 是否显示标题 */
  showTitle?: boolean;
  /** 标题的无障碍属性 */
  titleAccessible?: boolean;
}

export const LayoutCard: React.FC<LayoutCardProps> = ({
  title,
  children,
  containerStyle,
  cardStyle,
  titleStyle,
  showTitle = true,
  titleAccessible = true,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.card, cardStyle]}>
        {/* 标题区域 - 始终保持内边距 */}
        {showTitle && title && (
          <View style={styles.titleWithPadding}>
            <Text 
              style={[styles.sectionTitle, titleStyle]}
              accessible={titleAccessible}
              accessibilityRole="header"
            >
              {title}
            </Text>
          </View>
        )}
        
        {/* 内容区域 */}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.PADDING_S,
    marginTop: 18,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.CARD_RADIUS,
    paddingTop: 16,
    // paddingLeft: 18,
    // paddingRight: 18,
    paddingBottom: 6,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  titleWithPadding: {
    paddingHorizontal: 18,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: SIZES.PADDING_XS, // 12px
  },
});

export default LayoutCard;

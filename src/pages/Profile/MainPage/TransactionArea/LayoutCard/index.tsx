// #region 1. File Banner & TOC
/**
 * 布局卡片组件 - 可复用的卡片容器组件
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
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

// 内部导入
import { COLORS, SIZES, FONT_SIZES } from '../../constants';
// #endregion

// #region 3. Types & Schema
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
// #endregion

// #region 4. Constants & Config
// 样式常量在constants中定义
// #endregion

// #region 5. Utils & Helpers
// 无复杂工具函数需求
// #endregion

// #region 6. State Management
// 无状态管理需求
// #endregion

// #region 7. Domain Logic
// 无复杂业务逻辑
// #endregion

// #region 8. UI Components & Rendering
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
// #endregion

// #region 9. Exports
export default LayoutCard;
// #endregion

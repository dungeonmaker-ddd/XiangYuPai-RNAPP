/**
 * ✅ 主要内容区域组件
 * 展示组局列表、组局卡片和各种加载状态
 * 
 * TOC (quick jump):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */

// #region 1. File Banner & TOC
/**
 * ContentArea - 主要内容区域
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema  
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { View, StyleSheet } from 'react-native';

// 导入子功能区域
import { GroupList } from './GroupList';
import { LoadingStates } from './LoadingStates';

// 导入类型和常量
import type { ContentAreaProps } from './types';
import { CONTENT_CONSTANTS } from './constants';
import { COLORS } from '../constants';
// #endregion

// #region 3. Types & Schema
// Props接口定义在 types.ts 中
// #endregion

// #region 4. Constants & Config
// 本地常量在 constants.ts 中定义
// #endregion

// #region 5. Utils & Helpers
// 本地工具函数（如果需要）
// #endregion

// #region 6. State Management
// 状态管理由父组件传递
// #endregion

// #region 7. Domain Logic
// 业务逻辑函数（如果需要）
// #endregion

// #region 8. UI Components & Rendering
export const ContentArea: React.FC<ContentAreaProps> = ({
  activities,
  loading,
  refreshing,
  hasMore,
  isEmpty,
  error,
  onRefresh,
  onLoadMore,
  onActivityPress,
  onAvatarPress,
}) => {
  // 显示加载状态
  if (loading && activities.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingStates type="loading" />
      </View>
    );
  }

  // 显示错误状态
  if (error && activities.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingStates type="error" message={error} onRetry={onRefresh} />
      </View>
    );
  }

  // 显示空状态
  if (isEmpty) {
    return (
      <View style={styles.container}>
        <LoadingStates type="empty" />
      </View>
    );
  }

  // 显示组局列表
  return (
    <View style={styles.container}>
      <GroupList
        activities={activities}
        refreshing={refreshing}
        hasMore={hasMore}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
        onActivityPress={onActivityPress}
        onAvatarPress={onAvatarPress}
      />
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});
// #endregion

// #region 9. Exports
export default ContentArea;
export type { ContentAreaProps } from './types';
// #endregion

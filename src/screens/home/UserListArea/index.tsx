/**
 * UserListArea - 用户列表区域组件
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

// #region 1. Imports
import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';

// 内部模块导入
import { COLORS } from '../constants';
import type { UserCard } from '../types';
import UserCardComponent from './UserCardComponent';
import { processListData } from './processData';
import { utilsListLayout } from './utilsLayout';
// #endregion

// #region 2. Types & Schema
interface UserListAreaProps {
  users: UserCard[];
  loading: boolean;
  onUserPress: (user: UserCard) => void;
  onEndReached?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}
// #endregion

// #region 3. Constants & Config
const LIST_CONFIG = {
  initialNumToRender: 10,
  maxToRenderPerBatch: 5,
  windowSize: 10,
  getItemLayout: (data: any, index: number) => ({
    length: 120,
    offset: 120 * index,
    index,
  }),
} as const;
// #endregion

// #region 4. Utils & Helpers
// 工具函数已移至 ./utilsLayout.ts
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑已移至 ./processData.ts
// #endregion

// #region 7. UI Components & Rendering
/**
 * UserListArea 组件 - 用户列表区域
 * 展示用户卡片的垂直滚动列表
 */
const UserListArea: React.FC<UserListAreaProps> = ({
  users,
  loading,
  onUserPress,
  onEndReached,
  refreshing = false,
  onRefresh,
}) => {
  const processedUsers = processListData(users);
  const { getListStyle, getContentStyle } = utilsListLayout();

  const renderUserItem = useCallback(({ item }: { item: UserCard }) => (
    <UserCardComponent 
      user={item} 
      onPress={() => onUserPress(item)} 
    />
  ), [onUserPress]);

  const renderListEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.emptyText}>加载中...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无用户</Text>
      </View>
    );
  }, [loading]);

  const renderListFooter = useCallback(() => {
    if (loading && users.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.footerText}>加载更多...</Text>
        </View>
      );
    }
    return null;
  }, [loading, users.length]);

  const keyExtractor = useCallback((item: UserCard) => item.id, []);

  return (
    <View style={[styles.container, getListStyle()]}>
      <FlatList
        data={processedUsers}
        keyExtractor={keyExtractor}
        renderItem={renderUserItem}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={[styles.listContent, getContentStyle()]}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={onRefresh}
        {...LIST_CONFIG}
      />
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray500,
    marginTop: 12,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.gray500,
  },
});
// #endregion

// #region 9. Exports
export default UserListArea;
export type { UserListAreaProps };
// #endregion

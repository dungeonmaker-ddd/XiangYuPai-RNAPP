/**
 * UserResultsView - 用户搜索结果视图组件
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
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

// 内部模块导入
import { COLORS, SPACING, FONTS } from '../../constants';
import type { UserInfo } from '../../types';
// #endregion

// #region 2. Types & Schema
interface UserResultsViewProps {
  results: UserInfo[];
  keyword: string;
  loading: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onUserPress?: (user: UserInfo) => void;
}

interface UserCardProps {
  user: UserInfo;
  keyword: string;
  onPress?: (user: UserInfo) => void;
}
// #endregion

// #region 3. Constants & Config
const USER_CARD_CONFIG = {
  height: 80,
  avatarSize: 48,
  borderRadius: 8,
} as const;
// #endregion

// #region 4. Utils & Helpers
const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  if (distance < 1) return '<1km';
  if (distance < 10) return `${distance.toFixed(1)}km`;
  return `${Math.round(distance)}km`;
};

const getStatusColor = (status: UserInfo['status']): string => {
  switch (status) {
    case 'online': return COLORS.online;
    case 'available': return COLORS.available;
    case 'busy': return COLORS.busy;
    default: return COLORS.offline;
  }
};

const getStatusText = (status: UserInfo['status']): string => {
  switch (status) {
    case 'online': return '在线';
    case 'available': return '可预约';
    case 'busy': return '忙碌';
    default: return '离线';
  }
};
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑处理
// #endregion

// #region 7. UI Components & Rendering
/**
 * UserCard 组件 - 用户信息卡片
 */
const UserCard: React.FC<UserCardProps> = ({ user, keyword, onPress }) => {
  const handlePress = () => {
    onPress?.(user);
  };

  const renderHighlightedText = (text: string) => {
    if (!keyword) {
      return <Text style={styles.userName}>{text}</Text>;
    }

    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <Text style={styles.userName}>
        {parts.map((part, index) => (
          <Text
            key={index}
            style={[
              styles.userName,
              part.toLowerCase() === keyword.toLowerCase() && styles.highlightedText,
            ]}
          >
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={styles.userCard}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* 用户头像 */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
          defaultSource={require('../../../../../../assets/images/common/default-avatar.png')}
        />
        {/* 在线状态指示器 */}
        <View style={[
          styles.statusIndicator,
          { backgroundColor: getStatusColor(user.status) }
        ]} />
      </View>

      {/* 用户信息 */}
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          {renderHighlightedText(user.username)}
          {user.isVerified && (
            <Text style={styles.verifiedIcon}>✓</Text>
          )}
          <Text style={styles.genderIcon}>
            {user.gender === 'male' ? '♂️' : '♀️'}
          </Text>
        </View>

        {/* 游戏标签 */}
        <View style={styles.tagsRow}>
          {user.gameSkills.slice(0, 2).map((skill, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{skill}</Text>
            </View>
          ))}
          {user.status !== 'offline' && (
            <View style={[styles.tag, styles.statusTag]}>
              <Text style={[styles.tagText, styles.statusTagText]}>
                {getStatusText(user.status)}
              </Text>
            </View>
          )}
        </View>

        {/* 简介 */}
        <Text style={styles.userBio} numberOfLines={1}>
          {user.bio || '这个人很懒，什么都没写'}
        </Text>
      </View>

      {/* 右侧信息 */}
      <View style={styles.rightInfo}>
        {user.location?.distance && (
          <Text style={styles.distanceText}>
            {formatDistance(user.location.distance)}
          </Text>
        )}
        
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>联系</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/**
 * UserResultsView 组件 - 用户搜索结果视图
 */
const UserResultsView: React.FC<UserResultsViewProps> = ({
  results,
  keyword,
  loading,
  onLoadMore,
  onRefresh,
  refreshing = false,
  onUserPress,
}) => {
  const renderUserItem = useCallback(({ item }: { item: UserInfo }) => (
    <UserCard
      user={item}
      keyword={keyword}
      onPress={onUserPress}
    />
  ), [keyword, onUserPress]);

  const renderListEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>搜索用户中...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>👤</Text>
        <Text style={styles.emptyText}>暂无相关用户</Text>
        <Text style={styles.emptyHint}>试试其他关键词</Text>
      </View>
    );
  }, [loading]);

  const renderListFooter = useCallback(() => {
    if (loading && results.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.footerText}>加载更多...</Text>
        </View>
      );
    }
    return null;
  }, [loading, results.length]);

  const keyExtractor = useCallback((item: UserInfo) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        renderItem={renderUserItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: USER_CARD_CONFIG.borderRadius,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatar: {
    width: USER_CARD_CONFIG.avatarSize,
    height: USER_CARD_CONFIG.avatarSize,
    borderRadius: USER_CARD_CONFIG.avatarSize / 2,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  userName: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  highlightedText: {
    color: COLORS.primary,
    backgroundColor: COLORS.highlightBackground,
  },
  verifiedIcon: {
    fontSize: FONTS.size.sm,
    color: COLORS.info,
    marginRight: SPACING.xs,
  },
  genderIcon: {
    fontSize: FONTS.size.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  tag: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  tagText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weight.medium,
  },
  statusTag: {
    backgroundColor: COLORS.primary + '20',
  },
  statusTagText: {
    color: COLORS.primary,
  },
  userBio: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight,
    lineHeight: FONTS.lineHeight.normal * FONTS.size.sm,
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  distanceText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: FONTS.size.md,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  emptyHint: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight,
  },
});
// #endregion

// #region 9. Exports
export default UserResultsView;
export type { UserResultsViewProps };
// #endregion

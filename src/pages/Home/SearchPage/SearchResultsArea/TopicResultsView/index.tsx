/**
 * TopicResultsView - 话题搜索结果视图组件
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
import type { TopicInfo } from '../../types';
// #endregion

// #region 2. Types & Schema
interface TopicResultsViewProps {
  results: TopicInfo[];
  keyword: string;
  loading: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onTopicPress?: (topic: TopicInfo) => void;
}

interface TopicCardProps {
  topic: TopicInfo;
  keyword: string;
  onPress?: (topic: TopicInfo) => void;
}
// #endregion

// #region 3. Constants & Config
const TOPIC_CARD_CONFIG = {
  height: 80,
  iconSize: 48,
  borderRadius: 8,
} as const;
// #endregion

// #region 4. Utils & Helpers
const formatCount = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  }
  
  if (count < 10000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  
  if (count < 1000000) {
    return `${Math.round(count / 1000)}k`;
  }
  
  return `${(count / 1000000).toFixed(1)}M`;
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
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
 * TopicCard 组件 - 话题信息卡片
 */
const TopicCard: React.FC<TopicCardProps> = ({ topic, keyword, onPress }) => {
  const handlePress = () => {
    onPress?.(topic);
  };

  const renderHighlightedText = (text: string, style: any) => {
    if (!keyword) {
      return <Text style={style}>{text}</Text>;
    }

    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <Text style={style}>
        {parts.map((part, index) => (
          <Text
            key={index}
            style={[
              style,
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
      style={styles.topicCard}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* 话题图标 */}
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: topic.icon }}
          style={styles.topicIcon}
          // 移除默认图标，使用条件渲染替代
        />
        {/* 热门标识 */}
        {topic.isHot && (
          <View style={styles.hotBadge}>
            <Text style={styles.hotBadgeText}>热</Text>
          </View>
        )}
      </View>

      {/* 话题信息 */}
      <View style={styles.topicInfo}>
        {/* 话题名称行 */}
        <View style={styles.nameRow}>
          {renderHighlightedText(topic.name, styles.topicName)}
          {topic.isHot && (
            <View style={styles.hotTag}>
              <Text style={styles.hotTagText}>热门</Text>
            </View>
          )}
        </View>

        {/* 话题分类 */}
        <View style={styles.categoryRow}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{topic.category}</Text>
          </View>
        </View>

        {/* 话题描述 */}
        <View style={styles.descriptionRow}>
          {renderHighlightedText(
            truncateText(topic.description, 50), 
            styles.topicDescription
          )}
        </View>

        {/* 统计信息 */}
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            👥 {formatCount(topic.followCount)} 关注
          </Text>
          <Text style={styles.statsSeparator}>•</Text>
          <Text style={styles.statsText}>
            📝 {formatCount(topic.postCount)} 帖子
          </Text>
        </View>
      </View>

      {/* 右侧关注按钮 */}
      <View style={styles.rightInfo}>
        <TouchableOpacity 
          style={[
            styles.followButton,
            topic.isFollowed && styles.followedButton
          ]}
        >
          <Text style={[
            styles.followButtonText,
            topic.isFollowed && styles.followedButtonText
          ]}>
            {topic.isFollowed ? '已关注' : '关注'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

/**
 * TopicResultsView 组件 - 话题搜索结果视图
 */
const TopicResultsView: React.FC<TopicResultsViewProps> = ({
  results,
  keyword,
  loading,
  onLoadMore,
  onRefresh,
  refreshing = false,
  onTopicPress,
}) => {
  const renderTopicItem = useCallback(({ item }: { item: TopicInfo }) => (
    <TopicCard
      topic={item}
      keyword={keyword}
      onPress={onTopicPress}
    />
  ), [keyword, onTopicPress]);

  const renderListEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>搜索话题中...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🏷️</Text>
        <Text style={styles.emptyText}>暂无相关话题</Text>
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

  const keyExtractor = useCallback((item: TopicInfo) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        renderItem={renderTopicItem}
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
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: TOPIC_CARD_CONFIG.borderRadius,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: TOPIC_CARD_CONFIG.height,
  },
  iconContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  topicIcon: {
    width: TOPIC_CARD_CONFIG.iconSize,
    height: TOPIC_CARD_CONFIG.iconSize,
    borderRadius: 8,
    backgroundColor: COLORS.gray100,
  },
  hotBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotBadgeText: {
    fontSize: 10,
    fontWeight: FONTS.weight.bold,
    color: COLORS.white,
  },
  topicInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  topicName: {
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  hotTag: {
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotTagText: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.medium,
    color: COLORS.error,
  },
  categoryRow: {
    marginBottom: SPACING.xs,
  },
  categoryTag: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weight.medium,
  },
  descriptionRow: {
    marginBottom: SPACING.xs,
  },
  topicDescription: {
    fontSize: FONTS.size.sm,
    color: COLORS.textLight,
    lineHeight: FONTS.lineHeight.normal * FONTS.size.sm,
  },
  highlightedText: {
    color: COLORS.primary,
    backgroundColor: COLORS.highlightBackground,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
  },
  statsSeparator: {
    fontSize: FONTS.size.xs,
    color: COLORS.textLight,
    marginHorizontal: SPACING.xs,
  },
  rightInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  followButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  followedButton: {
    backgroundColor: COLORS.gray100,
    borderColor: COLORS.gray300,
  },
  followButtonText: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primary,
  },
  followedButtonText: {
    color: COLORS.textSecondary,
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
export default TopicResultsView;
export type { TopicResultsViewProps };
// #endregion

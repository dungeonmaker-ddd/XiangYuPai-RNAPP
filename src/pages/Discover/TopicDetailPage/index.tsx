/**
 * 话题详情页面 - 显示特定话题下的所有动态
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
import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  RefreshControl,
  Text,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import { TopicDetailPageProps, TopicPostItem } from './types';
import { TOPIC_DETAIL_CONSTANTS } from './constants';
import { useTopicDetail } from './hooks/useTopicDetail';
import TopicHeaderArea from './TopicHeaderArea';
import TopicPostCardArea from './TopicPostCardArea';
import TopicLoadingArea from './TopicLoadingArea';
// #endregion

// #region 2. Types & Schema
interface TopicDetailPageState {
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
}
// #endregion

// #region 3. Constants & Config
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ITEM_HEIGHT = 320; // 动态卡片预估高度
const LOAD_MORE_THRESHOLD = 0.7; // 滚动到70%时加载更多
// #endregion

// #region 4. Utils & Helpers
const formatTopicTitle = (topic: string): string => {
  return topic.startsWith('#') ? topic : `#${topic}`;
};

const getItemLayout = (data: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});
// #endregion

// #region 5. State Management
const TopicDetailPage: React.FC<TopicDetailPageProps> = ({
  navigation,
  route,
}) => {
  const { topicId, topicName } = route.params;
  
  // 使用主业务Hook
  const {
    topicInfo,
    posts,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasMore,
    refreshTopic,
    loadMorePosts,
    handlePostLike,
    handlePostComment,
    handlePostShare,
    handleUserPress,
  } = useTopicDetail(topicId);

  // Refs
  const flatListRef = useRef<FlatList>(null);
// #endregion

// #region 6. Domain Logic
  // 处理返回
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 处理分享话题
  const handleShareTopic = useCallback(() => {
    // TODO: 实现话题分享功能
    console.log('Share topic:', topicName);
  }, [topicName]);

  // 处理动态卡片点击
  const handlePostPress = useCallback((post: TopicPostItem) => {
    navigation.navigate('DiscoverDetail', {
      contentId: post.id,
      contentItem: post,
    });
  }, [navigation]);

  // 处理下拉刷新
  const handleRefresh = useCallback(() => {
    refreshTopic();
  }, [refreshTopic]);

  // 处理加载更多
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      loadMorePosts();
    }
  }, [hasMore, isLoadingMore, loadMorePosts]);

  // 处理滚动到顶部
  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);
// #endregion

// #region 7. UI Components & Rendering
  // 渲染动态卡片
  const renderPostItem = useCallback(({ item, index }: { item: TopicPostItem; index: number }) => (
    <TopicPostCardArea
      post={item}
      index={index}
      onPress={() => handlePostPress(item)}
      onLike={() => handlePostLike(item.id)}
      onComment={() => handlePostComment(item.id)}
      onShare={() => handlePostShare(item.id)}
      onUserPress={() => handleUserPress(item.user.id)}
    />
  ), [handlePostPress, handlePostLike, handlePostComment, handlePostShare, handleUserPress]);

  // 渲染列表头部
  const renderListHeader = useMemo(() => (
    <View style={styles.listHeader}>
      <Text style={styles.topicDescription}>
        {topicInfo?.description || `关于 ${formatTopicTitle(topicName)} 的所有动态`}
      </Text>
      <View style={styles.topicStats}>
        <Text style={styles.statsText}>
          {topicInfo?.postCount || posts.length} 条动态
        </Text>
        <Text style={styles.statsText}>
          {topicInfo?.participantCount || 0} 人参与
        </Text>
      </View>
    </View>
  ), [topicInfo, topicName, posts.length]);

  // 渲染列表底部
  const renderListFooter = useMemo(() => {
    if (isLoadingMore) {
      return <TopicLoadingArea type="loadMore" />;
    }
    
    if (!hasMore && posts.length > 0) {
      return (
        <View style={styles.listFooter}>
          <Text style={styles.endText}>已经到底了</Text>
        </View>
      );
    }
    
    return null;
  }, [isLoadingMore, hasMore, posts.length]);

  // 渲染空状态
  const renderEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>暂无动态</Text>
      <Text style={styles.emptySubText}>来发布第一条动态吧</Text>
    </View>
  ), []);

  // 加载状态
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={TOPIC_DETAIL_CONSTANTS.BACKGROUND} />
        <TopicHeaderArea
          title={formatTopicTitle(topicName)}
          onBackPress={handleGoBack}
          onShare={handleShareTopic}
        />
        <TopicLoadingArea type="initial" />
      </View>
    );
  }

  // 错误状态
  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={TOPIC_DETAIL_CONSTANTS.BACKGROUND} />
        <TopicHeaderArea
          title={formatTopicTitle(topicName)}
          onBackPress={handleGoBack}
          onShare={handleShareTopic}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>加载失败</Text>
          <Text style={styles.errorSubText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={TOPIC_DETAIL_CONSTANTS.BACKGROUND} />
      
      {/* 话题头部区域 */}
      <TopicHeaderArea
        title={formatTopicTitle(topicName)}
        onBackPress={handleGoBack}
        onShare={handleShareTopic}
      />

      {/* 话题动态列表 */}
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[TOPIC_DETAIL_CONSTANTS.PRIMARY]}
            tintColor={TOPIC_DETAIL_CONSTANTS.PRIMARY}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={LOAD_MORE_THRESHOLD}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      />
    </View>
  );
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TOPIC_DETAIL_CONSTANTS.BACKGROUND,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  listHeader: {
    paddingHorizontal: TOPIC_DETAIL_CONSTANTS.SECTION_PADDING,
    paddingVertical: TOPIC_DETAIL_CONSTANTS.ITEM_SPACING,
    backgroundColor: TOPIC_DETAIL_CONSTANTS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: TOPIC_DETAIL_CONSTANTS.BORDER_LIGHT,
  },
  topicDescription: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.MEDIUM,
    lineHeight: TOPIC_DETAIL_CONSTANTS.LINE_HEIGHT.MEDIUM,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_SECONDARY,
    marginBottom: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
  },
  topicStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.SMALL,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_TERTIARY,
    marginRight: TOPIC_DETAIL_CONSTANTS.ITEM_SPACING,
  },
  listFooter: {
    paddingVertical: TOPIC_DETAIL_CONSTANTS.LARGE_SPACING,
    alignItems: 'center',
  },
  endText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.SMALL,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_TERTIARY,
  },
  emptyContainer: {
    paddingTop: screenHeight * 0.2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.LARGE,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_SECONDARY,
    marginBottom: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
  },
  emptySubText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.NORMAL,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_TERTIARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: TOPIC_DETAIL_CONSTANTS.SECTION_PADDING,
  },
  errorText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.LARGE,
    color: TOPIC_DETAIL_CONSTANTS.SECONDARY,
    marginBottom: TOPIC_DETAIL_CONSTANTS.SMALL_SPACING,
  },
  errorSubText: {
    fontSize: TOPIC_DETAIL_CONSTANTS.FONT.NORMAL,
    color: TOPIC_DETAIL_CONSTANTS.TEXT_TERTIARY,
    textAlign: 'center',
  },
});
// #endregion

// #region 9. Exports
export default TopicDetailPage;
// #endregion

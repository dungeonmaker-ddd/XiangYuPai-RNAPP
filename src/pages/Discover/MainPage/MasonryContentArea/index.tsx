/**
 * 瀑布流内容区域组件
 * 实现双列动态高度布局和虚拟滚动优化
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
import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import { MasonryContainerProps, ContentItem } from '../types';
import { COLORS, MASONRY_CONFIG, PERFORMANCE_CONFIG } from '../constants';
import ContentCardArea from '../ContentCardArea';
// #endregion

// #region 2. Types & Schema
interface MasonryItem {
  item: ContentItem;
  height: number;
  column: number;
  top: number;
}

interface MasonryState {
  screenWidth: number;
  cardWidth: number;
  columnHeights: number[];
  positions: MasonryItem[];
  refreshing: boolean;
}
// #endregion

// #region 3. Constants & Config
const SCREEN_WIDTH = Dimensions.get('window').width;
const CONTENT_PADDING = 16;
const CARD_GAP = MASONRY_CONFIG.gap;
const COLUMNS = MASONRY_CONFIG.columns;

const calculateCardWidth = (): number => {
  return (SCREEN_WIDTH - CONTENT_PADDING * 2 - CARD_GAP * (COLUMNS - 1)) / COLUMNS;
};

const LOAD_MORE_THRESHOLD = 300; // 距离底部300px时触发加载更多
// #endregion

// #region 4. Utils & Helpers
const calculateItemHeight = (item: ContentItem, cardWidth: number): number => {
  // 基础高度计算
  const imageAspectRatio = 1.2; // 默认图片比例，实际应该从图片数据获取
  const imageHeight = cardWidth / imageAspectRatio;
  const contentHeight = 80; // 用户信息和标题区域固定高度
  
  // 根据内容类型调整高度
  let adjustedImageHeight = imageHeight;
  if (item.type === 'video') {
    adjustedImageHeight = Math.min(imageHeight * 1.1, cardWidth * 1.5);
  }
  
  // 根据标题长度微调
  const titleLines = Math.ceil(item.title.length / 20);
  const titleExtraHeight = titleLines > 2 ? (titleLines - 2) * 16 : 0;
  
  return Math.floor(adjustedImageHeight + contentHeight + titleExtraHeight);
};

const getShortestColumn = (columnHeights: number[]): number => {
  let minHeight = Math.min(...columnHeights);
  return columnHeights.indexOf(minHeight);
};

const calculateMasonryPositions = (
  items: ContentItem[], 
  cardWidth: number
): { positions: MasonryItem[], totalHeight: number } => {
  const columnHeights = new Array(COLUMNS).fill(0);
  const positions: MasonryItem[] = [];
  
  items.forEach((item, index) => {
    const itemHeight = calculateItemHeight(item, cardWidth);
    const columnIndex = getShortestColumn(columnHeights);
    const top = columnHeights[columnIndex];
    
    positions.push({
      item,
      height: itemHeight,
      column: columnIndex,
      top,
    });
    
    columnHeights[columnIndex] += itemHeight + CARD_GAP;
  });
  
  const totalHeight = Math.max(...columnHeights);
  return { positions, totalHeight };
};
// #endregion

// #region 5. State Management
const MasonryContentArea: React.FC<MasonryContainerProps> = ({
  contentList,
  loading,
  hasMore,
  onLoadMore,
  onContentPress,
  onLike,
  onUserPress,
  tabType,
}) => {
  const [state, setState] = React.useState<MasonryState>(() => {
    const cardWidth = calculateCardWidth();
    const { positions } = calculateMasonryPositions(contentList, cardWidth);
    
    return {
      screenWidth: SCREEN_WIDTH,
      cardWidth,
      columnHeights: new Array(COLUMNS).fill(0),
      positions,
      refreshing: false,
    };
  });

  // 当内容列表变化时重新计算布局
  React.useEffect(() => {
    const { positions } = calculateMasonryPositions(contentList, state.cardWidth);
    setState(prev => ({
      ...prev,
      positions,
    }));
  }, [contentList, state.cardWidth]);

  // 监听屏幕尺寸变化
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const newCardWidth = calculateCardWidth();
      const { positions } = calculateMasonryPositions(contentList, newCardWidth);
      
      setState(prev => ({
        ...prev,
        screenWidth: window.width,
        cardWidth: newCardWidth,
        positions,
      }));
    });

    return () => subscription?.remove();
  }, [contentList]);
// #endregion

// #region 6. Domain Logic
const handleScroll = React.useCallback((event: any) => {
  const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
  const paddingToBottom = LOAD_MORE_THRESHOLD;
  
  // 触发加载更多
  if (
    contentOffset.y + layoutMeasurement.height >= 
    contentSize.height - paddingToBottom &&
    !loading &&
    hasMore
  ) {
    onLoadMore();
  }
}, [loading, hasMore, onLoadMore]);

const handleRefresh = React.useCallback(() => {
  setState(prev => ({ ...prev, refreshing: true }));
  
  // 模拟刷新操作
  setTimeout(() => {
    setState(prev => ({ ...prev, refreshing: false }));
  }, 1000);
}, []);

const handleContentPress = React.useCallback((item: ContentItem) => {
  onContentPress(item);
}, [onContentPress]);

const handleLike = React.useCallback((contentId: string) => {
  onLike(contentId);
}, [onLike]);

const handleUserPress = React.useCallback((userId: string) => {
  // 从内容列表中找到对应用户信息
  const userContent = contentList.find(item => item.author.id === userId);
  if (userContent) {
    onUserPress(userContent.author);
  }
}, [contentList, onUserPress]);

// 渲染单个卡片
const renderCard = React.useCallback((position: MasonryItem, index: number) => {
  const { item, column, top } = position;
  const left = column * (state.cardWidth + CARD_GAP);
  
  return (
    <View
      key={`${item.id}-${index}`}
      style={[
        styles.cardWrapper,
        {
          position: 'absolute',
          left,
          top,
          width: state.cardWidth,
        }
      ]}
    >
      <ContentCardArea
        content={item}
        tabType={tabType}
        onPress={() => handleContentPress(item)}
        onLike={() => handleLike(item.id)}
        onUserPress={() => handleUserPress(item.author.id)}
      />
    </View>
  );
}, [state.cardWidth, tabType, handleContentPress, handleLike, handleUserPress]);

// 渲染加载更多指示器
const renderLoadMoreIndicator = () => {
  if (!loading) return null;
  
  return (
    <View style={styles.loadMoreContainer}>
      <ActivityIndicator size="small" color={COLORS.PRIMARY} />
      <Text style={styles.loadMoreText}>正在加载更多...</Text>
    </View>
  );
};

// 渲染空状态
const renderEmptyState = () => {
  if (contentList.length > 0) return null;
  
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📱</Text>
      <Text style={styles.emptyText}>暂无内容</Text>
      <Text style={styles.emptySubtext}>刷新试试看吧</Text>
    </View>
  );
};
// #endregion

// #region 7. UI Components & Rendering
  const totalHeight = state.positions.length > 0 
    ? Math.max(...state.positions.map(pos => pos.top + pos.height)) + 60
    : 300;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ minHeight: totalHeight }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={PERFORMANCE_CONFIG.DEBOUNCE_SCROLL}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
      >
        {/* 瀑布流容器 */}
        <View style={[styles.masonryContainer, { height: totalHeight }]}>
          {state.positions.map(renderCard)}
        </View>
        
        {/* 加载更多指示器 */}
        {renderLoadMoreIndicator()}
        
        {/* 空状态 */}
        {renderEmptyState()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  masonryContainer: {
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 16,
    position: 'relative',
  },
  cardWrapper: {
    // 动态样式在组件中设置
  },
  loadMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.TEXT_TERTIARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.TEXT_TERTIARY,
  },
});
// #endregion

// #region 8. Exports
export default MasonryContentArea;
// #endregion

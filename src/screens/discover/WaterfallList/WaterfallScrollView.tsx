/**
 * 瀑布流滚动容器组件
 * 基于《纯结构架构图标准模板》的L2级核心滚动容器设计
 * 负责滚动逻辑、虚拟化渲染和性能优化
 * 
 * 特性：
 * - 专用卡片点击事件处理：集成了 onWaterfallCardClick 专用事件处理器
 * - UI逻辑分离：卡片点击的业务逻辑完全在事件处理器中处理
 * - 自动索引计算：确保传递给事件处理器的索引是原始数据中的真实位置
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';
import WaterfallCard from './WaterfallCard';
import { WaterfallLayoutEngine } from './WaterfallLayoutEngine';
import { VirtualizationManager } from './VirtualizationManager';
import { ContentItem, TabType, LayoutItem } from './types';
import { COLORS, TYPOGRAPHY, LAYOUT_CONSTANTS } from './constants';
import { onWaterfallCardClick } from './onWaterfallCardClick';

// 滚动容器属性接口
export interface WaterfallScrollViewProps {
  data: ContentItem[];
  layoutEngine: WaterfallLayoutEngine;
  virtualizationManager: VirtualizationManager;
  tabType: TabType;
  onLoadMore: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  loading: boolean;
  hasMore: boolean;
  onLike?: (itemId: string) => void;
  imageQuality?: 'high' | 'standard' | 'low';
  // 事件处理配置
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}

/**
 * 瀑布流滚动容器组件
 */
const WaterfallScrollView: React.FC<WaterfallScrollViewProps> = ({
  data,
  layoutEngine,
  virtualizationManager,
  tabType,
  onLoadMore,
  onRefresh,
  refreshing,
  loading,
  hasMore,
  onLike,
  imageQuality = 'standard',
  navigation,
  analytics,
  showToast,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [lastScrollDirection, setLastScrollDirection] = useState<'up' | 'down'>('down');
  const lastScrollOffsetRef = useRef(0);

  // 计算布局项目
  const layoutItems = useMemo(() => {
    return layoutEngine.calculateLayout(data);
  }, [data, layoutEngine]);

  // 虚拟化可见项目
  const visibleItems = useMemo(() => {
    if (!virtualizationManager.getConfig().enabled) {
      return layoutItems;
    }
    
    return virtualizationManager.getVisibleItems(
      layoutItems,
      scrollOffset,
      containerHeight
    );
  }, [layoutItems, scrollOffset, containerHeight, virtualizationManager]);

  // 容器总高度
  const totalHeight = useMemo(() => {
    return layoutEngine.getTotalHeight(layoutItems);
  }, [layoutItems, layoutEngine]);

  // 滚动事件处理
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    const newScrollOffset = contentOffset.y;
    
    // 更新滚动偏移
    setScrollOffset(newScrollOffset);
    
    // 判断滚动方向
    if (newScrollOffset > lastScrollOffsetRef.current) {
      setLastScrollDirection('down');
    } else if (newScrollOffset < lastScrollOffsetRef.current) {
      setLastScrollDirection('up');
    }
    lastScrollOffsetRef.current = newScrollOffset;

    // 检查是否需要加载更多
    const { contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = 100; // 提前100px触发加载
    
    if (
      contentOffset.y >= contentSize.height - layoutMeasurement.height - paddingToBottom &&
      hasMore &&
      !loading
    ) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  // 预加载下一批内容
  useEffect(() => {
    if (virtualizationManager.getConfig().enabled && layoutItems.length > 0) {
      const preloadItems = virtualizationManager.preloadNextBatch(
        layoutItems,
        scrollOffset,
        containerHeight,
        lastScrollDirection
      );
      
      // 这里可以添加预加载逻辑，比如预加载图片
      // 目前暂时保留接口
    }
  }, [scrollOffset, containerHeight, lastScrollDirection, layoutItems, virtualizationManager]);

  // 容器布局变化处理
  const handleContainerLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  }, []);

  // 渲染加载指示器
  const renderLoadingIndicator = () => {
    if (!loading || data.length === 0) return null;

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  };

  // 渲染无更多数据提示
  const renderNoMoreIndicator = () => {
    if (hasMore || data.length === 0) return null;

    return (
      <View style={styles.noMoreContainer}>
        <View style={styles.noMoreLine} />
        <Text style={styles.noMoreText}>已经到底了~</Text>
        <View style={styles.noMoreLine} />
      </View>
    );
  };

  // 渲染空状态
  const renderEmptyState = () => {
    if (data.length > 0 || loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📱</Text>
        <Text style={styles.emptyTitle}>暂无内容</Text>
        <Text style={styles.emptySubtitle}>下拉刷新试试吧</Text>
      </View>
    );
  };

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
            progressBackgroundColor={COLORS.CARD_BACKGROUND}
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={virtualizationManager.getConfig().enabled}
        contentContainerStyle={data.length === 0 ? styles.emptyContentContainer : undefined}
      >
        {/* 空状态显示 */}
        {renderEmptyState()}
        
        {/* 瀑布流内容容器 */}
        {data.length > 0 && (
          <View style={[styles.contentContainer, { height: totalHeight }]}>
            {visibleItems.map((item: LayoutItem, originalIndex: number) => {
              // 计算在原始数据中的真实索引
              const realIndex = data.findIndex(dataItem => dataItem.id === item.data.id);
              
              return (
                <WaterfallCard
                  key={item.id}
                  item={item.data}
                  index={realIndex >= 0 ? realIndex : originalIndex}
                  tabType={tabType}
                  style={{
                    ...styles.cardPosition,
                    position: 'absolute',
                    left: item.x,
                    top: item.y,
                    width: item.width,
                  }}
                  navigation={navigation}
                  analytics={analytics}
                  showToast={showToast}
                  onLike={onLike ? () => onLike(item.data.id) : undefined}
                  imageQuality={imageQuality}
                />
              );
            })}
          </View>
        )}
        
        {/* 加载更多指示器 */}
        {renderLoadingIndicator()}
        
        {/* 无更多数据提示 */}
        {renderNoMoreIndicator()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    position: 'relative',
    paddingHorizontal: LAYOUT_CONSTANTS.PADDING_HORIZONTAL,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPosition: {
    // 动态位置样式由props覆盖
  },
  
  // 加载状态样式
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: LAYOUT_CONSTANTS.MARGIN_LARGE,
  },
  loadingText: {
    ...TYPOGRAPHY.BODY_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: LAYOUT_CONSTANTS.MARGIN_SMALL,
  },
  
  // 无更多数据样式
  noMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: LAYOUT_CONSTANTS.MARGIN_LARGE,
    paddingHorizontal: LAYOUT_CONSTANTS.PADDING_HORIZONTAL,
  },
  noMoreLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  noMoreText: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_TERTIARY,
    marginHorizontal: LAYOUT_CONSTANTS.MARGIN_MEDIUM,
  },
  
  // 空状态样式
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: LAYOUT_CONSTANTS.PADDING_HORIZONTAL,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: LAYOUT_CONSTANTS.MARGIN_LARGE,
  },
  emptyTitle: {
    ...TYPOGRAPHY.TITLE_MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: LAYOUT_CONSTANTS.MARGIN_SMALL,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.BODY_MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default WaterfallScrollView;

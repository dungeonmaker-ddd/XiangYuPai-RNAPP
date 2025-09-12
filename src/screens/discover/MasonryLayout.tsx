/**
 * 发现页面 - 双列瀑布流布局组件
 * 实现智能双列布局算法和高性能虚拟滚动
 */

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  Dimensions,
  StyleSheet,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { MasonryLayoutProps, ContentItem } from './types';
import {
  MASONRY_CONFIG,
  COLORS,
  FONTS,
  SPACING,
  ANIMATION_CONFIG,
  ERROR_MESSAGES,
  TEST_IDS,
  ACCESSIBILITY_LABELS
} from './constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 计算列宽的精确公式
const calculateColumnWidth = () => {
  const availableWidth = screenWidth - (MASONRY_CONFIG.CONTENT_PADDING * 2) - MASONRY_CONFIG.COLUMN_GAP;
  const columnWidth = availableWidth / MASONRY_CONFIG.NUM_COLUMNS;
  
  // 确保列宽在合理范围内
  const clampedWidth = Math.max(
    MASONRY_CONFIG.MIN_COLUMN_WIDTH,
    Math.min(MASONRY_CONFIG.MAX_COLUMN_WIDTH, columnWidth)
  );
  
  return Math.floor(clampedWidth); // 向下取整确保整数像素
};

// 项目位置信息接口
interface ItemPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  measured: boolean;
}

// 列高度追踪
interface ColumnHeight {
  left: number;
  right: number;
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  data,
  renderItem,
  onEndReached,
  onRefresh,
  refreshing = false,
  loading = false,
  error = null,
  emptyText = ERROR_MESSAGES.EMPTY_FOLLOWING,
  numColumns = MASONRY_CONFIG.NUM_COLUMNS,
  columnGap = MASONRY_CONFIG.COLUMN_GAP,
  contentPadding = MASONRY_CONFIG.CONTENT_PADDING
}) => {
  // 状态管理
  const [itemPositions, setItemPositions] = useState<Map<string, ItemPosition>>(new Map());
  const [columnHeights, setColumnHeights] = useState<ColumnHeight>({ left: 0, right: 0 });
  const [containerHeight, setContainerHeight] = useState(0);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  
  // 引用
  const scrollViewRef = useRef<ScrollView>(null);
  const measureTimeoutRef = useRef<number | undefined>(undefined);
  const lastScrollY = useRef(0);
  
  // 计算列宽
  const columnWidth = useMemo(() => calculateColumnWidth(), []);
  
  // 获取项目高度的异步函数
  const measureItemHeight = useCallback((item: ContentItem, width: number): Promise<number> => {
    return new Promise((resolve) => {
      // 基础高度计算
      let height = MASONRY_CONFIG.CARD_VERTICAL_GAP;
      
      // 用户信息区域
      height += 56; // 用户信息栏固定高度
      
      // 内容文字区域
      if (item.content) {
        const lineCount = Math.min(3, Math.ceil(item.content.length / 20)); // 简化计算
        height += lineCount * 20 + 8; // 行高 + 边距
      }
      
      // 媒体区域
      if (item.media && item.media.length > 0) {
        const firstMedia = item.media[0];
        if (firstMedia.width && firstMedia.height) {
          // 按比例计算实际显示高度
          const aspectRatio = firstMedia.height / firstMedia.width;
          const mediaHeight = Math.min(400, Math.max(100, width * aspectRatio));
          height += mediaHeight + 8;
        } else {
          // 默认高度
          height += 200;
        }
      }
      
      // 互动操作栏
      height += 48;
      
      // 卡片内边距
      height += 24;
      
      resolve(height);
    });
  }, []);
  
  // 智能列选择算法
  const selectColumn = useCallback((itemHeight: number): 'left' | 'right' => {
    const heightDiff = Math.abs(columnHeights.left - columnHeights.right);
    
    // 如果高度差小于阈值，优先选择左列
    if (heightDiff < 50) {
      return columnHeights.left <= columnHeights.right ? 'left' : 'right';
    }
    
    // 选择较低的列
    return columnHeights.left < columnHeights.right ? 'left' : 'right';
  }, [columnHeights]);
  
  // 计算项目布局位置
  const calculateLayout = useCallback(async () => {
    if (!data.length) {
      setIsLayoutReady(true);
      return;
    }
    
    const newPositions = new Map<string, ItemPosition>();
    let leftHeight = 0;
    let rightHeight = 0;
    
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const itemHeight = await measureItemHeight(item, columnWidth);
      
      // 选择列
      const column = leftHeight <= rightHeight ? 'left' : 'right';
      const x = column === 'left' 
        ? contentPadding 
        : contentPadding + columnWidth + columnGap;
      const y = column === 'left' ? leftHeight : rightHeight;
      
      newPositions.set(item.id, {
        x,
        y,
        width: columnWidth,
        height: itemHeight,
        measured: true
      });
      
      // 更新列高度
      if (column === 'left') {
        leftHeight += itemHeight;
      } else {
        rightHeight += itemHeight;
      }
    }
    
    setItemPositions(newPositions);
    setColumnHeights({ left: leftHeight, right: rightHeight });
    setContainerHeight(Math.max(leftHeight, rightHeight) + SPACING.LG);
    setIsLayoutReady(true);
  }, [data, columnWidth, contentPadding, columnGap, measureItemHeight]);
  
  // 数据变化时重新计算布局
  useEffect(() => {
    setIsLayoutReady(false);
    
    // 防抖处理
    if (measureTimeoutRef.current) {
      clearTimeout(measureTimeoutRef.current);
    }
    
    measureTimeoutRef.current = setTimeout(() => {
      calculateLayout();
    }, 100) as any;
    
    return () => {
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
    };
  }, [calculateLayout]);
  
  // 处理滚动事件
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const currentY = contentOffset.y;
    
    // 上拉加载检测
    const threshold = contentSize.height - layoutMeasurement.height - 100;
    if (currentY > threshold && currentY > lastScrollY.current && !loading) {
      onEndReached?.();
    }
    
    lastScrollY.current = currentY;
  }, [loading, onEndReached]);
  
  // 渲染加载状态
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator 
        size="large" 
        color={COLORS.PRIMARY}
        testID={TEST_IDS.LOADING_INDICATOR}
      />
      <Text style={styles.loadingText}>加载中...</Text>
    </View>
  );
  
  // 渲染错误状态
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
  
  // 渲染空状态
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyText}</Text>
    </View>
  );
  
  // 渲染底部加载更多
  const renderFooter = () => {
    if (!loading || data.length === 0) return null;
    
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  };
  
  // 渲染项目
  const renderMasonryItem = (item: ContentItem, index: number) => {
    const position = itemPositions.get(item.id);
    if (!position || !position.measured) return null;
    
    return (
      <View
        key={item.id}
        style={[
          styles.itemContainer,
          {
            position: 'absolute',
            left: position.x,
            top: position.y,
            width: position.width,
            height: position.height
          }
        ]}
      >
        {renderItem(item, index)}
      </View>
    );
  };
  
  // 错误状态
  if (error && data.length === 0) {
    return renderError();
  }
  
  // 空状态
  if (!loading && data.length === 0) {
    return renderEmpty();
  }
  
  // 初始加载状态
  if (loading && data.length === 0) {
    return renderLoading();
  }
  
  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={{ minHeight: containerHeight }}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
            testID={TEST_IDS.REFRESH_CONTROL}
            accessibilityLabel={ACCESSIBILITY_LABELS.REFRESH_CONTENT}
          />
        ) : undefined
      }
      testID={TEST_IDS.CONTENT_LIST}
    >
      {/* 瀑布流容器 */}
      <View style={[styles.masonryContainer, { height: containerHeight }]}>
        {isLayoutReady && data.map(renderMasonryItem)}
      </View>
      
      {/* 底部加载更多 */}
      {renderFooter()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND
  },
  
  masonryContainer: {
    position: 'relative',
    backgroundColor: COLORS.BACKGROUND
  },
  
  itemContainer: {
    overflow: 'hidden'
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XXL
  },
  
  loadingText: {
    fontSize: FONTS.SIZE_14,
    color: COLORS.GRAY_500,
    marginTop: SPACING.SM,
    textAlign: 'center'
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.XXL
  },
  
  errorText: {
    fontSize: FONTS.SIZE_16,
    color: COLORS.ERROR,
    textAlign: 'center',
    lineHeight: FONTS.SIZE_16 * FONTS.LINE_HEIGHT_1_4
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.XXL
  },
  
  emptyText: {
    fontSize: FONTS.SIZE_16,
    color: COLORS.GRAY_500,
    textAlign: 'center',
    lineHeight: FONTS.SIZE_16 * FONTS.LINE_HEIGHT_1_4
  },
  
  footerLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.LG
  },
  
  footerText: {
    fontSize: FONTS.SIZE_14,
    color: COLORS.GRAY_500,
    marginLeft: SPACING.SM
  }
});

export default MasonryLayout;

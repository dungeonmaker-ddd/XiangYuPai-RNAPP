/**
 * 瀑布流主容器组件
 * 基于《纯结构架构图标准模板》的L1级主容器设计
 * 负责整体布局、响应式适配和状态管理
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WaterfallScrollView from './WaterfallScrollView';
import { WaterfallLayoutEngine, LayoutConfig } from '../utils/WaterfallLayoutEngine';
import { VirtualizationManager } from '../utils/VirtualizationManager';
import { ContentItem, TabType } from '../types';
import { COLORS, LAYOUT_CONSTANTS } from '../constants';

// 瀑布流容器属性接口
export interface WaterfallContainerProps {
  data: ContentItem[];
  tabType: TabType;
  onLoadMore: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  loading: boolean;
  hasMore: boolean;
  onLike?: (itemId: string) => void;
  
  // 可选配置
  showStatusBar?: boolean;
  enableVirtualization?: boolean;
  customLayoutConfig?: Partial<LayoutConfig>;
  imageQuality?: 'high' | 'standard' | 'low';
  
  // 事件处理配置
  navigation?: any;
  analytics?: any;
  showToast?: (message: string) => void;
}

/**
 * 瀑布流主容器组件
 */
const WaterfallContainer: React.FC<WaterfallContainerProps> = ({
  data,
  tabType,
  onLoadMore,
  onRefresh,
  refreshing,
  loading,
  hasMore,
  onLike,
  showStatusBar = true,
  enableVirtualization = true,
  customLayoutConfig,
  imageQuality = 'standard',
  navigation,
  analytics,
  showToast,
}) => {
  const insets = useSafeAreaInsets();
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  // 响应式布局监听
  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // 根据屏幕尺寸计算最优列数
  const optimalColumnCount = useMemo(() => {
    return WaterfallLayoutEngine.calculateOptimalColumnCount(screenData.width);
  }, [screenData.width]);

  // 布局配置
  const layoutConfig = useMemo((): LayoutConfig => {
    const baseConfig: LayoutConfig = {
      columnCount: optimalColumnCount,
      columnSpacing: LAYOUT_CONSTANTS.COLUMN_GAP,
      rowSpacing: LAYOUT_CONSTANTS.MARGIN_MEDIUM,
      containerPadding: LAYOUT_CONSTANTS.PADDING_HORIZONTAL,
      itemBorderRadius: LAYOUT_CONSTANTS.CARD_RADIUS,
      screenWidth: screenData.width,
    };

    return { ...baseConfig, ...customLayoutConfig };
  }, [optimalColumnCount, screenData.width, customLayoutConfig]);

  // 布局引擎实例
  const layoutEngine = useMemo(() => {
    return new WaterfallLayoutEngine(layoutConfig);
  }, [layoutConfig]);

  // 虚拟化管理器实例
  const virtualizationManager = useMemo(() => {
    return new VirtualizationManager({
      enabled: enableVirtualization,
      bufferSize: 1.5,
      recycleThreshold: 50,
      maxCacheSize: 100,
    });
  }, [enableVirtualization]);

  // 屏幕尺寸变化时更新引擎
  useEffect(() => {
    layoutEngine.updateScreenSize(screenData);
  }, [layoutEngine, screenData]);

  // 处理下拉刷新
  const handleRefresh = useCallback(() => {
    // 清理虚拟化缓存
    virtualizationManager.clearCache();
    onRefresh();
  }, [onRefresh, virtualizationManager]);

  // 容器样式
  const containerStyle = useMemo(() => [
    styles.container,
    {
      paddingTop: showStatusBar ? insets.top : 0,
    },
  ], [showStatusBar, insets.top]);

  return (
    <View style={containerStyle}>
      {/* 系统状态栏 */}
      {showStatusBar && (
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.BACKGROUND}
          translucent={false}
        />
      )}
      
      {/* 瀑布流滚动容器 */}
      <WaterfallScrollView
        data={data}
        layoutEngine={layoutEngine}
        virtualizationManager={virtualizationManager}
        tabType={tabType}
        onLoadMore={onLoadMore}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        loading={loading}
        hasMore={hasMore}
        onLike={onLike}
        imageQuality={imageQuality}
        navigation={navigation}
        analytics={analytics}
        showToast={showToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});

export default WaterfallContainer;

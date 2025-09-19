/**
 * 瀑布流列表组件
 * 基于《纯结构架构图标准模板》的重构版本
 * 使用统一模块架构
 */

import React, { memo } from 'react';
import WaterfallContainer from './WaterfallContainer';
import { WaterfallListProps } from './types';

/**
 * 瀑布流列表组件 - 兼容性包装器
 * 
 * 这个组件现在作为统一模块的包装器，保持向后兼容性
 * 同时提供了基于标准模板的全新瀑布流实现
 */
export const WaterfallList = memo<WaterfallListProps>(({
  data,
  loading,
  refreshing,
  hasMore,
  onRefresh,
  onLoadMore,
  onItemPress: _onItemPress,
  onLike,
  onCollect: _onCollect,
  onUserPress: _onUserPress,
  onShare: _onShare,
  navigation,
  analytics,
  showToast,
}) => {
  return (
    <WaterfallContainer
      data={data}
      tabType="hot" // 默认为热门标签，可以后续优化
      loading={loading || false}
      refreshing={refreshing || false}
      hasMore={hasMore || true}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      onLike={onLike}
      
      // 新架构的增强配置
      showStatusBar={false} // 由外层页面控制状态栏
      enableVirtualization={true} // 启用虚拟滚动优化
      imageQuality="standard" // 标准图片质量
      
      // 可选的自定义布局配置
      customLayoutConfig={{
        // 可以在这里覆盖默认的布局参数
        // columnCount: 2, // 强制2列
        // columnSpacing: 8, // 列间距
        // rowSpacing: 8, // 行间距
      }}
      
      // 导航和事件处理
      navigation={navigation}
      analytics={analytics}
      showToast={showToast}
    />
  );
});

WaterfallList.displayName = 'WaterfallList';

// 导出新架构的核心组件，供高级用户直接使用
export { default as WaterfallContainer } from './WaterfallContainer';
export { default as WaterfallScrollView } from './WaterfallScrollView';
export { default as WaterfallCard } from './WaterfallCard';

export default WaterfallList;
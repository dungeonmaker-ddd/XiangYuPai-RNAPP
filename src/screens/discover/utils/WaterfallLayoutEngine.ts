/**
 * 瀑布流布局计算引擎
 * 基于《纯结构架构图标准模板》的标准化设计
 * 负责瀑布流的精确位置计算和性能优化
 */

import { Dimensions } from 'react-native';
import { ContentItem } from '../types';
import { LAYOUT_CONSTANTS, IMAGE_CONFIG } from '../constants';

// 布局配置接口
export interface LayoutConfig {
  columnCount: number;
  columnSpacing: number;
  rowSpacing: number;
  containerPadding: number;
  itemBorderRadius: number;
  screenWidth: number;
}

// 布局项接口
export interface LayoutItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: ContentItem;
  columnIndex: number;
}

// 瀑布流布局引擎类
export class WaterfallLayoutEngine {
  private config: LayoutConfig;
  private columnWidth: number = 0;
  private columnHeights: number[] = [];
  private screenData = Dimensions.get('window');

  constructor(customConfig?: Partial<LayoutConfig>) {
    // 默认配置
    const defaultConfig: LayoutConfig = {
      columnCount: LAYOUT_CONSTANTS.COLUMN_COUNT,
      columnSpacing: LAYOUT_CONSTANTS.COLUMN_GAP,
      rowSpacing: LAYOUT_CONSTANTS.MARGIN_SMALL, // 使用MARGIN_SMALL(4px)，统一控制卡片间距
      containerPadding: LAYOUT_CONSTANTS.PADDING_HORIZONTAL,
      itemBorderRadius: LAYOUT_CONSTANTS.CARD_RADIUS,
      screenWidth: this.screenData.width,
    };

    this.config = { ...defaultConfig, ...customConfig };
    this.calculateColumnWidth();
    this.resetColumnHeights();
  }

  /**
   * 计算列宽
   */
  private calculateColumnWidth(): void {
    const { columnCount, columnSpacing, containerPadding } = this.config;
    const availableWidth = this.config.screenWidth - (containerPadding * 2);
    const totalSpacing = columnSpacing * (columnCount - 1);
    this.columnWidth = (availableWidth - totalSpacing) / columnCount;
  }

  /**
   * 重置列高度
   */
  private resetColumnHeights(): void {
    const { containerPadding } = this.config;
    this.columnHeights = new Array(this.config.columnCount).fill(containerPadding);
  }

  /**
   * 获取最短列的索引
   */
  private getShortestColumnIndex(): number {
    let minHeight = this.columnHeights[0];
    let minIndex = 0;
    
    for (let i = 1; i < this.columnHeights.length; i++) {
      if (this.columnHeights[i] < minHeight) {
        minHeight = this.columnHeights[i];
        minIndex = i;
      }
    }
    
    return minIndex;
  }

  /**
   * 计算单个item的高度
   */
  private calculateItemHeight(item: ContentItem): number {
    // 规范化图片尺寸
    const normalizedItem = this.normalizeImageData(item);
    
    // 计算图片高度（保持宽高比）
    const imageHeight = (normalizedItem.height / normalizedItem.width) * this.columnWidth;
    
    // 内容区域高度（用户信息、标题等）
    const contentHeight = IMAGE_CONFIG.WATERFALL.CONTENT_HEIGHT;
    
    return imageHeight + contentHeight;
  }

  /**
   * 规范化图片数据
   */
  private normalizeImageData(item: ContentItem): ContentItem {
    const { WATERFALL } = IMAGE_CONFIG;
    let { width, height } = item;

    // 确保尺寸在合理范围内
    if (width < WATERFALL.MIN_WIDTH || width > WATERFALL.MAX_WIDTH ||
        height < WATERFALL.MIN_HEIGHT || height > WATERFALL.MAX_HEIGHT) {
      
      // 使用默认宽高比
      width = WATERFALL.MIN_WIDTH;
      height = width / WATERFALL.DEFAULT_ASPECT_RATIO;
    }

    // 计算宽高比
    const aspectRatio = width / height;
    
    // 限制宽高比范围
    if (aspectRatio < WATERFALL.MIN_ASPECT_RATIO) {
      height = width / WATERFALL.MIN_ASPECT_RATIO;
    } else if (aspectRatio > WATERFALL.MAX_ASPECT_RATIO) {
      height = width / WATERFALL.MAX_ASPECT_RATIO;
    }

    return {
      ...item,
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  /**
   * 计算item的x坐标
   */
  private calculateItemX(columnIndex: number): number {
    const { columnSpacing, containerPadding } = this.config;
    return containerPadding + columnIndex * (this.columnWidth + columnSpacing);
  }

  /**
   * 计算完整的瀑布流布局
   */
  public calculateLayout(data: ContentItem[]): LayoutItem[] {
    this.resetColumnHeights();
    const layoutItems: LayoutItem[] = [];

    data.forEach((item) => {
      // 选择最短的列
      const columnIndex = this.getShortestColumnIndex();
      
      // 计算item尺寸和位置
      const height = this.calculateItemHeight(item);
      const x = this.calculateItemX(columnIndex);
      const y = this.columnHeights[columnIndex];

      // 创建布局项
      const layoutItem: LayoutItem = {
        id: item.id,
        x,
        y,
        width: this.columnWidth,
        height,
        data: item,
        columnIndex,
      };

      layoutItems.push(layoutItem);

      // 更新列高度
      this.columnHeights[columnIndex] += height + this.config.rowSpacing;
    });

    return layoutItems;
  }

  /**
   * 获取瀑布流总高度
   */
  public getTotalHeight(layoutItems: LayoutItem[]): number {
    if (layoutItems.length === 0) return 0;
    
    const maxHeight = Math.max(...this.columnHeights);
    return maxHeight + this.config.containerPadding;
  }

  /**
   * 更新屏幕尺寸
   */
  public updateScreenSize(newScreenData: { width: number; height: number }): void {
    this.screenData = { 
      ...this.screenData, 
      width: newScreenData.width, 
      height: newScreenData.height 
    };
    this.config.screenWidth = newScreenData.width;
    this.calculateColumnWidth();
  }

  /**
   * 更新配置
   */
  public updateConfig(newConfig: Partial<LayoutConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.calculateColumnWidth();
  }

  /**
   * 获取当前配置
   */
  public getConfig(): LayoutConfig {
    return { ...this.config };
  }

  /**
   * 获取列宽
   */
  public getColumnWidth(): number {
    return this.columnWidth;
  }

  /**
   * 获取列高度数组
   */
  public getColumnHeights(): number[] {
    return [...this.columnHeights];
  }

  /**
   * 根据屏幕尺寸自动计算最优列数
   */
  public static calculateOptimalColumnCount(screenWidth: number): number {
    if (screenWidth < 400) return 2;
    if (screenWidth < 600) return 2;
    if (screenWidth < 900) return 3;
    return 4;
  }

  /**
   * 检查item是否在可视区域内
   */
  public isItemVisible(
    item: LayoutItem, 
    scrollOffset: number, 
    containerHeight: number,
    bufferSize: number = 1.5
  ): boolean {
    const bufferHeight = containerHeight * bufferSize;
    const visibleTop = scrollOffset - bufferHeight;
    const visibleBottom = scrollOffset + containerHeight + bufferHeight;
    
    return item.y < visibleBottom && (item.y + item.height) > visibleTop;
  }
}

/**
 * 创建默认布局引擎实例
 */
export const createDefaultLayoutEngine = (screenWidth?: number): WaterfallLayoutEngine => {
  const width = screenWidth || Dimensions.get('window').width;
  const columnCount = WaterfallLayoutEngine.calculateOptimalColumnCount(width);
  
  return new WaterfallLayoutEngine({
    columnCount,
    screenWidth: width,
  });
};

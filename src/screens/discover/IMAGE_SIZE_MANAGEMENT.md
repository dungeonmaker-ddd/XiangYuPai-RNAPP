# 瀑布流图片尺寸管理优化

## 概述

为了更好地管理瀑布流中的图片尺寸，特别是宽度限制，我们实现了一套完整的图片尺寸管理系统。

## 主要改进

### 1. 图片尺寸配置 (`constants.ts`)

新增了 `WATERFALL` 配置，包含：

```typescript
WATERFALL: {
  // 最小宽度 (px)
  MIN_WIDTH: 200,
  // 最大宽度 (px) 
  MAX_WIDTH: 800,
  // 最小高度 (px)
  MIN_HEIGHT: 150,
  // 最大高度 (px)
  MAX_HEIGHT: 1200,
  // 默认宽高比 (当原图比例异常时使用)
  DEFAULT_ASPECT_RATIO: 3 / 4,
  // 最小宽高比
  MIN_ASPECT_RATIO: 1 / 3,
  // 最大宽高比
  MAX_ASPECT_RATIO: 3 / 1,
  // 内容区域固定高度
  CONTENT_HEIGHT: 80,
}
```

### 2. 图片尺寸工具函数 (`utils/imageUtils.ts`)

#### 核心功能

- **`calculateImageDimensions`**: 计算瀑布流卡片的图片尺寸
- **`calculateCardHeight`**: 计算卡片总高度
- **`validateImageDimensions`**: 验证图片尺寸是否合理
- **`normalizeImageData`**: 规范化单个图片数据
- **`normalizeImageDataBatch`**: 批量规范化图片数据

#### 尺寸控制策略

1. **宽高比限制**: 限制在 1:3 到 3:1 之间，避免过于极端的比例
2. **尺寸范围控制**: 确保图片在合理的宽度和高度范围内
3. **异常数据处理**: 为无效或缺失的尺寸数据提供默认值
4. **显示优化**: 根据卡片宽度计算最佳显示尺寸

### 3. 组件更新

#### WaterfallList 组件
- 使用 `normalizeImageDataBatch` 预处理数据
- 使用 `calculateCardHeight` 计算精确的卡片高度

#### ContentCard 组件
- 使用 `calculateImageDimensions` 获取优化的显示尺寸
- 动态调整卡片高度以适应图片内容

## 使用示例

```typescript
import { 
  calculateImageDimensions, 
  normalizeImageData 
} from '../utils/imageUtils';

// 规范化图片数据
const normalizedItem = normalizeImageData(contentItem);

// 计算显示尺寸
const { displayWidth, displayHeight } = calculateImageDimensions(
  normalizedItem, 
  cardWidth
);
```

## 优势

1. **一致性**: 所有图片都有统一的尺寸标准
2. **性能优化**: 避免异常尺寸导致的布局问题
3. **用户体验**: 更好的视觉效果和流畅的滚动
4. **可维护性**: 集中管理所有尺寸相关的配置
5. **扩展性**: 易于调整和优化尺寸规则

## 配置说明

可以通过修改 `constants.ts` 中的 `WATERFALL` 配置来调整：

- **尺寸范围**: 根据实际需求调整最小/最大宽高
- **宽高比**: 调整允许的宽高比范围
- **默认比例**: 设置异常情况下的默认宽高比
- **内容高度**: 调整用户信息区域的固定高度

## 注意事项

1. 所有图片数据都会被自动规范化
2. 异常的宽高比会被自动调整到合理范围
3. 缺失的尺寸数据会使用默认值填充
4. 配置修改后建议重新测试各种尺寸的图片效果

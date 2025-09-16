# 瀑布流布局稳定性改进

## 问题描述

之前的瀑布流布局偶尔会出现：
- 右padding移到左侧
- 中间空隙消失
- 左右卡片间距不一致

## 解决方案：Padding + 负Margin 方案

### 核心思路

1. **统一padding**: 给所有卡片添加相同的水平padding
2. **负margin拉齐**: 使用负margin将边缘卡片拉齐到容器边缘
3. **精确计算**: 重新设计宽度计算逻辑

### 实现细节

#### 1. 宽度计算优化

```typescript
const { cardWidth, halfGap } = useMemo(() => {
  const halfGap = LAYOUT_CONSTANTS.COLUMN_GAP / 2;
  const cardWidth = (SCREEN_WIDTH - LAYOUT_CONSTANTS.PADDING_HORIZONTAL * 2) / 2;
  return { cardWidth, halfGap };
}, []);
```

- `halfGap`: 列间距的一半，用于padding
- `cardWidth`: 每列的完整宽度（包含padding空间）

#### 2. 动态样式应用

```typescript
{
  width: cardWidth,
  paddingHorizontal: halfGap,           // 两列都有相同的水平padding
  marginLeft: item.columnIndex === 0 ? -halfGap : 0,   // 左列负margin拉齐左边
  marginRight: item.columnIndex === 1 ? -halfGap : 0,  // 右列负margin拉齐右边
}
```

### 布局效果

```
容器边界
|                                          |
|  [Left Card]      [Right Card]          |
|  ←halfGap→        ←halfGap→              |
|  ↑-halfGap        ↑-halfGap              |
|  实际内容         实际内容               |
|                                          |
```

#### 左列卡片：
- 宽度: `cardWidth`
- 左padding: `halfGap`
- 右padding: `halfGap`
- 左margin: `-halfGap` (拉齐到容器左边)
- 右margin: `0`

#### 右列卡片：
- 宽度: `cardWidth`  
- 左padding: `halfGap`
- 右padding: `halfGap`
- 左margin: `0`
- 右margin: `-halfGap` (拉齐到容器右边)

### 优势

1. **稳定性**: 避免了margin计算错误导致的布局异常
2. **一致性**: 所有卡片都有相同的内部padding
3. **精确性**: 负margin确保边缘对齐
4. **可维护性**: 逻辑清晰，容易调试

### 相关配置

在 `constants.ts` 中可以调整：

```typescript
LAYOUT_CONSTANTS: {
  COLUMN_GAP: 8,              // 列间距
  PADDING_HORIZONTAL: 16,     // 容器水平padding
}
```

### 视觉效果

- ✅ 左右边缘完全对齐容器边界
- ✅ 中间间距始终保持 `COLUMN_GAP`
- ✅ 卡片内容有统一的内边距
- ✅ 避免布局异常和跳跃

## 技术细节

### 计算逻辑

1. 容器可用宽度: `SCREEN_WIDTH - PADDING_HORIZONTAL * 2`
2. 每列宽度: 可用宽度 ÷ 2
3. 内容实际宽度: 每列宽度 - padding
4. 列间距: 通过padding实现，负margin拉齐边界

### 兼容性

- ✅ iOS & Android
- ✅ 不同屏幕尺寸
- ✅ 横竖屏切换
- ✅ React Native FlatList

这个方案确保了瀑布流布局的稳定性和一致性，解决了之前的间距异常问题。

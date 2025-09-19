# WaterfallCard 瀑布流卡片组件

> 基于《通用组件架构核心标准》设计的瀑布流卡片组件，专注于内容展示和基础交互。

## 📋 组件概述

### 基本信息
- **组件名称**: WaterfallCard
- **复杂度等级**: Intermediate (200-300行)
- **架构版本**: 2.0.0
- **架构标准**: 通用组件架构核心标准

### 核心特性
- ✅ **8段式编码逻辑**: 导入→类型→常量→工具→状态→事件→渲染→样式
- ✅ **具名化原则**: 所有函数和变量都有明确含义的名称
- ✅ **单一职责**: 专注于瀑布流卡片的展示和基础交互
- ✅ **自包含原则**: 包含组件所需的所有逻辑和样式
- ✅ **业务逻辑外置**: 复杂交互通过事件处理器实现

## 🏗️ 文件结构

```
WaterfallCard/                                  # 伪页面组件根目录
├── 🏗️ 核心文件 (必需)
│   ├── index.tsx                               # 主组件文件 - UI渲染和功能组装
│   ├── types.ts                                # 类型定义 - 接口、类型、约束
│   ├── constants.ts                            # 常量定义 - 配置、默认值
│   └── README.md                               # 组件文档 - 使用说明、API
│
├── 🔄 状态管理层
│   └── useWaterfallCard.ts                     # 主状态管理 - 核心业务状态
│
├── ⚡ 事件处理层
│   ├── onWaterfallCardClick.ts                 # 卡片点击事件处理
│   ├── onWaterfallLikeClick.ts                 # 点赞事件处理
│   └── onWaterfallUserClick.ts                 # 用户交互事件处理
│
├── 🧭 导航处理层
│   └── navigateToContentDetail.ts              # 内容详情导航处理
│
├── 🌐 API接口层
│   └── apiWaterfallCardLike.ts                 # 点赞相关API接口
│
├── 🔌 后端交互层
│   └── backend/                                # 后端代码文件夹
│       ├── entityWaterfallCardLike.java        # MyBatis Plus实体类
│       ├── dtoWaterfallCardLikeRequest.java    # 数据传输对象
│       ├── controllerWaterfallCardLike.java    # REST API控制器
│       └── serviceWaterfallCardLike.java       # QueryWrapper业务服务
│
├── 🔄 数据处理层
│   └── processWaterfallCardImage.ts            # 图片处理逻辑
│
└── 🛠️ 工具函数层
    └── formatWaterfallCardDisplay.ts           # 显示格式化工具
```

## 🎯 API 接口

### Props 接口

```typescript
interface WaterfallCardProps {
  // 核心数据
  item: ContentItem;                    // 内容数据项
  index: number;                        // 卡片索引
  tabType: TabType;                     // 标签类型
  
  // UI配置
  style?: ViewStyle;                    // 自定义样式
  imageQuality?: WaterfallCardImageQuality; // 图片质量
  
  // 事件处理依赖注入
  navigation?: any;                     // 导航对象
  analytics?: any;                      // 分析对象
  showToast?: (message: string) => void; // Toast显示函数
  
  // 可选回调函数
  onLike?: () => void;                  // 点赞回调
  onLongPress?: () => void;             // 长按回调
}
```

### 类型定义

```typescript
// 图片质量类型
type WaterfallCardImageQuality = 'high' | 'standard' | 'low';

// 媒体类型
type WaterfallCardMediaType = 'image' | 'video' | 'live';

// 用户点击类型
type WaterfallCardUserClickType = 'avatar' | 'nickname' | 'userInfo';
```

## 📖 使用示例

### 基础使用

```tsx
import WaterfallCard from '../WaterfallCard';

const ExampleScreen = () => {
  const handleLike = () => {
    console.log('点赞回调触发');
  };

  return (
    <WaterfallCard
      item={contentItem}
      index={0}
      tabType="recommend"
      imageQuality="standard"
      navigation={navigation}
      analytics={analytics}
      showToast={showToast}
      onLike={handleLike}
    />
  );
};
```

### 自定义样式

```tsx
<WaterfallCard
  item={contentItem}
  index={0}
  tabType="recommend"
  style={{
    marginHorizontal: 10,
    borderRadius: 12,
  }}
/>
```

### 高质量图片

```tsx
<WaterfallCard
  item={contentItem}
  index={0}
  tabType="recommend"
  imageQuality="high"
/>
```

## 🔧 功能特性

### 图片处理
- **多质量支持**: 支持 high/standard/low 三种图片质量
- **CDN优化**: 自动添加CDN参数优化图片加载
- **尺寸计算**: 基于原始尺寸计算合适的显示高度
- **加载状态**: 显示加载指示器和错误状态

### 交互功能
- **卡片点击**: 跳转到内容详情页
- **用户交互**: 支持点击用户头像、昵称查看用户资料
- **点赞功能**: 支持点赞操作，带成功/失败回调
- **长按操作**: 支持长按触发自定义操作

### 媒体类型
- **视频标识**: 显示播放按钮标识
- **直播标识**: 显示 LIVE 标识
- **图片内容**: 默认图片展示

## 🎨 样式系统

### 设计规范
- **卡片阴影**: 使用统一的阴影效果
- **圆角设计**: 遵循设计系统的圆角规范
- **间距系统**: 使用标准化的间距常量
- **颜色系统**: 基于设计系统的颜色规范

### 响应式设计
- **自适应高度**: 根据图片比例自动计算高度
- **最小/最大高度**: 限制极端情况下的高度范围
- **文字截断**: 支持多行文字截断显示

## ⚡ 性能优化

### React优化
- **memo包装**: 使用 React.memo 避免不必要的重渲染
- **useMemo**: 缓存计算结果，避免重复计算
- **useCallback**: 缓存事件处理函数

### 图片优化
- **CDN加速**: 使用CDN参数优化图片加载速度
- **质量控制**: 根据需求选择合适的图片质量
- **懒加载**: 支持图片懒加载（需要父组件配合）

## 🔗 依赖关系

### 内部依赖
- `../../types`: 基础类型定义
- `../../constants`: 设计系统常量
- `../../events/*`: 事件处理器

### 外部依赖
- `react`: React核心库
- `react-native`: React Native组件库

## 🧪 测试建议

### 单元测试
```typescript
// 测试组件渲染
test('should render correctly', () => {
  // 测试基本渲染功能
});

// 测试工具函数
test('formatDisplayCount should format numbers correctly', () => {
  expect(formatDisplayCount(999)).toBe('999');
  expect(formatDisplayCount(1500)).toBe('1.5k');
  expect(formatDisplayCount(12000)).toBe('1.2w');
});

// 测试图片URL生成
test('getOptimizedImageUrl should generate correct URLs', () => {
  const url = 'https://example.com/image.jpg';
  expect(getOptimizedImageUrl(url, 'standard'))
    .toBe('https://example.com/image.jpg?imageView2/2/w/600/q/80');
});
```

### 集成测试
- 测试与事件处理器的集成
- 测试与导航系统的集成
- 测试与分析系统的集成

## 📝 更新日志

### v2.0.0 (当前版本)
- ✨ 基于通用组件架构核心标准完全重构
- ✨ 实现8段式编码逻辑
- ✨ 模块化文件结构
- ✨ 完整的类型定义和工具函数
- ✨ 性能优化和最佳实践应用

### v1.0.0 (历史版本)
- 🎉 初始版本实现
- 📱 基础的瀑布流卡片功能

## 🤝 贡献指南

1. 遵循通用组件架构核心标准
2. 保持8段式编码逻辑结构
3. 添加完整的类型定义
4. 编写详细的注释和文档
5. 确保所有功能都有对应的测试用例

---

**维护者**: 架构团队  
**最后更新**: 2024年  
**架构标准**: 通用组件架构核心标准 v1.0.0

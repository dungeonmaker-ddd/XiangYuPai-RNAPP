# 瀑布流事件处理系统 Waterfall Event Handling System

## 概述

这是一个简单而强大的事件处理系统，专为React Native应用设计。与复杂的事件管理器不同，我们采用"一个事件一个文件"的方式，让UI组件保持纯净，业务逻辑集中管理。

## 设计原则

- **UI组件纯净化**: UI组件只负责展示，不包含业务逻辑
- **事件逻辑集中化**: 每个事件的处理逻辑都在对应的文件中
- **模块化设计**: 事件处理器可以在多个模块中复用
- **易于维护**: 事件逻辑独立，便于测试和维护

## 文件结构

```
src/screens/discover/events/
├── onWaterfallCardClick.ts         # 瀑布流卡片点击事件处理器
├── onWaterfallLikeClick.ts         # 瀑布流点赞点击事件处理器
├── onWaterfallUserClick.ts         # 瀑布流用户点击事件处理器
├── CardClickExample.tsx            # 卡片点击使用示例
├── WaterfallSimplifiedExample.tsx  # 简化版使用示例
├── WaterfallEventsExample.tsx      # 完整事件处理示例
└── README.md                      # 文档
```

## 核心特性

### 1. 瀑布流卡片点击事件处理器 (`onWaterfallCardClick.ts`)

- **功能完整**: 包含分析记录、权限检查、导航处理、错误管理
- **类型安全**: 完整的TypeScript类型定义
- **配置灵活**: 支持自定义配置和默认配置
- **错误处理**: 统一的错误处理和上报机制

### 2. 瀑布流点赞点击事件处理器 (`onWaterfallLikeClick.ts`)

- **完整的点赞流程**: 登录检查、频率限制、API调用、状态更新
- **智能反馈**: 点赞成功/失败的不同处理和提示
- **数据同步**: 本地状态与服务器状态的同步
- **防重复操作**: 内置频率限制和重复点击保护

### 3. 瀑布流用户点击事件处理器 (`onWaterfallUserClick.ts`)

- **多种点击类型**: 支持头像、昵称、用户信息区域的不同点击
- **智能导航策略**: 根据点击类型和用户状态选择最佳导航方式
- **用户状态检查**: 包含用户存在性、隐私设置、封禁状态检查
- **灵活的界面展示**: 支持预览、完整资料页、模态框等多种展示方式

### 4. 便捷的API接口

```typescript
// 卡片点击事件
await onWaterfallCardClick({
  item, index, tabType, navigation, analytics, showToast,
});

// 点赞点击事件
await onWaterfallLikeClick({
  item, index, tabType, navigation, analytics, showToast,
  onLikeSuccess: (itemId, newCount) => console.log('点赞成功'),
});

// 用户点击事件
await onWaterfallUserClick({
  item, user: item.user, index, tabType, clickType: 'avatar',
  navigation, analytics, showToast,
});

// 预配置处理器
const cardClickHandler = createWaterfallCardClickHandler({ navigation, analytics });
const likeClickHandler = createWaterfallLikeClickHandler({ navigation, analytics });
const userClickHandler = createWaterfallUserClickHandler({ navigation, analytics });
```

## 使用方法

### 基础使用

```tsx
import { WaterfallContainer } from '../components';

const MyComponent = ({ data, navigation }) => {
  return (
    <WaterfallContainer
      data={data}
      tabType="recommend"
      onLoadMore={() => {}}
      onRefresh={() => {}}
      refreshing={false}
      loading={false}
      hasMore={true}
      navigation={navigation}
      showToast={(message) => Alert.alert('提示', message)}
    />
  );
};
```

### 高级配置

```tsx
const MyAdvancedComponent = ({ data, navigation }) => {
  const analytics = {
    track: (event, properties) => {
      // 发送分析数据到你的服务
    },
  };

  const showToast = (message) => {
    // 使用你的Toast组件
    Toast.show(message);
  };

  return (
    <WaterfallContainer
      data={data}
      tabType="hot"
      onLoadMore={handleLoadMore}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      loading={loading}
      hasMore={hasMore}
      onLike={handleLike}
      onCollect={handleCollect}
      onUserPress={handleUserPress}
      onShare={handleShare}
      navigation={navigation}
      analytics={analytics}
      showToast={showToast}
      imageQuality="high"
    />
  );
};
```

## 事件处理流程

### 卡片点击事件流程

1. **参数验证**: 检查传入的参数是否有效
2. **分析记录**: 记录用户点击行为用于分析
3. **权限检查**: 检查内容访问权限（VIP、地区、年龄等）
4. **用户行为记录**: 记录用户行为用于推荐算法
5. **导航处理**: 处理页面导航
6. **错误处理**: 统一的错误处理和上报

## 支持的功能

### 分析数据记录

- 内容相关数据（ID、类型、标题、作者等）
- 位置相关数据（索引、标签页、点击位置等）
- 用户状态数据（点赞、收藏、关注状态等）
- 设备和时间数据

### 权限检查

- 内容删除检查
- VIP权限检查
- 地区限制检查
- 年龄验证检查

### 错误处理

- 参数验证错误
- 网络请求错误
- 权限检查错误
- 导航错误
- 统一的错误上报

## 扩展新事件

要添加新的事件处理器，请按照以下步骤：

### 1. 创建事件处理文件

```typescript
// src/screens/discover/events/onNewEvent.ts

export interface NewEventParams {
  // 定义参数接口
}

export interface NewEventResult {
  // 定义结果接口
}

export const onNewEvent = async (params: NewEventParams): Promise<NewEventResult> => {
  try {
    // 处理事件逻辑
    
    return {
      success: true,
      // 其他结果数据
    };
  } catch (error) {
    // 错误处理
    
    return {
      success: false,
      error: error.message,
    };
  }
};
```

### 2. 更新组件接口

在相关组件中添加新的事件参数：

```typescript
export interface ComponentProps {
  // 现有属性...
  onNewEvent?: (params: SomeParams) => void;
}
```

### 3. 集成到组件中

在组件中调用事件处理器：

```typescript
const handleNewEvent = useCallback(async (params) => {
  await onNewEvent(params);
}, []);
```

## 最佳实践

### 1. 保持UI组件纯净

```tsx
// ✅ 好的做法
const MyCard = ({ item, index, tabType, navigation }) => {
  return (
    <WaterfallCard
      item={item}
      index={index}
      tabType={tabType}
      navigation={navigation}
    />
  );
};

// ❌ 避免的做法
const MyCard = ({ item, index, tabType, navigation }) => {
  const handleClick = () => {
    // 大量业务逻辑...
  };
  
  return (
    <TouchableOpacity onPress={handleClick}>
      {/* ... */}
    </TouchableOpacity>
  );
};
```

### 2. 统一错误处理

```typescript
// ✅ 使用事件处理器的统一错误处理
await onCardClick(params);

// ❌ 在组件中处理错误
try {
  // 业务逻辑...
} catch (error) {
  // 错误处理...
}
```

### 3. 合理使用配置

```typescript
// ✅ 预配置常用参数
const cardClickHandler = createCardClickHandler({
  navigation,
  analytics,
  showToast,
});

// ✅ 根据需要选择API
await cardClickHandler(item, index, tabType);
await defaultCardClickHandler(item, index, tabType);
await onCardClick({ /* 完整参数 */ });
```

## 类型定义

所有事件处理器都提供完整的TypeScript类型定义，包括：

- 参数接口
- 结果接口
- 回调函数类型
- 配置选项类型

## 性能优化

- 事件处理器支持异步操作
- 分析数据记录不会阻塞主流程
- 错误处理不会影响用户体验
- 支持可选的功能配置

## 总结

这个事件处理系统提供了：

1. **简单易用**: 一个事件一个文件，清晰直观
2. **功能完整**: 包含分析、权限、导航、错误处理等完整功能
3. **类型安全**: 完整的TypeScript支持
4. **易于扩展**: 简单的扩展模式
5. **性能优化**: 异步处理，不阻塞UI

通过这个系统，你可以保持UI组件的纯净性，同时拥有强大的事件处理能力。

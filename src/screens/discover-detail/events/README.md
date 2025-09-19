# 导航事件管理系统

这个导航事件管理系统为发现详情页面提供了统一的页面跳转事件处理机制。每个跳转功能都被拆分为独立的文件，便于维护和复用。

## 📁 文件结构

```
events/
├── index.ts                    # 统一导出文件
├── navigateToReport.ts         # 举报页面跳转事件
├── navigateToProfile.ts        # 用户资料页面跳转事件
├── navigateToChat.ts           # 私聊页面跳转事件
├── navigateToDiscover.ts       # 发现页面跳转事件
└── README.md                   # 使用文档
```

## 🚀 快速开始

### 1. 基本使用

```typescript
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNavigationEventHandlers } from '../events';

const MyComponent: React.FC = () => {
  const navigation = useNavigation();
  const navigationHandlers = createNavigationEventHandlers(navigation as any);

  const handleReport = () => {
    navigationHandlers.navigateToReport({
      targetId: 'content_123',
      targetType: 'content',
      targetTitle: '内容标题',
      targetAuthor: '作者名称',
    });
  };

  return (
    // 你的组件 JSX
  );
};
```

### 2. 单独使用特定导航事件

```typescript
import { navigateToReport } from '../events/navigateToReport';

const handleReport = async () => {
  const success = await navigateToReport(navigation, {
    targetId: 'content_123',
    targetType: 'content',
  });
  
  if (success) {
    console.log('导航成功');
  }
};
```

## 📖 API 文档

### createNavigationEventHandlers

创建所有导航事件处理器的工厂函数。

**参数:**
- `navigation: NavigationProp<ParamListBase>` - React Navigation 实例

**返回值:**
- 包含所有导航处理器的对象

### 举报页面跳转 (navigateToReport)

跳转到举报页面。

**参数:**
```typescript
interface ReportNavigationParams {
  targetId: string;           // 举报目标ID
  targetType: ReportTargetType; // 举报目标类型
  targetTitle?: string;       // 举报目标标题（可选）
  targetAuthor?: string;      // 举报目标作者（可选）
}
```

**使用示例:**
```typescript
navigationHandlers.navigateToReport({
  targetId: 'post_123',
  targetType: 'content',
  targetTitle: '违规内容标题',
  targetAuthor: '发布者用户名',
});
```

### 用户资料页面跳转 (navigateToProfile)

跳转到用户资料页面。

**参数:**
```typescript
interface ProfileNavigationParams {
  userId: string;           // 用户ID
  username?: string;        // 用户名（可选）
  avatarUrl?: string;       // 用户头像URL（可选）
}
```

**使用示例:**
```typescript
navigationHandlers.navigateToProfile({
  userId: 'user_456',
  username: '用户昵称',
  avatarUrl: 'https://example.com/avatar.jpg',
});
```

### 私聊页面跳转 (navigateToChat)

跳转到私聊页面。

**参数:**
```typescript
interface ChatNavigationParams {
  userId: string;           // 对方用户ID
  username?: string;        // 对方用户名（可选）
  avatarUrl?: string;       // 对方用户头像URL（可选）
  chatRoomId?: string;      // 聊天室ID（可选）
}
```

**使用示例:**
```typescript
navigationHandlers.navigateToChat({
  userId: 'user_789',
  username: '聊天对象',
  avatarUrl: 'https://example.com/chat-avatar.jpg',
});
```

### 发现页面跳转 (navigateToDiscover)

跳转到发现页面或返回发现页面。

**参数:**
```typescript
interface DiscoverNavigationParams {
  filterTag?: string;       // 筛选标签（可选）
  searchKeyword?: string;   // 搜索关键词（可选）
  focusContentId?: string;  // 定位到特定内容ID（可选）
}
```

**使用示例:**
```typescript
// 带参数跳转
navigationHandlers.navigateToDiscover({
  filterTag: '美食',
  searchKeyword: '火锅',
});

// 返回发现页面
navigationHandlers.navigateBackToDiscover();
```

## 🔧 错误处理

所有导航事件都包含错误处理机制：

- 参数验证：检查必需参数是否提供
- 异常捕获：捕获导航过程中的异常
- 日志记录：记录导航成功/失败的日志
- 返回值：返回 `Promise<boolean>` 表示操作是否成功

## 🎯 最佳实践

### 1. 统一使用工厂函数

推荐使用 `createNavigationEventHandlers` 来创建所有处理器：

```typescript
const navigationHandlers = createNavigationEventHandlers(navigation as any);
```

### 2. 错误处理

对于关键的导航操作，建议检查返回值：

```typescript
const success = await navigationHandlers.navigateToReport(params);
if (!success) {
  // 处理导航失败的情况
  showErrorMessage('跳转失败，请重试');
}
```

### 3. 参数完整性

提供尽可能完整的参数，有助于目标页面的正确显示：

```typescript
// ✅ 推荐：提供完整参数
navigationHandlers.navigateToProfile({
  userId: 'user_123',
  username: '用户昵称',
  avatarUrl: 'https://example.com/avatar.jpg',
});

// ❌ 不推荐：只提供最少参数
navigationHandlers.navigateToProfile({
  userId: 'user_123',
});
```

### 4. 类型安全

使用 TypeScript 的类型检查来确保参数正确：

```typescript
import type { ReportNavigationParams } from '../events';

const reportParams: ReportNavigationParams = {
  targetId: 'content_123',
  targetType: 'content', // 类型检查会确保这是有效的 ReportTargetType
};
```

## 🔄 扩展新的导航事件

要添加新的导航事件，请按照以下步骤：

### 1. 创建新的导航文件

在 `events/` 目录下创建新文件，例如 `navigateToNewPage.ts`：

```typescript
import type { NavigationProp, ParamListBase } from '@react-navigation/native';

export interface NewPageNavigationParams {
  // 定义参数接口
}

export const navigateToNewPage = async (
  navigation: NavigationProp<ParamListBase>,
  params: NewPageNavigationParams
): Promise<boolean> => {
  // 实现导航逻辑
};

export const createNewPageNavigationHandler = (
  navigation: NavigationProp<ParamListBase>
) => {
  return (params: NewPageNavigationParams) => navigateToNewPage(navigation, params);
};
```

### 2. 更新统一导出文件

在 `events/index.ts` 中添加新的导出：

```typescript
export * from './navigateToNewPage';
export type { NewPageNavigationParams } from './navigateToNewPage';

// 在 createNavigationEventHandlers 中添加新的处理器
export const createNavigationEventHandlers = (navigation: NavigationProp<ParamListBase>) => {
  return {
    // 现有的处理器...
    navigateToNewPage: createNewPageNavigationHandler(navigation),
  };
};
```

## 📝 注意事项

1. **类型转换**: 由于 React Navigation 的类型复杂性，在使用时可能需要进行类型转换 `navigation as any`
2. **异步操作**: 所有导航函数都是异步的，返回 Promise
3. **日志记录**: 所有导航操作都会记录日志，便于调试
4. **参数验证**: 必需参数会在导航前进行验证

## 🔗 相关文件

- [DetailHeader.tsx](../components/DetailHeader.tsx) - 使用导航事件的示例组件
- [NavigationEventsExample.tsx](../examples/NavigationEventsExample.tsx) - 完整使用示例
- [举报模块](../../report/) - 举报页面相关功能

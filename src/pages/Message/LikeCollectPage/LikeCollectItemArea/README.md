# LikeCollectItemArea 组件区域

## 📖 概述

LikeCollectItemArea 是点赞收藏页面的核心组件区域，负责展示单个点赞或收藏消息项，包含用户头像、操作信息、内容预览和缩略图。

## 🏗️ 组件结构

```
LikeCollectItemArea/
├── index.tsx                   # 主组件实现
├── types.ts                    # 类型定义
├── constants.ts               # 常量配置
└── README.md                  # 组件文档
```

## 🎯 功能特性

### ✅ 核心功能
- **用户信息展示**：头像、昵称、在线状态
- **操作类型显示**：点赞/收藏图标和文本
- **时间格式化**：智能显示相对时间
- **内容预览**：目标内容的标题和缩略图
- **交互响应**：点击用户、点击消息的事件处理

### 🎨 视觉设计
- **布局结构**：左侧头像 + 中间信息 + 右侧缩略图
- **操作图标**：头像右下角显示操作类型图标
- **内容类型**：缩略图左下角显示内容类型标识
- **响应效果**：点击时的透明度变化反馈

## 📋 API 接口

### Props

| 属性 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `message` | `LikeCollectMessage` | ✅ | 点赞收藏消息数据 |
| `onPress` | `(message: LikeCollectMessage) => void` | ✅ | 点击消息项回调 |
| `onUserPress` | `(userId: string) => void` | ✅ | 点击用户头像回调 |

### 消息数据结构

```typescript
interface LikeCollectMessage {
  id: string;
  user: {
    id: string;
    nickname: string;
    avatar: string;
    isOnline: boolean;
    lastActiveTime: string;
  };
  actionType: 'like' | 'collect';
  targetContent: {
    id: string;
    type: 'post' | 'comment';
    title: string;
    thumbnail?: string;
  };
  timestamp: string;
  isRead: boolean;
}
```

## 🚀 使用示例

### 基础用法

```typescript
import LikeCollectItemArea from './LikeCollectItemArea';

const MyComponent = () => {
  const handleMessagePress = (message: LikeCollectMessage) => {
    console.log('查看消息详情:', message.id);
    // 跳转到内容详情页面
  };

  const handleUserPress = (userId: string) => {
    console.log('查看用户资料:', userId);
    // 跳转到用户资料页面
  };

  return (
    <LikeCollectItemArea
      message={messageData}
      onPress={handleMessagePress}
      onUserPress={handleUserPress}
    />
  );
};
```

### 在列表中使用

```typescript
import { FlatList } from 'react-native';
import LikeCollectItemArea from './LikeCollectItemArea';

const MessageList = ({ messages }: { messages: LikeCollectMessage[] }) => {
  const renderItem = ({ item }: { item: LikeCollectMessage }) => (
    <LikeCollectItemArea
      message={item}
      onPress={handleMessagePress}
      onUserPress={handleUserPress}
    />
  );

  return (
    <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};
```

## 🎨 样式定制

### 主要样式常量

```typescript
// 缩略图尺寸
THUMBNAIL_SIZE: { width: 48, height: 48 }

// 操作图标尺寸
ACTION_ICON_SIZE: { width: 20, height: 20, fontSize: 12 }

// 操作类型配置
ACTION_CONFIG: {
  like: { icon: '💖', text: '点赞了你的评论' },
  collect: { icon: '⭐', text: '收藏了你的作品' }
}
```

### 布局特点

- **整体高度**：使用 `STYLES.SIZES.MESSAGE_ITEM_HEIGHT`
- **水平间距**：使用 `STYLES.SPACING.LG` (16px)
- **垂直间距**：使用 `STYLES.SPACING.MD` (12px)
- **头像间距**：右侧 `STYLES.SPACING.LG` 间距

## 🔧 工具函数

### formatTime(timestamp: string)
智能时间格式化函数：
- 1分钟内：显示"刚刚"
- 1小时内：显示"X分钟前"
- 24小时内：显示"X小时前"
- 超过24小时：显示"MM-DD"格式

### getActionText(actionType)
根据操作类型返回相应的文本描述

### getActionIcon(actionType)
根据操作类型返回相应的图标

## ⚠️ 注意事项

1. **图片处理**：使用 `defaultSource` 处理图片加载失败
2. **文本截断**：内容预览限制为2行显示
3. **点击区域**：确保足够的点击区域大小
4. **性能优化**：使用 `activeOpacity` 提供视觉反馈
5. **类型安全**：严格的 TypeScript 类型检查

## 🔗 相关组件

- **UserAvatar**：用户头像组件
- **LikeCollectScreen**：父级页面组件
- **MessageCenterScreen**：消息中心主页面

这个组件区域遵循了 UNIVERSAL_COMPONENT_ARCHITECTURE_CORE 的标准，提供了清晰的职责分离和优秀的用户体验。

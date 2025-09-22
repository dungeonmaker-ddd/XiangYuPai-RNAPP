# Message 页面组

## 📖 概述

Message 页面组是应用的消息系统核心模块，包含消息中心、点赞收藏、私聊功能等相关页面，采用层级化页面组架构。

## 🏗️ 架构结构

```
src/pages/Message/                                  # Message 页面组
├── index.ts                                        # 页面组入口文件
├── types.ts                                        # 页面组类型定义
├── constants.ts                                    # 页面组常量配置
├── README.md                                       # 页面组文档
│
├── MainPage/                                       # 主页面 - 消息中心
│   ├── index.tsx                                   # 主页面实现（从 MessageCenterScreen.tsx 迁移）
│   ├── types.ts                                    # 主页面类型定义
│   ├── constants.ts                                # 主页面常量配置
│   ├── README.md                                   # 主页面文档
│   │
│   ├── MessageHeaderArea/                          # 消息头部区域
│   ├── MessageCategoryArea/                        # 消息分类区域
│   ├── RecentChatListArea/                         # 最近聊天列表区域
│   └── components/                                 # ⚠️ 待重构的组件目录
│       ├── MessageCategoryGrid.tsx                 # 消息分类网格
│       ├── MessageHeader.tsx                       # 消息头部
│       ├── RecentChatList.tsx                      # 最近聊天列表
│       ├── UserAvatar.tsx                          # 用户头像
│       ├── functionBtn/                            # 功能按钮图标
│       └── title/                                  # 标题相关图标
│
├── LikeCollectPage/                                # 点赞收藏页面
│   ├── index.tsx                                   # 点赞收藏页面实现（从 LikeCollectScreen.tsx 迁移）
│   ├── types.ts                                    # 点赞收藏页面类型定义
│   ├── constants.ts                                # 点赞收藏页面常量配置
│   ├── README.md                                   # 点赞收藏页面文档
│   │
│   └── components/                                 # ⚠️ 待重构的组件目录
│       └── LikeCollectItem.tsx                     # 点赞收藏项组件
│
├── PrivateChatPage/                                # 私聊页面
│   ├── index.tsx                                   # 私聊页面实现（从 PrivateChatScreen.tsx 迁移）
│   ├── types.ts                                    # 私聊页面类型定义
│   ├── constants.ts                                # 私聊页面常量配置
│   ├── README.md                                   # 私聊页面文档
│   │
│   ├── components/                                 # ⚠️ 待重构的组件目录
│   │   ├── ChatHeader.tsx                          # 聊天头部
│   │   ├── InputArea.tsx                           # 输入区域
│   │   ├── MessageBubble.tsx                       # 消息气泡
│   │   ├── MessageList.tsx                         # 消息列表
│   │   └── MessageBubble.example.tsx               # 消息气泡示例
│   │
│   └── pchat/                                      # 私聊相关图标资源
│       ├── 点赞前.png
│       ├── 立刻拍照.png
│       ├── 返回上一页.png
│       └── 选择图片.png
│
├── useMessage.ts                                   # 页面组主状态管理
├── useMessageData.ts                               # 页面组数据状态管理
└── navigateMessageFlow.ts                         # 页面组导航流程管理
```

## 🎯 页面说明

### 📱 MainPage - 消息中心主页面
- **功能**: 消息中心展示，包含消息分类、最近聊天列表等
- **位置**: `./MainPage/`
- **入口**: `index.tsx`（从 `MessageCenterScreen.tsx` 迁移）
- **原始位置**: `src/screens/message/`

### 👍 LikeCollectPage - 点赞收藏页面
- **功能**: 点赞和收藏消息展示
- **位置**: `./LikeCollectPage/`
- **入口**: `index.tsx`（从 `LikeCollectScreen.tsx` 迁移）
- **原始位置**: `src/screens/message-like-collect/`

### 💬 PrivateChatPage - 私聊页面
- **功能**: 一对一私聊功能，包含消息发送、接收、表情、图片等
- **位置**: `./PrivateChatPage/`
- **入口**: `index.tsx`（从 `PrivateChatScreen.tsx` 迁移）
- **原始位置**: `src/screens/message-private-chat/`

## 🔄 迁移状态

### ✅ 已完成
- [x] 基础目录结构创建
- [x] 主页面内容迁移 (`src/screens/message` → `./MainPage/`)
- [x] 点赞收藏页面内容迁移 (`src/screens/message-like-collect` → `./LikeCollectPage/`)
- [x] 私聊页面内容迁移 (`src/screens/message-private-chat` → `./PrivateChatPage/`)
- [x] 页面组入口文件创建
- [x] 页面组基础架构文件创建
- [x] 页面组状态管理层创建
- [x] 页面组导航层创建

### 🔄 进行中
- [ ] 移除 `components/` 中间层级（需要重构为组件区域）
- [ ] 导入路径更新
- [ ] 功能测试验证

### 📋 待完成
- [ ] 组件区域重构（将 `components/` 下的组件重构为组件区域）
- [ ] API接口层完善（实时消息、聊天接口等）
- [ ] WebSocket 连接管理
- [ ] 消息缓存和离线存储
- [ ] 文档完善

## ⚠️ 重构注意事项

### 需要重构的 `components/` 目录

当前仍存在 `components/` 中间层级，需要按照新架构标准重构：

#### MainPage 组件重构计划
```
MainPage/components/ → 重构为组件区域：
├── MessageCategoryGrid.tsx → MessageCategoryArea/
├── MessageHeader.tsx → MessageHeaderArea/
├── RecentChatList.tsx → RecentChatListArea/
├── UserAvatar.tsx → SharedComponents/UserAvatarArea/
└── [图标资源] → 对应组件区域内
```

#### LikeCollectPage 组件重构计划
```
LikeCollectPage/components/ → 重构为组件区域：
└── LikeCollectItem.tsx → LikeCollectItemArea/
```

#### PrivateChatPage 组件重构计划
```
PrivateChatPage/components/ → 重构为组件区域：
├── ChatHeader.tsx → ChatHeaderArea/
├── InputArea.tsx → InputArea/（已符合命名）
├── MessageBubble.tsx → MessageBubbleArea/
├── MessageList.tsx → MessageListArea/
└── MessageBubble.example.tsx → MessageBubbleArea/examples/
```

## 🚀 使用方式

### 导入页面组件
```typescript
// 导入主页面
import { MessageMainPage } from '@/pages/Message';

// 导入子页面
import { MessageLikeCollectPage, MessagePrivateChatPage } from '@/pages/Message';

// 导入类型和常量
import { MessageNavigationParams, MESSAGE_ROUTES, MESSAGE_TYPES } from '@/pages/Message';

// 导入状态管理
import { useMessage, useMessageData, navigateMessageFlow } from '@/pages/Message';
```

### 状态管理使用
```typescript
const MyComponent = () => {
  // 使用页面组状态管理
  const {
    unreadCount,
    currentChatId,
    setCurrentChatId,
    incrementUnreadCount,
  } = useMessage();

  // 使用数据状态管理
  const {
    messages,
    chatSessions,
    fetchMessages,
    markMessageAsRead,
  } = useMessageData();

  // 处理消息点击
  const handleMessageClick = (messageId: string, messageType: string, targetId?: string) => {
    markMessageAsRead(messageId);
    navigateMessageFlow.handleMessageClick(messageId, messageType, targetId);
  };

  return (
    // 组件JSX
  );
};
```

### 导航使用
```typescript
// 导航到各个页面
navigateMessageFlow.toMain();
navigateMessageFlow.toLikeCollect({ messageType: 'like' });
navigateMessageFlow.toPrivateChat({ userId: 'user123', userName: '用户名' });

// 复合导航操作
navigateMessageFlow.openChatWithUser('user123', '用户名');
navigateMessageFlow.viewLikeMessages();
navigateMessageFlow.handleMessageClick('msg1', 'like', 'post123');
```

## 📝 注意事项

1. **架构标准**: 严格遵循 `UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md` 标准
2. **实时通信**: 需要集成 WebSocket 或类似实时通信机制
3. **消息缓存**: 考虑本地存储和离线消息处理
4. **状态同步**: 多页面间的消息状态需要同步
5. **性能优化**: 大量消息列表的虚拟化渲染
6. **组件重构**: 需要将现有 `components/` 重构为组件区域架构

## 🔗 相关文档

- [UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md](../../.cursor/rules/UNIVERSAL_COMPONENT_ARCHITECTURE_CORE.md)
- [MainPage README](./MainPage/README.md)
- [LikeCollectPage README](./LikeCollectPage/README.md)
- [PrivateChatPage README](./PrivateChatPage/README.md)
- [消息系统模块架构设计.md](./MainPage/消息系统模块架构设计.md)

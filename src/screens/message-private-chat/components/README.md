# MessageBubble 组件重构说明

## 重构概述

根据您的需求，我们将 MessageBubble 组件重构为支持多种消息类型的系统，特别是添加了"动态消息"类型，该类型复用了 UserCard 组件中的动态展示逻辑。

## 新增功能

### 1. 扩展消息类型系统

```typescript
// 新的消息类型定义
export interface ExtendedChatMessage extends Omit<ChatMessage, 'type'> {
  type: 'text' | 'image' | 'dynamic';  // 新增 'dynamic' 类型
  dynamicContent?: DynamicContent;     // 动态内容数据
}

// 动态内容数据结构
export interface DynamicContent {
  id: string;
  photos: string[];
  title: string;
  likes: number;
  timestamp: string;
}
```

### 2. 动态消息渲染功能

- **可展开/收起**：点击标题可以展开或收起完整的动态内容
- **图片网格展示**：类似 UserCard 的动态展示，支持最多显示3张图片预览
- **互动数据覆盖**：每张图片显示点赞数等互动信息
- **智能截断**：标题过长时自动截断并显示省略号

### 3. 交互增强

```typescript
interface MessageBubbleProps {
  message: ExtendedChatMessage;
  userInfo: User;
  onPress?: (message: ExtendedChatMessage) => void;
  onDynamicPress?: (dynamicId: string, photoIndex: number) => void;  // 新增
}
```

## 使用示例

### 基本用法

```typescript
import MessageBubble, { ExtendedChatMessage, DynamicContent } from './MessageBubble';

// 动态消息示例
const dynamicMessage: ExtendedChatMessage = {
  id: 'msg_1',
  senderId: '1',
  receiverId: '2',
  content: '分享了一个动态',
  type: 'dynamic',
  timestamp: '2024-01-15T10:25:00Z',
  status: 'read',
  isFromMe: false,
  dynamicContent: {
    id: 'dynamic_1',
    photos: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg'
    ],
    title: '今天的美好时光 ✨',
    likes: 88,
    timestamp: '2024-01-15T10:25:00Z'
  }
};

// 组件使用
<MessageBubble
  message={dynamicMessage}
  userInfo={userInfo}
  onPress={(message) => console.log('Message pressed:', message.id)}
  onDynamicPress={(dynamicId, photoIndex) => console.log('Photo pressed:', dynamicId, photoIndex)}
/>
```

## 设计特点

### 1. 符合模块化原则
- **功能内聚**：所有消息渲染逻辑集中在单个组件内
- **强隔离**：不依赖外部共享工具，所有需要的工具函数都在组件内部
- **YAGNI原则**：只实现当前需要的功能，避免过度设计

### 2. 代码结构清晰
```
MessageBubble.tsx (403 lines) - 符合300-600行标准
├─ 1. Imports & Types (31 lines)
│   ├─ React/RN 核心库导入
│   ├─ 扩展消息类型定义
│   └─ Props 接口定义
│
├─ 2. Utils & Helpers (25 lines)
│   ├─ formatTime() - 时间格式化
│   ├─ getStatusIcon() - 状态图标映射
│   └─ truncateText() - 文本截断
│
├─ 3. Render Functions (120 lines)
│   ├─ renderTextMessage() - 文本消息渲染
│   ├─ renderImageMessage() - 图片消息渲染
│   ├─ renderDynamicMessage() - 动态消息渲染 (新增)
│   └─ renderMessageContent() - 消息分发器
│
├─ 4. Main Component (70 lines)
│   └─ MessageBubble 主组件结构
│
├─ 5. Styles (155 lines)
│   ├─ 原有样式定义
│   └─ 动态消息样式 (新增60行)
│
└─ 6. Exports (2 lines)
```

### 3. 样式复用与扩展
- **继承原有样式**：动态消息样式基于现有气泡样式扩展
- **响应式设计**：图片网格自适应不同屏幕尺寸
- **视觉一致性**：保持与原有消息类型的视觉风格统一

## 技术实现

### 1. 状态管理
```typescript
const [showFullDynamic, setShowFullDynamic] = useState(false);
```
每个动态消息独立管理其展开/收起状态。

### 2. 条件渲染
```typescript
const displayPhotos = showFullDynamic 
  ? dynamicContent.photos 
  : dynamicContent.photos.slice(0, 3);
```
根据展开状态决定显示的图片数量。

### 3. 事件处理
```typescript
// 动态标题点击 - 展开/收起
onPress={() => setShowFullDynamic(!showFullDynamic)}

// 图片点击 - 查看大图
onPress={() => onDynamicPress && onDynamicPress(dynamicContent.id, index)}
```

## 兼容性

- **向后兼容**：原有的文本和图片消息功能保持不变
- **类型安全**：使用 TypeScript 确保类型安全
- **渐进式升级**：可以逐步将现有消息升级为新的类型系统

## 文件结构

```
src/screens/message/private-chat/components/
├── MessageBubble.tsx           # 重构后的主组件
├── MessageBubble.example.tsx   # 使用示例
└── README.md                   # 本说明文档
```

## 下一步扩展

1. **更多消息类型**：可以继续扩展支持语音、视频、位置等消息类型
2. **动画效果**：为展开/收起添加平滑的动画过渡
3. **离线支持**：为动态消息添加离线缓存功能
4. **无障碍支持**：添加更完善的无障碍访问支持

这个重构完全符合您提到的按功能域拆分的原则，保持了代码的内聚性和独立性，同时实现了您要求的动态消息功能。

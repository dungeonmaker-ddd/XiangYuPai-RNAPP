# 私聊对话页面 (PrivateChatPage)

## 📋 页面概述

私聊对话页面是消息系统的核心功能页面，提供一对一实时聊天功能。支持文本消息、图片分享、动态内容分享等多种消息类型，具备完整的聊天体验。

## 🏗️ 架构设计

### 📁 文件结构
```
PrivateChatPage/
├── index.ts                 # 页面入口文件
├── index.tsx               # 页面主组件
├── types.ts                # 页面类型定义
├── constants.ts            # 页面常量配置
├── README.md               # 页面文档(本文件)
├── ChatHeaderArea/         # 聊天头部区域
│   └── index.tsx           # 头部组件
├── MessageListArea/        # 消息列表区域
│   └── index.tsx           # 消息列表组件
├── MessageBubbleArea/      # 消息气泡区域
│   └── index.tsx           # 消息气泡组件
├── InputArea/              # 输入区域
│   └── index.tsx           # 输入组件
└── components/             # 其他组件
```

### 🔧 核心功能

1. **实时聊天**
   - 文本消息发送和接收
   - 消息状态管理（发送中、已送达、已读）
   - 实时消息同步

2. **多媒体支持**
   - 图片选择和发送
   - 相机拍照功能
   - 动态内容分享

3. **交互体验**
   - 键盘自适应布局
   - 消息重发机制
   - 滚动到底部功能

4. **用户状态**
   - 在线状态显示
   - 正在输入提示
   - 最后活跃时间

## 📊 数据流

### 核心数据结构
```typescript
interface ExtendedChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'dynamic' | 'system';
  timestamp: string;
  status: MessageStatus;
  isFromMe: boolean;
  isRead: boolean;
  dynamicContent?: DynamicContent;
  imageContent?: ImageContent;
}

interface DynamicContent {
  id: string;
  photos: string[];
  title: string;
  likes: number;
  timestamp: string;
}
```

### 状态管理
- **聊天状态**: 消息列表、发送状态、连接状态
- **输入状态**: 输入文本、键盘状态、附件模式
- **UI状态**: 滚动位置、未读计数、加载状态

## 🎯 API 接口

### 获取聊天历史
```typescript
GET /api/chat/history
Parameters: {
  chatId: string;
  page: number;
  pageSize: number;
  beforeMessageId?: string;
}
Response: {
  messages: ExtendedChatMessage[];
  hasMore: boolean;
  totalCount: number;
}
```

### 发送消息
```typescript
POST /api/chat/send
Body: {
  chatId: string;
  content: string;
  type: MessageType;
  replyToMessageId?: string;
  dynamicContent?: DynamicContent;
}
Response: {
  message: ExtendedChatMessage;
  tempId: string;
}
```

### 标记已读
```typescript
POST /api/chat/mark-read
Body: {
  chatId: string;
  messageIds: string[];
}
```

### 上传图片
```typescript
POST /api/chat/upload-image
Form-Data: {
  file: File;
  chatId: string;
}
Response: {
  url: string;
  thumbnail?: string;
  metadata: {
    width: number;
    height: number;
    size: number;
  };
}
```

## 🎨 组件架构

### 主要组件

#### 1. ChatHeaderArea
- **功能**: 显示聊天对象信息、在线状态、返回导航
- **Props**: `userInfo`, `onBack`, `onUserPress`
- **状态**: 用户在线状态、正在输入状态

#### 2. MessageListArea
- **功能**: 消息列表展示、分页加载、消息管理
- **Props**: `messages`, `userInfo`, `onLoadMore`
- **状态**: 消息列表、加载状态、滚动位置

#### 3. MessageBubbleArea
- **功能**: 单条消息渲染、不同类型消息展示
- **Props**: `message`, `isFromMe`, `onPress`
- **支持**: 文本、图片、动态内容、系统消息

#### 4. InputArea
- **功能**: 消息输入、附件选择、发送控制
- **Props**: `value`, `onSend`, `onImagePicker`
- **状态**: 输入文本、键盘状态、发送状态

### 样式规范
```typescript
// 消息气泡样式
BUBBLE_COLORS = {
  FROM_ME: {
    BACKGROUND: '#8A2BE2',
    TEXT: '#FFFFFF',
  },
  FROM_OTHER: {
    BACKGROUND: '#F5F5F5',
    TEXT: '#000000',
  }
}

// 布局常量
UI_CONSTANTS = {
  HEADER_HEIGHT: 56,
  BUBBLE_MAX_WIDTH: 0.75,
  INPUT_AREA_HEIGHT: 60,
  MESSAGE_SPACING: 8,
}
```

## 🔄 消息生命周期

### 发送流程
1. **用户输入** → 创建临时消息
2. **显示发送中** → 调用发送API
3. **发送成功** → 更新消息状态
4. **发送失败** → 显示重试按钮

### 接收流程
1. **WebSocket推送** → 接收新消息
2. **添加到列表** → 更新UI显示
3. **标记已读** → 调用已读API
4. **状态同步** → 更新消息状态

## 📱 用户体验优化

### 交互设计
- **键盘适配**: 自动调整布局避免遮挡
- **手势操作**: 支持下拉刷新、上拉加载
- **反馈机制**: 清晰的加载和状态指示

### 性能优化
- **虚拟列表**: 大量消息时使用虚拟滚动
- **图片优化**: 缩略图预览、懒加载
- **内存管理**: 及时清理不可见消息
- **网络优化**: 消息合并发送、重连机制

### 错误处理
- **网络异常**: 自动重试和离线缓存
- **发送失败**: 重发机制和错误提示
- **资源加载**: 降级处理和错误占位

## 🧪 测试策略

### 单元测试
```typescript
// 消息组件测试
describe('MessageBubble', () => {
  it('should render text message correctly', () => {
    // 测试文本消息渲染
  });
  
  it('should handle dynamic content', () => {
    // 测试动态内容渲染
  });
});

// 输入组件测试
describe('InputArea', () => {
  it('should handle text input', () => {
    // 测试文本输入功能
  });
  
  it('should trigger send on submit', () => {
    // 测试发送功能
  });
});
```

### 集成测试
- API调用和响应处理
- 消息发送和接收流程
- 键盘交互和布局适配
- 错误场景和重试机制

## 🔧 开发指南

### 环境配置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 运行测试
npm test
```

### 代码规范
- 遵循8段式代码结构
- 严格的TypeScript类型检查
- 统一的命名规范和注释

### 调试工具
- React DevTools
- Network监控
- 性能分析工具
- 消息状态调试

## 📝 更新日志

### v1.2.0 (2024-12-19)
- ✅ 完整的聊天功能实现
- ✅ 动态内容分享支持
- ✅ 键盘自适应布局
- ✅ 消息状态管理
- ✅ 错误处理和重试机制

### v1.1.0
- ✅ 图片发送功能
- ✅ 消息重发机制
- ✅ 用户状态显示

### v1.0.0
- ✅ 基础聊天功能
- ✅ 文本消息发送
- ✅ 消息列表展示

### 待实现功能
- 🔄 语音消息支持
- 🔄 消息转发功能
- 🔄 聊天记录搜索
- 🔄 消息加密功能
- 🔄 群聊支持

## 🤝 贡献指南

1. **架构标准**: 遵循Universal Component Architecture Core
2. **代码质量**: 保持高质量的TypeScript代码
3. **测试覆盖**: 编写完整的单元和集成测试
4. **文档更新**: 及时更新相关文档
5. **性能考虑**: 注意内存和网络性能优化

## 📞 技术支持

- **开发团队**: 联系内部开发团队
- **问题反馈**: 通过Issue系统提交
- **功能建议**: 产品需求管理系统

## 🔐 安全考虑

- **数据加密**: 敏感消息内容加密传输
- **身份验证**: 严格的用户身份验证
- **权限控制**: 细粒度的操作权限管理
- **审计日志**: 关键操作的审计追踪

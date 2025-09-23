# 赞和收藏页面 (LikeCollectPage)

## 📋 页面概述

赞和收藏页面是消息系统的子功能页面，专门用于展示用户收到的点赞和收藏通知消息。用户可以查看哪些人对自己的作品进行了点赞或收藏操作。

## 🏗️ 架构设计

### 📁 文件结构
```
LikeCollectPage/
├── index.ts                 # 页面入口文件
├── index.tsx               # 页面主组件
├── types.ts                # 页面类型定义
├── constants.ts            # 页面常量配置
├── README.md               # 页面文档(本文件)
└── LikeCollectItemArea/    # 消息项组件区域
    ├── index.tsx           # 消息项主组件
    ├── types.ts            # 消息项类型
    ├── constants.ts        # 消息项常量
    └── README.md           # 消息项文档
```

### 🔧 核心功能

1. **消息列表展示**
   - 显示点赞和收藏消息列表
   - 支持下拉刷新和上拉加载更多
   - 消息状态管理（已读/未读）

2. **交互功能**
   - 点击消息查看相关内容详情
   - 点击用户头像查看用户主页
   - 支持清空所有消息功能

3. **UI特性**
   - 响应式布局设计
   - 流畅的动画效果
   - 空状态友好提示

## 📊 数据流

### 数据结构
```typescript
interface LikeCollectMessage {
  id: string;
  user: User;                    # 执行操作的用户
  actionType: 'like' | 'collect'; # 操作类型
  targetContent: {               # 目标内容
    id: string;
    type: 'post' | 'comment';
    title: string;
    thumbnail?: string;
  };
  timestamp: string;
  isRead: boolean;
}
```

### 状态管理
- **本地状态**: 消息列表、加载状态、刷新状态
- **父级状态**: 通过Message页面组统一状态管理
- **持久化**: 已读状态本地缓存

## 🎯 API 接口

### 获取消息列表
```typescript
GET /api/messages/like-collect
Parameters: {
  page: number;
  pageSize: number;
  actionType?: 'like' | 'collect';
}
Response: {
  messages: LikeCollectMessage[];
  total: number;
  hasMore: boolean;
}
```

### 标记消息已读
```typescript
POST /api/messages/mark-read
Body: {
  messageId: string;
}
```

### 清空所有消息
```typescript
DELETE /api/messages/clear-all
Body: {
  actionType?: 'like' | 'collect';
}
```

## 🎨 UI 组件

### 主要组件
- **LikeCollectScreen**: 页面主容器
- **Header**: 页面头部导航
- **LikeCollectItemArea**: 消息项组件
- **EmptyState**: 空状态组件

### 样式规范
- 遵循Material Design规范
- 使用统一的颜色系统和间距规范
- 支持深色模式适配

## 🔄 生命周期

1. **页面初始化**
   - 加载消息列表数据
   - 初始化状态管理
   - 设置事件监听

2. **数据更新**
   - 支持实时消息推送
   - 定期刷新未读消息
   - 页面可见时自动刷新

3. **页面销毁**
   - 清理事件监听
   - 保存页面状态
   - 释放资源

## 📱 用户体验

### 交互设计
- **点击反馈**: 所有可交互元素提供视觉反馈
- **加载状态**: 明确的加载指示器
- **错误处理**: 友好的错误提示和重试机制

### 性能优化
- **虚拟化列表**: 大量数据时使用虚拟滚动
- **图片懒加载**: 头像和缩略图按需加载
- **缓存策略**: 智能缓存减少网络请求

## 🧪 测试策略

### 单元测试
- 组件渲染测试
- 状态管理测试
- 工具函数测试

### 集成测试
- API调用测试
- 用户交互流程测试
- 错误场景测试

## 🔧 开发指南

### 本地开发
```bash
# 启动开发服务器
npm start

# 运行测试
npm test

# 构建生产版本
npm run build
```

### 代码规范
- 遵循8段式代码结构
- 使用TypeScript严格模式
- 统一的命名规范和注释标准

## 📝 更新日志

### v1.0.0 (2024-12-19)
- ✅ 基础页面结构实现
- ✅ 消息列表展示功能
- ✅ 基础交互功能
- ✅ 响应式布局适配

### 待实现功能
- 🔄 消息筛选功能
- 🔄 批量操作功能
- 🔄 消息搜索功能
- 🔄 推送通知集成

## 🤝 贡献指南

1. 遵循Universal Component Architecture Core标准
2. 保持代码风格一致性
3. 编写完整的类型定义
4. 添加相应的测试用例
5. 更新相关文档

## 📞 技术支持

如有问题或建议，请联系开发团队或提交Issue。

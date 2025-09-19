# 互动操作栏组件 (InteractionActionBar)

## 📋 概述

InteractionActionBar 是一个功能完整的互动操作栏组件，重构自原有的 CommentInput 组件。它集成了评论输入、点赞、收藏、分享等多种互动功能，采用8段式架构标准设计，提供了流畅的用户体验和完整的功能支持。

## ✨ 主要特性

### 🎯 核心功能
- **评论输入**: 支持多行文本输入、表情选择、媒体添加
- **快捷互动**: 点赞、收藏、分享三大核心互动功能
- **实时反馈**: 乐观更新UI，提供即时的用户反馈
- **动画效果**: 丰富的交互动画，提升用户体验

### 📱 界面特性
- **响应式设计**: 适配不同屏幕尺寸
- **主题一致**: 符合设计规范的视觉样式
- **键盘适配**: 智能键盘弹出/收起处理
- **安全区域**: 适配iPhone底部安全区域

### 🔧 技术特性
- **8段式架构**: 清晰的代码组织结构
- **TypeScript**: 完整的类型定义
- **性能优化**: 使用memo、动画使用native driver
- **错误处理**: 完善的错误边界和异常处理

## 🏗️ 组件架构

```
InteractionActionBar
├── 评论输入区域 (60%)
│   ├── 输入框 (多行文本支持)
│   ├── 操作按钮 (表情、媒体)
│   └── 发送按钮
├── 快捷操作区域 (40%)
│   ├── 点赞按钮 (带计数)
│   ├── 收藏按钮 (带计数)
│   └── 分享按钮 (带计数)
├── 表情面板 (可选显示)
└── 分享面板 (Modal弹窗)
```

## 📖 使用方法

### 基础使用

```tsx
import InteractionActionBar from './components/CommentInput';
import { InteractionActionBarProps } from './types';

const [commentText, setCommentText] = useState('');

const handleCommentSubmit = () => {
  console.log('发布评论:', commentText);
  setCommentText('');
};

const handleLike = (isLiked: boolean, newCount: number) => {
  console.log('点赞状态:', isLiked, '新计数:', newCount);
};

<InteractionActionBar
  value={commentText}
  onValueChange={setCommentText}
  onSubmit={handleCommentSubmit}
  onLike={handleLike}
  initialLikeCount={28}
  initialIsLiked={false}
/>
```

### 完整配置

```tsx
const interactionProps: InteractionActionBarProps = {
  // 评论相关
  value: commentText,
  placeholder: '写评论...',
  loading: isSubmitting,
  onValueChange: setCommentText,
  onSubmit: handleCommentSubmit,
  replyToUser: 'username', // 可选：回复用户
  onCancel: handleCancel,  // 可选：取消回复
  
  // 互动数据
  initialLikeCount: 28,
  initialCollectCount: 15,
  initialShareCount: 8,
  initialIsLiked: false,
  initialIsCollected: false,
  
  // 互动回调
  onLike: handleLike,
  onCollect: handleCollect,
  onShare: handleShare,
  
  // 分享配置
  shareContent: {
    title: '精彩内容分享',
    description: '来看看这个有趣的内容',
    url: 'https://example.com/content/123',
    imageUrl: 'https://example.com/image.jpg',
  },
};

<InteractionActionBar {...interactionProps} />
```

## 🎨 样式设计

### 颜色规范
- **主背景**: `#FFFFFF` (白色)
- **输入框背景**: `#F8F8F8` (浅灰色)
- **边框颜色**: `#E8E8E8` (浅灰色)
- **主要操作色**: `#8A2BE2` (紫色)
- **点赞激活色**: `#FF4757` (红色)
- **收藏激活色**: `#FFA502` (金色)

### 尺寸规范
- **操作栏高度**: 64px
- **操作按钮尺寸**: 48x48px
- **图标尺寸**: 24x24px
- **输入框最小高度**: 40px
- **输入框最大高度**: 120px (小屏幕80px)

## 🎬 动画效果

### 点赞动画
- **触发**: 点击点赞按钮
- **效果**: 0.3s心跳动画，缩放1.2倍后回弹
- **视觉**: 空心❤️ ↔ 实心❤️，红色渐变

### 收藏动画
- **触发**: 点击收藏按钮
- **效果**: 0.4s旋转+缩放动画
- **视觉**: 空心☆ ↔ 实心⭐，金色渐变

### 键盘动画
- **触发**: 键盘弹出/收起
- **效果**: 平滑的位置过渡动画
- **适配**: iOS使用键盘动画时长，Android使用固定时长

## 📱 分享功能

### 支持平台
- **微信**: 好友分享
- **朋友圈**: 朋友圈分享
- **QQ**: QQ好友分享
- **微博**: 微博分享
- **复制链接**: 复制到剪贴板
- **系统分享**: 调用系统分享菜单

### 分享配置
```tsx
shareContent: {
  title: '分享标题',
  description: '分享描述',
  url: '分享链接',
  imageUrl: '分享图片', // 可选
}
```

## 🔄 状态管理

### 本地状态
- `showEmojiPanel`: 表情面板显示状态
- `showSharePanel`: 分享面板显示状态
- `inputHeight`: 输入框动态高度
- `keyboardHeight`: 键盘高度
- `isLiked/isCollected`: 互动状态
- `likeCount/collectCount/shareCount`: 计数状态

### 外部控制
通过props传入初始状态和回调函数，支持外部状态管理系统集成。

## 🛠️ 自定义扩展

### 添加新的互动功能
1. 在`InteractionActionBarProps`中添加相关props
2. 在`LocalState`中添加状态管理
3. 在UI部分添加按钮组件
4. 在样式中添加对应样式定义

### 修改视觉样式
1. 更新`Constants & Config`部分的尺寸常量
2. 修改`Styles`部分的颜色和尺寸定义
3. 保持8段式架构的代码组织

## 🧪 测试建议

### 功能测试
- 评论输入和发送功能
- 点赞/取消点赞状态切换
- 收藏/取消收藏状态切换
- 分享面板显示和平台选择
- 表情选择和插入

### 交互测试
- 键盘弹出时界面适配
- 动画效果流畅性
- 触摸反馈准确性
- 不同屏幕尺寸适配

### 性能测试
- 快速点击响应性
- 动画性能表现
- 内存使用情况

## 📝 注意事项

1. **权限检查**: 使用前确保用户已登录
2. **网络处理**: 互动操作需要网络请求，注意错误处理
3. **埋点统计**: 建议在关键操作点添加数据埋点
4. **无障碍支持**: 组件已包含基础的无障碍标签
5. **平台适配**: 某些功能(如震动)在不同平台表现不同

## 🔗 相关文档

- [发型详情页面架构设计](../README.md)
- [组件类型定义](../types/index.ts)
- [使用示例](./InteractionActionBarExample.tsx)

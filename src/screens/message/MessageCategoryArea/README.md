# 消息分类功能区域组件

> 主要内容区域 - 4宫格消息分类功能布局

## 📁 组件结构

```
MessageCategoryArea/
├── index.tsx                   # 主组件文件
└── README.md                   # 组件文档
```

## 🎯 功能特性

- ✅ **4宫格布局**：赞和收藏、评论、粉丝、系统通知
- ✅ **功能图标显示**：60x60px PNG图标
- ✅ **未读角标**：动态显示未读消息数量
- ✅ **点击交互**：卡片点击反馈和跳转

## 🎨 设计特点

### 布局结构
- **网格布局**：4个等宽卡片，水平居中分布
- **卡片尺寸**：72x72px，包含图标和标题
- **容器高度**：120px固定高度

### 视觉样式
- **图标样式**：60x60px PNG图片，居中显示
- **角标样式**：红色圆形，最小16x16px
- **标题样式**：14sp中等字重，居中对齐

### 交互效果
- **点击反馈**：activeOpacity 0.8
- **角标动画**：数量变化时的动态效果
- **图标映射**：自动匹配对应的功能图标

## 📋 使用方法

```typescript
import MessageCategoryArea from './MessageCategoryArea';

<MessageCategoryArea
  categories={categories}
  onCategoryPress={handleCategoryPress}
/>
```

## 🔧 Props 接口

```typescript
interface MessageCategoryAreaProps {
  categories: MessageCategory[];                    // 分类数据数组
  onCategoryPress: (category: MessageCategory) => void;  // 分类点击回调
}
```

## 📊 数据结构

```typescript
interface MessageCategory {
  id: string;           // 分类ID
  type: MessageType;    // 分类类型
  title: string;        // 分类标题
  icon: string;         // 图标标识
  iconColor: string;    // 图标颜色
  unreadCount: number;  // 未读数量
  route: string;        // 路由名称
}
```

## 🎯 子组件

### CategoryCard
- **功能**：单个分类卡片
- **包含**：图标容器 + 未读角标 + 标题文字

### UnreadBadge  
- **功能**：未读消息角标
- **特性**：动态显示，99+截断，0时隐藏

---

*遵循通用组件模块化架构核心标准*

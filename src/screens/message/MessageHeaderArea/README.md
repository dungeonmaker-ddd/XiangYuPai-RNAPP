# 消息导航栏区域组件

> 顶部布局区域 - 固定头部导航栏

## 📁 组件结构

```
MessageHeaderArea/
├── index.tsx                   # 主组件文件
└── README.md                   # 组件文档
```

## 🎯 功能特性

- ✅ **固定头部布局**：高度56px，白色背景
- ✅ **标题居中显示**：绝对居中的页面标题
- ✅ **右侧操作按钮**：清理按钮（可选显示）
- ✅ **响应式布局**：左右等宽，保持标题居中

## 🎨 设计特点

### 布局结构
- **左侧占位区域**：flex: 1，保持标题居中
- **中间标题区域**：固定宽度，绝对居中
- **右侧操作区域**：flex: 1，左对齐显示按钮

### 视觉样式
- **标题样式**：18sp黑色粗体
- **按钮样式**：22x22px图标，点击反馈
- **边框样式**：底部1px灰色分隔线

## 📋 使用方法

```typescript
import MessageHeaderArea from './MessageHeaderArea';

<MessageHeaderArea
  onClearPress={handleClearPress}
  showClearButton={true}
/>
```

## 🔧 Props 接口

```typescript
interface MessageHeaderAreaProps {
  onClearPress?: () => void;      // 清理按钮点击回调
  showClearButton?: boolean;      // 是否显示清理按钮
}
```

## 📊 组件特性

- **职责单一**：专注于头部导航栏功能
- **高度复用**：可在多个页面使用
- **配置灵活**：支持按钮显示控制
- **交互友好**：按钮点击反馈和动画

---

*遵循通用组件模块化架构核心标准*

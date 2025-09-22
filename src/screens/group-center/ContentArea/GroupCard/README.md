# GroupCard - 组局卡片功能区域

> **复杂的信息卡片实现，包含背景图、发起者信息、活动详情、参与者状态等**

## 功能概述

GroupCard 是组局中心的核心展示组件，以卡片形式展示组局活动的完整信息。

## 组件特性

### 📱 视觉设计
- **背景图展示**：16:9比例背景图 + 渐变遮罩效果
- **发起者头像**：左上角悬浮头像 + 在线状态指示
- **活动类型标识**：右上角类型图标 + 颜色主题
- **信息层次**：标题 + 标签 + 详情 + 参与者的清晰层次

### 🎯 交互功能
- **卡片点击**：整体可点击进入详情页
- **头像点击**：点击查看发起者资料
- **状态反馈**：点击动画和视觉反馈

### 📊 信息展示
- **活动标题**：大字体标题 + 文字截断
- **活动标签**：彩色标签组 + 横向排列
- **时间地点**：图标 + 格式化文字
- **价格信息**：金色突出显示
- **参与者状态**：头像群 + 报名统计

## 使用方式

```tsx
import { GroupCard } from './ContentArea/GroupCard';

<GroupCard
  activity={groupActivity}
  onPress={handleActivityPress}
  onAvatarPress={handleAvatarPress}
/>
```

## Props 说明

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| activity | GroupActivity | ✅ | 组局活动数据 |
| onPress | (activity: GroupActivity) => void | ✅ | 卡片点击回调 |
| onAvatarPress | (user: UserInfo) => void | ❌ | 头像点击回调 |

## 架构实现

### 嵌套功能区域
- **useCardState.ts** - 卡片本地状态管理
- **onCardAction.ts** - 卡片事件处理逻辑
- **processCardData.ts** - 卡片数据处理
- **utilsCard.ts** - 卡片工具函数

### 八段式结构
严格遵循八段式代码结构，确保代码组织清晰可维护。

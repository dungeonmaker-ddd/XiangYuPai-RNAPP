# 🔍 发现页面模块

基于原型图设计的标准化发现页面，实现三维内容发现体系。

## 📁 文件结构

```
src/screens/discover/
├── DiscoverScreen.tsx      # 主页面组件
├── FilterTabs.tsx          # 标签导航组件
├── MasonryLayout.tsx       # 双列瀑布流布局
├── ContentCard.tsx         # 内容卡片组件
├── UserCard.tsx           # 用户卡片组件
├── BottomNavigation.tsx   # 底部导航组件
├── types.ts               # 类型定义
├── constants.ts           # 常量配置
├── index.ts               # 导出索引
└── README.md              # 使用说明
```

## 🎯 核心功能

### 三维内容发现体系
- **关注标签**：展示关注用户的最新动态
- **热门标签**：基于算法推荐的热门内容
- **同城标签**：基于地理位置的本地化内容

### 双列瀑布流布局
- 智能列选择算法
- 精确列宽计算 (167-194px)
- 虚拟滚动优化
- 异步高度测量

### 多媒体内容支持
- 图片内容展示
- 视频内容播放
- 文字动态
- 同城活动卡片

### 社交互动功能
- 点赞/评论/分享
- 用户关注
- 内容举报
- 位置导航

## 🚀 使用方法

### 基础用法

```typescript
import { DiscoverScreen } from './src/screens/discover';

// 在路由中使用
<Stack.Screen 
  name="Discover" 
  component={DiscoverScreen}
  options={{ headerShown: false }}
/>
```

### 组件导入

```typescript
import {
  DiscoverScreen,
  FilterTabs,
  MasonryLayout,
  ContentCard,
  UserCard,
  BottomNavigation
} from './src/screens/discover';
```

### 类型定义

```typescript
import {
  TabType,
  ContentItem,
  ContentType,
  UserInfo,
  LocationInfo
} from './src/screens/discover';
```

## 📐 设计规范

### 布局尺寸
- 瀑布流列宽：动态计算 (最小160px，最大240px)
- 列间距：8px
- 容器边距：左右各16px
- 卡片内边距：12px

### 颜色系统
- 主色调：#8B5CF6 (紫色)
- 渐变色：rgba(115, 127, 225, 1) → rgba(175, 56, 217, 1)
- 文字色：#1F2937 (深灰黑色)
- 辅助色：#6B7280 (中性灰色)

### 字体规范
- 标题：16sp Bold
- 正文：14sp Regular  
- 辅助：12sp Regular
- 字体：PingFang SC

## 🎨 动画效果

### 标签切换动画
- 指示线滑动：0.3s ease-in-out
- 内容淡入淡出：0.2s ease

### 交互反馈动画
- 点赞动画：心形缩放 + 颜色变化
- 按钮点击：轻微缩放反馈
- 卡片加载：骨架屏动画

### 滚动优化
- 虚拟滚动：仅渲染可视区域
- 懒加载：图片延迟加载
- 防抖节流：滚动事件优化

## 📱 响应式适配

### 屏幕尺寸适配
- 超小屏 (<320px)：单列布局
- 小屏 (320-375px)：双列紧凑
- 标准屏 (375-414px)：双列标准
- 大屏 (>414px)：双列宽松

### 安全区域适配
- 状态栏高度自适应
- 底部安全区域适配
- 刘海屏适配

## 🔧 性能优化

### 内存管理
- DOM节点回收
- 图片资源释放
- 事件监听清理

### 网络优化
- 请求防抖
- 分页加载
- 缓存策略

### 渲染优化
- 组件缓存
- 批量更新
- 硬件加速

## 📊 模拟数据

当前使用模拟数据进行展示，包含：
- 随机用户信息
- 多种内容类型
- 模拟互动数据
- 地理位置信息

## 🚀 扩展计划

- [ ] 真实API集成
- [ ] 离线缓存支持  
- [ ] 推送通知
- [ ] AR相机功能
- [ ] 实时定位更新

## 📝 注意事项

1. **权限管理**：使用位置服务需要用户授权
2. **网络状态**：需要检查网络连接状态
3. **内存控制**：大量图片加载时注意内存管理
4. **性能监控**：建议集成性能监控工具

## 🤝 贡献指南

遵循项目的代码规范和设计原则：
- 单文件模块化设计
- 强类型定义
- 响应式布局
- 无障碍支持

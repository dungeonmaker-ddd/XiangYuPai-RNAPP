# HeaderArea - 顶部导航区域

## 功能描述
地区选择页面的顶部导航栏组件，包含返回按钮、页面标题等基础导航元素。

## 组件特性
- ✅ 返回按钮交互
- ✅ 可自定义标题
- ✅ 响应式布局
- ✅ 统一视觉样式

## 使用方法

```tsx
import HeaderArea from './HeaderArea';

<HeaderArea
  title="定位"
  onBackPress={() => navigation.goBack()}
  showBackButton={true}
/>
```

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| title | string | '定位' | 页面标题 |
| onBackPress | function | - | 返回按钮点击回调 |
| showBackButton | boolean | true | 是否显示返回按钮 |

## 设计规范
- 高度：56px（SIZES.headerHeight）
- 背景：白色（COLORS.background）
- 底部边框：浅灰色分割线
- 标题居中，返回按钮左对齐

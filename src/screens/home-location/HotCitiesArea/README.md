# HotCitiesArea - 热门城市区域

## 功能描述
地区选择页面的热门城市选择区域，以网格形式展示预设的热门城市，支持快速选择。

## 组件特性
- ✅ 网格布局展示（4列自适应）
- ✅ 城市选择交互
- ✅ 选中状态高亮
- ✅ 响应式布局

## 使用方法

```tsx
import HotCitiesArea from './HotCitiesArea';

<HotCitiesArea
  cities={hotCities}
  selectedLocation={selectedLocation}
  onCityPress={(city) => handleSelectCity(city)}
/>
```

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| cities | RegionInfo[] | - | 热门城市列表 |
| selectedLocation | RegionInfo \| null | - | 当前选中的位置 |
| onCityPress | function | - | 城市点击回调 |

## 布局规范
- **网格列数**：4列（自适应屏幕宽度）
- **城市卡片**：圆角矩形，统一高度40px
- **间距**：城市卡片间8px间距
- **选中状态**：紫色背景和边框

## 设计说明
- 城市名称超长时自动截断
- 支持触摸反馈效果
- 选中状态实时更新显示

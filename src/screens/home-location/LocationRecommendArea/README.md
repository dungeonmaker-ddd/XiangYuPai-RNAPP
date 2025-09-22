# LocationRecommendArea - 定位推荐区域

## 功能描述
地区选择页面的定位推荐区域，显示当前定位信息和最近访问记录，支持一键获取定位和选择当前位置。

## 组件特性
- ✅ 当前定位显示
- ✅ 定位状态管理（加载中、成功、失败）
- ✅ 一键获取定位
- ✅ 选择当前位置
- ✅ 错误状态展示

## 使用方法

```tsx
import LocationRecommendArea from './LocationRecommendArea';

<LocationRecommendArea
  currentLocation={currentLocation}
  loading={locating}
  error={locationError}
  onCurrentLocationPress={() => handleSelectCurrentLocation()}
  onGetLocationPress={() => handleGetCurrentLocation()}
/>
```

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| currentLocation | CurrentLocationInfo \| null | - | 当前定位信息 |
| loading | boolean | - | 定位加载状态 |
| error | string \| null | - | 定位错误信息 |
| onCurrentLocationPress | function | - | 选择当前位置回调 |
| onGetLocationPress | function | - | 获取定位回调 |

## 状态说明

### 定位状态
- **未定位**：显示"点击获取当前位置"
- **定位中**：显示加载动画和"定位中..."
- **定位成功**：显示城市和区域信息，右侧显示选中图标
- **定位失败**：显示错误信息

### 视觉状态
- **普通状态**：灰色背景，灰色边框
- **已定位状态**：紫色背景，紫色边框，突出显示

## 设计规范
- 区域标题：14px，中等字重
- 卡片内边距：12px
- 图标尺寸：32x32px，圆形背景
- 状态图标：20x20px，绿色背景

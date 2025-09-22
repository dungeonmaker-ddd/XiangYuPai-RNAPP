# RegionListArea - 地区列表区域

## 功能描述
地区选择页面的主要内容区域，包含搜索功能、地区列表和字母索引，支持多种方式快速定位目标地区。

## 组件特性
- ✅ 实时搜索功能
- ✅ 虚拟化长列表
- ✅ 字母索引快速跳转
- ✅ 选中状态管理
- ✅ 性能优化

## 使用方法

```tsx
import RegionListArea from './RegionListArea';

<RegionListArea
  regions={regions}
  selectedLocation={selectedLocation}
  searchQuery={searchQuery}
  activeAlphabet={activeAlphabet}
  onRegionPress={(region) => handleSelectRegion(region)}
  onSearchChange={(query) => handleSearch(query)}
  onAlphabetPress={(letter) => handleAlphabet(letter)}
/>
```

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| regions | RegionInfo[] | - | 地区列表数据 |
| selectedLocation | RegionInfo \| null | - | 当前选中的位置 |
| searchQuery | string | - | 搜索关键词 |
| activeAlphabet | string \| null | - | 当前激活的字母 |
| onRegionPress | function | - | 地区点击回调 |
| onSearchChange | function | - | 搜索变化回调 |
| onAlphabetPress | function | - | 字母点击回调 |

## 子组件

### RegionListItem
- 地区列表项组件
- 支持选中状态显示
- 统一的点击交互

### AlphabetIndex
- 右侧字母索引导航
- 支持快速跳转定位
- 智能显示可用字母

## 功能特性

### 搜索功能
- 支持城市名称搜索
- 支持拼音搜索
- 300ms防抖优化
- 实时结果展示

### 字母索引
- A-Z完整字母导航
- 只显示有数据的字母
- 点击快速滚动定位
- 当前字母高亮显示

### 性能优化
- FlatList虚拟化渲染
- getItemLayout优化滚动
- 防抖搜索减少计算
- 记忆化数据处理

## 布局说明
- 搜索框固定在顶部
- 地区列表占据主要区域
- 字母索引固定在右侧
- 搜索时隐藏字母索引

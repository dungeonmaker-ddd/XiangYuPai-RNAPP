# 📍 地区选择模块

基于标准化架构的地区选择功能模块，支持定位、热门城市、字母索引等多种选择方式。

## 📁 文件结构

```
src/screens/location/
├── LocationSelectorScreen.tsx  # 主页面组件 (600行架构)
├── components/                 # 组件目录
│   └── index.ts               # 组件导出索引
├── types.ts                   # 类型定义
├── constants.ts               # 常量配置
├── index.ts                   # 模块导出索引
└── README.md                  # 使用说明
```

## 🎯 核心功能

### 智能定位系统
- **自动定位**：GPS定位获取当前城市
- **权限处理**：完整的定位权限申请流程
- **错误处理**：定位失败的友好提示

### 多种选择方式
- **当前定位**：一键选择当前位置
- **热门城市**：预设热门城市快速选择
- **字母索引**：A-Z字母导航快速定位
- **搜索功能**：支持城市名称和拼音搜索

### 用户体验优化
- **最近访问**：记录用户选择历史
- **选择确认**：清晰的选择状态反馈
- **加载状态**：完整的加载和错误状态

## 🚀 使用方法

### 基础用法

```typescript
import { LocationSelectorScreen } from './src/screens/location';

// 在导航中使用
navigation.navigate('LocationSelector', {
  currentLocation: { city: '深圳', district: '南山区' },
  onLocationSelected: (location) => {
    console.log('Selected location:', location);
    // 处理位置选择结果
  }
});
```

### 组件导入

```typescript
import {
  LocationSelectorScreen,
  RegionInfo,
  CurrentLocationInfo,
  COLORS,
  SPACING
} from './src/screens/location';
```

### 类型定义

```typescript
import type {
  LocationSelectorScreenProps,
  RegionInfo,
  CurrentLocationInfo,
  LocationPermissionStatus
} from './src/screens/location';
```

## 📐 架构设计

### 600行单文件架构
按照标准化架构模式组织：

```
LocationSelectorScreen.tsx (≈600 lines)
├─ 0. File Banner & TOC (10–15)
├─ 1. Imports & Types (30-50行)
├─ 2. Constants & Config (40-60行)
├─ 3. Utils & Helpers (80-120行)
├─ 4. State Management (80-120行)
├─ 5. Subcomponents (150-200行)
├─ 6. Main Component (120-160行)
├─ 7. Styles (60-90行)
└─ 8. Exports (10-20行)
```

### 设计原则
- **功能内聚**：所有地区选择相关功能集中在一个模块
- **强隔离**：不依赖外部共享组件，完全自包含
- **YAGNI**：只实现当前需要的功能，避免过度工程
- **可扩展**：支持渐进式功能增强

## 🔧 技术实现

### 依赖项
```json
{
  "@react-native-community/geolocation": "^3.0.0",
  "react-native-safe-area-context": "^4.0.0"
}
```

### 权限配置

#### iOS (Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>应用需要访问您的位置信息来提供更好的服务</string>
```

#### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## 📊 性能特性

- **虚拟滚动**：长列表优化，支持大量地区数据
- **搜索防抖**：300ms防抖，减少不必要的搜索
- **状态缓存**：智能缓存用户选择和定位信息
- **懒加载**：按需加载地区数据

## 🎨 UI特性

- **响应式布局**：适配不同屏幕尺寸
- **Material Design**：遵循现代设计规范
- **无障碍支持**：完整的可访问性支持
- **暗色主题**：支持系统主题切换

## 🔗 集成示例

### 与首页集成
```typescript
// 在 HomeScreen.tsx 中
const handleLocationPress = useCallback(() => {
  navigation.navigate('LocationSelector', {
    currentLocation: location,
    onLocationSelected: (newLocation: RegionInfo) => {
      setLocation({
        city: newLocation.name,
        district: newLocation.district,
      });
      // 重新加载基于位置的数据
      loadUsers();
    }
  });
}, [location, loadUsers]);
```

## 📝 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 组件使用 React.FC 类型注解

### 命名规范
- 组件：PascalCase
- 函数：camelCase
- 常量：UPPER_SNAKE_CASE
- 类型：PascalCase + 后缀（Props, State, Info等）

### 错误处理
- 所有异步操作都有错误处理
- 用户友好的错误提示
- 完整的loading状态管理

---

**注意**: 此模块严格遵循单文件架构原则，所有功能都集中在主文件中，避免不必要的文件拆分。

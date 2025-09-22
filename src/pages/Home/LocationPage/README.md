# 📍 地区选择模块

基于UNIVERSAL_COMPONENT_ARCHITECTURE_CORE标准的嵌套化地区选择功能模块，支持定位、热门城市、字母索引等多种选择方式。

## 📁 文件结构

```
src/screens/home-location/
├── index.ts                           # 📱 模块导出索引
├── types.ts                          # 📋 页面类型定义
├── constants.ts                      # ⚙️ 页面常量配置
├── README.md                         # 📖 页面文档
├── HomeLocationScreen.tsx            # 📱 页面父组件 - 集成所有子组件
│
├── 🔄 页面状态管理层
│   └── useHomeLocation.tsx           # 页面主状态管理
│
├── 🧭 页面导航层
│   └── navigateToHomeLocation.tsx    # 页面跳转导航
│
├── HeaderArea/                       # ✅ 顶部导航区域
│   ├── index.tsx                     # 主组件文件
│   └── README.md                     # 组件文档
│
├── LocationRecommendArea/            # ✅ 定位推荐区域
│   ├── index.tsx                     # 主组件文件
│   └── README.md                     # 组件文档
│
├── HotCitiesArea/                    # ✅ 热门城市区域
│   └── index.tsx                     # 主组件文件
│
└── RegionListArea/                   # ✅ 地区列表区域
    ├── index.tsx                     # 主组件文件
    ├── RegionListItem/               # 🔸 地区列表项功能区域
    │   └── index.tsx                 # 区域主文件
    └── AlphabetIndex/                # 🔸 字母索引功能区域
        └── index.tsx                 # 区域主文件
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
import { HomeLocationScreen } from './src/screens/home-location';
// 或者使用兼容性导入
import { LocationSelectorScreen } from './src/screens/home-location';

// 在导航中使用
navigation.navigate('HomeLocationSelector', {
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
  HomeLocationScreen,
  useHomeLocation,
  navigateToHomeLocation,
  RegionInfo,
  CurrentLocationInfo,
  COLORS,
  SPACING
} from './src/screens/home-location';
```

### 类型定义

```typescript
import type {
  HomeLocationScreenProps,
  RegionInfo,
  CurrentLocationInfo,
  LocationPermissionStatus
} from './src/screens/home-location';
```

### 状态管理Hook

```typescript
import { useHomeLocation } from './src/screens/home-location';

const MyComponent = () => {
  const { state, actions } = useHomeLocation({
    initialLocation: currentLocation
  });
  
  // 使用状态和操作
  return (
    // JSX
  );
};
```

### 导航函数

```typescript
import { navigateToHomeLocation } from './src/screens/home-location';

// 导航到地区选择页面
navigateToHomeLocation(navigation, {
  currentLocation,
  onLocationSelected: (location) => {
    // 处理选择结果
  }
});
```

## 📐 架构设计

### 嵌套化主导架构
按照UNIVERSAL_COMPONENT_ARCHITECTURE_CORE标准组织：

```
HomeLocationScreen.tsx (主页面组件)
├─ 页面父组件集成架构
│  ├─ 状态管理层统一管理
│  ├─ 导航层统一管理
│  └─ 组件区域协调集成
│
├─ HeaderArea/ (顶部导航区域)
│  └─ 简洁的导航栏实现
│
├─ LocationRecommendArea/ (定位推荐区域)
│  └─ 当前定位和最近访问
│
├─ HotCitiesArea/ (热门城市区域)
│  └─ 网格布局的城市选择
│
└─ RegionListArea/ (地区列表区域)
   ├─ RegionListItem/ (列表项功能区域)
   └─ AlphabetIndex/ (字母索引功能区域)
```

### 设计原则
- **嵌套化主导**：移除components中间层，直接嵌套组件区域
- **职责分离**：每个区域职责单一，功能内聚
- **统一管理**：页面级状态管理和导航管理
- **可扩展性**：支持功能区域的独立扩展
- **标准化**：严格遵循八段式代码结构

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
import { navigateToHomeLocation } from './src/screens/home-location';

const handleLocationPress = useCallback(() => {
  navigateToHomeLocation(navigation, {
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

// 或者直接使用navigation.navigate
const handleLocationPressAlternative = useCallback(() => {
  navigation.navigate('HomeLocationSelector', {
    currentLocation: location,
    onLocationSelected: (newLocation: RegionInfo) => {
      // 处理选择结果
    }
  });
}, [location]);
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

## 🎯 重构说明

此模块已从原来的600行单文件架构重构为符合**UNIVERSAL_COMPONENT_ARCHITECTURE_CORE**标准的嵌套化架构：

### 重构前后对比

| 项目 | 重构前 | 重构后 |
|------|--------|--------|
| **架构模式** | 600行单文件架构 | 嵌套化主导架构 |
| **组件组织** | 单文件内子组件 | 独立组件区域目录 |
| **状态管理** | 组件内状态 | 页面级统一状态管理 |
| **导航管理** | 组件内处理 | 独立导航层 |
| **代码结构** | 功能混合 | 八段式标准结构 |
| **可维护性** | 中等 | 高 |
| **可扩展性** | 有限 | 强 |

### 兼容性保证
- 保留`LocationSelectorScreen`导出，确保现有代码兼容
- API接口保持不变，无需修改调用方代码
- 类型定义向后兼容

**注意**: 此模块现在严格遵循嵌套化架构原则，按功能区域组织代码，提供更好的可维护性和扩展性。

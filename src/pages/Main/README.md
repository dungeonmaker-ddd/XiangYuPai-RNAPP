# Main 页面组

## 📖 概述

Main 页面组是应用的核心容器，负责管理全局底部导航和各个主要页面组的切换，提供统一的状态栏配置和页面管理。

## 🏗️ 架构结构

```
src/pages/Main/                                        # Main 页面组
├── index.tsx                                          # 主页面实现
├── index.ts                                           # 页面组入口文件
├── types.ts                                           # 页面组类型定义
├── constants.ts                                       # 页面组常量配置
└── README.md                                          # 页面组文档
```

## 🎯 功能特性

### ✅ 核心功能
- **标签页管理**：管理 Home、Discover、Message、Profile 四个主要页面
- **状态栏配置**：根据当前页面自动配置状态栏样式
- **全局导航**：集成全局底部导航组件
- **页面切换**：流畅的页面切换体验

### 🎨 视觉设计
- **状态栏适配**：每个页面都有对应的状态栏配色
- **安全区域**：支持全面屏设备的安全区域适配
- **页面容器**：为每个页面提供独立的容器空间

## 📋 API 接口

### Props

| 属性 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `navigation` | `MainScreenNavigationProp` | ✅ | React Navigation 导航对象 |

### 状态栏配置

```typescript
const STATUS_BAR_CONFIG = {
  home: {
    barStyle: 'light-content',
    backgroundColor: '#8B5CF6'  // 紫色
  },
  discover: {
    barStyle: 'dark-content', 
    backgroundColor: '#FFFFFF'  // 白色
  },
  message: {
    barStyle: 'dark-content',
    backgroundColor: '#FFFFFF'  // 白色
  },
  profile: {
    barStyle: 'light-content',
    backgroundColor: '#8A2BE2'  // 紫色
  }
};
```

## 🚀 使用方式

### 在导航器中使用

```typescript
import { MainPage } from '@/pages/Main';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
```

### 页面切换逻辑

```typescript
const handleTabPress = (tabId: string) => {
  // 自动验证标签页有效性
  if (VALID_TABS.includes(tabId as TabScreen)) {
    setActiveTab(tabId as TabScreen);
  } else {
    Alert.alert('提示', `${tabId} 页面正在开发中...`);
  }
};
```

## 🔧 技术实现

### 页面管理
- **动态渲染**：根据 activeTab 状态动态渲染对应页面
- **状态保持**：页面切换时保持各页面的状态
- **内存优化**：只渲染当前活跃页面

### 导航集成
- **底部导航**：集成 GlobalBottomNavigation 组件
- **页面传参**：将 navigation 对象传递给各个页面
- **路由管理**：支持深度链接和页面跳转

## ⚠️ 注意事项

1. **页面组依赖**：确保所有引用的页面组（Home、Discover、Message、Profile）都已正确实现
2. **导航配置**：需要在主导航器中正确配置此页面
3. **状态栏适配**：不同页面的状态栏配色可能需要根据设计调整
4. **性能考虑**：大型页面切换时注意内存使用

## 🔗 相关文档

- [Home 页面组](../Home/README.md)
- [Discover 页面组](../Discover/README.md)
- [Message 页面组](../Message/README.md)
- [Profile 页面组](../Profile/README.md)
- [GlobalBottomNavigation](../../navigation/README.md)

这个主页面组遵循了 UNIVERSAL_COMPONENT_ARCHITECTURE_CORE 的标准，提供了清晰的页面管理和导航体验。

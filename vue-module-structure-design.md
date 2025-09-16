# Vue模块结构设计指南

> 基于React Native模块设计理念，适配Vue 3 + TypeScript项目的单文件组件架构

## 设计理念

### 1. 分层清晰、职责明确、可扩展性强
- **导入层**：Vue核心、第三方库、类型定义
- **配置层**：常量、配置、类型定义
- **逻辑层**：组合式API、状态管理、业务逻辑
- **UI层**：模板渲染、组件结构
- **样式层**：CSS模块、样式定义

### 2. 按功能域拆分 (Domain-based)
- 功能内聚，修改影响面小
- 适用中大型项目、功能导向开发
- 强隔离，避免跨模块依赖

---

## Vue组件结构设计

### 100行 Vue组件结构

```vue
<!-- FeatureComponent.vue (≈100 lines) -->
<template>
  <!-- UI Rendering (30-40) -->
  <div class="container">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <ul>
        <li v-for="item in data" :key="item.id">{{ item.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// 1. Imports (5-8)
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 2. Types (5-8)
interface DataItem {
  id: number
  name: string
}

// 3. Constants (5-8)
const API_URL = 'https://api.example.com/data'

// 4. State Management (10-15)
const data = ref<DataItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// 5. Domain Logic (20-30)
const fetchData = async () => {
  loading.value = true
  try {
    const response = await axios.get<DataItem[]>(API_URL)
    data.value = response.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* 6. Styles (5-10) */
.container {
  padding: 16px;
}
.loading, .error {
  text-align: center;
  padding: 20px;
}
.error {
  color: red;
}
</style>
```

### 300行 Vue组件结构

```
FeatureComponent.vue (≈300 lines)
├─ Template Section (60-80)
│  ├─ 条件渲染：loading/error/data states
│  ├─ 列表渲染：数据展示
│  └─ 事件绑定：用户交互
│
├─ Script Setup Section (150-180)
│  ├─ Imports (10-20)
│  │  ├─ Vue核心API、第三方库
│  │  └─ 类型定义、工具函数
│  │
│  ├─ Types & Interfaces (15-25)
│  │  ├─ Props/Emits类型
│  │  └─ 业务数据类型
│  │
│  ├─ Constants & Config (10-15)
│  │  └─ API配置、默认值
│  │
│  ├─ Utils & Helpers (15-25)
│  │  └─ 格式化、验证函数
│  │
│  ├─ State Management (25-40)
│  │  ├─ reactive/ref状态
│  │  └─ computed派生状态
│  │
│  ├─ Domain Logic (40-60)
│  │  ├─ API调用函数
│  │  ├─ 业务逻辑处理
│  │  └─ 事件处理函数
│  │
│  └─ Lifecycle Hooks (10-20)
│     └─ onMounted、onUnmounted等
│
└─ Style Section (30-40)
   ├─ CSS变量定义
   └─ 组件样式
```

### 600行 Vue组件结构

```
FeatureComponent.vue (≈600 lines)
├─ Template Section (150-200)
│  ├─ 复杂布局结构
│  ├─ 多个子组件组合
│  ├─ 条件渲染逻辑
│  └─ 事件处理绑定
│
├─ Script Setup Section (350-400)
│  ├─ Imports (25-35)
│  ├─ Types & Interfaces (40-60)
│  ├─ Constants & Config (20-30)
│  ├─ Utils & Helpers (40-60)
│  ├─ Composables (60-90)
│  │  ├─ useDataFetching
│  │  ├─ useFormValidation
│  │  └─ useUIState
│  ├─ State Management (60-90)
│  ├─ Domain Logic (80-120)
│  └─ Lifecycle & Effects (20-30)
│
└─ Style Section (50-70)
   ├─ CSS模块化
   └─ 响应式设计
```

### 1000行 Vue组件结构

```
FeatureComponent.vue (≈1000 lines)
├─ Template Section (250-350)
│  ├─ 复杂的UI布局
│  ├─ 多层嵌套组件
│  ├─ 动态组件渲染
│  └─ 复杂交互逻辑
│
├─ Script Setup Section (650-750)
│  ├─ File Banner & TOC (10-20)
│  ├─ Imports (40-60)
│  ├─ Types & Schemas (80-120)
│  ├─ Constants & Config (30-50)
│  ├─ Utils & Mappers (80-120)
│  ├─ Composables (150-200)
│  │  ├─ useFeatureService
│  │  ├─ useStateManagement
│  │  ├─ useFormHandling
│  │  └─ useUIInteraction
│  ├─ State Management (100-150)
│  ├─ Domain Logic (120-160)
│  └─ Lifecycle Management (40-60)
│
└─ Style Section (80-120)
   ├─ CSS变量系统
   ├─ 组件样式
   └─ 响应式布局
```

---

## 按功能域拆分的Vue项目结构

### 标准目录结构

```
src/views/
├── home/                          # 首页模块
│   ├── HomeView.vue              # 主页面组件 (300-600行)
│   ├── components/               # 子组件目录
│   │   ├── HeaderSection.vue     # 头部组件 (100-200行)
│   │   ├── FilterTabs.vue        # 筛选标签 (100-150行)
│   │   ├── FunctionGrid.vue      # 功能网格 (150-200行)
│   │   ├── GameBanner.vue        # 游戏横幅 (100-150行)
│   │   ├── LimitedOffers.vue     # 限时优惠 (200-300行)
│   │   ├── TeamPartySection.vue  # 团队聚会 (150-250行)
│   │   ├── UserCard.vue          # 用户卡片 (100-150行)
│   │   ├── BottomNavigation.vue  # 底部导航 (100-200行)
│   │   └── index.ts              # 组件导出索引
│   ├── composables/              # 组合式API
│   │   ├── useHomeData.ts        # 数据获取逻辑
│   │   ├── useUserInteraction.ts # 用户交互逻辑
│   │   └── index.ts              # 导出索引
│   ├── types.ts                  # 类型定义
│   ├── constants.ts              # 常量配置
│   └── index.ts                  # 模块导出索引
│
├── profile/                      # 个人资料模块
│   ├── ProfileView.vue
│   ├── components/
│   │   ├── ProfileHeader.vue
│   │   ├── ProfileStats.vue
│   │   └── ProfileSettings.vue
│   ├── composables/
│   │   └── useProfile.ts
│   ├── types.ts
│   ├── constants.ts
│   └── index.ts
│
└── index.ts                      # 总导出索引
```

### 强隔离原则实现

```typescript
// ❌ 禁止跨模块引用
import { useHomeData } from '../home/composables/useHomeData'

// ✅ 允许模块内部引用
import { useProfileData } from './composables/useProfile'

// ✅ 允许重复小型工具函数 (≤30行)
// home/utils/formatDate.ts
export const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN')
}

// profile/utils/formatDate.ts (允许重复)
export const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN')
}
```

---

## Vue组件开发规范

### 1. 组件结构顺序
```vue
<template>
  <!-- UI层 -->
</template>

<script setup lang="ts">
// 1. 文件说明和TOC (大型组件)
// 2. 导入声明
// 3. 类型定义
// 4. 常量配置
// 5. Props和Emits定义
// 6. 工具函数
// 7. 状态管理
// 8. 组合式API
// 9. 计算属性
// 10. 方法定义
// 11. 生命周期钩子
</script>

<style scoped>
/* 样式定义 */
</style>
```

### 2. 命名规范
- 组件文件：PascalCase (HomeView.vue)
- 组合式API：camelCase with use前缀 (useHomeData.ts)
- 类型定义：PascalCase with Interface/Type前缀
- 常量：UPPER_SNAKE_CASE

### 3. YAGNI原则应用
```typescript
// ❌ 过度设计
interface ApiResponse<T> {
  data: T
  meta: {
    pagination: {
      page: number
      limit: number
      total: number
      hasNext: boolean
    }
    cache: {
      ttl: number
      version: string
    }
  }
  errors?: ApiError[]
}

// ✅ 简单实用
interface HomeData {
  banners: Banner[]
  offers: Offer[]
  userInfo: UserInfo
}
```

---

## 总结

这套Vue模块结构设计继承了React Native文档中的核心理念：
1. **分层清晰**：每个部分职责明确
2. **功能内聚**：按业务域组织代码
3. **强隔离**：避免跨模块依赖
4. **渐进式**：支持不同规模的组件设计
5. **实用主义**：遵循YAGNI原则，避免过度工程化

通过这种结构，可以有效管理从小型组件到大型功能模块的复杂度，保持代码的可维护性和可扩展性。

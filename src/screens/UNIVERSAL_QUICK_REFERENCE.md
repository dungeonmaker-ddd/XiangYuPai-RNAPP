# 通用组件架构快速参考表

## 📁 跨框架目录结构对照

| 文件类型 | React/RN | Vue 2/3 | Angular | Flutter | UniApp |
|---------|----------|---------|---------|---------|--------|
| **主组件** | `index.tsx` | `Component.vue` | `component.ts` | `component.dart` | `Component.vue` |
| **类型定义** | `types.ts` | `types.ts` | `types.ts` | `types.dart` | `types.js` |
| **常量定义** | `constants.ts` | `constants.ts` | `constants.ts` | `constants.dart` | `constants.js` |
| **状态管理** | `useComponent.ts` | `useComponent.ts` | `component.service.ts` | `component_state.dart` | `useComponent.js` |
| **事件处理** | `onComponentAction.ts` | `onComponentAction.ts` | `action.service.ts` | `on_component_action.dart` | `onComponentAction.js` |
| **导航处理** | `navigateToTarget.ts` | `navigateToTarget.ts` | `navigate.service.ts` | `navigate_to_target.dart` | `navigateToTarget.js` |

## 🎯 命名规范速查表

### 核心文件命名
```
Component.[ext]          # 主组件文件
types.[ext]             # 类型/接口定义
constants.[ext]         # 常量定义
README.md              # 组件文档
```

### 功能文件命名
```
use[ComponentName][Feature].[ext]    # 状态管理
on[ComponentName][Action].[ext]      # 事件处理
navigateTo[Target].[ext]            # 导航处理
process[ComponentName][Data].[ext]   # 数据处理
validate[ComponentName][Field].[ext] # 验证逻辑
```

## 🚀 快速创建命令

### React/React Native
```bash
mkdir ComponentName && cd ComponentName
touch index.tsx types.ts constants.ts README.md
touch useComponentName.ts onComponentNamePress.ts navigateToTarget.ts
```

### Vue 2/3
```bash
mkdir ComponentName && cd ComponentName
touch ComponentName.vue types.ts constants.ts README.md
touch useComponentName.ts onComponentNamePress.ts navigateToTarget.ts
```

### Angular
```bash
ng generate component ComponentName
cd src/app/component-name
touch component-name.types.ts component-name.constants.ts
touch component-name.service.ts on-component-action.service.ts navigate.service.ts
```

### Flutter
```bash
mkdir component_name && cd component_name
touch component_name.dart component_name_types.dart component_name_constants.dart
touch component_name_state.dart on_component_name_action.dart navigate_to_target.dart
touch README.md
```

### UniApp
```bash
mkdir ComponentName && cd ComponentName
touch ComponentName.vue types.js constants.js README.md
touch useComponentName.js onComponentNamePress.js navigateToTarget.js
```

## 📝 代码模板速查

### 类型定义模板

#### TypeScript (React/Vue/Angular)
```typescript
export interface ComponentNameProps {
  data: any;
  onAction: () => void;
  style?: any;
  disabled?: boolean;
}

export interface ComponentNameState {
  loading: boolean;
  error: string | null;
}
```

#### Dart (Flutter)
```dart
class ComponentNameProps {
  final dynamic data;
  final VoidCallback onAction;
  final bool disabled;
  
  ComponentNameProps({
    required this.data,
    required this.onAction,
    this.disabled = false,
  });
}
```

#### JavaScript (UniApp)
```javascript
/**
 * @typedef {Object} ComponentNameProps
 * @property {*} data
 * @property {Function} onAction
 * @property {boolean} [disabled]
 */
```

### 状态管理模板

#### React Hook
```typescript
export const useComponentName = (props: ComponentNameProps) => {
  const [state, setState] = useState<ComponentNameState>({
    loading: false,
    error: null,
  });

  const handleAction = useCallback(() => {
    // 业务逻辑
  }, []);

  return { state, handleAction };
};
```

#### Vue 3 Composition API
```typescript
export const useComponentName = (props: ComponentNameProps) => {
  const state = reactive<ComponentNameState>({
    loading: false,
    error: null,
  });

  const handleAction = () => {
    // 业务逻辑
  };

  return { state, handleAction };
};
```

#### Angular Service
```typescript
@Injectable()
export class ComponentNameService {
  private state = signal<ComponentNameState>({
    loading: false,
    error: null,
  });

  handleAction() {
    // 业务逻辑
  }

  getState() {
    return this.state.asReadonly();
  }
}
```

#### Flutter State Management
```dart
class ComponentNameNotifier extends ChangeNotifier {
  ComponentNameState _state = ComponentNameState();
  
  ComponentNameState get state => _state;
  
  void handleAction() {
    // 业务逻辑
    notifyListeners();
  }
}
```

### 事件处理模板

#### 通用事件处理器
```typescript
// TypeScript
export const onComponentNameAction = (props: ComponentNameProps) => {
  try {
    analytics?.track('component_action');
    console.log('ComponentName: Action 执行成功');
  } catch (error) {
    console.error('ComponentName: Action 执行失败', error);
  }
};
```

```dart
// Dart
class ComponentNameEventHandler {
  static void onAction(ComponentNameProps props) {
    try {
      print('ComponentName: Action 执行成功');
    } catch (error) {
      print('ComponentName: Action 执行失败: $error');
    }
  }
}
```

### 导航处理模板

#### React Navigation
```typescript
export const navigateToTarget = async (params: NavigateParams): Promise<boolean> => {
  try {
    navigation.navigate('TargetScreen', params);
    return true;
  } catch (error) {
    console.error('导航失败', error);
    return false;
  }
};
```

#### Vue Router
```typescript
export const navigateToTarget = async (params: NavigateParams): Promise<boolean> => {
  try {
    await router.push({ name: 'TargetPage', params });
    return true;
  } catch (error) {
    console.error('导航失败', error);
    return false;
  }
};
```

#### Angular Router
```typescript
@Injectable()
export class NavigationService {
  constructor(private router: Router) {}

  async navigateToTarget(params: NavigateParams): Promise<boolean> {
    try {
      await this.router.navigate(['/target'], { queryParams: params });
      return true;
    } catch (error) {
      console.error('导航失败', error);
      return false;
    }
  }
}
```

#### Flutter Navigator
```dart
class NavigationHandler {
  static Future<bool> navigateToTarget(BuildContext context, NavigateParams params) async {
    try {
      await Navigator.pushNamed(context, '/target', arguments: params);
      return true;
    } catch (error) {
      print('导航失败: $error');
      return false;
    }
  }
}
```

#### UniApp Navigation
```javascript
export const navigateToTarget = async (params) => {
  try {
    await uni.navigateTo({
      url: `/pages/target/target?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`
    });
    return true;
  } catch (error) {
    console.error('导航失败', error);
    return false;
  }
};
```

## 🎨 框架特定适配指南

### React/React Native
- ✅ 使用 Hooks 进行状态管理
- ✅ 事件处理器返回处理函数
- ✅ 使用 TypeScript 进行类型检查
- ✅ 导航使用 React Navigation

### Vue 2/3
- ✅ Vue 3 优先使用 Composition API
- ✅ Vue 2 可使用 Mixins 或 Options API
- ✅ 使用 TypeScript 增强类型安全
- ✅ 导航使用 Vue Router

### Angular
- ✅ 使用 Services 封装业务逻辑
- ✅ 利用 Dependency Injection
- ✅ 使用 Signals 进行响应式状态管理
- ✅ 导航使用 Angular Router

### Flutter
- ✅ 使用 Provider/Riverpod 进行状态管理
- ✅ 遵循 Material Design 规范
- ✅ 使用 Dart 语言特性
- ✅ 导航使用 Navigator 2.0

### UniApp
- ✅ 兼容多端运行
- ✅ 使用条件编译处理平台差异
- ✅ 状态管理可选择 Vuex/Pinia
- ✅ 导航使用 uni-app API

## ✅ 实施检查清单

### 创建新组件
- [ ] 创建组件目录
- [ ] 添加主组件文件
- [ ] 添加类型定义文件
- [ ] 添加常量定义文件（如需要）
- [ ] 添加状态管理文件（如需要）
- [ ] 添加事件处理文件（如需要）
- [ ] 添加导航处理文件（如需要）
- [ ] 编写 README.md 文档
- [ ] 确保遵循框架最佳实践

### 重构现有组件
- [ ] 分析组件功能职责
- [ ] 创建新的目录结构
- [ ] 拆分类型定义
- [ ] 提取常量配置
- [ ] 拆分状态管理逻辑
- [ ] 拆分事件处理逻辑
- [ ] 拆分导航处理逻辑
- [ ] 更新组件主文件
- [ ] 更新外部引用
- [ ] 测试功能完整性

## 🔧 工具推荐

### 代码生成工具
- **Plop.js** - 自定义代码生成器
- **Yeoman** - 通用脚手架工具
- **Angular CLI** - Angular 专用生成器
- **Flutter CLI** - Flutter 组件生成

### 开发工具
- **VS Code** - 跨框架开发支持
- **WebStorm** - 强大的重构功能
- **Android Studio** - Flutter 开发
- **Xcode** - iOS 开发支持

### 文档工具
- **Storybook** - 组件文档和测试
- **VuePress** - Vue 生态文档
- **Docusaurus** - React 生态文档
- **GitBook** - 通用文档平台

---

**提示**: 选择适合你的技术栈的实现方式，保持架构思想的一致性！

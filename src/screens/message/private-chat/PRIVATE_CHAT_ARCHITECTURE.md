# 私聊对话模块 - 架构设计文档

## 🌳 模块树状图（页面结构视角）

```
【私聊对话模块】★★★
│
├── 【私聊主页面】📱 (一对一聊天界面 - 白色背景)
│   ├── 📱 系统状态栏 (9:41时间 + 信号电池显示)
│   │
│   ├── 🔝 对话导航栏 (固定头部 - 高度100px - 白色背景)
│   │   ├── 🔙「<」返回按钮 (左上角 - 黑色箭头图标 32x32px)
│   │   │   ├── 点击效果：0.2s缩放动画
│   │   │   └── 返回功能：回到消息列表页面
│   │   └── 📝 对话信息区域 (居中显示)
│   │       ├── "用户昵称" 对话用户昵称 (16sp黑色粗体)
│   │       └── 🟢 在线状态 "在线" (14sp绿色 - 昵称下方)
│   │           ├── 在线状态：绿色"在线"
│   │           ├── 离线状态：灰色"X分钟前在线"
│   │           └── 状态更新：实时更新机制
│   │
│   ├── 💬 聊天消息区域 (中间滚动区域 - 占满剩余空间)
│   │   ├── 📋 消息列表容器 (FlatList - 垂直滚动)
│   │   │   ├── 📐 消息间距：垂直8px间距
│   │   │   ├── 📐 左右边距：16px
│   │   │   └── 🔄 自动滚动：新消息自动滚动到底部
│   │   │
│   │   ├── ⏰ 时间分隔线 (条件显示 - 超过5分钟间隔)
│   │   │   ├── 📐 样式：灰色虚线 + 时间文本居中
│   │   │   ├── 🎨 背景：浅灰色圆角背景
│   │   │   └── 📝 格式："XX:XX" 或 "XX分钟前"
│   │   │
│   │   ├── 💭 消息气泡组件 (MessageBubble)
│   │   │   ├── 👤 头像显示 (对方消息显示，我的消息不显示)
│   │   │   │   ├── 📐 尺寸：40x40px圆形头像
│   │   │   │   ├── 🎨 样式：圆形边框，默认头像占位
│   │   │   │   └── 📍 位置：消息气泡左侧/右侧
│   │   │   │
│   │   │   ├── 💬 气泡容器 (根据消息类型和发送方调整)
│   │   │   │   ├── 📐 最大宽度：屏幕70%
│   │   │   │   ├── 🎨 我的消息：蓝色气泡，右对齐，右下角切角
│   │   │   │   ├── 🎨 对方消息：灰色气泡，左对齐，左下角切角
│   │   │   │   └── 🎨 阴影：轻微阴影效果
│   │   │   │
│   │   │   ├── 📝 文本消息气泡
│   │   │   │   ├── 📝 文本内容 (16sp，行高1.3倍)
│   │   │   │   ├── 🎨 我的消息：白色文字
│   │   │   │   ├── 🎨 对方消息：黑色文字
│   │   │   │   └── 📐 内边距：16px水平，12px垂直
│   │   │   │
│   │   │   ├── 🖼️ 图片消息气泡
│   │   │   │   ├── 🖼️ 图片显示 (200x200px，圆角8px)
│   │   │   │   ├── 📝 图片描述 "图片" (14sp)
│   │   │   │   ├── 🔄 加载状态：显示占位图
│   │   │   │   ├── ❌ 错误状态：显示默认图片
│   │   │   │   └── 👆 点击交互：查看大图功能
│   │   │   │
│   │   │   └── ✨ 动态消息气泡 (新增功能)
│   │   │       ├── 📝 动态标题 (16sp粗体，最多30字符+...)
│   │   │       ├── 🖼️ 单张动态图片
│   │   │       │   ├── 📐 尺寸：宽度100%，高宽比1.2:1
│   │   │       │   ├── 🎨 样式：圆角8px，覆盖填充
│   │   │       │   └── 👆 点击交互：查看动态详情
│   │   │       ├── 💖 互动信息覆盖层
│   │   │       │   ├── 📍 位置：图片右上角
│   │   │       │   ├── 🎨 样式：半透明黑色背景
│   │   │       │   └── 📝 内容："❤️ 88" 点赞数显示
│   │   │       └── ⏰ 动态时间戳 (12sp，右对齐，半透明)
│   │   │
│   │   └── 📊 消息状态信息 (时间戳+发送状态)
│   │       ├── ⏰ 时间戳 (12sp灰色，格式："HH:MM")
│   │       └── ✅ 发送状态 (仅我的消息显示)
│   │           ├── ⏳ 发送中：loading图标
│   │           ├── ✓ 已发送：单勾灰色
│   │           ├── ✓✓ 已读：双勾蓝色
│   │           └── ❌ 发送失败：红色X + 蓝色重发按钮
│   │               └── 🔄 重发功能：点击重发按钮重新发送消息
│   │
│   └── ⌨️ 输入区域 (底部固定 - 白色背景)
│       ├── 🎯 功能按钮区域 (左侧图标组)
│       │   ├── 📷「拍照」按钮 (32x32px圆形，浅灰背景)
│       │   │   ├── 🎨 图标：相机图标20x20px
│       │   │   ├── 👆 点击效果：0.2s缩放动画
│       │   │   └── 🔗 功能：打开相机拍照
│       │   └── 🖼️「相册」按钮 (32x32px圆形，浅灰背景)
│       │       ├── 🎨 图标：图片图标20x20px
│       │       ├── 👆 点击效果：0.2s缩放动画
│       │       └── 🔗 功能：打开相册选择/发送动态选项
│       │
│       ├── 📝 文本输入框 (中间伸缩区域)
│       │   ├── 📐 最小高度：40px
│       │   ├── 📐 最大高度：120px (支持多行输入)
│       │   ├── 🎨 样式：1px灰色边框，20px圆角
│       │   ├── 📐 内边距：16px水平，12px垂直
│       │   ├── 📝 字体：16sp，行高1.3倍
│       │   ├── 💭 占位符："请输入内容..."
│       │   ├── 📱 键盘：支持回车发送
│       │   └── 📝 限制：最多1000字符
│       │
│       ├── 📤「发送」按钮 (右侧圆形按钮)
│       │   ├── 📐 尺寸：40x40px圆形
│       │   ├── 🎨 有内容：蓝色背景，白色箭头图标
│       │   ├── 🎨 无内容：灰色背景，禁用状态
│       │   ├── 👆 点击效果：0.9透明度
│       │   └── ⌨️ 快捷键：键盘回车键发送
│       │
│       └── 📱 安全区域适配 (iOS底部安全区域)
│           └── 📐 高度：动态适配设备安全区域
│
└── 🔧 技术实现层
    ├── 🔄 状态管理
    │   ├── 📝 消息列表状态：messages[]
    │   ├── ⌨️ 输入框状态：inputText
    │   ├── 👤 用户信息状态：userInfo
    │   └── 🔄 加载状态：loading
    │
    ├── 💾 数据结构
    │   ├── 💬 ExtendedChatMessage：扩展消息类型
    │   ├── ✨ DynamicContent：动态内容结构
    │   ├── 👤 User：用户信息结构
    │   └── 📊 MessageStatus：消息状态枚举
    │
    └── 🎯 交互逻辑
        ├── 📤 发送文本消息：sendTextMessage()
        ├── ✨ 发送动态消息：sendDynamicMessage()
        ├── 🖼️ 处理图片选择：handleImagePicker()
        ├── 📷 处理拍照：handleCameraPicker()
        ├── 👆 消息点击：handleMessagePress()
        └── ✨ 动态点击：handleDynamicPress()
```

## 🔄 核心交互流程图

### 1. 页面初始化流程
```
【进入私聊页面】
    ↓
【获取路由参数】→ 用户ID + 用户信息
    ↓
【初始化状态】→ 设置用户信息
    ↓
【加载聊天记录】→ API调用 (模拟800ms)
    ↓
【渲染消息列表】→ FlatList渲染
    ↓
【自动滚动到底部】→ scrollToEnd()
    ↓
【页面准备就绪】
```

### 2. 发送文本消息流程
```
【用户输入文本】
    ↓
【点击发送按钮】或【键盘回车】
    ↓
【验证输入内容】→ 是否为空
    ↓ (非空)
【创建消息对象】→ ExtendedChatMessage
    ↓
【添加到消息列表】→ setMessages([...prev, newMessage])
    ↓
【清空输入框】→ setInputText('')
    ↓
【滚动到底部】→ scrollToEnd() 延迟100ms
    ↓
【调用发送API】→ 模拟1秒延迟
    ↓
【更新消息状态】→ SENDING → SENT/FAILED
```

### 3. 发送动态消息流程
```
【点击相册按钮】
    ↓
【显示选择弹窗】→ Alert.alert()
    ↓
【选择"发送动态"】
    ↓
【生成测试动态数据】→ DynamicContent
    ↓
【调用sendDynamicMessage】
    ↓
【创建动态消息对象】→ type: 'dynamic'
    ↓
【添加到消息列表】→ 包含dynamicContent
    ↓
【执行发送流程】→ 同文本消息API流程
```

### 4. 消息显示渲染流程
```
【FlatList渲染消息】
    ↓
【判断时间分隔线】→ 超过5分钟显示
    ↓
【渲染MessageBubble】
    ↓
【根据消息类型分发】
    ├─【text】→ renderTextMessage()
    ├─【image】→ renderImageMessage()
    └─【dynamic】→ renderDynamicMessage()
    ↓
【应用气泡样式】→ 根据isFromMe调整
    ↓
【显示头像】→ 对方消息显示
    ↓
【显示状态信息】→ 时间戳+发送状态
```

### 5. 动态消息交互流程
```
【渲染动态消息】
    ↓
【显示动态标题】→ 截断30字符
    ↓
【显示单张图片】→ photos[0]
    ↓
【添加点赞覆盖层】→ 右上角显示
    ↓
【用户点击图片】
    ↓
【触发onDynamicPress】→ (dynamicId, photoIndex=0)
    ↓
【处理点击事件】→ 查看动态详情/图片大图
```

### 6. 消息重发流程
```
【发送消息失败】
    ↓
【消息状态更新为FAILED】→ 显示红色X图标
    ↓
【显示重发按钮】→ 蓝色"重发"按钮
    ↓
【用户点击重发】
    ↓
【触发handleRetryMessage】→ (messageId)
    ↓
【更新状态为SENDING】→ 显示loading图标
    ↓
【调用重发API】→ 模拟1秒延迟
    ↓
【更新最终状态】→ SENT(成功) / FAILED(再次失败)
```

## 📁 文件结构树状图

```
src/screens/message/private-chat/
├── 📄 PrivateChatScreen.tsx (170行) ★重构简化★
│   ├── 🔧 页面布局：SafeAreaView+KeyboardAvoidingView
│   ├── 🎯 交互控制：发送消息+事件响应
│   ├── 📋 组件集成：ChatHeader+MessageList+InputArea
│   └── 👤 用户状态：用户信息+输入框状态
│
├── 📁 components/ (组件模块)
│   ├── 📄 index.ts (9行) - 组件导出索引
│   │
│   ├── 📄 ChatHeader.tsx (120行)
│   │   ├── 🔧 功能：导航栏+用户信息+在线状态
│   │   ├── 🎨 样式：居中布局+返回按钮
│   │   └── 🔄 状态：在线时间计算逻辑
│   │
│   ├── 📄 MessageList.tsx (320行) ★新增子模块★
│   │   ├── 🔧 数据管理：useMessageData Hook
│   │   ├── 📊 状态控制：消息CRUD+状态流转
│   │   ├── 📋 列表渲染：FlatList+性能优化
│   │   ├── ⏰ 时间逻辑：TimeDivider子组件
│   │   └── 🎯 交互处理：重发+滚动控制
│   │
│   ├── 📄 MessageBubble.tsx (398行) ★核心组件★
│   │   ├── 🔧 消息类型支持：text/image/dynamic
│   │   ├── 🎨 气泡样式：双向布局+主题适配
│   │   ├── ✨ 动态消息：单图显示+交互覆盖层
│   │   ├── 📊 状态显示：发送状态+时间戳+重发按钮
│   │   └── 🎯 交互处理：点击事件+状态切换
│   │
│   └── 📄 InputArea.tsx (178行)
│       ├── 🔧 输入功能：多行文本+字符限制
│       ├── 🎯 功能按钮：拍照+相册选择
│       ├── 📤 发送控制：状态判断+快捷键
│       └── 📱 适配处理：键盘回避+安全区域
│
├── 📁 pchat/ (静态资源)
│   ├── 🖼️ 立刻拍照.png (拍照按钮图标)
│   ├── 🖼️ 选择图片.png (相册按钮图标)
│   └── 🖼️ 返回上一页.png (返回按钮图标)
│
├── 📄 index.ts (7行) - 模块导出索引
│
└── 📁 documentation/ (文档模块)
    ├── 📄 README.md (174行) - MessageBubble重构说明
    ├── 📄 SINGLE_IMAGE_DYNAMIC.md (145行) - 单图动态实现
    ├── 📄 MESSAGE_TYPE_FIX.md (108行) - 消息类型修复
    └── 📄 PRIVATE_CHAT_ARCHITECTURE.md (本文档)
```

## 🎯 核心组件详细设计

### MessageBubble组件架构
```
MessageBubble.tsx (364行)
├── 1. 类型定义 (25行)
│   ├── DynamicContent interface
│   ├── ExtendedChatMessage interface
│   └── MessageBubbleProps interface
│
├── 2. 工具函数 (30行)
│   ├── formatTime() - 时间格式化
│   ├── getStatusIcon() - 状态图标映射
│   └── truncateText() - 文本截断工具
│
├── 3. 渲染函数 (120行)
│   ├── renderTextMessage() - 文本消息渲染
│   ├── renderImageMessage() - 图片消息渲染
│   ├── renderDynamicMessage() - 动态消息渲染 ★新增★
│   └── renderMessageContent() - 消息类型分发
│
├── 4. 主组件结构 (70行)
│   ├── 头像显示逻辑
│   ├── 消息内容容器
│   ├── 状态信息显示
│   └── 布局适配逻辑
│
└── 5. 样式定义 (119行)
    ├── 基础气泡样式 (60行)
    ├── 消息类型样式 (40行)
    └── 动态消息样式 (19行) ★新增★
```

### PrivateChatScreen主页面架构
```
PrivateChatScreen.tsx (426行)
├── 1. 导入声明 (25行)
│   ├── React/RN核心库
│   ├── 类型定义导入
│   └── 组件导入
│
├── 2. 类型定义 (10行)
│   └── PrivateChatScreenProps
│
├── 3. 数据常量 (98行)
│   ├── MOCK_MESSAGES (90行) - 测试消息数据
│   └── MOCK_USER_INFO (8行) - 测试用户信息
│
├── 4. 状态管理 (8行)
│   ├── messages - 消息列表状态
│   ├── inputText - 输入框状态
│   ├── userInfo - 用户信息状态
│   └── loading - 加载状态
│
├── 5. 业务逻辑 (150行)
│   ├── loadMessages() - 加载聊天记录
│   ├── sendTextMessage() - 发送文本消息
│   ├── sendDynamicMessage() - 发送动态消息
│   ├── handleImagePicker() - 图片选择处理
│   ├── handleMessagePress() - 消息点击处理
│   └── handleDynamicPress() - 动态点击处理
│
├── 6. 副作用管理 (10行)
│   ├── 初始化加载消息
│   └── 路由参数处理
│
├── 7. 子组件定义 (25行)
│   └── TimeDivider - 时间分隔线组件
│
├── 8. UI渲染结构 (70行)
│   ├── SafeAreaView + StatusBar
│   ├── ChatHeader - 导航头部
│   ├── KeyboardAvoidingView - 键盘适配
│   ├── FlatList - 消息列表
│   └── InputArea - 输入区域
│
└── 9. 样式定义 (30行)
    ├── 容器样式
    ├── 消息列表样式
    └── 时间分隔线样式
```

## 🔧 技术实现细节

### 1. 消息类型系统
```typescript
// 基础消息类型扩展
export interface ExtendedChatMessage extends Omit<ChatMessage, 'type'> {
  type: 'text' | 'image' | 'dynamic';  // 支持三种消息类型
  dynamicContent?: DynamicContent;     // 动态消息专用数据
}

// 动态内容数据结构
export interface DynamicContent {
  id: string;          // 动态唯一标识
  photos: string[];    // 图片URL数组（当前只用第一张）
  title: string;       // 动态标题
  likes: number;       // 点赞数
  timestamp: string;   // 动态发布时间
}
```

### 2. 状态管理模式
```typescript
// 消息列表状态管理
const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);

// 发送消息状态流转
SENDING → SENT → READ (成功)
SENDING → FAILED (失败)
```

### 3. 布局适配策略
```typescript
// iOS键盘适配
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
>

// 安全区域适配
<SafeAreaView style={styles.container}>
  <StatusBar barStyle="dark-content" backgroundColor={STYLES.COLORS.WHITE} />
```

### 4. 性能优化措施
- **FlatList优化**：keyExtractor + renderItem缓存
- **图片懒加载**：defaultSource占位图机制
- **状态最小化**：只在必要时触发重新渲染
- **回调缓存**：useCallback防止不必要的子组件重渲染

### 5. 交互体验增强
- **自动滚动**：新消息自动滚动到底部
- **键盘适配**：输入时自动调整布局
- **点击反馈**：所有交互元素都有视觉反馈
- **加载状态**：清晰的loading和错误状态提示

## 📊 模块规模统计

| 组件 | 行数 | 主要功能 | 复杂度 |
|------|------|----------|---------|
| MessageBubble.tsx | 398行 | 消息渲染 | ★★★★ |
| MessageList.tsx | 320行 | 数据管理+列表 | ★★★★ |
| InputArea.tsx | 178行 | 输入控制 | ★★★ |
| PrivateChatScreen.tsx | 170行 | 页面布局+交互 | ★★★ |
| ChatHeader.tsx | 120行 | 导航头部 | ★★ |
| **总计** | **1186行** | **完整模块** | **★★★★** |

## 🎯 模块特点总结

### ✅ 架构优势
1. **职责分离**：数据逻辑(MessageList)与展示逻辑(PrivateChatScreen)分离
2. **组件化设计**：UI组件和业务逻辑模块化组织
3. **数据复用**：useMessageData Hook可跨组件复用
4. **类型安全**：完整的TypeScript类型定义
5. **扩展性强**：易于添加新的消息类型和子模块
6. **测试友好**：数据逻辑和UI逻辑可独立测试

### 🚀 用户体验
1. **流畅交互**：平滑的动画和反馈效果
2. **响应式设计**：适配不同屏幕尺寸
3. **无障碍支持**：完整的点击区域和视觉反馈
4. **性能优化**：列表虚拟化和图片懒加载

### 🔧 开发体验
1. **代码清晰**：职责分离，模块边界明确
2. **易于维护**：数据逻辑和UI逻辑独立修改
3. **调试友好**：详细的console输出和错误处理
4. **快速迭代**：Hook复用和模块化开发
5. **团队协作**：不同开发者可并行开发不同模块

这个私聊对话模块采用了现代React Native的最佳实践，通过**消息列表子模块化**实现了数据逻辑与展示逻辑的完美分离，为用户提供了完整的一对一聊天体验，同时保持了优秀的代码质量和可维护性。

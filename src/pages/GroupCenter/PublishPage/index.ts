/**
 * 🎯 组局发布模块 - 统一导出
 * 基于通用组件架构核心标准的模块导出
 */

// 主页面组件
export { default as PublishGroupScreen } from './PublishGroupScreen';
export { default as GroupPublishScreen } from './PublishGroupScreen'; // 使用同一个组件

// 组件区域导出
export { HeaderArea } from './HeaderArea';
export { TypeSelectionArea } from './TypeSelectionArea';
// export { FormInputArea } from './FormInputArea';
// export { AgreementArea } from './AgreementArea';
// export { PaymentArea } from './PaymentArea';

// 状态管理导出
export { useGroupPublish } from './useGroupPublish';

// 导航功能导出
export { navigateToPayment } from './navigateToPayment';
export { navigateBack } from './navigateBack';

// 类型和常量导出
export * from './types';
export * from './constants';

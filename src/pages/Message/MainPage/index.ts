/**
 * 消息系统模块 - 总导出索引
 */

// 主页面
export { default as MessageCenterScreen, default as MessageMainPage } from './index.tsx';
export { default } from './index.tsx';

// 子模块页面 - 注释掉不存在的模块
// export * from './like-collect'; // 模块不存在
// export * from './private-chat'; // 模块不存在

// 共享组件
export * from './components';

// 类型和常量
export * from './types';
export * from './constants';

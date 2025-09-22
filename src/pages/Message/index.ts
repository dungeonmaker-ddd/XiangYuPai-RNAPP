/**
 * Message 页面组入口文件
 * 
 * 导出页面组的所有页面和相关模块
 */

// 主页面导出
export { default as MessageMainPage } from './MainPage/index';

// 子页面导出
export { default as MessageLikeCollectPage } from './LikeCollectPage';
export { default as MessagePrivateChatPage } from './PrivateChatPage';

// 别名导出，用于向后兼容
export { default as MessageCenterScreen } from './MainPage';
export { default as LikeCollectScreen } from './LikeCollectPage';
export { default as PrivateChatScreen } from './PrivateChatPage';

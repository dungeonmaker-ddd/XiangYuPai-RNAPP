/**
 * 发布页面格式化和提示工具
 * 
 * 提供Toast提示、文本格式化等功能
 */

import { Alert } from 'react-native';

/**
 * 显示成功提示
 * 
 * @param message 提示消息
 */
export const showSuccessToast = (message: string): void => {
  // 在实际项目中，这里应该使用Toast组件
  // 这里使用Alert作为临时替代
  Alert.alert('成功', message);
};

/**
 * 显示错误提示
 * 
 * @param message 错误消息
 */
export const showErrorToast = (message: string): void => {
  // 在实际项目中，这里应该使用Toast组件
  // 这里使用Alert作为临时替代
  Alert.alert('错误', message);
};

/**
 * 显示警告提示
 * 
 * @param message 警告消息
 */
export const showWarningToast = (message: string): void => {
  Alert.alert('警告', message);
};

/**
 * 显示信息提示
 * 
 * @param message 信息消息
 */
export const showInfoToast = (message: string): void => {
  Alert.alert('提示', message);
};

/**
 * 格式化文件大小
 * 
 * @param bytes 字节数
 * @returns 格式化的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * 格式化时间
 * 
 * @param date 日期对象
 * @returns 格式化的时间字符串
 */
export const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return '刚刚';
  }
};

/**
 * 格式化数字（添加千分位分隔符）
 * 
 * @param num 数字
 * @returns 格式化的数字字符串
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 截断文本
 * 
 * @param text 原始文本
 * @param length 最大长度
 * @param suffix 后缀（默认为'...'）
 * @returns 截断后的文本
 */
export const truncateText = (text: string, length: number, suffix: string = '...'): string => {
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length - suffix.length) + suffix;
};

/**
 * 格式化标签文本
 * 
 * @param tags 标签数组
 * @returns 格式化的标签字符串
 */
export const formatTags = (tags: string[]): string => {
  return tags.map(tag => `#${tag}`).join(' ');
};

/**
 * 解析话题标签
 * 
 * @param content 内容文本
 * @returns 提取的话题标签数组
 */
export const parseTopicTags = (content: string): string[] => {
  const regex = /#([^\s#]+)/g;
  const matches = content.match(regex);
  return matches ? matches.map(match => match.substring(1)) : [];
};

/**
 * 格式化地点名称
 * 
 * @param location 地点对象
 * @returns 格式化的地点名称
 */
export const formatLocationName = (location: {
  name: string;
  address?: string;
  distance?: number;
}): string => {
  let formatted = location.name;
  
  if (location.distance !== undefined) {
    if (location.distance < 1000) {
      formatted += ` (${Math.round(location.distance)}m)`;
    } else {
      formatted += ` (${(location.distance / 1000).toFixed(1)}km)`;
    }
  }
  
  return formatted;
};

/**
 * 验证并格式化URL
 * 
 * @param url 原始URL
 * @returns 格式化的URL或null
 */
export const formatUrl = (url: string): string | null => {
  try {
    // 如果没有协议，添加https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    return null;
  }
};

/**
 * 格式化进度百分比
 * 
 * @param current 当前值
 * @param total 总值
 * @returns 百分比字符串
 */
export const formatProgress = (current: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = Math.round((current / total) * 100);
  return `${percentage}%`;
};

/**
 * 格式化媒体时长
 * 
 * @param seconds 秒数
 * @returns 格式化的时长字符串
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `0:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

/**
 * 生成随机ID
 * 
 * @param length ID长度（默认8位）
 * @returns 随机ID字符串
 */
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 深拷贝对象
 * 
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as any;
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }
  
  return obj;
};

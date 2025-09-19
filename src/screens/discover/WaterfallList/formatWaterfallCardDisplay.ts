/**
 * 瀑布流卡片显示格式化工具
 * 基于通用组件架构核心标准 - 工具函数层
 * 
 * @version 2.0.0
 * @author 架构团队
 */

// =====================================================
// 格式化常量
// =====================================================

const FORMAT_THRESHOLDS = {
  THOUSAND: 1000,
  TEN_THOUSAND: 10000,
} as const;

// =====================================================
// 主要格式化函数
// =====================================================

/**
 * 格式化数字显示
 * 将数字转换为易读的格式（如：1.2k, 3.4w）
 * 
 * @param count 需要格式化的数字
 * @returns 格式化后的字符串
 * 
 * @example
 * formatDisplayCount(999) => "999"
 * formatDisplayCount(1500) => "1.5k" 
 * formatDisplayCount(12000) => "1.2w"
 */
export const formatDisplayCount = (count: number): string => {
  if (count < FORMAT_THRESHOLDS.THOUSAND) {
    return count.toString();
  }
  
  if (count < FORMAT_THRESHOLDS.TEN_THOUSAND) {
    return `${(count / FORMAT_THRESHOLDS.THOUSAND).toFixed(1)}k`;
  }
  
  return `${(count / FORMAT_THRESHOLDS.TEN_THOUSAND).toFixed(1)}w`;
};

/**
 * 格式化用户昵称显示
 * 处理过长昵称的截断和显示
 * 
 * @param nickname 用户昵称
 * @param maxLength 最大显示长度
 * @returns 格式化后的昵称
 */
export const formatUserNickname = (nickname: string, maxLength: number = 12): string => {
  if (nickname.length <= maxLength) {
    return nickname;
  }
  
  return `${nickname.slice(0, maxLength - 1)}...`;
};

/**
 * 格式化内容标题显示
 * 处理内容标题的换行和截断
 * 
 * @param title 内容标题
 * @param maxLines 最大行数
 * @returns 格式化后的标题
 */
export const formatContentTitle = (title: string, maxLines: number = 3): string => {
  const maxLength = maxLines * 20; // 假设每行20个字符
  
  if (title.length <= maxLength) {
    return title;
  }
  
  return `${title.slice(0, maxLength - 1)}...`;
};

/**
 * 🔍 搜索模块工具函数
 * 
 * 基于搜索结果模块架构设计的工具函数集合
 * 包含防抖、高亮、格式化等实用工具
 */

import { SEARCH_CONFIG, COLORS } from './constants';
import { SearchHistoryItem, ContentItem, UserInfo, ServiceInfo, TopicInfo } from './types';

// ══════════════════════════════════════════════════════════════
// 1. 防抖工具函数
// ══════════════════════════════════════════════════════════════

/**
 * 防抖函数 - 优化搜索性能
 * @param func 要防抖的函数
 * @param delay 延迟时间(ms)
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = SEARCH_CONFIG.DEBOUNCE_DELAY
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * 节流函数 - 限制函数调用频率
 * @param func 要节流的函数
 * @param delay 节流间隔(ms)
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 1000
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(null, args);
    }
  };
};

// ══════════════════════════════════════════════════════════════
// 2. 字符串处理工具
// ══════════════════════════════════════════════════════════════

/**
 * 关键词高亮处理
 * @param text 原始文本
 * @param keyword 关键词
 * @param highlightColor 高亮颜色
 * @returns 处理后的文本对象
 */
export const highlightKeyword = (
  text: string,
  keyword: string,
  highlightColor: string = COLORS.highlight
) => {
  if (!keyword || !text) {
    return [{ text, highlighted: false }];
  }

  const regex = new RegExp(`(${keyword})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => ({
    text: part,
    highlighted: regex.test(part),
    color: regex.test(part) ? highlightColor : undefined,
  }));
};

/**
 * 文本截断处理
 * @param text 原始文本
 * @param maxLength 最大长度
 * @param suffix 后缀
 * @returns 截断后的文本
 */
export const truncateText = (
  text: string,
  maxLength: number = 50,
  suffix: string = '...'
): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * 关键词清理 - 移除特殊字符
 * @param keyword 原始关键词
 * @returns 清理后的关键词
 */
export const sanitizeKeyword = (keyword: string): string => {
  return keyword
    .trim()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '') // 保留字母、数字、空格、中文
    .replace(/\s+/g, ' '); // 合并多个空格
};

/**
 * 验证搜索关键词
 * @param keyword 关键词
 * @returns 验证结果
 */
export const validateKeyword = (keyword: string): {
  valid: boolean;
  error?: string;
} => {
  const cleanKeyword = sanitizeKeyword(keyword);
  
  if (!cleanKeyword) {
    return { valid: false, error: '请输入搜索关键词' };
  }
  
  if (cleanKeyword.length < SEARCH_CONFIG.MIN_KEYWORD_LENGTH) {
    return { valid: false, error: '搜索关键词太短' };
  }
  
  if (cleanKeyword.length > SEARCH_CONFIG.MAX_KEYWORD_LENGTH) {
    return { valid: false, error: '搜索关键词太长' };
  }
  
  return { valid: true };
};

// ══════════════════════════════════════════════════════════════
// 3. 数据格式化工具
// ══════════════════════════════════════════════════════════════

/**
 * 格式化距离显示
 * @param distance 距离(km)
 * @returns 格式化后的距离字符串
 */
export const formatDistance = (distance?: number): string => {
  if (!distance || distance < 0) {
    return '';
  }
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  
  if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  }
  
  return `${Math.round(distance)}km`;
};

/**
 * 格式化数字显示（点赞数、评论数等）
 * @param count 数字
 * @returns 格式化后的字符串
 */
export const formatCount = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  }
  
  if (count < 10000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  
  if (count < 1000000) {
    return `${Math.round(count / 1000)}k`;
  }
  
  return `${(count / 1000000).toFixed(1)}M`;
};

/**
 * 格式化时间显示
 * @param timestamp 时间戳
 * @returns 格式化后的时间字符串
 */
export const formatTime = (timestamp: number | string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) {
    return '刚刚';
  }
  
  if (diffMins < 60) {
    return `${diffMins}分钟前`;
  }
  
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * 格式化价格显示
 * @param price 价格
 * @param unit 单位
 * @returns 格式化后的价格字符串
 */
export const formatPrice = (price: number, unit: string = '金币'): string => {
  if (price === 0) {
    return '免费';
  }
  
  return `${price} ${unit}`;
};

/**
 * 格式化视频时长
 * @param duration 时长(秒)
 * @returns 格式化后的时长字符串
 */
export const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// ══════════════════════════════════════════════════════════════
// 4. 搜索历史工具
// ══════════════════════════════════════════════════════════════

/**
 * 生成搜索历史项ID
 * @param keyword 关键词
 * @param timestamp 时间戳
 * @returns 历史项ID
 */
export const generateHistoryId = (keyword: string, timestamp: number): string => {
  return `${keyword}_${timestamp}`;
};

/**
 * 过滤重复的搜索历史
 * @param history 历史记录数组
 * @param newItem 新的历史项
 * @returns 过滤后的历史记录
 */
export const filterDuplicateHistory = (
  history: SearchHistoryItem[],
  newItem: SearchHistoryItem
): SearchHistoryItem[] => {
  // 移除相同关键词的历史记录
  const filtered = history.filter(item => item.keyword !== newItem.keyword);
  
  // 添加新记录到开头
  return [newItem, ...filtered];
};

/**
 * 限制搜索历史数量
 * @param history 历史记录数组
 * @param maxCount 最大数量
 * @returns 限制后的历史记录
 */
export const limitHistoryCount = (
  history: SearchHistoryItem[],
  maxCount: number = SEARCH_CONFIG.MAX_HISTORY
): SearchHistoryItem[] => {
  return history.slice(0, maxCount);
};

// ══════════════════════════════════════════════════════════════
// 5. 数据排序工具
// ══════════════════════════════════════════════════════════════

/**
 * 内容项排序 - 按相关度和时间
 * @param items 内容项数组
 * @param keyword 搜索关键词
 * @returns 排序后的数组
 */
export const sortContentItems = (
  items: ContentItem[],
  keyword: string
): ContentItem[] => {
  return items.sort((a, b) => {
    // 计算相关度分数
    const scoreA = calculateRelevanceScore(a, keyword);
    const scoreB = calculateRelevanceScore(b, keyword);
    
    if (scoreA !== scoreB) {
      return scoreB - scoreA; // 相关度高的排前面
    }
    
    // 相关度相同时按时间排序
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

/**
 * 用户排序 - 按在线状态和相关度
 * @param users 用户数组
 * @param keyword 搜索关键词
 * @returns 排序后的数组
 */
export const sortUsers = (users: UserInfo[], keyword: string): UserInfo[] => {
  return users.sort((a, b) => {
    // 在线用户优先
    const onlineA = a.status === 'online' ? 1 : 0;
    const onlineB = b.status === 'online' ? 1 : 0;
    
    if (onlineA !== onlineB) {
      return onlineB - onlineA;
    }
    
    // 计算相关度分数
    const scoreA = calculateUserRelevanceScore(a, keyword);
    const scoreB = calculateUserRelevanceScore(b, keyword);
    
    return scoreB - scoreA;
  });
};

/**
 * 服务排序 - 按评分和相关度
 * @param services 服务数组
 * @param keyword 搜索关键词
 * @returns 排序后的数组
 */
export const sortServices = (
  services: ServiceInfo[],
  keyword: string
): ServiceInfo[] => {
  return services.sort((a, b) => {
    // 评分高的优先
    if (a.rating !== b.rating) {
      return b.rating - a.rating;
    }
    
    // 计算相关度分数
    const scoreA = calculateServiceRelevanceScore(a, keyword);
    const scoreB = calculateServiceRelevanceScore(b, keyword);
    
    return scoreB - scoreA;
  });
};

// ══════════════════════════════════════════════════════════════
// 6. 相关度计算工具
// ══════════════════════════════════════════════════════════════

/**
 * 计算内容相关度分数
 * @param item 内容项
 * @param keyword 关键词
 * @returns 相关度分数
 */
const calculateRelevanceScore = (item: ContentItem, keyword: string): number => {
  let score = 0;
  const lowerKeyword = keyword.toLowerCase();
  
  // 标题匹配权重最高
  if (item.title.toLowerCase().includes(lowerKeyword)) {
    score += 10;
  }
  
  // 描述匹配
  if (item.description.toLowerCase().includes(lowerKeyword)) {
    score += 5;
  }
  
  // 标签匹配
  score += item.tags.filter(tag => 
    tag.toLowerCase().includes(lowerKeyword)
  ).length * 3;
  
  // 用户名匹配
  if (item.author.username.toLowerCase().includes(lowerKeyword)) {
    score += 2;
  }
  
  return score;
};

/**
 * 计算用户相关度分数
 * @param user 用户信息
 * @param keyword 关键词
 * @returns 相关度分数
 */
const calculateUserRelevanceScore = (user: UserInfo, keyword: string): number => {
  let score = 0;
  const lowerKeyword = keyword.toLowerCase();
  
  // 用户名匹配权重最高
  if (user.username.toLowerCase().includes(lowerKeyword)) {
    score += 10;
  }
  
  // 简介匹配
  if (user.bio.toLowerCase().includes(lowerKeyword)) {
    score += 5;
  }
  
  // 标签匹配
  score += user.tags.filter(tag => 
    tag.toLowerCase().includes(lowerKeyword)
  ).length * 3;
  
  // 游戏技能匹配
  score += user.gameSkills.filter(skill => 
    skill.toLowerCase().includes(lowerKeyword)
  ).length * 2;
  
  return score;
};

/**
 * 计算服务相关度分数
 * @param service 服务信息
 * @param keyword 关键词
 * @returns 相关度分数
 */
const calculateServiceRelevanceScore = (service: ServiceInfo, keyword: string): number => {
  let score = 0;
  const lowerKeyword = keyword.toLowerCase();
  
  // 服务标题匹配权重最高
  if (service.title.toLowerCase().includes(lowerKeyword)) {
    score += 10;
  }
  
  // 游戏类型匹配
  if (service.gameType.toLowerCase().includes(lowerKeyword)) {
    score += 8;
  }
  
  // 描述匹配
  if (service.description.toLowerCase().includes(lowerKeyword)) {
    score += 5;
  }
  
  // 标签匹配
  score += service.tags.filter(tag => 
    tag.toLowerCase().includes(lowerKeyword)
  ).length * 3;
  
  // 技能等级匹配
  if (service.skillLevel.toLowerCase().includes(lowerKeyword)) {
    score += 2;
  }
  
  return score;
};

// ══════════════════════════════════════════════════════════════
// 7. 缓存工具
// ══════════════════════════════════════════════════════════════

/**
 * 生成缓存键
 * @param keyword 关键词
 * @param type 搜索类型
 * @param page 页码
 * @returns 缓存键
 */
export const generateCacheKey = (
  keyword: string,
  type: string,
  page: number = 1
): string => {
  return `search_${type}_${keyword}_${page}`;
};

/**
 * 检查缓存是否过期
 * @param timestamp 缓存时间戳
 * @param duration 缓存时长(ms)
 * @returns 是否过期
 */
export const isCacheExpired = (
  timestamp: number,
  duration: number = SEARCH_CONFIG.CACHE_DURATION
): boolean => {
  return Date.now() - timestamp > duration;
};

// ══════════════════════════════════════════════════════════════
// 8. URL和深链接工具
// ══════════════════════════════════════════════════════════════

/**
 * 构建搜索URL
 * @param keyword 关键词
 * @param type 搜索类型
 * @returns 搜索URL
 */
export const buildSearchUrl = (keyword: string, type?: string): string => {
  const params = new URLSearchParams();
  params.set('q', keyword);
  
  if (type) {
    params.set('type', type);
  }
  
  return `/search?${params.toString()}`;
};

/**
 * 解析搜索URL参数
 * @param url 搜索URL
 * @returns 解析后的参数
 */
export const parseSearchUrl = (url: string): {
  keyword: string;
  type?: string;
} => {
  try {
    const urlObj = new URL(url, 'https://example.com');
    const params = urlObj.searchParams;
    
    return {
      keyword: params.get('q') || '',
      type: params.get('type') || undefined,
    };
  } catch {
    return { keyword: '' };
  }
};

// ══════════════════════════════════════════════════════════════
// 9. 性能监控工具
// ══════════════════════════════════════════════════════════════

/**
 * 搜索性能计时器
 */
export class SearchTimer {
  private startTime: number = 0;
  private endTime: number = 0;
  
  start(): void {
    this.startTime = performance.now();
  }
  
  end(): number {
    this.endTime = performance.now();
    return this.endTime - this.startTime;
  }
  
  getDuration(): number {
    return this.endTime - this.startTime;
  }
}

/**
 * 记录搜索统计信息
 * @param keyword 关键词
 * @param type 搜索类型
 * @param resultCount 结果数量
 * @param duration 搜索耗时
 */
export const logSearchStats = (
  keyword: string,
  type: string,
  resultCount: number,
  duration: number
): void => {
  // 这里可以接入统计服务
  console.log('Search Stats:', {
    keyword,
    type,
    resultCount,
    duration,
    timestamp: Date.now(),
  });
};

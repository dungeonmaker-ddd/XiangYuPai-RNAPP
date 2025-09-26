/**
 * FunctionGridArea 数据处理模块
 * 处理功能网格的数据逻辑
 */

import type { FunctionItem } from '../types';

// 文本图标映射（替代PNG图标避免中文文件名问题）
const ICON_MAP = {
  '王者荣耀': '🎮',
  '英雄联盟': '⚔️',
  '和平精英': '🔫',
  '荒野乱斗': '💥',
  '探店': '🏪',
  '私影': '🎬',
  '台球': '🎱',
  'K歌': '🎤',
  '喝酒': '🍺',
  '按摩': '💆',
} as const;

// 功能项配置
const FUNCTION_ITEMS: Array<Omit<FunctionItem, 'iconSource'>> = [
  // 第一行
  { id: '1', name: '王者荣耀', icon: '👑', color: '#FFD700' },
  { id: '2', name: '英雄联盟', icon: '⚔️', color: '#4A90E2' },
  { id: '3', name: '和平精英', icon: '🔫', color: '#FF8C00' },
  { id: '4', name: '荒野乱斗', icon: '💥', color: '#8B5CF6' },
  { id: '5', name: '探店', icon: '🏪', color: '#32CD32' },
  // 第二行
  { id: '6', name: '私影', icon: '📸', color: '#FF4500', isHot: true },
  { id: '7', name: '台球', icon: '🎱', color: '#FF69B4' },
  { id: '8', name: 'K歌', icon: '🎤', color: '#FFD700' },
  { id: '9', name: '喝酒', icon: '🍻', color: '#4A90E2' },
  { id: '10', name: '按摩', icon: '💆', color: '#999999' },
];

/**
 * 处理功能网格数据
 * 将配置数据转换为带图标源的完整数据
 */
export const processGridData = (): FunctionItem[] => {
  return FUNCTION_ITEMS.map(item => ({
    ...item,
    iconSource: ICON_MAP[item.name as keyof typeof ICON_MAP] || null,
  }));
};

/**
 * 根据类型筛选功能项
 */
export const processFilterByType = (type: string): FunctionItem[] => {
  const allItems = processGridData();
  
  switch (type) {
    case 'game':
      return allItems.filter(item => 
        ['王者荣耀', '英雄联盟', '和平精英', '荒野乱斗'].includes(item.name)
      );
    case 'entertainment':
      return allItems.filter(item => 
        ['私影', '台球', 'K歌', '喝酒'].includes(item.name)
      );
    case 'service':
      return allItems.filter(item => 
        ['探店', '按摩'].includes(item.name)
      );
    default:
      return allItems;
  }
};

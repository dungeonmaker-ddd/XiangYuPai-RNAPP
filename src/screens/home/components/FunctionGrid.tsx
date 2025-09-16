import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

// 导入共享常量和类型
import { SCREEN_WIDTH, COLORS } from '../constants';
import type { FunctionItem } from '../types';

// FunctionGrid 专用配置
const GRID_CONFIG = {
  columns: 5,
  rows: 2,
  gap: 20,
  iconSize: 48,
  labelSize: 12,
} as const;

// PNG图标映射 - 使用require静态导入
const ICON_MAP = {
  '王者荣耀': require('../../../../assets/icons/王者荣耀.png'),
  '英雄联盟': require('../../../../assets/icons/英雄联盟.png'),
  '和平精英': require('../../../../assets/icons/和平精英.png'),
  '荒野乱斗': require('../../../../assets/icons/荒野乱斗.png'),
  '探店': require('../../../../assets/icons/探店.png'),
  '私影': require('../../../../assets/icons/私影.png'),
  '台球': require('../../../../assets/icons/台球.png'),
  'K歌': require('../../../../assets/icons/K歌.png'),
  '喝酒': require('../../../../assets/icons/喝酒.png'),
  '按摩': require('../../../../assets/icons/按摩.png'),
};

// FunctionItem 类型已移动到 ./types.ts

interface FunctionGridProps {
  onFunctionPress: (functionId: string) => void;
}

const FUNCTION_ITEMS: FunctionItem[] = [
  // 第一行
  { id: '1', name: '王者荣耀', icon: '👑', color: '#FFD700' },
  { id: '2', name: '英雄联盟', icon: '⚔️', color: '#4A90E2' },
  { id: '3', name: '和平精英', icon: '🔫', color: '#FF8C00' },
  { id: '4', name: '荒野乱斗', icon: '💥', color: '#8B5CF6' },
  { id: '5', name: '探店', icon: '🏪', color: '#32CD32' },
  // 第二行
  { id: '6', name: '私影', icon: '📸', color: '#FF4500' },
  { id: '7', name: '台球', icon: '🎱', color: '#FF69B4' },
  { id: '8', name: 'K歌', icon: '🎤', color: '#FFD700' },
  { id: '9', name: '喝酒', icon: '🍻', color: '#4A90E2' },
  { id: '10', name: '按摩', icon: '💆', color: '#999999' },
];

// FunctionGrid Component
export const FunctionGrid = ({ onFunctionPress }: FunctionGridProps) => (
  <View style={[
    styles.paddingH16,
    styles.paddingV12,
    styles.borderRadius12,
    styles.shadow,
    styles.marginV8,
    {
      backgroundColor: COLORS.white,
      marginHorizontal: 14,
      gap: 16
    }
  ]}>
    {/* 渲染两行功能 */}
    {[0, 5].map(startIndex => (
      <View key={startIndex} style={[styles.rowSpaceBetween]}>
        {FUNCTION_ITEMS.slice(startIndex, startIndex + 5).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.center, {
              flex: 1,
              maxWidth: (SCREEN_WIDTH - 48) / 5
            }]}
            onPress={() => onFunctionPress(item.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.center, {
              width: 64,
              height: 64,
              position: 'relative'
            }]}>
              {ICON_MAP[item.name as keyof typeof ICON_MAP] ? (
                <Image
                  source={ICON_MAP[item.name as keyof typeof ICON_MAP]}
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                />
              ) : (
                <Text style={{ fontSize: 48, fontWeight: '500', color: item.color }}>{item.icon}</Text>
              )}
              {item.isHot && (
                <View style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: COLORS.red,
                }} />
              )}
            </View>
            <Text style={[styles.text, styles.textCenter, { fontSize: 12, marginTop: 8 }]}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ))}
  </View>
);

// 样式定义
const styles = StyleSheet.create({
  // 公共布局样式
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 公共文字样式
  text: {
    fontSize: 14,
    color: '#111827',
  },
  textCenter: {
    textAlign: 'center',
  },

  // 公共间距
  paddingH16: {
    paddingHorizontal: 16,
  },
  paddingV12: {
    paddingVertical: 12,
  },
  marginV8: {
    marginVertical: 8,
  },

  // 公共边框和阴影
  borderRadius12: {
    borderRadius: 12,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default FunctionGrid;

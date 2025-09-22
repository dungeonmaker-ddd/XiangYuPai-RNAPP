/**
 * FunctionGridArea - 功能服务网格区域组件
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */

// #region 1. Imports
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

// 内部模块导入
import { COLORS, SCREEN_WIDTH } from '../constants';
import type { FunctionItem } from '../types';
import { processGridData } from './processData';
import { utilsGridLayout } from './utilsLayout';
// #endregion

// #region 2. Types & Schema
interface FunctionGridAreaProps {
  onFunctionPress: (functionId: string) => void;
}
// #endregion

// #region 3. Constants & Config
const GRID_CONFIG = {
  columns: 5,
  rows: 2,
  gap: 16,
  iconSize: 64,
  labelSize: 12,
} as const;
// #endregion

// #region 4. Utils & Helpers
// 工具函数已移至 ./utilsLayout.ts
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑已移至 ./processData.ts
// #endregion

// #region 7. UI Components & Rendering
/**
 * FunctionGridArea 组件 - 功能服务网格区域
 * 2行5列的功能图标网格布局
 */
const FunctionGridArea: React.FC<FunctionGridAreaProps> = ({ onFunctionPress }) => {
  const functionItems = processGridData();
  const { getItemWidth, getContainerStyle } = utilsGridLayout(SCREEN_WIDTH);

  const renderFunctionItem = (item: FunctionItem, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.functionItem,
        {
          flex: 1,
          maxWidth: getItemWidth(),
        }
      ]}
      onPress={() => onFunctionPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {item.iconSource ? (
          <Image
            source={item.iconSource}
            style={styles.functionIcon}
            resizeMode="contain"
          />
        ) : (
          <Text style={[styles.emojiIcon, { color: item.color }]}>{item.icon}</Text>
        )}
        {item.isHot && (
          <View style={styles.hotIndicator} />
        )}
      </View>
      <Text style={styles.functionLabel}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFunctionRow = (startIndex: number) => (
    <View key={startIndex} style={styles.functionRow}>
      {functionItems.slice(startIndex, startIndex + 5).map((item, index) => 
        renderFunctionItem(item, startIndex + index)
      )}
    </View>
  );

  return (
    <View style={[styles.container, getContainerStyle()]}>
      {[0, 5].map(startIndex => renderFunctionRow(startIndex))}
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 8,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  functionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  functionItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: GRID_CONFIG.iconSize,
    height: GRID_CONFIG.iconSize,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  functionIcon: {
    width: GRID_CONFIG.iconSize,
    height: GRID_CONFIG.iconSize,
  },
  emojiIcon: {
    fontSize: 48,
    fontWeight: '500',
  },
  hotIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
  },
  functionLabel: {
    fontSize: GRID_CONFIG.labelSize,
    color: '#111827',
    textAlign: 'center',
    marginTop: 8,
  },
});
// #endregion

// #region 9. Exports
export default FunctionGridArea;
export type { FunctionGridAreaProps };
// #endregion

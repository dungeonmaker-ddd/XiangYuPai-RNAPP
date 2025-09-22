// #region 1. File Banner & TOC
/**
 * 举报类型选择区域 - 8种预设举报类型的网格选择器
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
// #endregion

// #region 2. Imports
import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

// 内部导入
import type { TypeSelectionAreaProps } from '../types';
import { REPORT_CONSTANTS } from '../constants';
import { TypeCard } from './TypeCard';
// #endregion

// #region 3. Types & Schema
interface LocalProps extends TypeSelectionAreaProps {
  // 扩展本地Props
}

interface TypeGridLayoutProps {
  reportTypes: any[];
  selectedType: any;
  onTypeSelect: (type: any) => void;
}
// #endregion

// #region 4. Constants & Config
const LAYOUT_CONFIG = {
  cardsPerRow: 2,
  cardSpacing: 12,
  sectionPadding: 16,
  titleSpacing: 24,
} as const;
// #endregion

// #region 5. Utils & Helpers
// 计算卡片布局
const calculateCardLayout = (screenWidth: number, padding: number, spacing: number, cardsPerRow: number) => {
  const availableWidth = screenWidth - (padding * 2);
  const totalSpacing = spacing * (cardsPerRow - 1);
  const cardWidth = (availableWidth - totalSpacing) / cardsPerRow;
  
  return {
    cardWidth: Math.floor(cardWidth),
    cardHeight: 56,
  };
};
// #endregion

// #region 6. State Management
// 无复杂状态管理需求
// #endregion

// #region 7. Domain Logic
// 事件处理逻辑已通过props传入
// #endregion

// #region 8. UI Components & Rendering
// 类型网格组件
const TypeGrid: React.FC<TypeGridLayoutProps> = React.memo(({
  reportTypes,
  selectedType,
  onTypeSelect,
}) => {
  return (
    <View style={styles.gridContainer}>
      {reportTypes.map((type, index) => (
        <TypeCard
          key={type.id}
          type={type}
          isSelected={selectedType?.id === type.id}
          onPress={onTypeSelect}
          style={[
            styles.gridItem,
            // 每行最后一个不需要右边距
            (index + 1) % LAYOUT_CONFIG.cardsPerRow === 0 && styles.gridItemLast,
          ]}
        />
      ))}
    </View>
  );
});

// 主组件
export const TypeSelectionArea: React.FC<LocalProps> = ({
  reportTypes,
  selectedType,
  onTypeSelect,
  validationError,
}) => {
  const handleTypeSelect = useCallback((type: any) => {
    onTypeSelect(type);
  }, [onTypeSelect]);

  return (
    <View style={styles.container}>
      {/* 标题区域 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>请选择你要举报的类型</Text>
        {validationError && (
          <Text style={styles.errorText}>{validationError.message}</Text>
        )}
      </View>

      {/* 类型选择网格 */}
      <TypeGrid
        reportTypes={reportTypes}
        selectedType={selectedType}
        onTypeSelect={handleTypeSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: LAYOUT_CONFIG.sectionPadding,
    paddingTop: 32,
    paddingBottom: 24,
  },
  
  // 标题样式
  titleContainer: {
    marginBottom: LAYOUT_CONFIG.titleSpacing,
  },
  title: {
    fontSize: 18,
    color: REPORT_CONSTANTS.COLORS.text.primary,
    fontWeight: '600',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 14,
    color: REPORT_CONSTANTS.COLORS.error,
    marginTop: 8,
    lineHeight: 20,
  },
  
  // 网格样式
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // 每行两个，留出间距
    marginBottom: LAYOUT_CONFIG.cardSpacing,
  },
  gridItemLast: {
    marginRight: 0,
  },
});
// #endregion

// #region 9. Exports
export default TypeSelectionArea;
// #endregion

// #region 1. File Banner & TOC
/**
 * 字符计数器组件 - 实时显示字数统计
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
import React from 'react';
import {
  Text,
  StyleSheet,
} from 'react-native';
// #endregion

// #region 3. Types & Schema
interface CharacterCounterProps {
  currentLength: number;
  maxLength: number;
  color: string;
  style?: any;
}
// #endregion

// #region 4. Constants & Config
const COUNTER_CONFIG = {
  fontSize: 12,
  lineHeight: 16,
} as const;
// #endregion

// #region 5. Utils & Helpers
// 格式化计数显示
const formatCount = (current: number, max: number): string => {
  return `${current}/${max}`;
};
// #endregion

// #region 6. State Management
// 无状态管理需求
// #endregion

// #region 7. Domain Logic
// 无复杂业务逻辑
// #endregion

// #region 8. UI Components & Rendering
export const CharacterCounter: React.FC<CharacterCounterProps> = React.memo(({
  currentLength,
  maxLength,
  color,
  style,
}) => {
  const displayText = formatCount(currentLength, maxLength);
  
  return (
    <Text
      style={[
        styles.counter,
        { color },
        style,
      ]}
      accessible={true}
      accessibilityLabel={`字数统计：已输入${currentLength}字，最多${maxLength}字`}
    >
      {displayText}
    </Text>
  );
});

const styles = StyleSheet.create({
  counter: {
    fontSize: COUNTER_CONFIG.fontSize,
    lineHeight: COUNTER_CONFIG.lineHeight,
    textAlign: 'right',
  },
});
// #endregion

// #region 9. Exports
export default CharacterCounter;
// #endregion

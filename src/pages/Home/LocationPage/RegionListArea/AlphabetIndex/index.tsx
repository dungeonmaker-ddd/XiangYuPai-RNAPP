/**
 * 地区选择模块 - 字母索引
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
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { AlphabetItem } from '../../types';
import { COLORS, FONTS, SIZES, SPACING, ALPHABET } from '../../constants';
// #endregion

// #region 2. Types & Schema
interface AlphabetIndexProps {
  alphabetData: AlphabetItem[];
  activeAlphabet: string | null;
  onAlphabetPress: (letter: string) => void;
}
// #endregion

// #region 3. Constants & Config
// 常量在imports中已引入
// #endregion

// #region 4. Utils & Helpers
// 检查字母是否有对应的地区数据
const hasRegionsForLetter = (letter: string, alphabetData: AlphabetItem[]): boolean => {
  return alphabetData.some(item => item.letter === letter && item.regions.length > 0);
};
// #endregion

// #region 5. State Management
// 此组件不包含状态管理
// #endregion

// #region 6. Domain Logic
// 业务逻辑通过props传入
// #endregion

// #region 7. UI Components & Rendering
const AlphabetIndex: React.FC<AlphabetIndexProps> = ({
  alphabetData,
  activeAlphabet,
  onAlphabetPress,
}) => {
  return (
    <View style={styles.alphabetContainer}>
      {ALPHABET.map((letter) => {
        const hasRegions = hasRegionsForLetter(letter, alphabetData);
        const isActive = activeAlphabet === letter;
        
        return (
          <TouchableOpacity
            key={letter}
            style={[
              styles.alphabetItem,
              isActive && styles.alphabetItemActive,
              !hasRegions && styles.alphabetItemDisabled,
            ]}
            onPress={() => hasRegions && onAlphabetPress(letter)}
            activeOpacity={hasRegions ? 0.7 : 1}
            disabled={!hasRegions}
          >
            <Text
              style={[
                styles.alphabetText,
                isActive && styles.alphabetTextActive,
                !hasRegions && styles.alphabetTextDisabled,
              ]}
            >
              {letter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  alphabetContainer: {
    width: SIZES.alphabetWidth,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  alphabetItem: {
    height: SIZES.alphabetItemHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1,
  },
  alphabetItemActive: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.alphabetItemHeight / 2,
    width: SIZES.alphabetItemHeight,
  },
  alphabetItemDisabled: {
    opacity: 0.3,
  },
  alphabetText: {
    fontSize: FONTS.size.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  alphabetTextActive: {
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  alphabetTextDisabled: {
    color: COLORS.textLight,
  },
});
// #endregion

// #region 8. Exports
export default AlphabetIndex;
export type { AlphabetIndexProps };
// #endregion

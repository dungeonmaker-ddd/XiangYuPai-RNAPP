/**
 * 🟢 加载状态功能区域 - 扁平实现
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { LoadingStatesProps } from '../types';
import { COLORS, FONT_SIZE, SPACING } from '../../constants';

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  type,
  message,
  onRetry,
}) => {
  const renderContent = () => {
    switch (type) {
      case 'loading':
        return (
          <View style={styles.container}>
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        );
      
      case 'empty':
        return (
          <View style={styles.container}>
            <Text style={styles.emptyText}>暂无数据</Text>
          </View>
        );
      
      case 'error':
        return (
          <View style={styles.container}>
            <Text style={styles.errorText}>{message || '加载失败'}</Text>
            {onRetry && (
              <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryText}>重试</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return renderContent();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XXXL,
  },
  loadingText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
  },
  errorText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.SM,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.TEXT_WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: '600',
  },
});

export default LoadingStates;

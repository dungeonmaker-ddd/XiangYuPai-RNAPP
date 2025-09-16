/**
 * 交易功能区域组件
 * 4宫格布局展示发布、订单、购买、报名功能
 */

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import type { TransactionSectionProps } from '../types';
import { TRANSACTION_FUNCTIONS } from '../constants';
import { TitleIconButton } from './TitleIconButton';
import { LayoutCard } from './LayoutCard';

// 图标映射已移至TitleIconButton组件中

export const TransactionSection: React.FC<TransactionSectionProps> = React.memo(({
  transactionCounts,
  onFunctionPress,
}) => {

  // 获取功能配置和对应的角标数量
  const getFunctionWithBadge = React.useCallback((functionConfig: typeof TRANSACTION_FUNCTIONS[number]) => {
    let badge = 0;
    
    switch (functionConfig.id) {
      case 'publish':
        // 发布功能暂不显示角标
        break;
      case 'orders':
        badge = transactionCounts?.newOrdersCount || 0;
        break;
      case 'purchase':
        // 购买功能暂不显示角标
        break;
      case 'enrollment':
        badge = transactionCounts?.newEnrollmentCount || 0;
        break;
    }
    
    return { ...functionConfig, badge };
  }, [transactionCounts]);

  return (
    <LayoutCard 
      title="交易" 
      containerStyle={styles.container}
    >
      {/* 功能网格 */}
      <View style={styles.functionGrid}>
        {TRANSACTION_FUNCTIONS.map((functionConfig) => {
          const functionWithBadge = getFunctionWithBadge(functionConfig);
          
          return (
            <TitleIconButton
              key={functionConfig.id}
              config={functionWithBadge}
              onPress={() => onFunctionPress(functionConfig.id)}
              badge={functionWithBadge.badge}
              accessibilityLabel={`${functionConfig.title}${functionWithBadge.badge > 0 ? `, ${functionWithBadge.badge} 条新消息` : ''}`}
              accessibilityHint={`点击进入${functionConfig.title}页面`}
            />
          );
        })}
      </View>
    </LayoutCard>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: -24, // 减少顶部重叠，与UserHeader的间距
  },
  functionGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // 图标行之间间距8px
    justifyContent: 'space-between', // 平分剩余空间，让按钮贴近边缘
    // 移除paddingHorizontal，避免与LayoutCard重复
  },
});

export default TransactionSection;

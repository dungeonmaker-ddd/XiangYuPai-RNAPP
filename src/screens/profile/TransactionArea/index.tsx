// #region 1. File Banner & TOC
/**
 * 交易功能区域 - 4宫格布局展示发布、订单、购买、报名功能
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
  View,
  StyleSheet,
} from 'react-native';

// 内部导入
import type { TransactionAreaProps } from '../types';
import { TRANSACTION_FUNCTIONS } from '../constants';
import { FunctionButton } from './FunctionButton';
import { LayoutCard } from './LayoutCard';
// #endregion

// #region 3. Types & Schema
interface LocalProps extends TransactionAreaProps {
  // 扩展本地Props
}
// #endregion

// #region 4. Constants & Config
// 功能配置已在constants中定义
// #endregion

// #region 5. Utils & Helpers
const getBadgeCount = (functionId: string, counts: any): number => {
  switch (functionId) {
    case 'orders':
      return counts?.newOrdersCount || 0;
    case 'enrollment':
      return counts?.newEnrollmentCount || 0;
    default:
      return 0;
  }
};
// #endregion

// #region 6. State Management
// 无复杂状态管理需求
// #endregion

// #region 7. Domain Logic
// 事件处理逻辑已通过props传入
// #endregion

// #region 8. UI Components & Rendering
export const TransactionArea: React.FC<LocalProps> = React.memo(({
  transactionCounts,
  onFunctionPress,
}) => {
  return (
    <LayoutCard 
      title="交易" 
      containerStyle={styles.container}
    >
      {/* 功能网格 */}
      <View style={styles.functionGrid}>
        {TRANSACTION_FUNCTIONS.map((functionConfig) => {
          const badge = getBadgeCount(functionConfig.id, transactionCounts);
          
          return (
            <FunctionButton
              key={functionConfig.id}
              config={functionConfig}
              onPress={() => onFunctionPress(functionConfig.id)}
              badge={badge}
              accessibilityLabel={`${functionConfig.title}${badge > 0 ? `, ${badge} 条新消息` : ''}`}
              accessibilityHint={`点击进入${functionConfig.title}页面`}
              size="small"
            />
          );
        })}
      </View>
    </LayoutCard>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: -24, // 减少顶部重叠，与UserInfoArea的间距
  },
  functionGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // 图标行之间间距8px
    justifyContent: 'space-between', // 平分剩余空间，让按钮贴近边缘
    paddingHorizontal: 18, // 与LayoutCard内边距保持一致
  },
});
// #endregion

// #region 9. Exports
export default TransactionArea;
// #endregion

/**
 * 功能网格组件
 * 集成功能卡片展示，使用可复用组件实现
 * 专注于功能组的展示和交互
 */

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import type { ToolsSectionProps } from '../types';
import { TOOL_FUNCTIONS } from '../constants';
import { TitleIconButton } from './TitleIconButton';
import { LayoutCard } from './LayoutCard';

// Badge计算工具函数 - 业务逻辑分离
const calculateBadgeCount = (functionId: string, walletInfo: any): number => {
  switch (functionId) {
    case 'wallet':
      return walletInfo?.balance && walletInfo.balance > 0 
        ? Math.floor(walletInfo.balance) 
        : 0;
    case 'coins':
      return walletInfo?.coinBalance && walletInfo.coinBalance > 0
        ? Math.min(walletInfo.coinBalance, 9999)
        : 0;
    case 'settings':
      // TODO: 实现系统更新检查
      return 0;
    case 'customer-service':
      // TODO: 实现未读消息计数
      return 0;
    default:
      return 0;
  }
};

// 图标映射已移至TitleIconButton组件中

// 功能分组配置
const FUNCTION_GROUPS = [
  { startIndex: 0, endIndex: 4, key: 'primary' }, // 个人中心、状态、钱包、金币
  { startIndex: 4, endIndex: 7, key: 'secondary' }, // 设置、客服、达人认证
];

export const FunctionGrid: React.FC<ToolsSectionProps> = ({
  walletInfo,
  onFunctionPress,
}) => {

  // 渲染功能行组件
  const renderFunctionRow = (groupConfig: any) => {
    const functions = TOOL_FUNCTIONS.slice(groupConfig.startIndex, groupConfig.endIndex);
    const isSecondaryGroup = groupConfig.key === 'secondary';
    
    return (
      <View key={groupConfig.key} style={styles.functionRow}>
        {functions.map((functionConfig) => {
          const badge = calculateBadgeCount(functionConfig.id, walletInfo);
          
          return (
            <TitleIconButton
              key={functionConfig.id}
              config={functionConfig}
              badge={badge}
              onPress={() => onFunctionPress(functionConfig.id)}
              size="large" // 使用大尺寸
            />
          );
        })}
        
        {/* 第二行需要填充空白位置 */}
        {isSecondaryGroup && <View style={styles.emptySlot} />}
      </View>
    );
  };

  return (
    <LayoutCard title="更多功能">
      {/* 功能组渲染 */}
      {FUNCTION_GROUPS.map(renderFunctionRow)}
    </LayoutCard>
  );
};

const styles = StyleSheet.create({
  functionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0, // 图标行之间间距4px，减少了4px
    justifyContent: 'space-between', // 平分剩余空间，让按钮贴近边缘
    // 移除paddingHorizontal，避免与LayoutCard重复
  },
  emptySlot: {
    flex: 1, // 与TitleIconButton的flex布局保持一致
    aspectRatio: 1, // 保持正方形比例
    minHeight: 85, // 与大尺寸TitleIconButton保持一致
    maxHeight: 95,
    // 移除marginHorizontal，与TitleIconButton保持一致
  },
});

export default FunctionGrid;

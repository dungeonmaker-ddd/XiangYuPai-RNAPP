// #region 1. File Banner & TOC
/**
 * 工具功能区域 - 更多功能的网格布局展示
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
import type { ToolsAreaProps } from '../types';
import { TOOL_FUNCTIONS } from '../constants';
import { FunctionButton } from '../TransactionArea/FunctionButton';
import { LayoutCard } from '../TransactionArea/LayoutCard';
// #endregion

// #region 3. Types & Schema
interface LocalProps extends ToolsAreaProps {
  // 扩展本地Props
}
// #endregion

// #region 4. Constants & Config
// 功能分组配置
const FUNCTION_GROUPS = [
  { startIndex: 0, endIndex: 4, key: 'primary' }, // 个人中心、状态、钱包、金币
  { startIndex: 4, endIndex: 7, key: 'secondary' }, // 设置、客服、达人认证
];
// #endregion

// #region 5. Utils & Helpers
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
// #endregion

// #region 6. State Management
// 无复杂状态管理需求
// #endregion

// #region 7. Domain Logic
// 事件处理逻辑已通过props传入
// #endregion

// #region 8. UI Components & Rendering
export const ToolsArea: React.FC<LocalProps> = ({
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
            <FunctionButton
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
    paddingHorizontal: 18, // 与LayoutCard内边距保持一致
  },
  emptySlot: {
    flex: 1, // 与FunctionButton的flex布局保持一致
    aspectRatio: 1, // 保持正方形比例
    minHeight: 85, // 与大尺寸FunctionButton保持一致
    maxHeight: 95,
  },
});
// #endregion

// #region 9. Exports
export default ToolsArea;
// #endregion

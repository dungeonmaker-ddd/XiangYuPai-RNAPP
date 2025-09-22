/**
 * 详情页面头部组件
 * 包含返回按钮和更多功能菜单
 * 
 * 功能：
 * - 返回导航
 * - 分享功能
 * - 举报跳转（集成举报模块）
 * - 屏蔽用户
 * - 自定义操作菜单
 */

import React, { memo, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 举报相关类型导入
import type { ReportTargetType } from '../../profile-report/types';
// 导航事件处理导入
import { createNavigationEventHandlers, type ReportNavigationParams } from '../events';

export interface DetailHeaderProps {
  /** 返回按钮点击回调 */
  onBackPress: () => void;
  /** 分享功能回调 */
  onShare?: () => void;
  /** 举报功能回调（可选，如不提供则使用内置导航） */
  onReport?: () => void;
  /** 屏蔽用户回调 */
  onBlockUser?: () => void;
  /** 自定义更多操作菜单 */
  customActions?: Array<{
    title: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
  /** 是否显示背景 */
  showBackground?: boolean;
  /** 背景透明度 */
  backgroundOpacity?: number;
  /** 举报目标信息（用于内置举报功能） */
  reportTarget?: {
    targetId: string;
    targetType: ReportTargetType;
    targetTitle?: string;
    targetAuthor?: string;
  };
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  onBackPress,
  onShare,
  onReport,
  onBlockUser,
  customActions,
  showBackground = false,
  backgroundOpacity = 0,
  reportTarget,
}) => {
  const navigation = useNavigation();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // 创建导航事件处理器
  const navigationHandlers = createNavigationEventHandlers(navigation as any);

  // 处理更多操作菜单
  const handleMoreOptions = useCallback(() => {
    console.log('DetailHeader: 点击更多操作按钮');
    setShowDropdown(true);
  }, []);

  const closeDropdown = useCallback(() => {
    console.log('DetailHeader: 关闭下拉菜单');
    setShowDropdown(false);
  }, []);

  const handleAction = useCallback((action: () => void) => {
    closeDropdown();
    action();
  }, [closeDropdown]);

  // 处理举报功能
  const handleReport = useCallback(() => {
    closeDropdown();
    
    if (onReport) {
      // 如果提供了自定义举报回调，使用自定义回调
      onReport();
    } else if (reportTarget) {
      // 使用导航事件处理器跳转到举报页面
      navigationHandlers.navigateToReport({
        targetId: reportTarget.targetId,
        targetType: reportTarget.targetType,
        targetTitle: reportTarget.targetTitle,
        targetAuthor: reportTarget.targetAuthor,
      });
    } else {
      // 如果没有提供举报目标信息，显示提示
      console.warn('DetailHeader: 缺少举报目标信息，无法跳转到举报页面');
    }
  }, [navigationHandlers, onReport, reportTarget, closeDropdown]);

  const containerStyle = [
    styles.container,
    showBackground && {
      backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
      ...styles.containerWithBackground,
    },
  ];

  // 调试信息
  console.log('DetailHeader: showDropdown 状态:', showDropdown);
  console.log('DetailHeader: 菜单项检查:', { 
    onShare: !!onShare, 
    onReport: !!onReport, 
    reportTarget: !!reportTarget, 
    onBlockUser: !!onBlockUser, 
    customActions: customActions?.length || 0 
  });

  return (
    <>
      <View style={containerStyle}>
        {/* 返回按钮 */}
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={onBackPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.navIcon}>‹</Text>
        </TouchableOpacity>
        
        {/* 更多操作按钮 */}
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={handleMoreOptions}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.navIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* 下拉菜单 */}
      {showDropdown && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.overlayTouchable} 
            activeOpacity={1} 
            onPress={closeDropdown}
          />
          <View style={styles.dropdownContainer}>
            {onShare && (
              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => handleAction(onShare)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownIcon}>📤</Text>
                <Text style={styles.dropdownText}>分享</Text>
              </TouchableOpacity>
            )}
            
            {(onReport || reportTarget) && (
              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={handleReport}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownIcon}>⚠️</Text>
                <Text style={styles.dropdownText}>举报</Text>
              </TouchableOpacity>
            )}
            
            {onBlockUser && (
              <TouchableOpacity 
                style={[styles.dropdownItem, styles.destructiveItem]} 
                onPress={() => handleAction(onBlockUser)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownIcon}>🚫</Text>
                <Text style={[styles.dropdownText, styles.destructiveText]}>屏蔽用户</Text>
              </TouchableOpacity>
            )}
            
            {customActions && customActions.map((action, index) => {
              const isLast = index === customActions.length - 1;
              const hasOtherActions = onShare || onReport || reportTarget || onBlockUser;
              const isReallyLast = isLast && !hasOtherActions;
              
              return (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.dropdownItem,
                    action.style === 'destructive' && styles.destructiveItem,
                    isReallyLast && styles.lastDropdownItem
                  ]} 
                  onPress={() => handleAction(action.onPress)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownIcon}>⚙️</Text>
                  <Text style={[
                    styles.dropdownText,
                    action.style === 'destructive' && styles.destructiveText
                  ]}>
                    {action.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
            
            {/* 默认测试菜单项 - 如果没有其他菜单项时显示 */}
            {!onShare && !onReport && !reportTarget && !onBlockUser && (!customActions || customActions.length === 0) && (
              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={closeDropdown}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownIcon}>ℹ️</Text>
                <Text style={styles.dropdownText}>暂无可用操作</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 999,
  },
  containerWithBackground: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 34,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 90,
    paddingRight: 20,
    zIndex: 9999,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 140,
    maxWidth: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  destructiveItem: {
    borderBottomColor: '#FFE6E6',
  },
  destructiveText: {
    color: '#FF3B30',
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
});

export default memo(DetailHeader);

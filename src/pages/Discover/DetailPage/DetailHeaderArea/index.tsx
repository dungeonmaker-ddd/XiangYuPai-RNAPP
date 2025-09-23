/**
 * 详情页面头部区域组件
 * 包含返回按钮和更多功能菜单
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

// ==================== 1. Imports ====================
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
// 临时定义类型，避免依赖不存在的模块
type ReportTargetType = 'content' | 'user' | 'comment';

// 临时导航处理函数
const createNavigationEventHandlers = (navigation: any) => ({
  navigateToReport: (params: any) => {
    console.log('导航到举报页面:', params);
    // TODO: 实现实际的导航逻辑
  }
});

// ==================== 2. Types & Schema ====================
export interface DetailHeaderAreaProps {
  onBackPress: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onBlockUser?: () => void;
  customActions?: Array<{
    title: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
  showBackground?: boolean;
  backgroundOpacity?: number;
  reportTarget?: {
    targetId: string;
    targetType: ReportTargetType;
    targetTitle?: string;
    targetAuthor?: string;
  };
}

// ==================== 3. Constants & Config ====================
const BUTTON_SIZE = 48;
const ICON_SIZE = 34;

// ==================== 4. Utils & Helpers ====================
// 工具函数在组件内部实现

// ==================== 5. State Management ====================
// 状态管理在主组件中实现

// ==================== 6. Domain Logic ====================
// 业务逻辑在主组件中实现

// ==================== 7. UI Components & Rendering ====================
const DetailHeaderArea: React.FC<DetailHeaderAreaProps> = ({
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
  
  const navigationHandlers = createNavigationEventHandlers(navigation as any);

  const handleMoreOptions = useCallback(() => {
    console.log('DetailHeaderArea: 点击更多操作按钮');
    setShowDropdown(true);
  }, []);

  const closeDropdown = useCallback(() => {
    console.log('DetailHeaderArea: 关闭下拉菜单');
    setShowDropdown(false);
  }, []);

  const handleAction = useCallback((action: () => void) => {
    closeDropdown();
    action();
  }, [closeDropdown]);

  const handleReport = useCallback(() => {
    closeDropdown();
    
    if (onReport) {
      onReport();
    } else if (reportTarget) {
      navigationHandlers.navigateToReport({
        targetId: reportTarget.targetId,
        targetType: reportTarget.targetType,
        targetTitle: reportTarget.targetTitle,
        targetAuthor: reportTarget.targetAuthor,
      });
    } else {
      console.warn('DetailHeaderArea: 缺少举报目标信息，无法跳转到举报页面');
    }
  }, [navigationHandlers, onReport, reportTarget, closeDropdown]);

  const containerStyle = [
    styles.container,
    showBackground && {
      backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
      ...styles.containerWithBackground,
    },
  ];

  console.log('DetailHeaderArea: showDropdown 状态:', showDropdown);
  console.log('DetailHeaderArea: 菜单项检查:', { 
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
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: ICON_SIZE,
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

// ==================== 8. Exports ====================
export default memo(DetailHeaderArea);

/**
 * 详情页面头部组件
 * 包含返回按钮和更多功能菜单
 */

import React, { memo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Dimensions,
} from 'react-native';

export interface DetailHeaderProps {
  /** 返回按钮点击回调 */
  onBackPress: () => void;
  /** 分享功能回调 */
  onShare?: () => void;
  /** 举报功能回调 */
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
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  onBackPress,
  onShare,
  onReport,
  onBlockUser,
  customActions,
  showBackground = false,
  backgroundOpacity = 0,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // 处理更多操作菜单
  const handleMoreOptions = () => {
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleAction = (action: () => void) => {
    closeDropdown();
    action();
  };

  const containerStyle = [
    styles.container,
    showBackground && {
      backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
      ...styles.containerWithBackground,
    },
  ];

  return (
    <>
      <View style={containerStyle}>
        {/* 返回按钮 */}
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>‹</Text>
        </TouchableOpacity>
        
        {/* 更多操作按钮 */}
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={handleMoreOptions}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* 下拉菜单 */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeDropdown}
        >
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
            
            {onReport && (
              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => handleAction(onReport)}
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
            
            {customActions && customActions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.dropdownItem,
                  action.style === 'destructive' && styles.destructiveItem
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
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 90,
    paddingRight: 20,
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
});

export default memo(DetailHeader);

/**
 * 我的页面主组件
 * 基于设计文档实现的完整个人中心页面
 * 遵循300行单文件架构设计原则
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// 内部组件导入
import { 
  UserHeader, 
  TransactionSection, 
  FunctionGrid,
  AvatarSkeleton,
  TransactionSectionSkeleton,
} from './components';

// 类型和常量导入
import type {
  UserInfo,
  TransactionCounts,
  WalletInfo,
  ProfilePageState,
  UserUpdateRequest,
} from './types';
import {
  COLORS,
  SIZES,
  FONT_SIZES,
  API_ENDPOINTS,
  DEFAULT_VALUES,
  ERROR_MESSAGES,
} from './constants';

// 工具函数
const formatError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return ERROR_MESSAGES.NETWORK_ERROR;
};

// 模拟API服务 (实际项目中应该从独立的service文件导入)
const profileService = {
  async getUserProfile(): Promise<UserInfo> {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          username: 'user123',
          nickname: '用户名称',
          avatar: null,
          bio: DEFAULT_VALUES.DEFAULT_BIO,
          status: 'online',
          isVerified: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-12-19',
        });
      }, 1000);
    });
  },

  async getTransactionCounts(): Promise<TransactionCounts> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          publishCount: 5,
          orderCount: 12,
          purchaseCount: 8,
          enrollmentCount: 3,
          newOrdersCount: 2,
          newEnrollmentCount: 1,
        });
      }, 800);
    });
  },

  async getWalletInfo(): Promise<WalletInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          balance: 1250.50,
          frozenBalance: 100.00,
          coinBalance: 3580,
          totalEarning: 5600.00,
          totalSpending: 2300.00,
        });
      }, 600);
    });
  },

  async updateUserProfile(data: UserUpdateRequest): Promise<UserInfo> {
    // 模拟更新
    return this.getUserProfile();
  },

  async uploadAvatar(file: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: 'https://example.com/avatar.jpg',
          size: 1024000,
          format: 'jpg',
        });
      }, 2000);
    });
  },
};

// 获取屏幕尺寸
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 主组件
export const ProfileScreen: React.FC = () => {
  // 状态管理
  const [state, setState] = useState<ProfilePageState>({
    userInfo: null,
    transactionCounts: null,
    walletInfo: null,
    isLoading: true,
    error: null,
    refreshing: false,
  });

  // 加载用户信息
  const loadUserInfo = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const userInfo = await profileService.getUserProfile();
      setState(prev => ({ ...prev, userInfo }));
    } catch (error) {
      setState(prev => ({ ...prev, error: formatError(error) }));
    }
  }, []);

  // 加载交易统计
  const loadTransactionCounts = useCallback(async () => {
    try {
      const counts = await profileService.getTransactionCounts();
      setState(prev => ({ ...prev, transactionCounts: counts }));
    } catch (error) {
      console.warn('Failed to load transaction counts:', error);
    }
  }, []);

  // 加载钱包信息
  const loadWalletInfo = useCallback(async () => {
    try {
      const walletInfo = await profileService.getWalletInfo();
      setState(prev => ({ ...prev, walletInfo }));
    } catch (error) {
      console.warn('Failed to load wallet info:', error);
    }
  }, []);

  // 初始化数据加载
  const initializeData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await Promise.all([
        loadUserInfo(),
        loadTransactionCounts(),
        loadWalletInfo(),
      ]);
    } catch (error) {
      setState(prev => ({ ...prev, error: formatError(error) }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [loadUserInfo, loadTransactionCounts, loadWalletInfo]);

  // 下拉刷新
  const handleRefresh = useCallback(async () => {
    setState(prev => ({ ...prev, refreshing: true }));
    await initializeData();
    setState(prev => ({ ...prev, refreshing: false }));
  }, [initializeData]);

  // 头像点击处理
  const handleAvatarPress = useCallback(() => {
    Alert.alert(
      '更换头像',
      '选择头像来源',
      [
        { text: '拍照', onPress: () => console.log('Camera') },
        { text: '相册', onPress: () => console.log('Gallery') },
        { text: '取消', style: 'cancel' },
      ]
    );
  }, []);

  // 编辑昵称
  const handleEditNickname = useCallback(() => {
    Alert.prompt(
      '编辑昵称',
      '请输入新昵称',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '保存',
          onPress: async (nickname) => {
            if (nickname && nickname.trim()) {
              try {
                const updatedUser = await profileService.updateUserProfile({ nickname: nickname.trim() });
                setState(prev => ({ ...prev, userInfo: updatedUser }));
              } catch (error) {
                Alert.alert('错误', formatError(error));
              }
            }
          },
        },
      ],
      'plain-text',
      state.userInfo?.nickname
    );
  }, [state.userInfo?.nickname]);

  // 编辑简介
  const handleEditBio = useCallback(() => {
    console.log('Edit bio');
    // 实际实现中会打开编辑页面
  }, []);

  // 查看完整资料
  const handleViewProfile = useCallback(() => {
    console.log('View full profile');
    // 实际实现中会导航到个人资料详情页
  }, []);

  // 功能点击处理
  const handleFunctionPress = useCallback((functionId: string) => {
    console.log('Function pressed:', functionId);
    // 实际实现中会根据functionId进行路由跳转
  }, []);

  // 组件挂载时初始化数据
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.WHITE}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 用户信息头部区域 - 增强渐变效果 */}
        <View style={styles.headerGradient}>
          <View style={styles.statusBar} />
          
          {/* 顶部装饰元素 */}
          <View style={styles.headerDecorations}>
            <View style={[styles.decorationCircle, styles.decoration1]} />
            <View style={[styles.decorationCircle, styles.decoration2]} />
            <View style={[styles.decorationCircle, styles.decoration3]} />
          </View>
          
          
          <UserHeader
            userInfo={state.userInfo}
            onAvatarPress={handleAvatarPress}
            onEditNickname={handleEditNickname}
            onEditBio={handleEditBio}
            onViewProfile={handleViewProfile}
          />
        </View>

        {/* 交易功能区域 */}
        {state.isLoading ? (
          <TransactionSectionSkeleton />
        ) : (
          <TransactionSection
            transactionCounts={state.transactionCounts}
            onFunctionPress={handleFunctionPress}
          />
        )}

        {/* 功能区域 */}
        {!state.isLoading && (
          <FunctionGrid
            walletInfo={state.walletInfo}
            onFunctionPress={handleFunctionPress}
          />
        )}

        {/* 底部安全区域 */}
        <View style={styles.bottomSafeArea} />
      </ScrollView>

      {/* 全屏加载状态 - 仅在初始加载时显示 */}
      {state.isLoading && !state.userInfo && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        </View>
      )}

      {/* 错误提示 */}
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: SIZES.PADDING_XL,
    backgroundColor: COLORS.PRIMARY,
    // 模拟渐变效果的多层背景
    position: 'relative',
    overflow: 'hidden',
    // 添加更丰富的视觉层次
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  decorationCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  decoration1: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    backgroundColor: COLORS.WHITE,
    top: -SCREEN_WIDTH * 0.4,
    right: -SCREEN_WIDTH * 0.3,
  },
  decoration2: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    top: -SCREEN_WIDTH * 0.2,
    left: -SCREEN_WIDTH * 0.2,
  },
  decoration3: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    backgroundColor: COLORS.WHITE,
    bottom: -SCREEN_WIDTH * 0.1,
    right: SCREEN_WIDTH * 0.1,
  },
  statusBar: {
    height: SIZES.STATUS_BAR_HEIGHT,
    zIndex: 1,
  },
  bottomSafeArea: {
    height: SIZES.BOTTOM_NAV_HEIGHT,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.CARD_RADIUS,
    padding: SIZES.PADDING_XL,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.LIGHT_GRAY,
    borderTopColor: COLORS.PRIMARY,
    // 这里可以添加旋转动画
  },
  loadingText: {
    color: COLORS.BLACK,
    fontSize: FONT_SIZES.BODY_LARGE,
    marginTop: SIZES.PADDING_M,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 120,
    left: SIZES.PADDING_M,
    right: SIZES.PADDING_M,
    backgroundColor: COLORS.ERROR,
    padding: SIZES.PADDING_M,
    borderRadius: SIZES.CARD_RADIUS,
    // 增强错误提示的视觉效果
    shadowColor: COLORS.ERROR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  errorText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY_LARGE,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ProfileScreen;

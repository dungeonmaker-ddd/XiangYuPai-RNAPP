/**
 * 🏠 首页模块 - 基于嵌套化主导架构的页面父组件集成
 *
 * TOC (快速跳转):
 * [1] Imports & Types
 * [2] Constants & Config
 * [3] Utils & Helpers
 * [4] State Management
 * [5] Domain Logic
 * [6] UI Components & Rendering
 * [7] Exports
 */

// #region 1. Imports & Types
import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';

// 导入嵌套化组件架构
import HeaderArea from './HeaderArea';
import GameBannerArea from './GameBannerArea';
import FunctionGridArea from './FunctionGridArea';
import LimitedOffersArea from './LimitedOffersArea';
import TeamPartyArea from './TeamPartyArea';
import FilterTabsArea from './FilterTabsArea';
import UserListArea from './UserListArea';

// 导入常量和类型
import { COLORS } from './constants';
import type { UserCard } from './types';
import { useHomeState } from './useHomeState';
import { useHomeNavigation } from './useHomeNavigation';

interface HomeScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}
// #endregion

// #region 2. Constants & Config
// 常量已移至 ./constants.ts
// #endregion

// #region 3. Utils & Helpers
// 工具函数
// #endregion

// #region 4. State Management
// 状态管理已移至 ./useHomeState.ts
// #endregion

// #region 5. Domain Logic
// 业务逻辑已移至各个区域组件
// #endregion

// #region 6. UI Components & Rendering
/**
 * HomeScreen 组件 - 首页页面父组件
 * 集成所有子组件区域的完整首页系统
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // 使用自定义hooks管理状态和逻辑
  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    activeRegion,
    setActiveRegion,
    users,
    limitedOffers,
    loading,
    refreshing,
    location,
    handleSearch,
    handleRefresh,
  } = useHomeState();

  const {
    handleUserPress,
    handleFunctionPress,
    handleLocationPress,
    handleMoreTeamPartyPress,
    handleGameBannerPress,
    handleTeamPartyPress,
    handleMoreOffersPress,
    handleSearchPress,
  } = useHomeNavigation(navigation);

  // 渲染列表头部内容
  const renderHeaderContent = useCallback(() => (
    <View style={styles.headerContent}>
      <GameBannerArea onPress={handleGameBannerPress} />
      <FunctionGridArea onFunctionPress={handleFunctionPress} />
      <LimitedOffersArea
        offers={limitedOffers}
        onUserPress={handleUserPress}
        onMorePress={handleMoreOffersPress}
      />
      <TeamPartyArea 
        onPress={handleTeamPartyPress}
        onMorePress={handleMoreTeamPartyPress}
      />
      <FilterTabsArea
        activeTab={activeFilter}
        onTabPress={setActiveFilter}
        activeRegion={activeRegion}
        onRegionPress={setActiveRegion}
      />
    </View>
  ), [
    handleGameBannerPress,
    handleFunctionPress,
    limitedOffers,
    handleUserPress,
    handleMoreOffersPress,
    handleTeamPartyPress,
    handleMoreTeamPartyPress,
    activeFilter,
    setActiveFilter,
    activeRegion,
    setActiveRegion,
  ]);

  return (
    <View style={styles.container}>
      {/* 渐变背景 - 使用纯色背景替代图片 */}
      <View style={styles.gradientBackground} />
      
      {/* 顶部导航区域 */}
      <HeaderArea
        location={location}
        onLocationPress={handleLocationPress}
        onSearch={(query: string) => {
          setSearchQuery(query);
          handleSearch(query);
        }}
        onSearchPress={handleSearchPress}
      />

      {/* 头部内容区域 */}
      <View style={styles.headerBackground}>
        {renderHeaderContent()}
      </View>

      {/* 用户列表区域 */}
      <UserListArea
        users={users}
        loading={loading}
        onUserPress={handleUserPress}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};
// #endregion

// #region 7. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    backgroundColor: '#f8f9fa', // 浅灰色背景
  },
  headerBackground: {
    backgroundColor: 'transparent',
  },
  headerContent: {
    backgroundColor: 'transparent',
  },
});
// #endregion

// #region 8. Exports
export default HomeScreen;
export type { HomeScreenProps };
// #endregion
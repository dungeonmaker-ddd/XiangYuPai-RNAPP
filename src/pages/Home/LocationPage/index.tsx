/**
 * 地区选择模块 - 主页面组件（嵌套化架构）
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

// #region 1. Imports
import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// 导入页面状态管理
import useHomeLocation from './useHomeLocation';
import { navigateBackFromHomeLocation, handleLocationSelectionComplete } from './navigateToHomeLocation';

// 导入组件区域
import HeaderArea from './HeaderArea';
import LocationRecommendArea from './LocationRecommendArea';
import HotCitiesArea from './HotCitiesArea';
import RegionListArea from './RegionListArea';

// 导入类型和常量
import type { HomeLocationScreenProps, RegionInfo } from './types';
import { COLORS } from './constants';
// #endregion

// #region 2. Types & Schema
// 类型定义在types文件中
// #endregion

// #region 3. Constants & Config
// 常量定义在constants文件中
// #endregion

// #region 4. Utils & Helpers
// 工具函数在各个区域组件中实现
// #endregion

// #region 5. State Management
// 页面状态管理通过useHomeLocation hook实现
// #endregion

// #region 6. Domain Logic
// 业务逻辑在各个区域组件和状态管理中实现
// #endregion

// #region 7. UI Components & Rendering
const HomeLocationScreen: React.FC<HomeLocationScreenProps> = ({
  route,
  navigation,
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  
  // 获取路由参数
  const initialLocation = route?.params?.currentLocation;
  const onLocationSelected = route?.params?.onLocationSelected;
  
  // 页面状态管理
  const { state, actions } = useHomeLocation({ initialLocation });

  // 处理返回
  const handleGoBack = useCallback(() => {
    if (navigation) {
      navigateBackFromHomeLocation(navigation);
    }
  }, [navigation]);

  // 处理地区选择
  const handleRegionPress = useCallback(async (region: RegionInfo) => {
    await actions.handleSelectRegion(region);
    
    if (navigation && onLocationSelected) {
      handleLocationSelectionComplete(navigation, region, onLocationSelected);
    }
  }, [actions, navigation, onLocationSelected]);

  // 处理当前定位选择
  const handleCurrentLocationPress = useCallback(() => {
    if (state.currentLocation) {
      const locationAsRegion: RegionInfo = {
        code: 'current',
        name: state.currentLocation.city,
        pinyin: 'current',
        firstLetter: 'C',
        level: 'city',
      };
      handleRegionPress(locationAsRegion);
    }
  }, [state.currentLocation, handleRegionPress]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* 顶部导航区域 */}
      <HeaderArea
        title="定位"
        onBackPress={handleGoBack}
        showBackButton={true}
      />

      {/* 主要内容区域 */}
      <View style={styles.content}>
        {/* 定位推荐区域 */}
        <LocationRecommendArea
          currentLocation={state.currentLocation}
          loading={state.locating}
          error={state.locationError}
          onCurrentLocationPress={handleCurrentLocationPress}
          onGetLocationPress={actions.handleGetCurrentLocation}
        />

        {/* 热门城市区域 */}
        <HotCitiesArea
          cities={state.hotCities}
          selectedLocation={state.selectedLocation}
          onCityPress={handleRegionPress}
        />

        {/* 地区列表区域 */}
        <RegionListArea
          regions={state.regions}
          selectedLocation={state.selectedLocation}
          searchQuery={state.searchQuery}
          activeAlphabet={state.activeAlphabet}
          onRegionPress={handleRegionPress}
          onSearchChange={actions.handleSearch}
          onAlphabetPress={actions.handleAlphabetPress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
});
// #endregion

// #region 8. Exports
export default HomeLocationScreen;
export type { HomeLocationScreenProps };
// #endregion

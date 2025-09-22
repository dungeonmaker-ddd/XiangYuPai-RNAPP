/**
 * GameBannerArea - 游戏推广横幅区域组件
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
import React from 'react';
import {
  TouchableOpacity,
  View,
  ImageBackground,
  StyleSheet,
} from 'react-native';
// #endregion

// #region 2. Types & Schema
interface GameBannerAreaProps {
  onPress: () => void;
}
// #endregion

// #region 3. Constants & Config
const BANNER_ASPECT_RATIO = 2.8;
const BACKGROUND_ASPECT_RATIO = 1.44;
// #endregion

// #region 4. Utils & Helpers
// 本地工具函数
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑处理
// #endregion

// #region 7. UI Components & Rendering
/**
 * GameBannerArea 组件 - 游戏推广横幅区域
 * 展示游戏推广内容的大图横幅
 */
const GameBannerArea: React.FC<GameBannerAreaProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={require('../../../../assets/images/home/banner/刺客信条4poster.png')}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        />
      </View>
    </TouchableOpacity>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerContainer: {
    width: '100%',
    aspectRatio: BANNER_ASPECT_RATIO,
    overflow: 'hidden',
    borderRadius: 12,
  },
  backgroundImage: {
    width: '101%',
    aspectRatio: BACKGROUND_ASPECT_RATIO,
    position: 'absolute',
    top: -50,
    left: -4,
    justifyContent: 'center',
  },
  imageStyle: {
    borderRadius: 12,
  },
});
// #endregion

// #region 9. Exports
export default GameBannerArea;
export type { GameBannerAreaProps };
// #endregion

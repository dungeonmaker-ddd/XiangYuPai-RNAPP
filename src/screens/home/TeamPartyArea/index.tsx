/**
 * TeamPartyArea - 组队聚会区域组件
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
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';

// 内部模块导入
import { COLORS } from '../constants';
// #endregion

// #region 2. Types & Schema
interface TeamPartyAreaProps {
  onPress: () => void;
  onMorePress: () => void;
}
// #endregion

// #region 3. Constants & Config
const BANNER_CONFIG = {
  aspectRatio: 351 / 115,
  borderRadius: 12,
} as const;
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
 * TeamPartyArea 组件 - 组队聚会区域
 * 展示组局中心的大图入口
 */
const TeamPartyArea: React.FC<TeamPartyAreaProps> = ({ onPress, onMorePress }) => {
  return (
    <View style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.headerRow}>
        <Text style={styles.mainTitle}>组队聚会</Text>
        <TouchableOpacity onPress={onMorePress}>
          <Text style={styles.moreText}>查看更多 {'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* 组局中心大图 */}
      <TouchableOpacity
        style={styles.bannerContainer}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.bannerWrapper}>
          <ImageBackground
            source={require('../../../../assets/images/home/team-party/组局中心.png')}
            style={styles.backgroundImage}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.titleContainer}>
              <Image
                source={require('../../../../assets/images/home/team-party/组局中心字幕.png')}
                style={styles.titleImage}
              />
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  moreText: {
    color: COLORS.gray500,
    fontSize: 14,
  },
  bannerContainer: {
    marginVertical: 8,
    borderRadius: BANNER_CONFIG.borderRadius,
    overflow: 'hidden',
  },
  bannerWrapper: {
    width: '100%',
    aspectRatio: BANNER_CONFIG.aspectRatio,
    overflow: 'hidden',
    borderRadius: BANNER_CONFIG.borderRadius,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: BANNER_CONFIG.borderRadius,
  },
  titleContainer: {
    width: '50%',
    aspectRatio: 190 / 45,
  },
  titleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
// #endregion

// #region 9. Exports
export default TeamPartyArea;
export type { TeamPartyAreaProps };
// #endregion

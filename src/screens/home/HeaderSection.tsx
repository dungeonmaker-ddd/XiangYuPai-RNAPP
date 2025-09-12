import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 导入共享常量和类型
import { COLORS } from './constants';
import type { LocationInfo } from './types';

interface HeaderSectionProps {
  location: LocationInfo;
  onLocationPress: () => void;
  onSearch: (query: string) => void;
}

// HeaderSection Component
export const HeaderSection = ({ location, onLocationPress, onSearch }: HeaderSectionProps) => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.paddingH16, styles.paddingV12, { paddingTop: safeAreaInsets.top, backgroundColor: 'transparent' }]}>
      {/* StatusBar配置已移至MainScreen统一管理 */}

      <View style={[styles.row, { gap: 12 }]}>
        <TouchableOpacity style={[styles.row, { gap: 4 }]} onPress={onLocationPress}>
          <Image
            source={require('../../../assets/images/home/header/定位.png')}
            style={{ width: 22, height: 22 }}
          />
          <Text style={[styles.textWhite, { fontSize: 14, fontWeight: '500' }]}>{location.city}</Text>
        </TouchableOpacity>

        <View style={[styles.row, {
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 19.78,
          borderWidth: 0.58,
          borderColor: '#FFFFFF',
          paddingHorizontal: 16,
          height: 30,
          gap: 8
        }]}>
          <Image
            source={require('../../../assets/images/home/header/搜索icon.png')}
            style={{ width: 17.45, height: 17.45 }}
          />
          <TextInput
            style={[styles.textWhite, {
              flex: 1,
              fontFamily: 'PingFang SC',
              fontSize: 14,
              paddingTop: 1,
              paddingBottom: 1
            }]}
            placeholder="搜索词"
            placeholderTextColor="rgba(255,255,255,0.8)"
            onChangeText={onSearch}
          />
        </View>
      </View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  // 公共布局样式
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 公共文字样式
  textWhite: {
    color: COLORS.white,
  },

  // 公共间距
  paddingH16: {
    paddingHorizontal: 16,
  },
  paddingV12: {
    paddingVertical: 12,
  },
});

export default HeaderSection;

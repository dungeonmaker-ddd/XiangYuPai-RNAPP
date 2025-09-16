import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';

// 导入共享常量
import { COLORS } from '../constants';

interface TeamPartySectionProps {
  onPress: () => void;
  onMorePress: () => void;
}

// TeamPartySection Component
export const TeamPartySection = ({ onPress, onMorePress }: TeamPartySectionProps) => (
  <View style={[styles.paddingH16, styles.paddingV12]}>
    <View style={[styles.rowSpaceBetween, { marginBottom: 12 }]}>
      <Text style={[styles.textBold, { fontSize: 18 }]}>组队聚会</Text>
      <TouchableOpacity onPress={onMorePress}>
        <Text style={styles.textGray}>查看更多 {'>'}</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      style={[styles.marginV8, styles.borderRadius12, { marginHorizontal: 0, overflow: 'hidden' }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={{ width: '100%', aspectRatio: 351/115, overflow: 'hidden', borderRadius: 12 }}>
        <ImageBackground
          source={require('../../../../assets/images/home/team-party/组局中心.png')}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: 'center',
            alignItems: 'center',
          }}
          imageStyle={styles.borderRadius12}
        >
          <View style={{ width: '50%', aspectRatio: 190/45 }}>
            <Image
              source={require('../../../../assets/images/home/team-party/组局中心字幕.png')}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  </View>
);

// 样式定义
const styles = StyleSheet.create({
  // 公共布局样式
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // 公共文字样式
  textBold: {
    fontWeight: '600',
  },
  textGray: {
    color: COLORS.gray500,
  },

  // 公共间距
  paddingH16: {
    paddingHorizontal: 16,
  },
  paddingV12: {
    paddingVertical: 12,
  },
  marginV8: {
    marginVertical: 8,
  },

  // 公共边框
  borderRadius12: {
    borderRadius: 12,
  },
});

export default TeamPartySection;

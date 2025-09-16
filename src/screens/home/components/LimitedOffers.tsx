import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';

// 导入共享常量和类型
import { COLORS } from '../constants';
import type { UserCard } from '../types';

interface LimitedOffersProps {
  offers: UserCard[];
  onUserPress: (user: UserCard) => void;
  onMorePress: () => void;
}

// LimitedOffers Component
export const LimitedOffers = ({ offers, onUserPress, onMorePress }: LimitedOffersProps) => (
  <View style={[styles.paddingH16, styles.paddingV12]}>
    <View style={[styles.rowSpaceBetween, { marginBottom: 12 }]}>
      <View style={[styles.row, { gap: 8 }]}>
        <Text style={[styles.textBold, { fontSize: 18 }]}>限时专享</Text>
        <View style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 15,
          paddingHorizontal: 8,
          paddingVertical: 4,
          // React Native 不支持CSS渐变，使用单色替代
          backgroundColor: '#FF6B47', // 渐变色的中间值
        }}>
          <Text style={[styles.textWhite, { fontSize: 11, fontWeight: '500' }]}>优质陪玩</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onMorePress}>
        <Text style={styles.textGray}>查看更多 {'>'}</Text>
      </TouchableOpacity>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {offers.map((user: UserCard, index: number) => (
        <TouchableOpacity
          key={user.id}
          style={[styles.borderRadius12, {
            width: 140,
            marginRight: 12
          }]}
          onPress={() => onUserPress(user)}
        >
          <View style={{
            position: 'relative',
            width: '100%',
            aspectRatio: 1,
            overflow: 'hidden',
            borderRadius: 12,
          }}>
            <Image
              source={require('../../../../assets/images/common/default-avatar.png')}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover'
              }}
            />
            <View style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={[styles.textWhite, { fontSize: 11, fontWeight: '500' }]}>
                近期{89 - index * 12}人下单
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'flex-start', paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={[styles.textBold, { fontSize: 16, marginBottom: 4, textAlign: 'left' }]}>
              {user.username}
            </Text>
            <Text style={[styles.textGray, {
              fontSize: 12,
              textAlign: 'left'
            }]}>
              {user.services[0] ? `${user.services[0]}区 荣耀王者` : '微信区 荣耀王者'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

// 样式定义
const styles = StyleSheet.create({
  // 公共布局样式
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // 公共文字样式
  textBold: {
    fontWeight: '600',
  },
  textWhite: {
    color: COLORS.white,
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

  // 公共边框
  borderRadius12: {
    borderRadius: 12,
  },
});

export default LimitedOffers;

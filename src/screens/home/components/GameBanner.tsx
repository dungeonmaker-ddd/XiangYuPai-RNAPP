import React from 'react';
import {
  TouchableOpacity,
  View,
  ImageBackground,
  StyleSheet,
} from 'react-native';

interface GameBannerProps {
  onPress: () => void;
}

// GameBanner Component
export const GameBanner = ({ onPress }: GameBannerProps) => (
  <TouchableOpacity
    style={[styles.marginV8, styles.borderRadius12, { marginHorizontal: 16, overflow: 'hidden' }]}
    onPress={onPress}
  >
    <View style={{ width: '100%', aspectRatio: 2.8, overflow: 'hidden', borderRadius: 12 }}>
      <ImageBackground
        source={require('../../../../assets/images/home/banner/刺客信条4poster.png')}
        style={{
          width: "101%",
          aspectRatio: 1.44,
          position: 'absolute',
          top: -50,
          left: -4,
          justifyContent: 'center',
        }}
        imageStyle={styles.borderRadius12}
      />
    </View>
  </TouchableOpacity>
);

// 样式定义
const styles = StyleSheet.create({
  marginV8: {
    marginVertical: 8,
  },
  borderRadius12: {
    borderRadius: 12,
  },
});

export default GameBanner;

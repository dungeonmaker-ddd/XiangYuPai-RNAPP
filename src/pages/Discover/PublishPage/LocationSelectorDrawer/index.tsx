// #region 1. File Banner & TOC
/**
 * 地点选择抽屉组件 - 底部弹出的地点选择界面
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
// #endregion

// #region 2. Imports
import React, { useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';

// 类型导入
import type { PublishLocationData } from '../types';
// #endregion

// #region 3. Types & Schema
interface LocationSelectorDrawerProps {
  isVisible: boolean;
  selectedLocation: PublishLocationData | null;
  onLocationSelect: (location: PublishLocationData) => void;
  onClose: () => void;
}
// #endregion

// #region 4. Constants & Config
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.7;
// #endregion

// #region 5. Utils & Helpers
const mockLocations: PublishLocationData[] = [
  {
    id: '1',
    name: '深圳市南山区',
    address: '广东省深圳市南山区',
    latitude: 22.5431,
    longitude: 114.0579,
    distance: 100,
  },
  {
    id: '2',
    name: '科技园',
    address: '深圳市南山区科技园',
    latitude: 22.5422,
    longitude: 114.0578,
    distance: 200,
  },
];
// #endregion

// #region 6. State Management
const LocationSelectorDrawer: React.FC<LocationSelectorDrawerProps> = ({
  isVisible,
  selectedLocation,
  onLocationSelect,
  onClose,
}) => {
// #endregion

// #region 7. Domain Logic
  const handleLocationSelect = useCallback((location: PublishLocationData) => {
    onLocationSelect(location);
  }, [onLocationSelect]);

  const handleOverlayPress = useCallback(() => {
    onClose();
  }, [onClose]);
// #endregion

// #region 8. UI Components & Rendering
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable}
          onPress={handleOverlayPress}
          activeOpacity={1}
        />
        
        <SafeAreaView style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.title}>选择地点</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>关闭</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            {mockLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.locationItem}
                onPress={() => handleLocationSelect(location)}
              >
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationAddress}>{location.address}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    height: DRAWER_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    fontSize: 16,
    color: '#8A2BE2',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  locationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666666',
  },
});
// #endregion

// #region 9. Exports
export default LocationSelectorDrawer;
export type { LocationSelectorDrawerProps };
// #endregion

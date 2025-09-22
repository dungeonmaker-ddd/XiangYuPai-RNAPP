/**
 * RegionSelector - 地区选择器组件
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
  Text,
  Image,
  Modal,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

// 内部模块导入
import { COLORS } from '../../constants';
import { processRegionData } from './processData';
// #endregion

// #region 2. Types & Schema
interface RegionSelectorProps {
  activeRegion: string;
  onRegionPress?: (region: string) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
// #endregion

// #region 3. Constants & Config
// 常量已移至 ./processData.ts
// #endregion

// #region 4. Utils & Helpers
// 工具函数
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
const handleRegionSelect = (
  region: string, 
  onRegionPress?: (region: string) => void,
  setShowModal?: (show: boolean) => void
) => {
  onRegionPress?.(region);
  setShowModal?.(false);
};
// #endregion

// #region 7. UI Components & Rendering
/**
 * RegionSelector 组件 - 地区选择器
 * 提供地区选择功能
 */
export const RegionSelector: React.FC<RegionSelectorProps> = ({
  activeRegion,
  onRegionPress,
  showModal,
  setShowModal,
}) => {
  const regionOptions = processRegionData();

  const renderRegionModal = () => (
    <Modal
      visible={showModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>选择区域</Text>
          </View>
          <ScrollView style={styles.optionsList}>
            {regionOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  activeRegion === option && styles.optionItemActive
                ]}
                onPress={() => handleRegionSelect(option, onRegionPress, setShowModal)}
              >
                <Text style={[
                  styles.optionText,
                  activeRegion === option && styles.optionTextActive
                ]}>
                  {option}
                </Text>
                {activeRegion === option && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.filterText}>
          {activeRegion === '全部' ? '区域' : activeRegion}
        </Text>
        <Image 
          source={require('../三角形.png')} 
          style={styles.triangleIcon}
        />
      </TouchableOpacity>

      {renderRegionModal()}
    </>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: 'rgba(153, 153, 153, 0.1)',
    width: 65,
    aspectRatio: 57/24,
  },
  filterText: {
    color: '#666666',
    fontSize: 14,
  },
  triangleIcon: {
    width: 4,
    height: 4,
    marginLeft: 5,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: '80%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  optionItemActive: {
    backgroundColor: COLORS.gray50,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.gray900,
  },
  optionTextActive: {
    color: '#AF38D9',
    fontWeight: '600',
  },
  checkMark: {
    color: '#AF38D9',
    fontSize: 16,
    fontWeight: '700',
  },
});
// #endregion

// #region 9. Exports
export default RegionSelector;
// #endregion

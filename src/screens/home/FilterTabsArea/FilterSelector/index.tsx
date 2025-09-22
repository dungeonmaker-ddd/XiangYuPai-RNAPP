/**
 * FilterSelector - 筛选器组件
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
import { processFilterData } from './processData';
// #endregion

// #region 2. Types & Schema
interface FilterSelectorProps {
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
const handleFilterSelect = (
  option: string,
  setShowModal?: (show: boolean) => void
) => {
  console.log('筛选条件:', option);
  setShowModal?.(false);
};
// #endregion

// #region 7. UI Components & Rendering
/**
 * FilterSelector 组件 - 筛选器
 * 提供高级筛选功能
 */
export const FilterSelector: React.FC<FilterSelectorProps> = ({
  showModal,
  setShowModal,
}) => {
  const filterOptions = processFilterData();

  const renderFilterModal = () => (
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
            <Text style={styles.modalTitle}>筛选条件</Text>
          </View>
          <ScrollView style={styles.optionsList}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionItem}
                onPress={() => handleFilterSelect(option, setShowModal)}
              >
                <Text style={styles.optionText}>
                  {option}
                </Text>
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
        <Text style={styles.filterText}>筛选</Text>
        <Image 
          source={require('../三角形.png')} 
          style={styles.triangleIcon}
        />
      </TouchableOpacity>

      {renderFilterModal()}
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
  optionText: {
    fontSize: 14,
    color: COLORS.gray900,
  },
});
// #endregion

// #region 9. Exports
export default FilterSelector;
// #endregion

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
} from 'react-native';

// 导入共享常量
import { COLORS } from '../constants';

const FILTER_TABS = [
  { id: 'nearby', label: '附近', active: true },
  { id: 'recommend', label: '推荐', active: false },
  { id: 'latest', label: '最新', active: false },
] as const;

const REGION_OPTIONS = [
  '全部',
  '南山区',
  '福田区', 
  '罗湖区',
  '宝安区',
  '龙岗区',
  '龙华区',
  '坪山区',
  '光明区',
  '盐田区'
];

const FILTER_OPTIONS = [
  '全部',
  '在线',
  '可预约',
  '新人',
  '高评分',
  '附近优先',
  '价格优惠',
  '服务完善'
];

interface FilterTabsProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  activeRegion?: string;
  onRegionPress?: (region: string) => void;
}

// FilterTabs Component
export const FilterTabs = ({ activeTab, onTabPress, activeRegion = '全部', onRegionPress }: FilterTabsProps) => {
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleRegionSelect = (region: string) => {
    onRegionPress?.(region);
    setShowRegionModal(false);
  };

  const renderModal = (visible: boolean, setVisible: (v: boolean) => void, options: string[], onSelect: (option: string) => void, title: string, activeValue?: string) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
          <ScrollView style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  activeValue === option && styles.optionItemActive
                ]}
                onPress={() => onSelect(option)}
              >
                <Text style={[
                  styles.optionText,
                  activeValue === option && styles.optionTextActive
                ]}>
                  {option}
                </Text>
                {activeValue === option && (
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
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.tabButtonActive
            ]}
            onPress={() => onTabPress(tab.id)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.filtersRow}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowRegionModal(true)}
        >
          <Text style={styles.filterText}>
            {activeRegion === '全部' ? '区域' : activeRegion}
          </Text>
          <Image 
            source={require('./三角形.png')} 
            style={styles.triangleIcon}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterText}>筛选</Text>
          <Image 
            source={require('./三角形.png')} 
            style={styles.triangleIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 区域选择模态框 */}
      {renderModal(
        showRegionModal, 
        setShowRegionModal, 
        REGION_OPTIONS, 
        handleRegionSelect, 
        '选择区域',
        activeRegion
      )}

      {/* 筛选模态框 */}
      {renderModal(
        showFilterModal, 
        setShowFilterModal, 
        FILTER_OPTIONS, 
        (option) => {
          console.log('筛选条件:', option);
          setShowFilterModal(false);
        }, 
        '筛选条件'
      )}
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  // 主容器
  container: {
    backgroundColor: COLORS.gray50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // 标签行
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tabButton: {
    borderRadius: 20,
    width: 65,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray100,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    borderColor: '#AF38D9',
    backgroundColor: '#AF38D9',
    shadowColor: 'rgba(175, 56, 217, 0.55)',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // 筛选行
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
  },
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

  // 模态框样式
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

  // 公共布局样式 (保留兼容性)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#111827',
  },
  textGray: {
    color: COLORS.gray500,
  },
  paddingH16: {
    paddingHorizontal: 16,
  },
});

export default FilterTabs;

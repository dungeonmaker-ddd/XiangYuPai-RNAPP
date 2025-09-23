// #region 1. File Banner & TOC
/**
 * ReportTypeSelectionArea - 举报类型选择区域组件
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
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { ReportTypeSelectionAreaProps, ReportType } from '../types';
import { REPORT_CONSTANTS } from '../constants';
// #endregion

// #region 3. Types & Schema
interface TypeCardProps {
  type: ReportType;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}
// #endregion

// #region 4. Constants & Config
const { width: screenWidth } = Dimensions.get('window');
const CARD_CONFIG = {
  columns: 2,
  horizontalPadding: 16,
  itemSpacing: 8,
  verticalSpacing: 12,
};

const CARD_WIDTH = (screenWidth - CARD_CONFIG.horizontalPadding * 2 - CARD_CONFIG.itemSpacing) / CARD_CONFIG.columns;
// #endregion

// #region 5. Utils & Helpers
const getTypeOptions = () => REPORT_CONSTANTS.TYPE_OPTIONS;

const getCardStyle = (isSelected: boolean) => [
  styles.typeCard,
  {
    borderColor: isSelected ? REPORT_CONSTANTS.UI.COLORS.BORDER_ACTIVE : REPORT_CONSTANTS.UI.COLORS.BORDER,
    borderWidth: isSelected ? 2 : 1,
    backgroundColor: isSelected ? `${REPORT_CONSTANTS.UI.COLORS.PRIMARY}08` : REPORT_CONSTANTS.UI.COLORS.BACKGROUND,
  },
];

const getTextStyle = (isSelected: boolean) => [
  styles.typeText,
  {
    color: isSelected ? REPORT_CONSTANTS.UI.COLORS.TEXT_PRIMARY : REPORT_CONSTANTS.UI.COLORS.TEXT_SECONDARY,
    fontWeight: isSelected ? '600' as const : '400' as const,
  },
];
// #endregion

// #region 6. State Management
// 无需本地状态管理，使用父组件传入的状态
// #endregion

// #region 7. Domain Logic
const useTypeSelection = (onTypeSelect: (type: ReportType) => void) => {
  const handleTypePress = (type: ReportType) => {
    onTypeSelect(type);
  };

  return { handleTypePress };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * 单个举报类型卡片组件
 */
const TypeCard: React.FC<TypeCardProps> = ({ type, label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={getCardStyle(isSelected)}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle(isSelected)}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * 举报类型选择区域主组件
 */
const ReportTypeSelectionArea: React.FC<ReportTypeSelectionAreaProps> = ({
  selectedType,
  onTypeSelect,
  options = getTypeOptions(),
}) => {
  const { handleTypePress } = useTypeSelection(onTypeSelect);

  return (
    <View style={styles.container}>
      {/* 区域标题 */}
      <Text style={styles.sectionTitle}>
        {REPORT_CONSTANTS.TEXT.TYPE_SELECTION_TITLE}
      </Text>

      {/* 类型选择网格 */}
      <View style={styles.gridContainer}>
        {options.map((option, index) => (
          <View
            key={option.type}
            style={[
              styles.gridItem,
              {
                marginRight: index % CARD_CONFIG.columns === 0 ? CARD_CONFIG.itemSpacing : 0,
                marginBottom: CARD_CONFIG.verticalSpacing,
              },
            ]}
          >
            <TypeCard
              type={option.type}
              label={option.label}
              isSelected={selectedType === option.type}
              onPress={() => handleTypePress(option.type)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: REPORT_CONSTANTS.UI.SPACING.MD,
    paddingTop: REPORT_CONSTANTS.UI.SPACING.LG,
  },
  sectionTitle: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.LARGE,
    color: REPORT_CONSTANTS.UI.COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    marginBottom: REPORT_CONSTANTS.UI.SPACING.LG,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: CARD_WIDTH,
  },
  typeCard: {
    height: REPORT_CONSTANTS.LAYOUT.TYPE_CARD_HEIGHT,
    borderRadius: REPORT_CONSTANTS.UI.SIZES.CARD_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: REPORT_CONSTANTS.UI.SPACING.SM,
  },
  typeText: {
    fontSize: REPORT_CONSTANTS.UI.FONTS.MEDIUM,
    textAlign: 'center',
  },
});
// #endregion

// #region 9. Exports
export default ReportTypeSelectionArea;
export { ReportTypeSelectionArea };
// #endregion

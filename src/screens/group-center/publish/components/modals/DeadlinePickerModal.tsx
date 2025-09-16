/**
 * 🎯 报名截止时间选择弹窗
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { DeadlineSettings } from '../../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '../../constants';

interface DeadlinePickerModalProps {
  visible: boolean;
  initialSettings: DeadlineSettings;
  activityStartTime: Date;
  onConfirm: (settings: DeadlineSettings) => void;
  onCancel: () => void;
}

const DeadlinePickerModal: React.FC<DeadlinePickerModalProps> = ({
  visible,
  initialSettings,
  activityStartTime,
  onConfirm,
  onCancel,
}) => {
  const [selectedOption, setSelectedOption] = useState<'1hour' | '6hours' | '1day'>('1hour');

  const handleConfirm = useCallback(() => {
    const now = new Date();
    let deadline = new Date(activityStartTime);
    
    switch (selectedOption) {
      case '1hour':
        deadline.setHours(deadline.getHours() - 1);
        break;
      case '6hours':
        deadline.setHours(deadline.getHours() - 6);
        break;
      case '1day':
        deadline.setDate(deadline.getDate() - 1);
        break;
    }

    const settings: DeadlineSettings = {
      deadline,
      quickOption: selectedOption,
      isValid: deadline > now,
    };
    onConfirm(settings);
  }, [selectedOption, activityStartTime, onConfirm]);

  const quickOptions = [
    { key: '1hour' as const, label: '提前1小时' },
    { key: '6hours' as const, label: '提前6小时' },
    { key: '1day' as const, label: '提前1天' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>设置截止时间</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelButton}>取消</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>快速选择</Text>
            {quickOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionButton,
                  selectedOption === option.key && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedOption(option.key)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option.key && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.XL,
    borderTopRightRadius: BORDER_RADIUS.XL,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  title: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  cancelButton: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
  },
  content: {
    padding: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  optionButton: {
    padding: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
  },
  optionButtonSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '10',
  },
  optionText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
  },
  optionTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  confirmButton: {
    backgroundColor: COLORS.PRIMARY,
    margin: SPACING.MD,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
});

export default DeadlinePickerModal;

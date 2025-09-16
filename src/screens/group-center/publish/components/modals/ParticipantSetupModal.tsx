/**
 * 🎯 参与人数设置弹窗
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { ParticipantSettings } from '../../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '../../constants';

interface ParticipantSetupModalProps {
  visible: boolean;
  initialSettings: ParticipantSettings;
  onConfirm: (settings: ParticipantSettings) => void;
  onCancel: () => void;
}

const ParticipantSetupModal: React.FC<ParticipantSetupModalProps> = ({
  visible,
  initialSettings,
  onConfirm,
  onCancel,
}) => {
  const [maxCount, setMaxCount] = useState(initialSettings.maxCount?.toString() || '6');

  const handleConfirm = useCallback(() => {
    const settings: ParticipantSettings = {
      maxCount: parseInt(maxCount) || 6,
      minCount: 2,
      genderRatio: { unlimited: true },
      ageLimit: { unlimited: true },
      isValid: parseInt(maxCount) >= 2,
    };
    onConfirm(settings);
  }, [maxCount, onConfirm]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>设置人数</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelButton}>取消</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.label}>最大人数</Text>
            <TextInput
              style={styles.input}
              placeholder="输入最大人数..."
              value={maxCount}
              onChangeText={setMaxCount}
              keyboardType="numeric"
            />
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
  label: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    fontSize: FONT_SIZE.MD,
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

export default ParticipantSetupModal;

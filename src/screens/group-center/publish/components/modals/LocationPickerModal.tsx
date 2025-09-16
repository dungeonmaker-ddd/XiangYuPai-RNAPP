/**
 * 🎯 地点选择弹窗
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { LocationSettings } from '../../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '../../constants';

interface LocationPickerModalProps {
  visible: boolean;
  initialSettings: LocationSettings;
  onConfirm: (settings: LocationSettings) => void;
  onCancel: () => void;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  initialSettings,
  onConfirm,
  onCancel,
}) => {
  const [address, setAddress] = useState(initialSettings.address || '');

  const handleConfirm = useCallback(() => {
    const settings: LocationSettings = {
      address,
      detailAddress: address,
      isCurrentLocation: false,
      isValid: address.length > 0,
    };
    onConfirm(settings);
  }, [address, onConfirm]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>选择地点</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelButton}>取消</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <TextInput
              style={styles.input}
              placeholder="输入地址..."
              value={address}
              onChangeText={setAddress}
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

export default LocationPickerModal;

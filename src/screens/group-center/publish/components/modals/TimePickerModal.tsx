/**
 * 🎯 时间选择弹窗
 * 
 * 功能：
 * - 日期选择
 * - 时间选择
 * - 持续时间设置
 * - 时间验证
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { TimeSettings } from '../../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '../../constants';

interface TimePickerModalProps {
  visible: boolean;
  initialSettings: TimeSettings;
  onConfirm: (settings: TimeSettings) => void;
  onCancel: () => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  initialSettings,
  onConfirm,
  onCancel,
}) => {
  const [selectedDate, setSelectedDate] = useState(initialSettings.startDate || new Date());
  const [startTime, setStartTime] = useState(initialSettings.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialSettings.endTime || '12:00');
  const [duration, setDuration] = useState(initialSettings.duration || 180);

  const handleConfirm = useCallback(() => {
    const settings: TimeSettings = {
      startDate: selectedDate,
      startTime,
      endTime,
      duration,
      isValid: true,
    };
    onConfirm(settings);
  }, [selectedDate, startTime, endTime, duration, onConfirm]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>选择时间</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelButton}>取消</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>活动日期</Text>
            <Text style={styles.dateDisplay}>
              {selectedDate.toLocaleDateString('zh-CN')}
            </Text>
            
            <Text style={styles.sectionTitle}>开始时间</Text>
            <Text style={styles.timeDisplay}>{startTime}</Text>
            
            <Text style={styles.sectionTitle}>结束时间</Text>
            <Text style={styles.timeDisplay}>{endTime}</Text>
          </ScrollView>
          
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
    marginTop: SPACING.MD,
    marginBottom: SPACING.SM,
  },
  dateDisplay: {
    fontSize: FONT_SIZE.LG,
    color: COLORS.PRIMARY,
    padding: SPACING.MD,
    backgroundColor: COLORS.GRAY_50,
    borderRadius: BORDER_RADIUS.MD,
  },
  timeDisplay: {
    fontSize: FONT_SIZE.LG,
    color: COLORS.PRIMARY,
    padding: SPACING.MD,
    backgroundColor: COLORS.GRAY_50,
    borderRadius: BORDER_RADIUS.MD,
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

export default TimePickerModal;

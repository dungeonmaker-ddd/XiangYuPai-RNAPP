/**
 * 🎯 约定项设置组件
 * 
 * 功能：
 * - 时间设置（日期+时间选择）
 * - 地点设置（地图选择+搜索）
 * - 定价设置（价格+计费方式）
 * - 人数设置（数量+性别+年龄限制）
 * - 报名截止时间设置
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';

import type {
  AgreementSettingsProps,
  AgreementSettings,
  TimeSettings,
  LocationSettings,
  PricingSettings,
  ParticipantSettings,
  DeadlineSettings,
  FormValidation,
} from '../types';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  TEXTS,
  AGREEMENT_CONFIG,
} from '../constants';

// 简化的弹窗组件（内联实现）
const SimpleModal: React.FC<{
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ visible, title, onClose, children }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          {children}
        </View>
      </View>
    </View>
  </Modal>
);

// ══════════════════════════════════════════════════════════════
// 1. 子组件：设置项卡片
// ══════════════════════════════════════════════════════════════

interface SettingCardProps {
  title: string;
  placeholder: string;
  value: string;
  isValid: boolean;
  hasError?: boolean;
  errorMessage?: string;
  onPress: () => void;
}

const SettingCard: React.FC<SettingCardProps> = ({
  title,
  placeholder,
  value,
  isValid,
  hasError,
  errorMessage,
  onPress,
}) => {
  return (
    <View style={styles.settingCard}>
      {/* 标题 */}
      <Text style={styles.settingTitle}>{title}</Text>
      
      {/* 选择按钮 */}
      <TouchableOpacity
        style={[
          styles.selectButton,
          hasError && styles.selectButtonError,
          isValid && styles.selectButtonValid,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectButtonText,
            value ? styles.selectButtonTextFilled : styles.selectButtonTextEmpty,
          ]}
        >
          {value || placeholder}
        </Text>
        <Text style={styles.selectButtonIcon}>▶</Text>
      </TouchableOpacity>
      
      {/* 错误信息 */}
      {hasError && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 2. 主组件：约定项设置
// ══════════════════════════════════════════════════════════════

const AgreementSettings: React.FC<AgreementSettingsProps> = ({
  settings,
  onSettingsChange,
  validation,
}) => {
  // 弹窗状态管理
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // 格式化显示文本的辅助函数
  const formatTimeDisplay = (timeSettings: TimeSettings): string => {
    if (!timeSettings.isValid) return '';
    
    const date = timeSettings.startDate.toLocaleDateString('zh-CN');
    const time = `${timeSettings.startTime}${timeSettings.endTime ? ` - ${timeSettings.endTime}` : ''}`;
    const duration = timeSettings.duration ? ` (${Math.floor(timeSettings.duration / 60)}小时${timeSettings.duration % 60}分钟)` : '';
    
    return `${date} ${time}${duration}`;
  };

  const formatLocationDisplay = (locationSettings: LocationSettings): string => {
    if (!locationSettings.isValid) return '';
    
    return locationSettings.detailAddress || locationSettings.address;
  };

  const formatPricingDisplay = (pricingSettings: PricingSettings): string => {
    if (!pricingSettings.isValid) return '';
    
    const currency = pricingSettings.currency === 'coin' ? '金币' : '元';
    const billingTypeText = {
      hourly: '小时',
      per_person: '人',
      fixed: '固定价格',
    }[pricingSettings.billingType];
    
    return `${pricingSettings.amount}${currency}/${billingTypeText}`;
  };

  const formatParticipantDisplay = (participantSettings: ParticipantSettings): string => {
    if (!participantSettings.isValid) return '';
    
    let text = `${participantSettings.minCount || 1}-${participantSettings.maxCount}人`;
    
    if (participantSettings.genderRatio && !participantSettings.genderRatio.unlimited) {
      const { male, female } = participantSettings.genderRatio;
      if (male && female) {
        text += ` (男${male}:女${female})`;
      } else if (male) {
        text += ' (仅限男生)';
      } else if (female) {
        text += ' (仅限女生)';
      }
    }
    
    if (participantSettings.ageLimit && !participantSettings.ageLimit.unlimited) {
      const { min, max } = participantSettings.ageLimit;
      if (min && max) {
        text += ` ${min}-${max}岁`;
      } else if (min) {
        text += ` ${min}岁以上`;
      } else if (max) {
        text += ` ${max}岁以下`;
      }
    }
    
    return text;
  };

  const formatDeadlineDisplay = (deadlineSettings: DeadlineSettings): string => {
    if (!deadlineSettings.isValid) return '';
    
    const date = deadlineSettings.deadline.toLocaleDateString('zh-CN');
    const time = deadlineSettings.deadline.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    return `${date} ${time}`;
  };

  // 弹窗处理函数
  const openModal = useCallback((modalType: string) => {
    setActiveModal(modalType);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // 设置更新处理函数
  const handleTimeChange = useCallback((timeSettings: TimeSettings) => {
    onSettingsChange({ time: timeSettings });
    closeModal();
  }, [onSettingsChange, closeModal]);

  const handleLocationChange = useCallback((locationSettings: LocationSettings) => {
    onSettingsChange({ location: locationSettings });
    closeModal();
  }, [onSettingsChange, closeModal]);

  const handlePricingChange = useCallback((pricingSettings: PricingSettings) => {
    onSettingsChange({ pricing: pricingSettings });
    closeModal();
  }, [onSettingsChange, closeModal]);

  const handleParticipantChange = useCallback((participantSettings: ParticipantSettings) => {
    onSettingsChange({ participants: participantSettings });
    closeModal();
  }, [onSettingsChange, closeModal]);

  const handleDeadlineChange = useCallback((deadlineSettings: DeadlineSettings) => {
    onSettingsChange({ deadline: deadlineSettings });
    closeModal();
  }, [onSettingsChange, closeModal]);

  return (
    <View style={styles.container}>
      {/* 标题区域 */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {TEXTS.AGREEMENT.TITLE}
        </Text>
        <Text style={styles.requiredMark}>
          {TEXTS.AGREEMENT.REQUIRED}
        </Text>
      </View>

      {/* 设置卡片列表 */}
      <View style={styles.settingsList}>
        {/* 时间设置 */}
        <SettingCard
          title={TEXTS.AGREEMENT.TIME_LABEL}
          placeholder={TEXTS.AGREEMENT.TIME_PLACEHOLDER}
          value={formatTimeDisplay(settings.time)}
          isValid={settings.time.isValid}
          hasError={!validation.time.isValid}
          errorMessage={validation.time.error}
          onPress={() => openModal('time')}
        />

        {/* 地点设置 */}
        <SettingCard
          title={TEXTS.AGREEMENT.LOCATION_LABEL}
          placeholder={TEXTS.AGREEMENT.LOCATION_PLACEHOLDER}
          value={formatLocationDisplay(settings.location)}
          isValid={settings.location.isValid}
          hasError={!validation.location.isValid}
          errorMessage={validation.location.error}
          onPress={() => openModal('location')}
        />

        {/* 定价设置 */}
        <SettingCard
          title={TEXTS.AGREEMENT.PRICING_LABEL}
          placeholder={TEXTS.AGREEMENT.PRICING_PLACEHOLDER}
          value={formatPricingDisplay(settings.pricing)}
          isValid={settings.pricing.isValid}
          hasError={!validation.pricing.isValid}
          errorMessage={validation.pricing.error}
          onPress={() => openModal('pricing')}
        />

        {/* 人数设置 */}
        <SettingCard
          title={TEXTS.AGREEMENT.PARTICIPANTS_LABEL}
          placeholder={TEXTS.AGREEMENT.PARTICIPANTS_PLACEHOLDER}
          value={formatParticipantDisplay(settings.participants)}
          isValid={settings.participants.isValid}
          hasError={!validation.participants.isValid}
          errorMessage={validation.participants.error}
          onPress={() => openModal('participants')}
        />

        {/* 报名截止时间设置 */}
        <SettingCard
          title={TEXTS.AGREEMENT.DEADLINE_LABEL}
          placeholder={TEXTS.AGREEMENT.DEADLINE_PLACEHOLDER}
          value={formatDeadlineDisplay(settings.deadline)}
          isValid={settings.deadline.isValid}
          hasError={!validation.deadline.isValid}
          errorMessage={validation.deadline.error}
          onPress={() => openModal('deadline')}
        />
      </View>

      {/* 约定项预览 */}
      {validation.overall.isValid && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>约定项预览</Text>
          <View style={styles.previewContent}>
            <Text style={styles.previewText}>
              📅 时间: {formatTimeDisplay(settings.time)}
            </Text>
            <Text style={styles.previewText}>
              📍 地点: {formatLocationDisplay(settings.location)}
            </Text>
            <Text style={styles.previewText}>
              💰 价格: {formatPricingDisplay(settings.pricing)}
            </Text>
            <Text style={styles.previewText}>
              👥 人数: {formatParticipantDisplay(settings.participants)}
            </Text>
            <Text style={styles.previewText}>
              ⏰ 截止: {formatDeadlineDisplay(settings.deadline)}
            </Text>
          </View>
        </View>
      )}

      {/* 简化的弹窗组件 */}
      <SimpleModal
        visible={activeModal === 'time'}
        title="选择时间"
        onClose={closeModal}
      >
        <Text style={styles.modalText}>时间选择功能开发中...</Text>
        <TouchableOpacity 
          style={styles.modalButton} 
          onPress={() => {
            const newSettings: TimeSettings = {
              startDate: new Date(),
              startTime: '09:00',
              endTime: '12:00',
              duration: 180,
              isValid: true,
            };
            handleTimeChange(newSettings);
          }}
        >
          <Text style={styles.modalButtonText}>确认</Text>
        </TouchableOpacity>
      </SimpleModal>

      <SimpleModal
        visible={activeModal === 'location'}
        title="选择地点"
        onClose={closeModal}
      >
        <Text style={styles.modalText}>地点选择功能开发中...</Text>
        <TouchableOpacity 
          style={styles.modalButton} 
          onPress={() => {
            const newSettings: LocationSettings = {
              address: '测试地址',
              detailAddress: '测试详细地址',
              isCurrentLocation: false,
              isValid: true,
            };
            handleLocationChange(newSettings);
          }}
        >
          <Text style={styles.modalButtonText}>确认</Text>
        </TouchableOpacity>
      </SimpleModal>

      <SimpleModal
        visible={activeModal === 'pricing'}
        title="设置价格"
        onClose={closeModal}
      >
        <Text style={styles.modalText}>价格设置功能开发中...</Text>
        <TouchableOpacity 
          style={styles.modalButton} 
          onPress={() => {
            const newSettings: PricingSettings = {
              amount: 100,
              currency: 'coin',
              billingType: 'hourly',
              paymentMethod: 'prepaid',
              isValid: true,
            };
            handlePricingChange(newSettings);
          }}
        >
          <Text style={styles.modalButtonText}>确认</Text>
        </TouchableOpacity>
      </SimpleModal>

      <SimpleModal
        visible={activeModal === 'participants'}
        title="设置人数"
        onClose={closeModal}
      >
        <Text style={styles.modalText}>人数设置功能开发中...</Text>
        <TouchableOpacity 
          style={styles.modalButton} 
          onPress={() => {
            const newSettings: ParticipantSettings = {
              maxCount: 6,
              minCount: 2,
              genderRatio: { unlimited: true },
              ageLimit: { unlimited: true },
              isValid: true,
            };
            handleParticipantChange(newSettings);
          }}
        >
          <Text style={styles.modalButtonText}>确认</Text>
        </TouchableOpacity>
      </SimpleModal>

      <SimpleModal
        visible={activeModal === 'deadline'}
        title="设置截止时间"
        onClose={closeModal}
      >
        <Text style={styles.modalText}>截止时间设置功能开发中...</Text>
        <TouchableOpacity 
          style={styles.modalButton} 
          onPress={() => {
            const newSettings: DeadlineSettings = {
              deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明天
              quickOption: '1day',
              isValid: true,
            };
            handleDeadlineChange(newSettings);
          }}
        >
          <Text style={styles.modalButtonText}>确认</Text>
        </TouchableOpacity>
      </SimpleModal>
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 3. 样式定义
// ══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  // 容器样式
  container: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.LG,
  },

  // 标题区域
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },

  title: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginRight: SPACING.SM,
  },

  requiredMark: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.ERROR,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  // 设置列表
  settingsList: {
    marginBottom: SPACING.LG,
  },

  // 设置卡片
  settingCard: {
    marginBottom: SPACING.MD,
  },

  settingTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },

  // 选择按钮
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.WHITE,
  },

  selectButtonError: {
    borderColor: COLORS.ERROR,
    backgroundColor: COLORS.ERROR + '10',
  },

  selectButtonValid: {
    borderColor: COLORS.SUCCESS,
    backgroundColor: COLORS.SUCCESS + '10',
  },

  selectButtonText: {
    fontSize: FONT_SIZE.MD,
    flex: 1,
  },

  selectButtonTextEmpty: {
    color: COLORS.TEXT_PLACEHOLDER,
  },

  selectButtonTextFilled: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  selectButtonIcon: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.SM,
    transform: [{ rotate: '0deg' }],
  },

  // 错误信息
  errorText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.ERROR,
    marginTop: SPACING.XS,
  },

  // 预览区域
  previewSection: {
    padding: SPACING.MD,
    backgroundColor: COLORS.GRAY_50,
    borderRadius: BORDER_RADIUS.MD,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },

  previewTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },

  previewContent: {
    // 预览内容样式
  },

  previewText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: SPACING.XS,
  },

  // 弹窗样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '80%',
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    overflow: 'hidden',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  modalTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  modalCloseButton: {
    fontSize: FONT_SIZE.XL,
    color: COLORS.TEXT_SECONDARY,
    padding: SPACING.SM,
  },

  modalContent: {
    padding: SPACING.MD,
  },

  modalText: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },

  modalButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
  },

  modalButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
});

export default AgreementSettings;

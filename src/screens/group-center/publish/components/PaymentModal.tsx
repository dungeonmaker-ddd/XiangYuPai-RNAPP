/**
 * 🎯 支付确认弹窗
 * 
 * 功能：
 * - 支付金额展示
 * - 支付方式选择
 * - 费用明细显示
 * - 余额检查
 * - 支付处理流程
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  PaymentModalProps,
  PaymentMethod,
  PaymentStatus,
  FeeBreakdown,
} from '../types';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  TEXTS,
  PAYMENT_CONFIG,
} from '../constants';

// ══════════════════════════════════════════════════════════════
// 1. 子组件：支付金额显示
// ══════════════════════════════════════════════════════════════

interface PaymentAmountProps {
  amount: number;
  currency: 'coin' | 'rmb';
}

const PaymentAmount: React.FC<PaymentAmountProps> = ({ amount, currency }) => {
  const currencySymbol = currency === 'coin' ? '🪙' : '¥';
  const currencyText = currency === 'coin' ? '金币' : '元';

  return (
    <View style={styles.amountSection}>
      <Text style={styles.amountLabel}>
        {TEXTS.PAYMENT.AMOUNT_LABEL}
      </Text>
      <View style={styles.amountDisplay}>
        <Text style={styles.amountSymbol}>{currencySymbol}</Text>
        <Text style={styles.amountValue}>{amount}</Text>
        <Text style={styles.amountUnit}>{currencyText}</Text>
      </View>
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 2. 子组件：支付方式选择
// ══════════════════════════════════════════════════════════════

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  userBalance: number;
  onMethodSelect: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  userBalance,
  onMethodSelect,
}) => {
  return (
    <View style={styles.methodSection}>
      <Text style={styles.sectionTitle}>
        {TEXTS.PAYMENT.METHOD_LABEL}
      </Text>
      
      {PAYMENT_CONFIG.METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodOption,
            selectedMethod === method.id && styles.methodOptionSelected,
            !method.enabled && styles.methodOptionDisabled,
          ]}
          onPress={() => method.enabled && onMethodSelect(method.id)}
          disabled={!method.enabled}
        >
          <View style={styles.methodInfo}>
            <View style={styles.methodIcon}>
              <Text style={styles.methodIconText}>{method.icon}</Text>
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodName}>{method.name}</Text>
              {method.id === PaymentMethod.COIN && (
                <Text style={styles.methodBalance}>
                  {TEXTS.PAYMENT.BALANCE_LABEL}: {userBalance}
                </Text>
              )}
            </View>
          </View>
          
          {selectedMethod === method.id && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 3. 子组件：费用明细
// ══════════════════════════════════════════════════════════════

interface FeeBreakdownProps {
  feeBreakdown: FeeBreakdown;
}

const FeeBreakdownComponent: React.FC<FeeBreakdownProps> = ({ feeBreakdown }) => {
  return (
    <View style={styles.feeSection}>
      <Text style={styles.sectionTitle}>
        {TEXTS.PAYMENT.FEE_BREAKDOWN}
      </Text>
      
      <View style={styles.feeList}>
        <View style={styles.feeItem}>
          <Text style={styles.feeLabel}>{TEXTS.PAYMENT.BASE_FEE}</Text>
          <Text style={styles.feeValue}>{feeBreakdown.baseFee}金币</Text>
        </View>
        
        <View style={styles.feeItem}>
          <Text style={styles.feeLabel}>{TEXTS.PAYMENT.SERVICE_FEE}</Text>
          <Text style={styles.feeValue}>{feeBreakdown.serviceFee}金币</Text>
        </View>
        
        {feeBreakdown.discount && feeBreakdown.discount > 0 && (
          <View style={styles.feeItem}>
            <Text style={[styles.feeLabel, styles.discountLabel]}>
              {TEXTS.PAYMENT.DISCOUNT}
            </Text>
            <Text style={[styles.feeValue, styles.discountValue]}>
              -{feeBreakdown.discount}金币
            </Text>
          </View>
        )}
        
        <View style={[styles.feeItem, styles.totalItem]}>
          <Text style={styles.totalLabel}>{TEXTS.PAYMENT.TOTAL}</Text>
          <Text style={styles.totalValue}>{feeBreakdown.total}金币</Text>
        </View>
      </View>
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// 4. 主组件：支付确认弹窗
// ══════════════════════════════════════════════════════════════

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  paymentInfo,
  onPaymentConfirm,
  onPaymentCancel,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.COIN);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [agreed, setAgreed] = useState(false);

  // 检查余额是否充足
  const isBalanceSufficient = paymentInfo.userBalance >= paymentInfo.amount;
  const canPay = agreed && isBalanceSufficient && paymentStatus === PaymentStatus.IDLE;

  // 处理支付确认
  const handlePaymentConfirm = useCallback(async () => {
    if (!canPay) return;

    try {
      setPaymentStatus(PaymentStatus.PROCESSING);
      
      // 模拟支付处理
      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
      
      // 随机成功/失败 (实际项目中这里会调用真实的支付接口)
      const success = Math.random() > 0.2; // 80% 成功率
      
      if (success) {
        setPaymentStatus(PaymentStatus.SUCCESS);
        Alert.alert('支付成功', '组局发布成功！', [
          { text: '确定', onPress: onPaymentConfirm }
        ]);
      } else {
        setPaymentStatus(PaymentStatus.FAILED);
        Alert.alert('支付失败', '请重试或联系客服', [
          { text: '确定', onPress: () => setPaymentStatus(PaymentStatus.IDLE) }
        ]);
      }
    } catch (error) {
      setPaymentStatus(PaymentStatus.FAILED);
      Alert.alert('支付错误', '网络错误，请重试', [
        { text: '确定', onPress: () => setPaymentStatus(PaymentStatus.IDLE) }
      ]);
    }
  }, [canPay, onPaymentConfirm]);

  // 处理支付取消
  const handlePaymentCancel = useCallback(() => {
    if (paymentStatus === PaymentStatus.PROCESSING) {
      Alert.alert('确认取消', '支付正在处理中，确定要取消吗？', [
        { text: '继续支付', style: 'cancel' },
        { text: '取消支付', style: 'destructive', onPress: onPaymentCancel }
      ]);
    } else {
      onPaymentCancel();
    }
  }, [paymentStatus, onPaymentCancel]);

  // 获取支付按钮文本
  const getPaymentButtonText = () => {
    switch (paymentStatus) {
      case PaymentStatus.PROCESSING:
        return TEXTS.PAYMENT.PROCESSING;
      case PaymentStatus.SUCCESS:
        return TEXTS.PAYMENT.SUCCESS;
      case PaymentStatus.FAILED:
        return TEXTS.PAYMENT.FAILED;
      default:
        return !isBalanceSufficient 
          ? TEXTS.PAYMENT.INSUFFICIENT_BALANCE 
          : TEXTS.PAYMENT.PAY_BUTTON;
    }
  };

  // 重置状态当弹窗显示时
  useEffect(() => {
    if (visible) {
      setPaymentStatus(PaymentStatus.IDLE);
      setAgreed(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 弹窗头部 */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {TEXTS.PAYMENT.TITLE}
            </Text>
            <TouchableOpacity 
              onPress={onClose}
              disabled={paymentStatus === PaymentStatus.PROCESSING}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 弹窗内容 */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 支付金额 */}
            <PaymentAmount
              amount={paymentInfo.amount}
              currency={paymentInfo.currency}
            />

            {/* 支付方式选择 */}
            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              userBalance={paymentInfo.userBalance}
              onMethodSelect={setSelectedMethod}
            />

            {/* 费用明细 */}
            <FeeBreakdownComponent feeBreakdown={paymentInfo.feeBreakdown} />

            {/* 支付条款 */}
            <View style={styles.termsSection}>
              <TouchableOpacity
                style={styles.agreementRow}
                onPress={() => setAgreed(!agreed)}
                disabled={paymentStatus === PaymentStatus.PROCESSING}
              >
                <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                  {agreed && <Text style={styles.checkboxMark}>✓</Text>}
                </View>
                <Text style={styles.agreementText}>
                  {TEXTS.PAYMENT.AGREEMENT_TEXT}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.securityTip}>
                {TEXTS.PAYMENT.SECURITY_TIP}
              </Text>
            </View>
          </ScrollView>

          {/* 操作按钮 */}
          <View style={styles.actions}>
            {!isBalanceSufficient && (
              <TouchableOpacity style={styles.rechargeButton}>
                <Text style={styles.rechargeButtonText}>
                  {TEXTS.PAYMENT.RECHARGE_BUTTON}
                </Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, styles.actionButton]}
                onPress={handlePaymentCancel}
                disabled={paymentStatus === PaymentStatus.PROCESSING}
              >
                <Text style={styles.cancelButtonText}>
                  {TEXTS.PAYMENT.CANCEL_BUTTON}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.payButton,
                  styles.actionButton,
                  !canPay && styles.payButtonDisabled,
                ]}
                onPress={handlePaymentConfirm}
                disabled={!canPay}
              >
                {paymentStatus === PaymentStatus.PROCESSING ? (
                  <ActivityIndicator color={COLORS.WHITE} size="small" />
                ) : (
                  <Text style={styles.payButtonText}>
                    {getPaymentButtonText()}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ══════════════════════════════════════════════════════════════
// 5. 样式定义
// ══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  // 弹窗样式
  overlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.XL,
    overflow: 'hidden',
  },

  // 头部
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  title: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  closeButton: {
    fontSize: FONT_SIZE.XL,
    color: COLORS.TEXT_SECONDARY,
    padding: SPACING.SM,
  },

  // 内容
  content: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
  },

  // 支付金额
  amountSection: {
    alignItems: 'center',
    paddingVertical: SPACING.XL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  amountLabel: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },

  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  amountSymbol: {
    fontSize: FONT_SIZE.XL,
    marginRight: SPACING.SM,
  },

  amountValue: {
    fontSize: FONT_SIZE.XXXL,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.ERROR,
  },

  amountUnit: {
    fontSize: FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.XS,
  },

  // 区域标题
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.LG,
    marginBottom: SPACING.MD,
  },

  // 支付方式
  methodSection: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    paddingBottom: SPACING.MD,
  },

  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
  },

  methodOptionSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '10',
  },

  methodOptionDisabled: {
    opacity: 0.5,
  },

  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },

  methodIconText: {
    fontSize: FONT_SIZE.LG,
  },

  methodDetails: {
    flex: 1,
  },

  methodName: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },

  methodBalance: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },

  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkMark: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
  },

  // 费用明细
  feeSection: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    paddingBottom: SPACING.MD,
  },

  feeList: {
    backgroundColor: COLORS.GRAY_50,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
  },

  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },

  feeLabel: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
  },

  feeValue: {
    fontSize: FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  discountLabel: {
    color: COLORS.SUCCESS,
  },

  discountValue: {
    color: COLORS.SUCCESS,
  },

  totalItem: {
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    paddingTop: SPACING.SM,
    marginTop: SPACING.SM,
    marginBottom: 0,
  },

  totalLabel: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  totalValue: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.ERROR,
  },

  // 支付条款
  termsSection: {
    paddingVertical: SPACING.MD,
  },

  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.MD,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    borderRadius: 4,
    marginRight: SPACING.SM,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },

  checkboxChecked: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY,
  },

  checkboxMark: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.BOLD,
  },

  agreementText: {
    flex: 1,
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },

  securityTip: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.TEXT_PLACEHOLDER,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // 操作按钮
  actions: {
    padding: SPACING.LG,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },

  rechargeButton: {
    backgroundColor: COLORS.WARNING,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },

  rechargeButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  actionButton: {
    flex: 1,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  cancelButton: {
    backgroundColor: COLORS.GRAY_100,
    marginRight: SPACING.SM,
  },

  cancelButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  payButton: {
    backgroundColor: COLORS.PRIMARY,
    marginLeft: SPACING.SM,
  },

  payButtonDisabled: {
    backgroundColor: COLORS.GRAY_300,
  },

  payButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
});

export default PaymentModal;

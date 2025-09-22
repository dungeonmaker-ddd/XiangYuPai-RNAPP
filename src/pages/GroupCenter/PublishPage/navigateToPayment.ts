/**
 * 🧭 页面跳转导航 - 跳转到支付确认
 * 统一管理支付相关的导航跳转
 */

import type { PaymentInfo } from './types';

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  push?: (screen: string, params?: any) => void;
}

export const navigateToPayment = (
  navigation: NavigationProps,
  paymentInfo: PaymentInfo,
  options?: {
    animation?: 'slide' | 'fade' | 'none';
    replace?: boolean;
  }
) => {
  const params = {
    paymentInfo,
    ...options,
  };

  if (options?.replace && navigation.push) {
    navigation.push('PaymentConfirm', params);
  } else {
    navigation.navigate('PaymentConfirm', params);
  }
};

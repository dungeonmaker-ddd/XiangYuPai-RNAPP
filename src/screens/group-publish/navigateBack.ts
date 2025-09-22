/**
 * 🧭 返回导航
 * 统一管理发布页面的返回导航逻辑
 */

interface NavigationProps {
  goBack: () => void;
  navigate: (screen: string, params?: any) => void;
  canGoBack: () => boolean;
}

export const navigateBack = (
  navigation: NavigationProps,
  options?: {
    confirmOnDirty?: boolean;
    fallbackScreen?: string;
    fallbackParams?: any;
    onConfirm?: () => void;
  }
) => {
  if (navigation.canGoBack()) {
    if (options?.confirmOnDirty && options.onConfirm) {
      // 需要确认的情况下调用确认回调
      options.onConfirm();
    } else {
      navigation.goBack();
    }
  } else if (options?.fallbackScreen) {
    navigation.navigate(options.fallbackScreen, options.fallbackParams);
  } else {
    // 默认回到组局中心
    navigation.navigate('GroupCenter');
  }
};

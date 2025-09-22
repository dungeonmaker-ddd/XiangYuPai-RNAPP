/**
 * 🧭 返回导航
 * 统一管理返回导航逻辑
 */

interface NavigationProps {
  goBack: () => void;
  navigate: (screen: string, params?: any) => void;
  canGoBack: () => boolean;
}

export const navigateBack = (
  navigation: NavigationProps,
  options?: {
    fallbackScreen?: string;
    fallbackParams?: any;
  }
) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else if (options?.fallbackScreen) {
    navigation.navigate(options.fallbackScreen, options.fallbackParams);
  } else {
    // 默认回到首页
    navigation.navigate('Home');
  }
};

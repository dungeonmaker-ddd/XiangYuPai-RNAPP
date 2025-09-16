/**
 * 发现页面服务导出索引
 * 统一管理和导出所有数据服务
 */

// 主要数据服务
export { 
  DiscoverDataService, 
  discoverDataService, 
  DiscoverAPI 
} from './DiscoverDataService';

// 数据管理Hook
export { useDiscoverData } from '../hooks/useDiscoverData';

// 类型定义
export type { 
  DataServiceConfig,
  UseDiscoverDataConfig,
  UseDiscoverDataReturn,
} from './DiscoverDataService';

// 便捷的服务配置函数
export const configureDiscoverServices = (config: {
  enableCache?: boolean;
  cacheExpireTime?: number;
  enableAutoRefresh?: boolean;
  autoRefreshInterval?: number;
}) => {
  // 配置数据服务
  discoverDataService.updateConfig({
    enableCache: config.enableCache,
    cacheExpireTime: config.cacheExpireTime,
  });

  return {
    // 返回配置好的Hook参数
    hookConfig: {
      enableAutoRefresh: config.enableAutoRefresh,
      autoRefreshInterval: config.autoRefreshInterval,
      enableCache: config.enableCache,
    },
  };
};

// 预设配置
export const ServicePresets = {
  // 生产环境配置
  production: {
    enableCache: true,
    cacheExpireTime: 5 * 60 * 1000, // 5分钟
    enableAutoRefresh: false,
    autoRefreshInterval: 60000, // 1分钟
  },
  
  // 开发环境配置
  development: {
    enableCache: true,
    cacheExpireTime: 2 * 60 * 1000, // 2分钟
    enableAutoRefresh: true,
    autoRefreshInterval: 30000, // 30秒
  },
  
  // 测试环境配置
  test: {
    enableCache: false,
    cacheExpireTime: 0,
    enableAutoRefresh: false,
    autoRefreshInterval: 0,
  },
};

// 快速配置函数
export const quickConfigure = (preset: keyof typeof ServicePresets) => {
  return configureDiscoverServices(ServicePresets[preset]);
};

/**
 * 点赞收藏项区域 - 类型定义
 */

import { LikeCollectMessage } from '../../types';

export interface LikeCollectItemAreaProps {
  message: LikeCollectMessage;
  onPress: (message: LikeCollectMessage) => void;
  onUserPress: (userId: string) => void;
}

export interface ActionInfo {
  icon: string;
  text: string;
  type: 'like' | 'collect';
}

/**
 * 点赞收藏项区域 - 常量配置
 */

export const ACTION_CONFIG = {
  like: {
    icon: '💖',
    text: '点赞了你的评论'
  },
  collect: {
    icon: '⭐',
    text: '收藏了你的作品'
  }
} as const;

export const THUMBNAIL_SIZE = {
  width: 48,
  height: 48
} as const;

export const ACTION_ICON_SIZE = {
  width: 20,
  height: 20,
  fontSize: 12
} as const;

export const CONTENT_TYPE_ICONS = {
  post: '📝',
  comment: '💬',
  image: '🖼️',
  video: '🎬'
} as const;

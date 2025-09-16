import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

// 导入共享常量和类型
import { COLORS } from '../constants';
import type { UserCard as UserCardData } from '../types';

interface UserCardProps {
  user: UserCardData;
  onPress: () => void;
}

// 工具函数
const formatDistance = (distance: number): string => {
  return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
};

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const getStatusColor = (status: UserCardData['status']): string => {
  switch (status) {
    case 'online': return COLORS.green;
    case 'available': return COLORS.orange;
    default: return COLORS.gray500;
  }
};

const getStatusText = (status: UserCardData['status']): string => {
  switch (status) {
    case 'online': return '在线';
    case 'available': return '可预约';
    default: return '离线';
  }
};

// UserCard Component
export const UserCard = ({ user, onPress }: UserCardProps) => {
  const [showDynamics, setShowDynamics] = useState(false);

  const handleContentPress = () => {
    setShowDynamics(!showDynamics);
  };

  return (
  <View style={styles.cardWrapper}>
    <View style={[
      styles.cardContainer,
      !showDynamics && styles.cardCollapsed,
      showDynamics && styles.cardExpanded
    ]}>
    {/* 👤 用户核心信息区域 - 可点击展开动态 */}
    <TouchableOpacity 
      style={styles.userInfoSection}
      onPress={handleContentPress}
      activeOpacity={0.8}
    >
       {/* 🖼️ 用户头像区域 */}
       <View style={styles.avatarContainer}>
         <Image source={{ uri: user.avatar }} style={styles.avatar} />
       </View>

       {/* 📝 用户信息区域 */}
       <View style={styles.userDetailsContainer}>
         {/* 第一行：用户昵称 + 性别年龄 */}
         <View style={styles.nameRow}>
           <Text style={styles.username}>{truncateText(user.username, 15)}</Text>
           <View style={styles.ageTag}>
             <Text style={styles.ageText}>♀{user.age}</Text>
           </View>
         </View>

         {/* 第二行：用户简介 */}
         <Text style={styles.bio}>
           {truncateText(user.bio || '这个家伙很神秘，没有填写简介', 40)}
         </Text>

         {/* 第三行：职位 + 状态信息 */}
         <View style={styles.thirdRowContainer}>
           {/* 左侧：职位信息 */}
           <View style={styles.jobTitleContainer}>
             <Text style={styles.jobTitle}>
               {user.services.length > 0 ? user.services[0] : '模特'}
             </Text>
           </View>
           
           {/* 右侧：状态和距离 */}
           <View style={styles.rightStatusContainer}>
             <View style={styles.statusIndicator}>
               <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.status) }]} />
               <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
                 {getStatusText(user.status)}
               </Text>
             </View>
             <Text style={styles.distanceText}>📍 {formatDistance(user.distance)}</Text>
           </View>
         </View>
       </View>
    </TouchableOpacity>

    {/* 🎨 最近动态区域 - 条件显示 */}
    {showDynamics && (
      <View>
        {/* 分割线 */}
        <View style={styles.divider} />
        
        <View style={styles.dynamicsSection}>
          {/* 🖼️ 动态网格容器 - 最多3张 */}
          <View style={styles.dynamicsGrid}>
          {user.photos.slice(0, 3).map((photo, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.dynamicItem}
              onPress={onPress}
            >
              {/* 🖼️ 图片子容器 */}
              <View style={styles.dynamicImageContainer}>
                <Image source={{ uri: photo }} style={styles.dynamicImage} />
                {/* 互动信息覆盖层 */}
                <View style={styles.dynamicStats}>
                  <Text style={styles.dynamicLikes}>❤️ {88 + index * 12}</Text>
                </View>
              </View>
              
              {/* 📝 图片下方文字 */}
              <View style={styles.dynamicTextContainer}>
                <Text style={styles.dynamicTitle}>最新动态 {index + 1}</Text>
              </View>
            </TouchableOpacity>
           ))}
          </View>
        </View>
      </View>
    )}
    </View>
  </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  // 📦 卡片包装容器 - 控制边距
  cardWrapper: {
    marginHorizontal: 14, // 左右边距14px
    marginVertical: 8,   // 上下边距16px
  },

  // 📋 卡片容器 - 垂直布局
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.gray50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // 收起状态的宽高比样式
  cardCollapsed: {
    width: '100%',
    // aspectRatio: 351 / 100, // 宽高比 3.51:1
    overflow: 'hidden', // 防止内容溢出
  },
  
  // 展开状态的宽高比样式
  cardExpanded: {
    width: '100%',
    aspectRatio: 351 / 243, // 宽高比 1.44:1
  },

  // 👤 用户核心信息区域
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // 去掉所有padding
  },

  // 🖼️ 用户头像区域
  avatarContainer: {
    width: '30%',          // 占据33%的宽度
    position: 'relative',
    alignItems: 'flex-start',
    // 去掉右边距
  },
  avatar: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8, // 改为正方形圆角
    // borderWidth: 3,
    borderColor: COLORS.white,
  },
  ageTag: {
    backgroundColor: COLORS.pink,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8, // 与用户名之间的间距
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },

  // 📝 用户信息区域
  userDetailsContainer: {
    width: '67%',            // 占据67%的宽度
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between', // 使第三行置底
    // 完全去掉最小高度，让容器自适应内容
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6, // 减少底部间距
    flexWrap: 'wrap', // 防止内容过长换行
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  bio: {
    fontSize: 14,
    color: COLORS.gray500,
    lineHeight: 20,
    flex: 1, // 让简介占据中间的可用空间
  },
  // 第三行：职位 + 状态信息容器
  thirdRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 左右分布
    alignItems: 'center',
  },
  
  // 左侧职位信息
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 14,
    color: COLORS.gray500,
    fontWeight: '500',
  },
  
  // 右侧状态信息容器
  rightStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 在线状态和距离之间的间距
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.gray500,
  },

  // 分割线样式
  divider: {
    height: 1,
    backgroundColor: COLORS.gray100,
    marginTop: 14,        // 分割线上间距14px
    marginBottom: 14,     // 分割线下间距14px
    marginHorizontal: 14, // 分割线左右边距14px
  },

  // 🎨 最近动态区域
  dynamicsSection: {
    paddingHorizontal: 14,
  },
  
  // 🖼️ 动态网格容器 - flex自适应布局
  dynamicsGrid: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between', // 均匀分布
    flexWrap: 'wrap', // 允许换行
  },
  dynamicItem: {
    flex: 1, // 自适应宽度
    minWidth: 80, // 最小宽度
    maxWidth: 120, // 最大宽度
    minHeight: 120, // 最小总高度（包含图片和文字）
    marginHorizontal: 2, // 小间距
    alignItems: 'center', // 子容器居中对齐
    justifyContent: 'flex-start', // 从顶部开始布局
  },
  
  // 🖼️ 图片子容器
  dynamicImageContainer: {
    width: '100%',
    minHeight: 100, // 最小容器高度
    maxHeight: 220, // 最大容器高度
    borderRadius: 8,
    position: 'relative',
    backgroundColor: COLORS.gray100,
    alignItems: 'center', // 图片居中对齐
    justifyContent: 'center', // 垂直居中
    flex: 1, // 贪婪地占用可用空间
  },
  
  dynamicImage: {
    width: '100%',
    minHeight: 80,  // 最小高度
    maxHeight: 200, // 最大高度限制
    backgroundColor: COLORS.gray100,
    resizeMode: 'cover', // 覆盖模式，填满容器
    flex: 1, // 贪婪地占用可用空间
  },
  
  // 📝 图片下方文字容器
  dynamicTextContainer: {
    width: '100%',
    paddingTop: 4, // 图片和文字之间的间距
    alignItems: 'flex-start', // 居左对齐
  },
  dynamicTitle: {
    color: COLORS.gray500,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'left', // 文字居左对齐
  },
  dynamicStats: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 10,
  },
  dynamicLikes: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '500',
  },

  // 公共布局样式 (保留兼容性)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },

  // 公共文字样式 (保留兼容性)
  text: {
    fontSize: 14,
    color: COLORS.gray900,
  },
  textWhite: {
    color: COLORS.white,
  },
  textGray: {
    color: COLORS.gray500,
  },
  textBold: {
    fontWeight: '600',
  },
  textCenter: {
    textAlign: 'center',
  },

  // 公共间距 (保留兼容性)
  padding16: {
    padding: 16,
  },

  // 公共边框 (保留兼容性)
  borderRadius12: {
    borderRadius: 12,
  },
});

export default UserCard;

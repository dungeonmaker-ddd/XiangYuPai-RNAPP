/**
 * 地区选择模块 - 地区列表区域
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */

// #region 1. Imports
import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';
import type { RegionInfo, AlphabetItem } from '../types';
import { COLORS, FONTS, SIZES, SPACING, ALPHABET, PLACEHOLDER_TEXTS } from '../constants';
import AlphabetIndex from './AlphabetIndex';
import RegionListItem from './RegionListItem';
// #endregion

// #region 2. Types & Schema
interface RegionListAreaProps {
  regions: RegionInfo[];
  selectedLocation: RegionInfo | null;
  searchQuery: string;
  activeAlphabet: string | null;
  onRegionPress: (region: RegionInfo) => void;
  onSearchChange: (query: string) => void;
  onAlphabetPress: (letter: string) => void;
}
// #endregion

// #region 3. Constants & Config
// 常量在imports中已引入
// #endregion

// #region 4. Utils & Helpers
// 搜索地区
const searchRegions = (query: string, regions: RegionInfo[]): RegionInfo[] => {
  if (!query.trim()) return regions;
  
  const lowerQuery = query.toLowerCase();
  return regions.filter(region => 
    region.name.toLowerCase().includes(lowerQuery) ||
    region.pinyin.toLowerCase().includes(lowerQuery) ||
    region.firstLetter.toLowerCase() === lowerQuery
  );
};

// 按字母分组地区
const groupRegionsByAlphabet = (regions: RegionInfo[]): AlphabetItem[] => {
  const grouped = regions.reduce((acc, region) => {
    const letter = region.firstLetter;
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(region);
    return acc;
  }, {} as Record<string, RegionInfo[]>);

  return ALPHABET.map((letter, index) => ({
    letter,
    regions: grouped[letter] || [],
    sectionIndex: index,
  })).filter(item => item.regions.length > 0);
};
// #endregion

// #region 5. State Management
// 此组件不包含内部状态管理
// #endregion

// #region 6. Domain Logic
// 业务逻辑通过props传入
// #endregion

// #region 7. UI Components & Rendering
const RegionListArea: React.FC<RegionListAreaProps> = ({
  regions,
  selectedLocation,
  searchQuery,
  activeAlphabet,
  onRegionPress,
  onSearchChange,
  onAlphabetPress,
}) => {
  const flatListRef = useRef<FlatList>(null);
  
  // 搜索结果
  const searchResults = useMemo(() => 
    searchRegions(searchQuery, regions),
    [searchQuery, regions]
  );

  // 字母分组数据
  const alphabetData = useMemo(() => 
    groupRegionsByAlphabet(regions), 
    [regions]
  );

  // 渲染数据
  const renderData = searchQuery ? searchResults : regions;

  const renderRegionItem = useCallback(({ item }: { item: RegionInfo }) => (
    <RegionListItem
      region={item}
      selected={selectedLocation?.code === item.code}
      onPress={onRegionPress}
    />
  ), [selectedLocation, onRegionPress]);

  return (
    <View style={styles.container}>
      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={PLACEHOLDER_TEXTS.search}
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* 地区列表容器 */}
      <View style={styles.regionListContainer}>
        <FlatList
          ref={flatListRef}
          data={renderData}
          keyExtractor={(item) => item.code}
          renderItem={renderRegionItem}
          showsVerticalScrollIndicator={false}
          style={styles.regionList}
          contentContainerStyle={styles.regionListContent}
          getItemLayout={(data, index) => ({
            length: SIZES.cardHeight,
            offset: SIZES.cardHeight * index,
            index,
          })}
        />
        
        {/* 字母索引 */}
        {!searchQuery && (
          <AlphabetIndex
            alphabetData={alphabetData}
            activeAlphabet={activeAlphabet}
            onAlphabetPress={onAlphabetPress}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // 搜索框
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  searchInput: {
    height: 40,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.size.md,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  // 地区列表
  regionListContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  regionList: {
    flex: 1,
  },
  regionListContent: {
    paddingBottom: SPACING.xl,
  },
});
// #endregion

// #region 8. Exports
export default RegionListArea;
export type { RegionListAreaProps };
// #endregion

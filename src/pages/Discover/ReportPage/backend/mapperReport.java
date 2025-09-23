// #region 1. File Banner & TOC
/**
 * Report Mapper - 举报数据访问接口 (精简版)
 * 
 * 继承 MyBatis-Plus BaseMapper，提供基础 CRUD 操作
 * 只保留前端必需的核心功能，避免过度设计
 */
// #endregion

// #region 2. Imports
package com.xiangyupai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xiangyupai.entity.Report;
import org.apache.ibatis.annotations.Mapper;
// #endregion

// #region 3. Mapper Interface Definition
/**
 * 举报数据访问接口 - 精简版
 * 只使用 MyBatis-Plus 提供的基础方法
 * 前端举报功能完全可以通过 BaseMapper + QueryWrapper 实现
 * 
 * @author System Generated
 * @since 2024-01-01
 */
@Mapper
public interface ReportMapper extends BaseMapper<Report> {
    
    // 前端举报功能只需要 BaseMapper 提供的基础方法：
    // - save() 保存举报
    // - count() 统计数量 (用于重复检查、频率限制)
    // - selectOne() 查询单条记录
    // - selectList() 查询列表
    // 
    // 所有查询都通过 QueryWrapper/LambdaQueryWrapper 实现
    // 无需自定义 SQL 方法
}
// #endregion
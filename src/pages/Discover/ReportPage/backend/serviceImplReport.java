// #region 1. File Banner & TOC
/**
 * Report Service Implementation - 举报业务服务实现类 (精简版)
 * 
 * 只实现前端必需的核心业务逻辑
 * 使用 MyBatis-Plus QueryWrapper 实现举报提交功能
 */
// #endregion

// #region 2. Imports
package com.xiangyupai.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xiangyupai.dto.ReportSubmitDTO;
import com.xiangyupai.entity.Report;
import com.xiangyupai.mapper.ReportMapper;
import com.xiangyupai.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
// #endregion

// #region 3. Service Implementation Definition
/**
 * 举报业务服务实现类 - 精简版
 * 只实现前端举报功能必需的核心方法
 * 
 * @author System Generated
 * @since 2024-01-01
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl extends ServiceImpl<ReportMapper, Report> implements ReportService {

    private final ReportMapper reportMapper;
    private final ObjectMapper objectMapper;

    // #region 4. 核心业务实现 - 前端必需
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long submitReport(ReportSubmitDTO submitDTO, Long reporterUserId, String ipAddress, String userAgent) {
        
        log.info("开始处理举报提交: targetId={}, reportType={}", submitDTO.getTargetId(), submitDTO.getReportType());
        
        // 验证提交数据
        String validationError = validateReportSubmission(submitDTO, reporterUserId);
        if (validationError != null) {
            throw new RuntimeException(validationError);
        }
        
        // 检查重复举报
        if (isDuplicateReport(submitDTO.getTargetId(), submitDTO.getTargetType(), reporterUserId)) {
            throw new RuntimeException("您已经举报过该内容，请勿重复举报");
        }
        
        // 构建举报实体
        Report report = buildReportEntity(submitDTO, reporterUserId, ipAddress, userAgent);
        
        // 保存到数据库
        boolean saved = save(report);
        if (!saved) {
            throw new RuntimeException("举报提交失败，请稍后重试");
        }
        
        log.info("举报提交成功: reportId={}", report.getId());
        
        return report.getId();
    }

    @Override
    public String validateReportSubmission(ReportSubmitDTO submitDTO, Long reporterUserId) {
        
        // 验证必填字段
        if (!StringUtils.hasText(submitDTO.getTargetId())) {
            return "被举报目标ID不能为空";
        }
        
        if (!StringUtils.hasText(submitDTO.getTargetType())) {
            return "被举报目标类型不能为空";
        }
        
        if (!StringUtils.hasText(submitDTO.getReportType())) {
            return "举报类型不能为空";
        }
        
        // 验证目标类型
        List<String> validTargetTypes = Arrays.asList("post", "user", "comment");
        if (!validTargetTypes.contains(submitDTO.getTargetType())) {
            return "无效的目标类型";
        }
        
        // 验证举报类型
        List<String> validReportTypes = Arrays.asList(
            "harassment", "inappropriate", "fraud", "illegal", 
            "fake_info", "minors", "disturbing", "other"
        );
        if (!validReportTypes.contains(submitDTO.getReportType())) {
            return "无效的举报类型";
        }
        
        // 验证描述长度
        if (StringUtils.hasText(submitDTO.getDescription()) && 
            submitDTO.getDescription().length() > 200) {
            return "举报描述不能超过200字符";
        }
        
        // 验证图片数量
        if (!CollectionUtils.isEmpty(submitDTO.getImages()) && 
            submitDTO.getImages().size() > 3) {
            return "最多只能上传3张图片";
        }
        
        // 验证用户举报频率 (防止滥用)
        if (isReportingTooFrequently(reporterUserId)) {
            return "您举报过于频繁，请稍后再试";
        }
        
        return null; // 验证通过
    }

    @Override
    public boolean isDuplicateReport(String targetId, String targetType, Long reporterUserId) {
        
        LambdaQueryWrapper<Report> queryWrapper = new LambdaQueryWrapper<Report>()
                .eq(Report::getTargetId, targetId)
                .eq(Report::getTargetType, targetType)
                .eq(Report::getReporterUserId, reporterUserId)
                .ge(Report::getCreatedAt, LocalDateTime.now().minusHours(24)); // 24小时内
        
        return count(queryWrapper) > 0;
    }
    // #endregion

    // #region 5. 私有工具方法
    /**
     * 构建举报实体
     */
    private Report buildReportEntity(ReportSubmitDTO submitDTO, Long reporterUserId, String ipAddress, String userAgent) {
        
        Report report = new Report();
        report.setReporterUserId(reporterUserId);
        report.setTargetId(submitDTO.getTargetId());
        report.setTargetType(submitDTO.getTargetType());
        report.setReportType(submitDTO.getReportType());
        report.setDescription(submitDTO.getDescription());
        report.setReportContext(submitDTO.getReportContext());
        report.setStatus("pending"); // 默认待处理状态
        report.setIpAddress(ipAddress);
        report.setUserAgent(userAgent);
        
        // 处理图片列表
        if (!CollectionUtils.isEmpty(submitDTO.getImages())) {
            try {
                String imagesJson = objectMapper.writeValueAsString(submitDTO.getImages());
                report.setImages(imagesJson);
            } catch (JsonProcessingException e) {
                log.error("序列化图片列表失败", e);
            }
        }
        
        // 处理设备信息
        if (submitDTO.getDeviceInfo() != null) {
            try {
                String deviceInfoJson = objectMapper.writeValueAsString(submitDTO.getDeviceInfo());
                report.setDeviceInfo(deviceInfoJson);
            } catch (JsonProcessingException e) {
                log.error("序列化设备信息失败", e);
            }
        }
        
        return report;
    }

    /**
     * 检查举报频率
     */
    private boolean isReportingTooFrequently(Long userId) {
        
        LambdaQueryWrapper<Report> queryWrapper = new LambdaQueryWrapper<Report>()
                .eq(Report::getReporterUserId, userId)
                .ge(Report::getCreatedAt, LocalDateTime.now().minusHours(1)); // 1小时内
        
        long recentReports = count(queryWrapper);
        return recentReports >= 10; // 1小时内超过10次举报
    }
    // #endregion
}
// #endregion
// #region 1. File Banner & TOC
/**
 * Report Controller - 举报控制器 (精简版)
 * 
 * 只提供前端必需的核心API接口
 * 避免过度设计，专注于实际业务需求
 */
// #endregion

// #region 2. Imports
package com.xiangyupai.controller;

import com.xiangyupai.dto.ReportSubmitDTO;
import com.xiangyupai.dto.ReportResponseDTO;
import com.xiangyupai.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
// #endregion

// #region 3. Controller Definition
/**
 * 举报控制器 - 精简版
 * 只包含前端实际需要的接口
 * 
 * @author System Generated
 * @since 2024-01-01
 */
@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportController {

    private final ReportService reportService;

    // #region 4. 核心接口 - 前端必需
    /**
     * 提交举报 - 前端唯一必需的核心接口
     * 
     * @param submitDTO 举报提交数据
     * @param request HTTP请求对象
     * @return 处理结果
     */
    @PostMapping("/submit")
    public ReportResponseDTO submitReport(
            @Valid @RequestBody ReportSubmitDTO submitDTO,
            HttpServletRequest request) {
        
        log.info("用户提交举报: targetId={}, targetType={}, reportType={}", 
                submitDTO.getTargetId(), submitDTO.getTargetType(), submitDTO.getReportType());
        
        try {
            // 获取用户信息和请求信息
            Long currentUserId = getCurrentUserId(request);
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            // 调用服务层处理举报提交
            Long reportId = reportService.submitReport(submitDTO, currentUserId, ipAddress, userAgent);
            
            log.info("举报提交成功: reportId={}, userId={}", reportId, currentUserId);
            return ReportResponseDTO.success(reportId, "举报提交成功，我们会在24小时内处理");
            
        } catch (Exception e) {
            log.error("举报提交失败: " + e.getMessage(), e);
            return ReportResponseDTO.failure("举报提交失败: " + e.getMessage(), null);
        }
    }
    // #endregion

    // #region 8. 工具方法
    /**
     * 获取当前用户ID
     */
    private Long getCurrentUserId(HttpServletRequest request) {
        // 从JWT Token或Session中获取用户ID
        String userId = request.getHeader("X-User-Id");
        if (userId == null) {
            throw new RuntimeException("用户未登录");
        }
        return Long.parseLong(userId);
    }

    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    /**
     * 检查是否为管理员
     */
    private boolean isAdmin(HttpServletRequest request) {
        // 从JWT Token或Session中获取用户角色
        String userRole = request.getHeader("X-User-Role");
        return "ADMIN".equals(userRole) || "MODERATOR".equals(userRole);
    }
    // #endregion
}
// #endregion

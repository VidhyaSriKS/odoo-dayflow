package com.dayflow.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsSummaryDto {
    private long totalEmployees;
    private long presentToday;
    private long absentToday;
    private long onLeaveToday;
    private long pendingLeaveRequests;
    private double attendanceRate;
    private BigDecimal totalMonthlyPayroll;

    private List<Map<String, Object>> attendanceTrend;
    private List<Map<String, Object>> departmentDistribution;
    private List<Map<String, Object>> leaveTrends;
}

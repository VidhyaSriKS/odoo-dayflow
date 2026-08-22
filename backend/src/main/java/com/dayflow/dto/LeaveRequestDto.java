package com.dayflow.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequestDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private String leaveType; // PAID, SICK, UNPAID, CASUAL
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays;
    private String reason;
    private String status; // PENDING, APPROVED, REJECTED
    private String hrComment;
    private String approvedBy;
    private LocalDateTime createdAt;
}

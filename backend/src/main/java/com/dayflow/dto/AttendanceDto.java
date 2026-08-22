package com.dayflow.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private LocalDate date;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private BigDecimal workingHours;
    private String status; // PRESENT, ABSENT, HALF_DAY, LEAVE
    private String notes;
}

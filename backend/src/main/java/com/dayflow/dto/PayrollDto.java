package com.dayflow.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private String designation;
    private Integer payPeriodMonth;
    private Integer payPeriodYear;
    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal netSalary;
    private String paymentStatus;
    private LocalDate paymentDate;
}

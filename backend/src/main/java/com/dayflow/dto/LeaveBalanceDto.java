package com.dayflow.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalanceDto {
    private Integer paidLeaveBalance;
    private Integer sickLeaveBalance;
    private Integer casualLeaveBalance;
    private Integer year;
}

package com.dayflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "pay_period_month", "pay_period_year"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "pay_period_month", nullable = false)
    private Integer payPeriodMonth;

    @Column(name = "pay_period_year", nullable = false)
    private Integer payPeriodYear;

    @Column(name = "basic_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal allowances;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal deductions;

    @Column(name = "net_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal netSalary;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "PAID"; // PAID, PENDING, PROCESSING

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

package com.dayflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_balances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private Employee employee;

    @Column(name = "paid_leave_balance", nullable = false)
    private Integer paidLeaveBalance = 15;

    @Column(name = "sick_leave_balance", nullable = false)
    private Integer sickLeaveBalance = 10;

    @Column(name = "casual_leave_balance", nullable = false)
    private Integer casualLeaveBalance = 10;

    @Column(name = "leave_year", nullable = false)
    private Integer year = 2026;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}

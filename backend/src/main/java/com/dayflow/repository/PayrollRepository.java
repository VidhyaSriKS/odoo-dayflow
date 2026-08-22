package com.dayflow.repository;

import com.dayflow.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByEmployeeId(Long employeeId);
    Optional<Payroll> findByEmployeeIdAndPayPeriodMonthAndPayPeriodYear(Long employeeId, Integer month, Integer year);
    
    @Query("SELECT SUM(p.netSalary) FROM Payroll p WHERE p.payPeriodMonth = :month AND p.payPeriodYear = :year")
    BigDecimal sumNetSalaryByMonthAndYear(Integer month, Integer year);
}

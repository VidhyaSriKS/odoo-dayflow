package com.dayflow.service;

import com.dayflow.dto.PayrollDto;
import com.dayflow.entity.Employee;
import com.dayflow.entity.Payroll;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditService auditService;

    public List<PayrollDto> getEmployeePayrolls(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<PayrollDto> getAllPayrolls() {
        return payrollRepository.findAll()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public PayrollDto updateEmployeeSalaryStructure(Long employeeId, BigDecimal basic, BigDecimal allowances, BigDecimal deductions) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (basic != null) employee.setBasicSalary(basic);
        if (allowances != null) employee.setAllowances(allowances);
        if (deductions != null) employee.setDeductions(deductions);

        employeeRepository.save(employee);

        // Also update or generate current month payroll record
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        Optional<Payroll> existing = payrollRepository.findByEmployeeIdAndPayPeriodMonthAndPayPeriodYear(employeeId, month, year);
        Payroll payroll = existing.orElseGet(() -> Payroll.builder()
                .employee(employee)
                .payPeriodMonth(month)
                .payPeriodYear(year)
                .paymentStatus("PAID")
                .paymentDate(now)
                .build());

        payroll.setBasicSalary(employee.getBasicSalary());
        payroll.setAllowances(employee.getAllowances());
        payroll.setDeductions(employee.getDeductions());
        payroll.setNetSalary(employee.getNetSalary());

        payroll = payrollRepository.save(payroll);

        if (employee.getUser() != null) {
            notificationService.createNotification(
                employee.getUser().getId(),
                "Payroll Structure Updated",
                "Your monthly net salary has been updated to $" + payroll.getNetSalary(),
                "INFO"
            );
        }

        auditService.logAction("PAYROLL_UPDATE", "ADMIN", "Updated payroll for employee: " + employee.getEmployeeCode());

        return mapToDto(payroll);
    }

    public PayrollDto mapToDto(Payroll p) {
        return PayrollDto.builder()
                .id(p.getId())
                .employeeId(p.getEmployee().getId())
                .employeeName(p.getEmployee().getFirstName() + " " + p.getEmployee().getLastName())
                .employeeCode(p.getEmployee().getEmployeeCode())
                .departmentName(p.getEmployee().getDepartment() != null ? p.getEmployee().getDepartment().getName() : "General")
                .designation(p.getEmployee().getDesignation())
                .payPeriodMonth(p.getPayPeriodMonth())
                .payPeriodYear(p.getPayPeriodYear())
                .basicSalary(p.getBasicSalary())
                .allowances(p.getAllowances())
                .deductions(p.getDeductions())
                .netSalary(p.getNetSalary())
                .paymentStatus(p.getPaymentStatus())
                .paymentDate(p.getPaymentDate())
                .build();
    }
}

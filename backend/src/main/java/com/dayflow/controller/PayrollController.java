package com.dayflow.controller;

import com.dayflow.dto.PayrollDto;
import com.dayflow.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @GetMapping("/me")
    public ResponseEntity<List<PayrollDto>> getMyPayroll(@RequestParam Long employeeId) {
        return ResponseEntity.ok(payrollService.getEmployeePayrolls(employeeId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PayrollDto>> getAllPayroll() {
        return ResponseEntity.ok(payrollService.getAllPayrolls());
    }

    @PutMapping("/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PayrollDto> updateSalaryStructure(
            @PathVariable Long employeeId,
            @RequestParam(required = false) BigDecimal basic,
            @RequestParam(required = false) BigDecimal allowances,
            @RequestParam(required = false) BigDecimal deductions) {
        return ResponseEntity.ok(payrollService.updateEmployeeSalaryStructure(employeeId, basic, allowances, deductions));
    }
}

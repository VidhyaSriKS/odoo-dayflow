package com.dayflow.controller;

import com.dayflow.dto.LeaveActionDto;
import com.dayflow.dto.LeaveRequestDto;
import com.dayflow.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @PostMapping
    public ResponseEntity<LeaveRequestDto> applyLeave(@RequestParam Long employeeId, @RequestBody LeaveRequestDto dto) {
        return ResponseEntity.ok(leaveService.applyLeave(employeeId, dto));
    }

    @GetMapping("/me")
    public ResponseEntity<List<LeaveRequestDto>> getMyLeaves(@RequestParam Long employeeId) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaves(employeeId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequestDto>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveRequestDto> approveLeave(
            @PathVariable Long id,
            @RequestBody(required = false) LeaveActionDto actionDto,
            Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "admin@dayflow.com";
        String comment = actionDto != null ? actionDto.getComment() : "Approved by HR";
        return ResponseEntity.ok(leaveService.approveLeave(id, adminEmail, comment));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveRequestDto> rejectLeave(
            @PathVariable Long id,
            @RequestBody(required = false) LeaveActionDto actionDto,
            Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "admin@dayflow.com";
        String comment = actionDto != null ? actionDto.getComment() : "Rejected by HR";
        return ResponseEntity.ok(leaveService.rejectLeave(id, adminEmail, comment));
    }

    @GetMapping("/balance")
    public ResponseEntity<com.dayflow.dto.LeaveBalanceDto> getLeaveBalance(@RequestParam Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeaveBalance(employeeId));
    }
}

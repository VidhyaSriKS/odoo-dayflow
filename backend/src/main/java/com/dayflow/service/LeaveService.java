package com.dayflow.service;

import com.dayflow.dto.LeaveRequestDto;
import com.dayflow.entity.Attendance;
import com.dayflow.entity.Employee;
import com.dayflow.entity.LeaveBalance;
import com.dayflow.entity.LeaveRequest;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.LeaveBalanceRepository;
import com.dayflow.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditService auditService;

    @Transactional
    public LeaveRequestDto applyLeave(Long employeeId, LeaveRequestDto dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (dto.getStartDate() == null || dto.getEndDate() == null) {
            throw new BadRequestException("Start date and End date are required.");
        }

        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new BadRequestException("End date cannot be before Start date.");
        }

        int days = (int) ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;

        LeaveBalance balance = leaveBalanceRepository.findByEmployeeId(employeeId)
                .orElseGet(() -> leaveBalanceRepository.save(LeaveBalance.builder().employee(employee).build()));

        String type = dto.getLeaveType() != null ? dto.getLeaveType().toUpperCase() : "PAID";
        if ("PAID".equals(type) && balance.getPaidLeaveBalance() < days) {
            throw new BadRequestException("Insufficient Paid Leave balance. Requested: " + days + ", Available: " + balance.getPaidLeaveBalance());
        }
        if ("SICK".equals(type) && balance.getSickLeaveBalance() < days) {
            throw new BadRequestException("Insufficient Sick Leave balance. Requested: " + days + ", Available: " + balance.getSickLeaveBalance());
        }

        LeaveRequest request = LeaveRequest.builder()
                .employee(employee)
                .leaveType(type)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .totalDays(days)
                .reason(dto.getReason())
                .status("PENDING")
                .build();

        request = leaveRequestRepository.save(request);

        auditService.logAction("LEAVE_APPLY", employee.getEmail(), "Submitted " + type + " leave request for " + days + " days.");

        return mapToDto(request);
    }

    @Transactional
    public LeaveRequestDto approveLeave(Long leaveId, String adminEmail, String comment) {
        LeaveRequest request = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + leaveId));

        if (!"PENDING".equals(request.getStatus())) {
            throw new BadRequestException("Leave request has already been processed.");
        }

        request.setStatus("APPROVED");
        request.setApprovedBy(adminEmail);
        request.setHrComment(comment);
        request = leaveRequestRepository.save(request);

        // Update leave balance
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeId(request.getEmployee().getId()).orElse(null);
        if (balance != null) {
            if ("PAID".equalsIgnoreCase(request.getLeaveType())) {
                balance.setPaidLeaveBalance(Math.max(0, balance.getPaidLeaveBalance() - request.getTotalDays()));
            } else if ("SICK".equalsIgnoreCase(request.getLeaveType())) {
                balance.setSickLeaveBalance(Math.max(0, balance.getSickLeaveBalance() - request.getTotalDays()));
            } else if ("CASUAL".equalsIgnoreCase(request.getLeaveType())) {
                balance.setCasualLeaveBalance(Math.max(0, balance.getCasualLeaveBalance() - request.getTotalDays()));
            }
            leaveBalanceRepository.save(balance);
        }

        // Update attendance records for leave dates
        final LeaveRequest finalRequest = request;
        LocalDate current = finalRequest.getStartDate();
        while (!current.isAfter(finalRequest.getEndDate())) {
            final LocalDate dateToProcess = current;
            Attendance att = attendanceRepository.findByEmployeeIdAndDate(finalRequest.getEmployee().getId(), dateToProcess)
                    .orElseGet(() -> Attendance.builder()
                            .employee(finalRequest.getEmployee())
                            .date(dateToProcess)
                            .build());
            att.setStatus("LEAVE");
            att.setNotes("Approved " + request.getLeaveType() + " Leave");
            attendanceRepository.save(att);
            current = current.plusDays(1);
        }

        // Send Notification
        if (request.getEmployee().getUser() != null) {
            notificationService.createNotification(
                request.getEmployee().getUser().getId(),
                "Leave Request Approved",
                "Your " + request.getLeaveType() + " leave request from " + request.getStartDate() + " to " + request.getEndDate() + " has been approved.",
                "SUCCESS"
            );
        }

        auditService.logAction("LEAVE_APPROVE", adminEmail, "Approved leave request ID: " + leaveId);

        return mapToDto(request);
    }

    @Transactional
    public LeaveRequestDto rejectLeave(Long leaveId, String adminEmail, String comment) {
        LeaveRequest request = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + leaveId));

        if (!"PENDING".equals(request.getStatus())) {
            throw new BadRequestException("Leave request has already been processed.");
        }

        request.setStatus("REJECTED");
        request.setApprovedBy(adminEmail);
        request.setHrComment(comment);
        request = leaveRequestRepository.save(request);

        // Send Notification
        if (request.getEmployee().getUser() != null) {
            notificationService.createNotification(
                request.getEmployee().getUser().getId(),
                "Leave Request Rejected",
                "Your leave request from " + request.getStartDate() + " to " + request.getEndDate() + " was rejected. Reason: " + (comment != null ? comment : "HR policy constraint"),
                "WARNING"
            );
        }

        auditService.logAction("LEAVE_REJECT", adminEmail, "Rejected leave request ID: " + leaveId);

        return mapToDto(request);
    }

    public List<LeaveRequestDto> getEmployeeLeaves(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<LeaveRequestDto> getAllLeaves() {
        return leaveRequestRepository.findAll()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public LeaveRequestDto mapToDto(LeaveRequest req) {
        return LeaveRequestDto.builder()
                .id(req.getId())
                .employeeId(req.getEmployee().getId())
                .employeeName(req.getEmployee().getFirstName() + " " + req.getEmployee().getLastName())
                .employeeCode(req.getEmployee().getEmployeeCode())
                .departmentName(req.getEmployee().getDepartment() != null ? req.getEmployee().getDepartment().getName() : "General")
                .leaveType(req.getLeaveType())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .totalDays(req.getTotalDays())
                .reason(req.getReason())
                .status(req.getStatus())
                .hrComment(req.getHrComment())
                .approvedBy(req.getApprovedBy())
                .createdAt(req.getCreatedAt())
                .build();
    }

    public com.dayflow.dto.LeaveBalanceDto getLeaveBalance(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeId(employeeId)
                .orElseGet(() -> leaveBalanceRepository.save(LeaveBalance.builder()
                        .employee(employee)
                        .paidLeaveBalance(15)
                        .sickLeaveBalance(10)
                        .casualLeaveBalance(10)
                        .year(2026)
                        .build()));
        return com.dayflow.dto.LeaveBalanceDto.builder()
                .paidLeaveBalance(balance.getPaidLeaveBalance())
                .sickLeaveBalance(balance.getSickLeaveBalance())
                .casualLeaveBalance(balance.getCasualLeaveBalance())
                .year(balance.getYear())
                .build();
    }
}

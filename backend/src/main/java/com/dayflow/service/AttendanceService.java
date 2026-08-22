package com.dayflow.service;

import com.dayflow.dto.AttendanceDto;
import com.dayflow.entity.Attendance;
import com.dayflow.entity.Employee;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditService auditService;

    @Transactional
    public AttendanceDto checkIn(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);

        if (existing.isPresent() && existing.get().getCheckInTime() != null) {
            throw new BadRequestException("Already checked in for today at " + existing.get().getCheckInTime().toLocalTime());
        }

        Attendance attendance = existing.orElseGet(() -> Attendance.builder()
                .employee(employee)
                .date(today)
                .build());

        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus("PRESENT");
        attendance = attendanceRepository.save(attendance);

        if (employee.getUser() != null) {
            notificationService.createNotification(
                employee.getUser().getId(),
                "Check-In Confirmed",
                "You successfully checked in at " + attendance.getCheckInTime().toLocalTime().toString().substring(0, 5),
                "SUCCESS"
            );
        }

        auditService.logAction("ATTENDANCE_CHECKIN", employee.getEmail(), "Checked in for date " + today);

        return mapToDto(attendance);
    }

    @Transactional
    public AttendanceDto checkOut(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new BadRequestException("No check-in record found for today. Please check in first."));

        if (attendance.getCheckInTime() == null) {
            throw new BadRequestException("Check-in time missing.");
        }

        LocalDateTime checkOut = LocalDateTime.now();
        attendance.setCheckOutTime(checkOut);

        Duration duration = Duration.between(attendance.getCheckInTime(), checkOut);
        double hours = duration.toMinutes() / 60.0;
        attendance.setWorkingHours(BigDecimal.valueOf(hours).setScale(2, RoundingMode.HALF_UP));

        attendance = attendanceRepository.save(attendance);

        if (employee.getUser() != null) {
            notificationService.createNotification(
                employee.getUser().getId(),
                "Check-Out Confirmed",
                "Check-out logged at " + checkOut.toLocalTime().toString().substring(0, 5) + ". Total hours: " + attendance.getWorkingHours() + "h.",
                "INFO"
            );
        }

        auditService.logAction("ATTENDANCE_CHECKOUT", employee.getEmail(), "Checked out. Hours worked: " + attendance.getWorkingHours());

        return mapToDto(attendance);
    }

    public List<AttendanceDto> getEmployeeAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<AttendanceDto> getAllAttendance(LocalDate date) {
        LocalDate queryDate = date != null ? date : LocalDate.now();
        return attendanceRepository.findByDate(queryDate)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public AttendanceDto mapToDto(Attendance att) {
        return AttendanceDto.builder()
                .id(att.getId())
                .employeeId(att.getEmployee().getId())
                .employeeName(att.getEmployee().getFirstName() + " " + att.getEmployee().getLastName())
                .employeeCode(att.getEmployee().getEmployeeCode())
                .departmentName(att.getEmployee().getDepartment() != null ? att.getEmployee().getDepartment().getName() : "General")
                .date(att.getDate())
                .checkInTime(att.getCheckInTime())
                .checkOutTime(att.getCheckOutTime())
                .workingHours(att.getWorkingHours())
                .status(att.getStatus())
                .notes(att.getNotes())
                .build();
    }
}

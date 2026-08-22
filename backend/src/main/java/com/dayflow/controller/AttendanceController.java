package com.dayflow.controller;

import com.dayflow.dto.AttendanceDto;
import com.dayflow.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<AttendanceDto> checkIn(@RequestParam Long employeeId) {
        return ResponseEntity.ok(attendanceService.checkIn(employeeId));
    }

    @PostMapping("/check-out")
    public ResponseEntity<AttendanceDto> checkOut(@RequestParam Long employeeId) {
        return ResponseEntity.ok(attendanceService.checkOut(employeeId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<AttendanceDto>> getMyAttendance(@RequestParam Long employeeId) {
        return ResponseEntity.ok(attendanceService.getEmployeeAttendance(employeeId));
    }

    @GetMapping
    public ResponseEntity<List<AttendanceDto>> getAllAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAllAttendance(date));
    }
}

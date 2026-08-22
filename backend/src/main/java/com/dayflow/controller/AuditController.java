package com.dayflow.controller;

import com.dayflow.entity.AuditLog;
import com.dayflow.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getLogs() {
        return ResponseEntity.ok(auditService.getAllLogs());
    }
}

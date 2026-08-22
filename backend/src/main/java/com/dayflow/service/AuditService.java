package com.dayflow.service;

import com.dayflow.entity.AuditLog;
import com.dayflow.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Transactional
    public void logAction(String action, String performedBy, String details) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .performedBy(performedBy)
                .details(details)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}

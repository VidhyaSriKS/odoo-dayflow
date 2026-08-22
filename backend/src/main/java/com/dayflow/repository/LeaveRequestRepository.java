package com.dayflow.repository;

import com.dayflow.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeId(Long employeeId);
    List<LeaveRequest> findByStatus(String status);
    
    @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.status = 'PENDING'")
    long countPendingRequests();
}

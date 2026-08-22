package com.dayflow.repository;

import com.dayflow.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
    List<Attendance> findByEmployeeId(Long employeeId);
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = 'PRESENT'")
    long countPresentByDate(LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = 'ABSENT'")
    long countAbsentByDate(LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = 'LEAVE'")
    long countOnLeaveByDate(LocalDate date);
}

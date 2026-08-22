package com.dayflow.repository;

import com.dayflow.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByUserId(Long userId);
    List<Employee> findByDepartmentId(Long departmentId);
    int countByEmployeeCodeStartingWith(String prefix);
    
    @Query("SELECT e FROM Employee e WHERE LOWER(e.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.designation) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Employee> searchEmployees(String query);
}

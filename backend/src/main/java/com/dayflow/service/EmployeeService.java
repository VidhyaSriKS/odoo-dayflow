package com.dayflow.service;

import com.dayflow.dto.EmployeeDto;
import com.dayflow.entity.Department;
import com.dayflow.entity.Employee;
import com.dayflow.entity.LeaveBalance;
import com.dayflow.entity.User;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.DepartmentRepository;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.LeaveBalanceRepository;
import com.dayflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditService auditService;

    public List<EmployeeDto> getAllEmployees(String query, Long departmentId) {
        List<Employee> list;
        if (query != null && !query.trim().isEmpty()) {
            list = employeeRepository.searchEmployees(query.trim());
        } else if (departmentId != null) {
            list = employeeRepository.findByDepartmentId(departmentId);
        } else {
            list = employeeRepository.findAll();
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapToDto(employee);
    }

    public EmployeeDto getEmployeeByUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee record not found for user: " + userId));
        return mapToDto(employee);
    }

    @Transactional
    public EmployeeDto createEmployee(EmployeeDto dto) {
        User user = User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode("Default@123"))
                .fullName(dto.getFirstName() + " " + dto.getLastName())
                .role("ROLE_EMPLOYEE")
                .active(true)
                .build();
        user = userRepository.save(user);

        Department dept = null;
        if (dto.getDepartmentId() != null) {
            dept = departmentRepository.findById(dto.getDepartmentId()).orElse(null);
        }

        Employee employee = Employee.builder()
                .employeeCode(dto.getEmployeeCode())
                .user(user)
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .department(dept)
                .designation(dto.getDesignation())
                .joiningDate(dto.getJoiningDate() != null ? dto.getJoiningDate() : java.time.LocalDate.now())
                .employmentStatus(dto.getEmploymentStatus() != null ? dto.getEmploymentStatus() : "ACTIVE")
                .basicSalary(dto.getBasicSalary())
                .allowances(dto.getAllowances())
                .deductions(dto.getDeductions())
                .build();

        employee = employeeRepository.save(employee);

        LeaveBalance leaveBalance = LeaveBalance.builder()
                .employee(employee)
                .paidLeaveBalance(15)
                .sickLeaveBalance(10)
                .casualLeaveBalance(10)
                .year(2026)
                .build();
        leaveBalanceRepository.save(leaveBalance);

        auditService.logAction("EMPLOYEE_CREATE", "ADMIN", "Created employee: " + employee.getEmployeeCode());

        return mapToDto(employee);
    }

    @Transactional
    public EmployeeDto updateEmployee(Long id, EmployeeDto dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        if (dto.getFirstName() != null) employee.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) employee.setLastName(dto.getLastName());
        if (dto.getPhone() != null) employee.setPhone(dto.getPhone());
        if (dto.getAddress() != null) employee.setAddress(dto.getAddress());
        if (dto.getDesignation() != null) employee.setDesignation(dto.getDesignation());
        if (dto.getEmploymentStatus() != null) employee.setEmploymentStatus(dto.getEmploymentStatus());
        if (dto.getBasicSalary() != null) employee.setBasicSalary(dto.getBasicSalary());
        if (dto.getAllowances() != null) employee.setAllowances(dto.getAllowances());
        if (dto.getDeductions() != null) employee.setDeductions(dto.getDeductions());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId()).orElse(null);
            employee.setDepartment(dept);
        }

        employee = employeeRepository.save(employee);
        auditService.logAction("EMPLOYEE_UPDATE", "ADMIN", "Updated employee: " + employee.getEmployeeCode());

        return mapToDto(employee);
    }

    @Transactional
    public void deactivateEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employee.setEmploymentStatus("TERMINATED");
        if (employee.getUser() != null) {
            employee.getUser().setActive(false);
            userRepository.save(employee.getUser());
        }
        employeeRepository.save(employee);
        auditService.logAction("EMPLOYEE_DEACTIVATE", "ADMIN", "Deactivated employee: " + employee.getEmployeeCode());
    }

    public EmployeeDto mapToDto(Employee emp) {
        return EmployeeDto.builder()
                .id(emp.getId())
                .employeeCode(emp.getEmployeeCode())
                .userId(emp.getUser() != null ? emp.getUser().getId() : null)
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .fullName(emp.getFirstName() + " " + emp.getLastName())
                .email(emp.getEmail())
                .phone(emp.getPhone())
                .address(emp.getAddress())
                .departmentId(emp.getDepartment() != null ? emp.getDepartment().getId() : null)
                .departmentName(emp.getDepartment() != null ? emp.getDepartment().getName() : "Unassigned")
                .designation(emp.getDesignation())
                .joiningDate(emp.getJoiningDate())
                .employmentStatus(emp.getEmploymentStatus())
                .profilePhotoUrl(emp.getProfilePhotoUrl())
                .basicSalary(emp.getBasicSalary())
                .allowances(emp.getAllowances())
                .deductions(emp.getDeductions())
                .netSalary(emp.getNetSalary())
                .build();
    }
}

package com.dayflow.service;

import com.dayflow.dto.AuthRequest;
import com.dayflow.dto.AuthResponse;
import com.dayflow.dto.RegisterRequest;
import com.dayflow.entity.Department;
import com.dayflow.entity.Employee;
import com.dayflow.entity.LeaveBalance;
import com.dayflow.entity.User;
import com.dayflow.exception.BadRequestException;
import com.dayflow.repository.DepartmentRepository;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.LeaveBalanceRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuditService auditService;

    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        Employee employee = employeeRepository.findByUserId(user.getId()).orElse(null);

        auditService.logAction("USER_LOGIN", user.getEmail(), "User logged in successfully");

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .employeeId(employee != null ? employee.getId() : null)
                .employeeCode(employee != null ? employee.getEmployeeCode() : null)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use.");
        }

        String role = (request.getRole() != null && request.getRole().startsWith("ROLE_")) 
                ? request.getRole() : "ROLE_" + (request.getRole() != null ? request.getRole().toUpperCase() : "EMPLOYEE");

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(role)
                .active(true)
                .build();

        user = userRepository.save(user);

        Department dept = departmentRepository.findByName(request.getDepartment() != null ? request.getDepartment() : "Engineering")
                .orElse(departmentRepository.findAll().stream().findFirst().orElse(null));

        String[] names = request.getFullName().split(" ", 2);
        String firstName = names[0];
        String lastName = names.length > 1 ? names[1] : "";

        Employee employee = Employee.builder()
                .employeeCode(request.getEmployeeCode())
                .user(user)
                .firstName(firstName)
                .lastName(lastName)
                .email(user.getEmail())
                .department(dept)
                .designation(request.getDesignation() != null ? request.getDesignation() : "Associate")
                .joiningDate(LocalDate.now())
                .employmentStatus("ACTIVE")
                .basicSalary(new BigDecimal("75000.00"))
                .allowances(new BigDecimal("5000.00"))
                .deductions(new BigDecimal("2000.00"))
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

        auditService.logAction("USER_REGISTER", user.getEmail(), "New employee registered: " + employee.getEmployeeCode());

        String jwt = jwtUtils.generateTokenFromEmail(user.getEmail());

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .employeeId(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .build();
    }
}

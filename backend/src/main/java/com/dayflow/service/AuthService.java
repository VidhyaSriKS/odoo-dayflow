package com.dayflow.service;

import com.dayflow.dto.AuthRequest;
import com.dayflow.dto.AuthResponse;
import com.dayflow.dto.RegisterRequest;
import com.dayflow.entity.Company;
import com.dayflow.entity.Department;
import com.dayflow.entity.Employee;
import com.dayflow.entity.LeaveBalance;
import com.dayflow.entity.User;
import com.dayflow.exception.BadRequestException;
import com.dayflow.repository.CompanyRepository;
import com.dayflow.repository.DepartmentRepository;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.LeaveBalanceRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.JwtUtils;
import com.dayflow.util.EmployeeCodeUtils;
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
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuditService auditService;
    
    @Autowired
    private EmployeeCodeUtils employeeCodeUtils;

    public AuthResponse authenticate(AuthRequest request) {
        String loginIdOrEmail = request.getLoginIdOrEmail();
        String targetEmail = loginIdOrEmail;
        
        if (loginIdOrEmail != null && !loginIdOrEmail.contains("@")) {
            Employee employee = employeeRepository.findByEmployeeCode(loginIdOrEmail)
                    .orElseThrow(() -> new BadRequestException("Invalid Login ID or Email credentials"));
            if (employee.getUser() != null) {
                targetEmail = employee.getUser().getEmail();
            }
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(targetEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(targetEmail)
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

        // For this hackathon scope, public registration acts as an Admin creating the Company.
        Company company;
        if (companyRepository.count() > 0) {
            company = companyRepository.findAll().get(0);
            if (request.getCompanyName() != null) {
                company.setName(request.getCompanyName());
                if (request.getCompanyLogo() != null) {
                    company.setLogoUrl(request.getCompanyLogo());
                }
                company = companyRepository.save(company);
            }
        } else {
            company = Company.builder()
                .name(request.getCompanyName() != null ? request.getCompanyName() : "Default Company")
                .logoUrl(request.getCompanyLogo())
                .build();
            company = companyRepository.save(company);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role("ROLE_ADMIN")
                .active(true)
                .build();

        user = userRepository.save(user);

        Department dept = departmentRepository.findByName(request.getDepartment() != null ? request.getDepartment() : "Engineering")
                .orElse(departmentRepository.findAll().stream().findFirst().orElse(null));

        String[] names = request.getFullName().split(" ", 2);
        String firstName = names[0];
        String lastName = names.length > 1 ? names[1] : "";
        
        String generatedCode = employeeCodeUtils.generateLoginId(company.getName(), firstName, lastName, LocalDate.now().getYear());

        Employee employee = Employee.builder()
                .employeeCode(generatedCode)
                .user(user)
                .firstName(firstName)
                .lastName(lastName)
                .email(user.getEmail())
                .phone(request.getPhone())
                .department(dept)
                .designation(request.getDesignation() != null ? request.getDesignation() : "Admin")
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
                .year(LocalDate.now().getYear())
                .build();
        leaveBalanceRepository.save(leaveBalance);

        auditService.logAction("USER_REGISTER", user.getEmail(), "New admin registered: " + employee.getEmployeeCode());

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

    @Transactional
    public void changePassword(String currentEmail, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Incorrect old password");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}

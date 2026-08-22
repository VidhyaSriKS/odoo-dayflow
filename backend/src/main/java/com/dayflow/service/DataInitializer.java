package com.dayflow.service;

import com.dayflow.entity.*;
import com.dayflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (departmentRepository.count() > 0) {
            System.out.println(">>> Dayflow Database already populated. Skipping DataInitializer.");
            return;
        }

        System.out.println(">>> Initializing Dayflow Rich Demo Seed Data...");

        // 1. Create Departments
        List<Department> departments = Arrays.asList(
            Department.builder().name("Engineering").description("Software, DevOps, Cloud").managerName("Sarah Connor").location("Building A, Floor 3").build(),
            Department.builder().name("Human Resources").description("Talent Acquisition, Payroll, Wellness").managerName("Admin HR").location("Building B, Floor 1").build(),
            Department.builder().name("Finance").description("Accounting, Financial Audit, Risk").managerName("Michael Scott").location("Building A, Floor 2").build(),
            Department.builder().name("Marketing").description("Brand Strategy, Content, Growth").managerName("Elena Rostova").location("Building C, Floor 4").build(),
            Department.builder().name("Operations").description("Logistics, Business Ops, Facilities").managerName("Marcus Vance").location("Building B, Floor 2").build()
        );
        departments = departmentRepository.saveAll(departments);
        Map<String, Department> deptMap = new HashMap<>();
        departments.forEach(d -> deptMap.put(d.getName(), d));

        // 2. Create Users
        String encodedPassword = passwordEncoder.encode("Admin@123");
        String empPassword = passwordEncoder.encode("Employee@123");

        User adminUser = userRepository.save(User.builder()
                .email("admin@dayflow.com")
                .password(encodedPassword)
                .fullName("Admin HR")
                .role("ROLE_ADMIN")
                .active(true)
                .build());

        User employeeUser = userRepository.save(User.builder()
                .email("employee@dayflow.com")
                .password(empPassword)
                .fullName("Alex Taylor")
                .role("ROLE_EMPLOYEE")
                .active(true)
                .build());

        // 3. Create Employees
        Employee adminEmp = employeeRepository.save(Employee.builder()
                .employeeCode("EMP1001")
                .user(adminUser)
                .firstName("Admin")
                .lastName("HR")
                .email("admin@dayflow.com")
                .phone("+1 (555) 019-2831")
                .address("100 HR Way, Silicon Valley, CA")
                .department(deptMap.get("Human Resources"))
                .designation("HR Director")
                .joiningDate(LocalDate.of(2023, 1, 15))
                .employmentStatus("ACTIVE")
                .basicSalary(new BigDecimal("95000.00"))
                .allowances(new BigDecimal("12000.00"))
                .deductions(new BigDecimal("5000.00"))
                .build());

        Employee alexEmp = employeeRepository.save(Employee.builder()
                .employeeCode("EMP1002")
                .user(employeeUser)
                .firstName("Alex")
                .lastName("Taylor")
                .email("employee@dayflow.com")
                .phone("+1 (555) 014-9281")
                .address("404 Innovation Drive, Austin, TX")
                .department(deptMap.get("Engineering"))
                .designation("Senior Software Engineer")
                .joiningDate(LocalDate.of(2023, 6, 1))
                .employmentStatus("ACTIVE")
                .basicSalary(new BigDecimal("85000.00"))
                .allowances(new BigDecimal("8000.00"))
                .deductions(new BigDecimal("3500.00"))
                .build());

        // Create 13 additional employees to total 15
        String[][] additionalData = {
            {"EMP1003", "Sarah", "Connor", "sarah.connor@dayflow.com", "Engineering", "Engineering Manager", "110000", "15000", "6000"},
            {"EMP1004", "Michael", "Scott", "michael.scott@dayflow.com", "Finance", "Financial Analyst", "65000", "6000", "2500"},
            {"EMP1005", "Elena", "Rostova", "elena.rostova@dayflow.com", "Marketing", "Head of Marketing", "90000", "10000", "4000"},
            {"EMP1006", "Marcus", "Vance", "marcus.vance@dayflow.com", "Operations", "Operations Director", "88000", "9000", "3800"},
            {"EMP1007", "David", "Kim", "david.kim@dayflow.com", "Engineering", "DevOps Engineer", "82000", "7500", "3200"},
            {"EMP1008", "Sophia", "Bennett", "sophia.bennett@dayflow.com", "Engineering", "Frontend Specialist", "78000", "7000", "3000"},
            {"EMP1009", "James", "Wilson", "james.wilson@dayflow.com", "Finance", "Senior Accountant", "72000", "6500", "2800"},
            {"EMP1010", "Olivia", "Martinez", "olivia.martinez@dayflow.com", "Marketing", "Content Strategist", "62000", "5500", "2200"},
            {"EMP1011", "Lucas", "Gray", "lucas.gray@dayflow.com", "Human Resources", "Recruitment Specialist", "60000", "5000", "2000"},
            {"EMP1012", "Chloe", "Adams", "chloe.adams@dayflow.com", "Operations", "Supply Chain Lead", "74000", "6800", "2900"},
            {"EMP1013", "Ethan", "Hunt", "ethan.hunt@dayflow.com", "Engineering", "Security Engineer", "95000", "11000", "4500"},
            {"EMP1014", "Mia", "Thorne", "mia.thorne@dayflow.com", "Marketing", "Growth Designer", "68000", "6000", "2400"},
            {"EMP1015", "Noah", "Silver", "noah.silver@dayflow.com", "Finance", "Auditor", "70000", "6200", "2600"}
        };

        List<Employee> allEmployees = new ArrayList<>(Arrays.asList(adminEmp, alexEmp));

        for (String[] row : additionalData) {
            User u = userRepository.save(User.builder()
                    .email(row[3])
                    .password(empPassword)
                    .fullName(row[1] + " " + row[2])
                    .role("ROLE_EMPLOYEE")
                    .active(true)
                    .build());

            Employee e = employeeRepository.save(Employee.builder()
                    .employeeCode(row[0])
                    .user(u)
                    .firstName(row[1])
                    .lastName(row[2])
                    .email(row[3])
                    .phone("+1 (555) 01" + (10 + new Random().nextInt(80)) + "-" + (1000 + new Random().nextInt(8999)))
                    .department(deptMap.get(row[4]))
                    .designation(row[5])
                    .joiningDate(LocalDate.of(2023, 1 + new Random().nextInt(11), 1 + new Random().nextInt(25)))
                    .employmentStatus("ACTIVE")
                    .basicSalary(new BigDecimal(row[6]))
                    .allowances(new BigDecimal(row[7]))
                    .deductions(new BigDecimal(row[8]))
                    .build());

            allEmployees.add(e);
        }

        // 4. Create Leave Balances
        for (Employee emp : allEmployees) {
            leaveBalanceRepository.save(LeaveBalance.builder()
                    .employee(emp)
                    .paidLeaveBalance(12 + new Random().nextInt(6))
                    .sickLeaveBalance(8 + new Random().nextInt(4))
                    .casualLeaveBalance(7 + new Random().nextInt(4))
                    .year(2026)
                    .build());
        }

        // 5. Create Attendance Records for last 10 days
        LocalDate today = LocalDate.now();
        for (Employee emp : allEmployees) {
            for (int i = 0; i < 10; i++) {
                LocalDate date = today.minusDays(i);
                if (date.getDayOfWeek().getValue() >= 6) continue; // Skip weekends

                String status = "PRESENT";
                LocalDateTime checkIn = date.atTime(8, new Random().nextInt(15));
                LocalDateTime checkOut = date.atTime(17, 30 + new Random().nextInt(29));
                BigDecimal hours = new BigDecimal("8.50");

                if (i == 3 && emp.getEmployeeCode().equals("EMP1004")) {
                    status = "ABSENT";
                    checkIn = null;
                    checkOut = null;
                    hours = BigDecimal.ZERO;
                } else if (i == 5 && emp.getEmployeeCode().equals("EMP1005")) {
                    status = "LEAVE";
                    checkIn = null;
                    checkOut = null;
                    hours = BigDecimal.ZERO;
                }

                attendanceRepository.save(Attendance.builder()
                        .employee(emp)
                        .date(date)
                        .checkInTime(checkIn)
                        .checkOutTime(checkOut)
                        .workingHours(hours)
                        .status(status)
                        .build());
            }
        }

        // 6. Create Leave Requests
        leaveRequestRepository.save(LeaveRequest.builder()
                .employee(alexEmp)
                .leaveType("SICK")
                .startDate(today.plusDays(1))
                .endDate(today.plusDays(2))
                .totalDays(2)
                .reason("Fever and severe cough. Doctor advised 2 days rest.")
                .status("PENDING")
                .build());

        leaveRequestRepository.save(LeaveRequest.builder()
                .employee(allEmployees.get(2))
                .leaveType("PAID")
                .startDate(today.minusDays(5))
                .endDate(today.minusDays(4))
                .totalDays(2)
                .reason("Family annual vacation.")
                .status("APPROVED")
                .hrComment("Approved by HR Director")
                .approvedBy("admin@dayflow.com")
                .build());

        // 7. Create Payroll Entries
        for (Employee emp : allEmployees) {
            payrollRepository.save(Payroll.builder()
                    .employee(emp)
                    .payPeriodMonth(today.getMonthValue())
                    .payPeriodYear(today.getYear())
                    .basicSalary(emp.getBasicSalary())
                    .allowances(emp.getAllowances())
                    .deductions(emp.getDeductions())
                    .netSalary(emp.getNetSalary())
                    .paymentStatus("PAID")
                    .paymentDate(today.minusDays(5))
                    .build());
        }

        // 8. Create Notifications
        notificationRepository.save(Notification.builder()
                .user(employeeUser)
                .title("Welcome to Dayflow HRMS")
                .message("Your employee profile EMP1002 has been activated.")
                .type("SUCCESS")
                .read(true)
                .build());

        notificationRepository.save(Notification.builder()
                .user(employeeUser)
                .title("August Salary Credit")
                .message("Your net salary of $" + alexEmp.getNetSalary() + " has been processed.")
                .type("INFO")
                .read(false)
                .build());

        // 9. Audit Log
        auditLogRepository.save(AuditLog.builder()
                .action("SYSTEM_INIT")
                .performedBy("SYSTEM")
                .details("Dayflow HRMS database seeded with 15 employees, 5 departments, attendance history, and payroll records.")
                .timestamp(LocalDateTime.now())
                .build());

        System.out.println(">>> Dayflow Rich Demo Seed Data initialized successfully!");
    }
}

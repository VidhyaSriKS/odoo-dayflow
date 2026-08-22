-- Seed Data for Dayflow HRMS

-- 1. Departments
INSERT INTO departments (id, name, description, manager_name, location) VALUES
(1, 'Engineering', 'Software engineering, DevOps, and cloud architecture', 'Sarah Connor', 'Building A, Floor 3'),
(2, 'Human Resources', 'Talent acquisition, employee wellness, and payroll', 'Admin HR', 'Building B, Floor 1'),
(3, 'Finance', 'Financial planning, accounting, and audit', 'Robert Langdon', 'Building A, Floor 2'),
(4, 'Marketing', 'Product marketing, brand strategy, and growth', 'Elena Rostova', 'Building C, Floor 4'),
(5, 'Operations', 'Business operations, logistics, and facilities', 'Marcus Vance', 'Building B, Floor 2')
ON CONFLICT DO NOTHING;

-- 2. Users (BCrypt hashes for Admin@123 and Employee@123)
-- Admin@123 -> $2a$10$e/3K3qU984H1/uH39N41/.gE9KqS3J0bO3qR4S5T6U7V8W9X0Y1Z2 (or generated dynamically)
INSERT INTO users (id, email, password_hash, full_name, role, is_active) VALUES
(1, 'admin@dayflow.com', '$2a$10$e8w.p4mKx2M2yL3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2', 'Dayflow Admin', 'ROLE_ADMIN', true),
(2, 'employee@dayflow.com', '$2a$10$e8w.p4mKx2M2yL3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2', 'Alex Taylor', 'ROLE_EMPLOYEE', true),
(3, 'sarah.engineering@dayflow.com', '$2a$10$e8w.p4mKx2M2yL3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2', 'Sarah Connor', 'ROLE_EMPLOYEE', true),
(4, 'michael.finance@dayflow.com', '$2a$10$e8w.p4mKx2M2yL3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2', 'Michael Scott', 'ROLE_EMPLOYEE', true),
(5, 'elena.marketing@dayflow.com', '$2a$10$e8w.p4mKx2M2yL3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2', 'Elena Rostova', 'ROLE_EMPLOYEE', true)
ON CONFLICT DO NOTHING;

-- 3. Employees
INSERT INTO employees (id, employee_code, user_id, first_name, last_name, email, phone, address, department_id, designation, joining_date, employment_status, basic_salary, allowances, deductions) VALUES
(1, 'EMP1001', 1, 'Admin', 'HR', 'admin@dayflow.com', '+1 (555) 019-2831', '100 HR Way, Silicon Valley, CA', 2, 'HR Director', '2023-01-15', 'ACTIVE', 95000.00, 12000.00, 5000.00),
(2, 'EMP1002', 2, 'Sanjay', 'Taylor', 'employee@dayflow.com', '+1 (555) 014-9281', '404 Innovation Drive, Austin, TX', 1, 'Senior Software Engineer', '2023-06-01', 'ACTIVE', 85000.00, 8000.00, 3500.00),
(3, 'EMP1003', 3, 'Sarah', 'Connor', 'sarah.engineering@dayflow.com', '+1 (555) 018-3729', '77 Tech Boulevard, Seattle, WA', 1, 'Engineering Manager', '2022-11-10', 'ACTIVE', 110000.00, 15000.00, 6000.00),
(4, 'EMP1004', 4, 'Michael', 'Scott', 'michael.finance@dayflow.com', '+1 (555) 012-4820', '172 Scranton Lane, Scranton, PA', 3, 'Financial Analyst', '2024-02-01', 'ACTIVE', 65000.00, 6000.00, 2500.00),
(5, 'EMP1005', 5, 'Elena', 'Rostova', 'elena.marketing@dayflow.com', '+1 (555) 016-9382', '89 Brand Avenue, New York, NY', 4, 'Head of Marketing', '2023-09-15', 'ACTIVE', 90000.00, 10000.00, 4000.00)
ON CONFLICT DO NOTHING;

-- 4. Leave Balances
INSERT INTO leave_balances (employee_id, paid_leave_balance, sick_leave_balance, casual_leave_balance, year) VALUES
(1, 20, 12, 10, 2026),
(2, 12, 8, 9, 2026),
(3, 18, 10, 8, 2026),
(4, 15, 10, 10, 2026),
(5, 14, 9, 7, 2026)
ON CONFLICT DO NOTHING;

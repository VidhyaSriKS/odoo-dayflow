-- Dayflow HRMS Database Schema (PostgreSQL & SQL Standard)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_EMPLOYEE', -- ROLE_EMPLOYEE, ROLE_ADMIN
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    manager_name VARCHAR(100),
    location VARCHAR(100) DEFAULT 'Main Headquarters',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id BIGSERIAL PRIMARY KEY,
    employee_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. EMP1001
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    designation VARCHAR(50) NOT NULL,
    joining_date DATE NOT NULL,
    employment_status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, ON_LEAVE, TERMINATED
    profile_photo_url VARCHAR(255),
    basic_salary NUMERIC(12, 2) DEFAULT 50000.00,
    allowances NUMERIC(12, 2) DEFAULT 5000.00,
    deductions NUMERIC(12, 2) DEFAULT 2000.00,
    net_salary NUMERIC(12, 2) GENERATED ALWAYS AS (basic_salary + allowances - deductions) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    working_hours NUMERIC(4, 2) DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'ABSENT', -- PRESENT, ABSENT, HALF_DAY, LEAVE
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_emp_date UNIQUE (employee_id, date)
);

-- 5. Leave Balances Table
CREATE TABLE IF NOT EXISTS leave_balances (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT UNIQUE NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    paid_leave_balance INT NOT NULL DEFAULT 15,
    sick_leave_balance INT NOT NULL DEFAULT 10,
    casual_leave_balance INT NOT NULL DEFAULT 10,
    year INT NOT NULL DEFAULT 2026,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(20) NOT NULL, -- PAID, SICK, UNPAID, CASUAL
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    hr_comment TEXT,
    approved_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Payroll Table
CREATE TABLE IF NOT EXISTS payroll (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    pay_period_month INT NOT NULL,
    pay_period_year INT NOT NULL,
    basic_salary NUMERIC(12, 2) NOT NULL,
    allowances NUMERIC(12, 2) NOT NULL,
    deductions NUMERIC(12, 2) NOT NULL,
    net_salary NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PAID', -- PAID, PENDING, PROCESSING
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_emp_pay_period UNIQUE (employee_id, pay_period_month, pay_period_year)
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'INFO', -- INFO, SUCCESS, WARNING, ALERT
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    document_name VARCHAR(100) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

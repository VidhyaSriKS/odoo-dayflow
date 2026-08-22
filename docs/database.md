# Dayflow Database Schema & ERD Documentation

## Relational Model Overview

The database consists of 10 primary relational tables designed with clean normal forms and relational integrity constraints.

### 1. `users`
- Primary key: `id` (BIGSERIAL)
- Fields: `email` (UNIQUE), `password_hash`, `full_name`, `role`, `is_active`, `created_at`

### 2. `departments`
- Primary key: `id` (BIGSERIAL)
- Fields: `name` (UNIQUE), `description`, `manager_name`, `location`

### 3. `employees`
- Primary key: `id` (BIGSERIAL)
- Foreign keys: `user_id` -> `users(id)`, `department_id` -> `departments(id)`
- Fields: `employee_code` (UNIQUE), `first_name`, `last_name`, `email`, `phone`, `designation`, `joining_date`, `employment_status`, `basic_salary`, `allowances`, `deductions`

### 4. `attendance`
- Primary key: `id` (BIGSERIAL)
- Foreign key: `employee_id` -> `employees(id)`
- Fields: `date`, `check_in_time`, `check_out_time`, `working_hours`, `status` (`PRESENT`, `ABSENT`, `HALF_DAY`, `LEAVE`)
- Constraint: Unique `(employee_id, date)`

### 5. `leave_balances`
- Primary key: `id` (BIGSERIAL)
- Foreign key: `employee_id` -> `employees(id)` (UNIQUE)
- Fields: `paid_leave_balance`, `sick_leave_balance`, `casual_leave_balance`, `year`

### 6. `leave_requests`
- Primary key: `id` (BIGSERIAL)
- Foreign key: `employee_id` -> `employees(id)`
- Fields: `leave_type`, `start_date`, `end_date`, `total_days`, `reason`, `status` (`PENDING`, `APPROVED`, `REJECTED`), `hr_comment`

### 7. `payroll`
- Primary key: `id` (BIGSERIAL)
- Foreign key: `employee_id` -> `employees(id)`
- Fields: `pay_period_month`, `pay_period_year`, `basic_salary`, `allowances`, `deductions`, `net_salary`, `payment_status`

### 8. `notifications`
- Primary key: `id` (BIGSERIAL)
- Foreign key: `user_id` -> `users(id)`
- Fields: `title`, `message`, `type`, `is_read`, `created_at`

### 9. `audit_logs`
- Primary key: `id` (BIGSERIAL)
- Fields: `action`, `performed_by`, `details`, `timestamp`

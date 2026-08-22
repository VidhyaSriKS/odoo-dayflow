# DAYFLOW — Human Resource Management System

Tagline:
> **Every workday, perfectly aligned.**

![Dayflow Architecture](https://img.shields.io/badge/Architecture-Full%20Stack-blue)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-green)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TS-cyan)

---

## 1. Problem & Solution

### Problem
Modern organizations suffer from fragmented HR operations. Attendance punch clocks are isolated from leave applications, salary visibility is hidden from employees, and HR administrators lack real-time insights to prevent tardiness clusters or employee burnout.

### Solution
**DAYFLOW** centralizes all HR verticals into a single unified SaaS platform powered by real-time analytics:
* **Role-Based Access Control**: Strict segregation between Employee Hub and HR/Admin Management Hub.
* **Live Attendance System**: Instant check-in/check-out timestamp logging with automated working hours calculation.
* **Leave Approval Workflows**: One-click HR approvals automatically updating leave balances, attendance states, and audit logs.
* **Payroll & Payslip PDF Generator**: Full salary breakdown with printable and downloadable PDF payslips.

---

## 2. Technology Stack

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React icons, Recharts, React Router v6.
* **Backend**: Java 17+, Spring Boot 3.2, Spring Security, Spring Data JPA, Hibernate, JWT Authentication, BCrypt.
* **Database**: PostgreSQL (Production / Docker) & embedded H2 (Zero-dependency local setup).

---

## 3. Demo Credentials

The system comes pre-loaded with rich realistic seed data (15 employees across 5 departments: Engineering, HR, Finance, Marketing, Operations).

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **HR / ADMIN** | `admin@dayflow.com` | `Admin@123` | Full HR Organization Management, Employee CRUD, Leave Approvals, Payroll Editing, Analytics |
| **EMPLOYEE** | `employee@dayflow.com` | `Employee@123` | Personal Dashboard, Check-In/Out, Apply Leave, Salary View, PDF Slip Download |

---

## 4. Project Directory Structure

```text
dayflow/
├── README.md
├── docker-compose.yml
├── .gitignore
├── .env.example
│
├── frontend/             # React + TypeScript + Vite + Tailwind UI
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── components/   # Navbar, Sidebar, StatCard, Badge, Modal, SalarySlipModal
│       ├── context/      # AuthContext, ThemeContext, NotificationContext
│       ├── pages/        # Landing, Login, SignUp, EmployeeDash, HrDash, EmployeeList, Attendance, Leave, Payroll
│       └── api/          # REST API Client & Mock Fallbacks
│
├── backend/              # Java Spring Boot 3 REST API
│   ├── pom.xml
│   └── src/main/java/com/dayflow/
│       ├── config/       # Security & App Config
│       ├── controller/   # Auth, Employee, Attendance, Leave, Payroll, Analytics Controllers
│       ├── entity/       # User, Employee, Department, Attendance, LeaveRequest, LeaveBalance, Payroll, AuditLog
│       ├── repository/   # Spring Data JPA Repositories
│       ├── service/      # Core Business Logic & DataInitializer
│       └── security/     # JwtUtils, JwtFilter, CustomUserDetailsService
│
├── database/             # Relational SQL Scripts
│   ├── schema.sql
│   └── seed.sql
│
└── docs/                 # Hackathon Pitch, Demo Script, Architecture & API Documentation
```

---

## 5. Running the Application Locally

### Option A: Standard Local Execution (Recommended)

1. **Frontend (Vite + React)**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App will be live at `http://localhost:5173`.

2. **Backend (Spring Boot)**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   REST API will be live at `http://localhost:8080/api` with embedded H2 console at `/api/h2-console`.

### Option B: Docker Compose

```bash
docker compose up --build
```

---

## 6. Live Hackathon Presentation Demo Scenario (3-5 Mins)

1. **Step 1**: Open `http://localhost:5173`. Click **Launch Employee Demo** (`employee@dayflow.com` / `Employee@123`).
2. **Step 2**: Show Employee Dashboard metrics. Click **Check In**. Notice status updates to *Checked In* at live time.
3. **Step 3**: Navigate to **Apply & View Leaves**, submit a Sick Leave request.
4. **Step 4**: Logout and click **Launch HR Admin Demo** (`admin@dayflow.com` / `Admin@123`).
5. **Step 5**: View HR Dashboard pending request badge. Navigate to **Leave Approvals**, locate Alex Taylor's request, and click **Approve**.


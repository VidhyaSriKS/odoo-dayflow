# DAYFLOW — Human Resource Management System

Tagline:
> **Every workday, perfectly aligned.**

![Dayflow Architecture](https://img.shields.io/badge/Architecture-Full%20Stack-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TS-cyan)
![Prisma](https://img.shields.io/badge/ORM-Prisma-black)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)

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
* **Backend**: Node.js, Express, TypeScript, JWT Authentication, BCrypt.
* **Database**: MySQL.
* **ORM**: Prisma.

---

## 3. Demo Credentials

The system comes pre-loaded with rich realistic seed data (Employees across 5 departments: Engineering, HR, Finance, Marketing, Operations).

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **HR / ADMIN** | `admin@dayflow.com` | `Admin@123` | Full HR Organization Management, Employee CRUD, Leave Approvals, Payroll Editing, Analytics |
| **EMPLOYEE** | `employee@dayflow.com` | `Employee@123` | Personal Dashboard, Check-In/Out, Apply Leave, Salary View, PDF Slip Download |

---

## 4. Project Directory Structure

```text
dayflow/
├── README.md
├── .gitignore
│
├── frontend/             # React + TypeScript + Vite + Tailwind UI
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/   # Navbar, Sidebar, StatCard, Badge, Modal
│       ├── context/      # AuthContext, ThemeContext
│       ├── pages/        # Landing, Login, SignUp, EmployeeDash, HrDash
│       └── api/          # REST API Client
│
├── backend/              # Node.js + Express REST API
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/           # Database Schema & Seeding scripts
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── seed-leaves.ts
│   └── src/
│       ├── index.ts      # Server Entry Point
│       ├── db.ts         # Prisma Client Instance
│       └── routes/       # API endpoints (auth, employees, attendance, leaves, analytics)
```

---

## 5. Running the Application Locally on a New System

### Prerequisites
- **Node.js** (v18 or higher)
- **MySQL Server** (running locally on port 3306)
- **Git**

### Step 1: Database Setup
Ensure your local MySQL server is running. Create a blank database named `dayflow`:
```sql
CREATE DATABASE IF NOT EXISTS dayflow;
```

### Step 2: Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Create a `.env` file in the `backend/` directory with the following variables (adjust your MySQL password accordingly):
```env
PORT=5000
DATABASE_URL="mysql://root:root@localhost:3306/dayflow"
JWT_SECRET="super-secret-key-for-jwt"
```
Run the Prisma migrations to create tables, and seed the database with demo data:
```bash
npx prisma db push
npx prisma db seed
npx tsx prisma/seed-leaves.ts
```
Start the backend development server:
```bash
npm run dev
```
The REST API will be live at `http://localhost:5000`.

### Step 3: Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the frontend development server:
```bash
npm run dev
```
The React App will be live at `http://localhost:5173`.

---

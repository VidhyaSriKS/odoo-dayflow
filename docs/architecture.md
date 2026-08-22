# Dayflow Architecture Documentation

## System Topology & Flow

Dayflow follows a modern multi-tier microservices-ready architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│     React 18 + TypeScript + Vite + Tailwind + Recharts      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Layer                          │
│   Spring Boot 3.x (Spring Security, Spring Data JPA, JWT)   │
│   - Security & Authentication Gateway                       │
│   - Domain Business Logic (Employees, Attendance, Payroll)  │
│   - Real-time Analytics & Report Generator                  │
└───────────────┬─────────────────────────────┬───────────────┘
                │ JDBC                        │ HTTP / JSON
                ▼                             ▼
┌───────────────────────────────┐ ┌───────────────────────────┐
│       Database Layer          │ │      AI Engine Layer      │
│  PostgreSQL / H2 Relational   │ │   Python FastAPI Service  │
│  (ACID-Compliant Persistence) │ │   NLP & Anomaly Detection │
└───────────────────────────────┘ └───────────────────────────┘
```

## Core Modules & Design Rationale

1. **Security & Authentication Subsystem**:
   - Statelsss authentication backed by JSON Web Tokens (JWT).
   - Role-Based Access Control (RBAC) enforced both at UI navigation level and backend controller endpoints using `@PreAuthorize("hasRole('ADMIN')")`.

2. **Attendance Management Engine**:
   - Real-time Check-In and Check-Out timestamp tracker with automated working hour calculation.
   - Algorithmic status determination: `PRESENT`, `ABSENT`, `HALF_DAY`, `LEAVE`.

3. **Leave Workflow Engine**:
   - Automated balance deductions on approval.
   - Audit trail generation & instant user notification dispatch upon approval/rejection.

4. **AI HR Assistant Integration**:
   - Queries real application metrics directly from backend database services before producing responses.
   - Anomaly detection pipeline flags attendance variance, late arrival clusters, and excessive absent rates.

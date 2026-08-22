# Dayflow REST API Reference

Base Endpoint: `http://localhost:8080/api`

## Authentication API

### 1. Login
- **Endpoint**: `POST /auth/login`
- **Request Body**:
```json
{
  "email": "admin@dayflow.com",
  "password": "Admin@123"
}
```
- **Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "admin@dayflow.com",
  "fullName": "Dayflow Admin",
  "role": "ROLE_ADMIN",
  "employeeId": 1
}
```

### 2. Register
- **Endpoint**: `POST /auth/register`
- **Roles**: `ROLE_EMPLOYEE`, `ROLE_ADMIN`

---

## Employees API

- `GET /employees` (Admin only - List all with pagination/search/department filter)
- `GET /employees/{id}` (View employee profile)
- `POST /employees` (Admin only - Add new employee)
- `PUT /employees/{id}` (Admin only - Update profile & salary structure)
- `DELETE /employees/{id}` (Admin only - Deactivate employee)

---

## Attendance API

- `POST /attendance/check-in` (Employee check in)
- `POST /attendance/check-out` (Employee check out)
- `GET /attendance/me` (Employee's own monthly/weekly records)
- `GET /attendance` (Admin view all attendance with date/department filter)

---

## Leave API

- `POST /leaves` (Apply for leave)
- `GET /leaves/me` (View personal leave history & balances)
- `GET /leaves` (Admin view pending/all leave requests)
- `PUT /leaves/{id}/approve` (Admin approval with optional HR note)
- `PUT /leaves/{id}/reject` (Admin rejection with HR reason)

---

## Payroll API

- `GET /payroll/me` (Employee view current & historical salary slips)
- `GET /payroll` (Admin organization-wide payroll summary)
- `PUT /payroll/{employeeId}` (Admin update basic, allowances, deductions)

---

## Notifications & AI API

- `GET /notifications` (Fetch current user's unread notifications)
- `PUT /notifications/{id}/read` (Mark notification as read)
- `POST /ai/chat` (Query AI Assistant with prompt)
- `GET /ai/insights` (Retrieve automated attendance risk/anomaly insights)

# Project 27 — Containerized Employee Management System

A full-stack, production-ready **Employee Management System** built with a **React + Vite** frontend and a **Python + Flask** REST API backend, backed by **MySQL**.

> [!NOTE]
> **DevOps & Containerization Notice:**
> This repository contains the core application code, database schema, and test suite. Dockerfiles, multi-stage builds, Docker Compose, Nginx reverse proxy configuration, health-check daemons, and CI/CD pipelines will be configured in subsequent DevOps learning phases.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Setup (MySQL)](#database-setup-mysql)
- [Environment Variables](#environment-variables)
- [Backend Setup & Running](#backend-setup--running)
- [Frontend Setup & Running](#frontend-setup--running)
- [REST API Reference](#rest-api-reference)
- [Example API Requests](#example-api-requests)
- [Running Automated Tests](#running-automated-tests)
- [Future DevOps Roadmap](#future-devops-roadmap)

---

## Overview

The Employee Management System provides a clean, responsive interface for organizations to maintain employee directories. It supports standard CRUD operations (Create, Read, Update, Delete) and dynamic multi-field search across employee records.

---

## Features

- **Employee Listing & Stats:** View all employee records alongside high-level metrics (headcount, departments, average salary, highest salary).
- **Add Employee:** Create records with real-time field validation (name, unique email format, department, position, non-negative salary).
- **Edit Employee:** Modify existing employee details with inline feedback.
- **Delete Confirmation:** Prevent accidental loss with a modal confirmation step.
- **Dynamic Search & Filtering:** Filter employees instantly by name, email, department, or job title.
- **Health Check Endpoint:** Decoupled `/api/health` endpoint for uptime monitoring and container probes.
- **Configurable Architecture:** 100% environment-variable driven configuration for seamless local execution and future containerization.

---

## Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Icons:** Lucide React
- **Styling:** Custom Modern CSS (CSS Variables, Flexbox, Responsive Grid)

### Backend
- **Language & Framework:** Python 3.12+ / Flask 3.0
- **ORM & DB Connector:** Flask-SQLAlchemy 3.1 / PyMySQL
- **CORS Handling:** Flask-CORS
- **Testing:** Pytest

### Database
- **Database Engine:** MySQL 8.0+

---

## Project Structure

```text
Dockerized Employee Managment/
├── .env.example               # Template environment configuration
├── .gitignore                 # Excludes .env, build output, and dependencies
├── README.md                  # System documentation
├── nginx/
│   └── README.md              # Placeholder for future Nginx reverse proxy configs
├── backend/
│   ├── app.py                 # Flask application factory and server entry point
│   ├── requirements.txt       # Backend Python dependencies
│   ├── schema.sql             # SQL schema definition and seed data
│   ├── config/
│   │   ├── __init__.py
│   │   └── config.py          # Environment-driven database and app settings
│   ├── models/
│   │   ├── __init__.py
│   │   └── employee.py        # SQLAlchemy Employee model & payload validation
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── health.py          # GET /api/health route
│   │   └── employees.py       # CRUD and search routes
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py        # Pytest test fixtures and SQLite test database
│       ├── test_health.py     # Tests for health status
│       └── test_employees.py  # Tests for CRUD operations, search, and validation
└── frontend/
    ├── index.html             # HTML entry point
    ├── package.json           # Frontend dependencies and npm scripts
    ├── vite.config.js         # Vite configuration
    └── src/
        ├── main.jsx           # React DOM root entry
        ├── App.jsx            # Main dashboard component and state management
        ├── index.css          # Design system stylesheet
        ├── services/
        │   └── api.js         # REST API client
        └── components/
            ├── Header.jsx           # Top navigation bar with backend status
            ├── StatsCards.jsx       # Metric overview cards
            ├── SearchFilter.jsx     # Search box and department dropdown
            ├── EmployeeTable.jsx    # Data table with actions and empty states
            ├── EmployeeModal.jsx    # Add / Edit form modal
            ├── DeleteModal.jsx      # Confirmation deletion dialog
            └── AlertBanner.jsx      # Success and error notifications
```

---

## Database Setup (MySQL)

1. Make sure MySQL server is installed and running locally.
2. Log into MySQL and create the database:
   ```sql
   CREATE DATABASE employee_db;
   ```
3. Initialize the schema and optional sample data using the provided `schema.sql`:
   ```bash
   mysql -u <your_mysql_user> -p employee_db < backend/schema.sql
   ```
   *Alternatively, the backend application will automatically create the `employees` table on startup if the database exists and credentials are valid.*

---

## Environment Variables

Copy `.env.example` to `.env` in the root or individual folders as needed:

```bash
cp .env.example .env
```

### Environment Variable Reference

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DB_HOST` | MySQL database host address | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `employee_db` |
| `DB_USER` | MySQL database user | `employee_user` or `root` |
| `DB_PASSWORD` | MySQL user password | `your_password` |
| `FLASK_ENV` | Flask environment mode | `development` |
| `FLASK_PORT` | Port for Flask backend | `5000` |
| `VITE_API_URL` | Base URL for REST API in React frontend | `http://localhost:5000/api` |

> [!CAUTION]
> Never commit actual passwords or `.env` files to Git. The `.gitignore` file is configured to exclude `.env` automatically.

---

## Backend Setup & Running

### 1. Create and Activate a Virtual Environment

**On Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**On Linux / macOS:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Flask Server

```bash
python app.py
```

The backend server will start on `http://localhost:5000`.

---

## Frontend Setup & Running

### 1. Install Node Dependencies

```bash
cd frontend
npm install
```

### 2. Run the Vite Development Server

```bash
npm run dev
```

The frontend dashboard will be available at `http://localhost:3000` (or `http://localhost:5173`).

---

## REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/employees` | Retrieve all employee records |
| `GET` | `/api/employees/search?q=<query>` | Search employees by name, email, department, or role |
| `GET` | `/api/employees/<id>` | Retrieve a single employee by ID |
| `POST` | `/api/employees` | Create a new employee |
| `PUT` | `/api/employees/<id>` | Update an existing employee |
| `DELETE` | `/api/employees/<id>` | Delete an employee record |

---

## Example API Requests

### 1. Health Check
```bash
curl -X GET http://localhost:5000/api/health
```
**Response (200 OK):**
```json
{
  "status": "healthy"
}
```

### 2. Get All Employees
```bash
curl -X GET http://localhost:5000/api/employees
```

### 3. Search Employees
```bash
curl -X GET "http://localhost:5000/api/employees/search?q=Engineering"
```

### 4. Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "department": "Engineering",
    "position": "Senior Backend Developer",
    "salary": 92000.00
  }'
```

### 5. Update Employee
```bash
curl -X PUT http://localhost:5000/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "salary": 98000.00,
    "position": "Lead Backend Developer"
  }'
```

### 6. Delete Employee
```bash
curl -X DELETE http://localhost:5000/api/employees/1
```

---

## Running Automated Tests

The test suite runs against an isolated, in-memory SQLite database (`sqlite:///:memory:`) so tests can execute rapidly and independently of an active MySQL database server.

Run tests using pytest:

```bash
cd backend
python -m pytest tests/ -v
```

### Test Coverage:
- Health check verification
- Employee listing (empty & populated states)
- Employee creation with valid data
- Input validation (missing fields, invalid email format, negative salary)
- Duplicate email prevention
- ID-based lookup and 404 handling
- Multi-field search
- Updates (full & partial)
- Deletion

---

## Future DevOps Roadmap

The following will be configured in subsequent containerization phases:
- [ ] Backend multi-stage `Dockerfile` (Python slim base image, non-root user).
- [ ] Frontend `Dockerfile` (Node builder + Nginx static asset server).
- [ ] `docker-compose.yml` orchestrating MySQL, Flask backend, and React/Nginx frontend.
- [ ] Custom bridge network with DNS container discovery (`db`, `backend`, `frontend`).
- [ ] Persistent named Docker volume for MySQL data (`mysql_data`).
- [ ] Container health checks (`HEALTHCHECK` instructions).
- [ ] GitHub Actions CI/CD pipeline (Docker build, Trivy security scan, and Docker Hub push).

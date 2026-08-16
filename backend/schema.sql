-- Employee Management Database Schema

CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional Initial Seed Data
INSERT INTO employees (name, email, department, position, salary) VALUES
('Alex Morgan', 'alex.morgan@example.com', 'Engineering', 'Lead Software Engineer', 95000.00),
('Sarah Connor', 'sarah.connor@example.com', 'Security', 'DevOps & Security Specialist', 88000.00),
('David Kim', 'david.kim@example.com', 'Product', 'Senior Product Manager', 92000.00),
('Elena Rostova', 'elena.rostova@example.com', 'Design', 'UI/UX Designer', 75000.00),
('Marcus Johnson', 'marcus.j@example.com', 'Marketing', 'Growth Specialist', 68000.00)
ON DUPLICATE KEY UPDATE id=id;

-- Air School Management System Database Schema
-- MySQL Database Schema

CREATE DATABASE IF NOT EXISTS air_school_db;
USE air_school_db;

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'instructor', 'student') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT,
    course VARCHAR(20) NOT NULL,
    status ENUM('Active', 'Inactive', 'Graduated') DEFAULT 'Active',
    join_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Faculty table
CREATE TABLE faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT,
    department VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    experience INT NOT NULL,
    qualification VARCHAR(200),
    salary DECIMAL(10,2),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    instructor VARCHAR(100),
    max_students INT NOT NULL,
    start_date DATE,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    enrolled_students INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL,
    time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status ENUM('Paid', 'Pending', 'Overdue') DEFAULT 'Paid',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Expenses table
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@airschool.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Kj8Q8Q8Q8', 'admin');

INSERT INTO students (first_name, last_name, email, phone, date_of_birth, course, status) VALUES
('John', 'Doe', 'john.doe@email.com', '+1-555-0123', '1995-05-20', 'PPL', 'Active'),
('Jane', 'Smith', 'jane.smith@email.com', '+1-555-0124', '1992-08-15', 'CPL', 'Active'),
('Mike', 'Johnson', 'mike.johnson@email.com', '+1-555-0125', '1990-12-10', 'ATPL', 'Graduated');

INSERT INTO faculty (first_name, last_name, email, phone, date_of_birth, department, position, experience, qualification, salary, status) VALUES
('Captain', 'Smith', 'captain.smith@airschool.com', '+1-555-0101', '1975-03-15', 'Flight Training', 'Chief Flight Instructor', 15, 'ATP, CFI, CFII', 85000.00, 'Active'),
('Dr. Sarah', 'Johnson', 'sarah.johnson@airschool.com', '+1-555-0102', '1980-07-22', 'Ground School', 'Ground School Instructor', 8, 'PhD in Aviation, CFI', 65000.00, 'Active'),
('Mike', 'Wilson', 'mike.wilson@airschool.com', '+1-555-0103', '1978-11-08', 'Simulator', 'Simulator Instructor', 12, 'CFI, MEI', 70000.00, 'Active');

INSERT INTO courses (course_name, course_code, description, category, duration, fee, instructor, max_students, start_date, status, enrolled_students) VALUES
('Private Pilot License', 'PPL', 'Learn to fly single-engine aircraft for personal use', 'Pilot Training', 6, 15000.00, 'Captain Smith', 20, '2024-03-01', 'Active', 15),
('Commercial Pilot License', 'CPL', 'Professional pilot training for commercial operations', 'Pilot Training', 12, 35000.00, 'Captain Johnson', 15, '2024-04-01', 'Active', 12),
('Ground School - Navigation', 'GS-NAV', 'Ground school course covering navigation principles', 'Ground School', 3, 2500.00, 'Dr. Sarah Johnson', 25, '2024-02-15', 'Active', 18);

INSERT INTO attendance (student_id, course, date, status, time) VALUES
(1, 'PPL', '2024-01-15', 'Present', '09:00:00'),
(2, 'CPL', '2024-01-15', 'Present', '09:00:00'),
(3, 'ATPL', '2024-01-15', 'Absent', '09:00:00');

INSERT INTO payments (student_id, course, amount, payment_date, payment_method, status, notes) VALUES
(1, 'PPL', 5000.00, '2024-01-15', 'Bank Transfer', 'Paid', 'First installment'),
(2, 'CPL', 10000.00, '2024-01-20', 'Card', 'Paid', 'Second installment');

INSERT INTO expenses (description, category, amount, date, notes) VALUES
('Aircraft Fuel', 'Fuel', 2500.00, '2024-01-10', 'Monthly fuel expense'),
('Aircraft Maintenance', 'Maintenance', 5000.00, '2024-01-12', 'Engine overhaul');

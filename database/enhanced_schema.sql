-- Enhanced Air School Management System Database Schema
-- Comprehensive schema supporting all system requirements

CREATE DATABASE IF NOT EXISTS air_school_db;
USE air_school_db;

-- Enhanced Users table with roles and permissions
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'instructor', 'student', 'finance', 'admissions') DEFAULT 'admin',
    permissions JSON,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enhanced Students table with comprehensive information
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_conditions TEXT,
    previous_flight_experience TEXT,
    admission_date DATE DEFAULT (CURRENT_DATE),
    graduation_date DATE NULL,
    status ENUM('Applied', 'Enrolled', 'Active', 'Suspended', 'Graduated', 'Withdrawn') DEFAULT 'Applied',
    admission_status ENUM('Pending', 'Approved', 'Rejected', 'Waitlisted') DEFAULT 'Pending',
    documents_submitted JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enhanced Faculty table with comprehensive management
CREATE TABLE faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
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
    certifications JSON,
    salary DECIMAL(10,2),
    hire_date DATE NOT NULL,
    status ENUM('Active', 'Inactive', 'On Leave', 'Terminated') DEFAULT 'Active',
    availability_schedule JSON,
    specializations JSON,
    performance_ratings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enhanced Courses table with comprehensive course management
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    duration_months INT NOT NULL,
    total_hours INT NOT NULL,
    theory_hours INT NOT NULL,
    practical_hours INT NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    instructor_id INT,
    max_students INT NOT NULL,
    min_students INT NOT NULL,
    start_date DATE,
    end_date DATE,
    schedule JSON,
    prerequisites JSON,
    learning_objectives TEXT,
    status ENUM('Planning', 'Active', 'Completed', 'Cancelled') DEFAULT 'Planning',
    enrolled_students INT DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES faculty(id) ON DELETE SET NULL
);

-- Student-Course Enrollment table
CREATE TABLE student_course_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    completion_date DATE NULL,
    status ENUM('Enrolled', 'In Progress', 'Completed', 'Dropped', 'Failed') DEFAULT 'Enrolled',
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    final_grade VARCHAR(5),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);

-- Enhanced Attendance table with detailed tracking
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    date DATE NOT NULL,
    session_type ENUM('Theory', 'Practical', 'Simulator', 'Exam') NOT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    instructor_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES faculty(id) ON DELETE SET NULL
);

-- Examinations table
CREATE TABLE examinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    course_id INT NOT NULL,
    exam_type ENUM('Theory', 'Practical', 'Oral', 'Simulator') NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    max_marks INT NOT NULL,
    passing_marks INT NOT NULL,
    instructor_id INT,
    venue VARCHAR(100),
    instructions TEXT,
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES faculty(id) ON DELETE SET NULL
);

-- Exam Results table
CREATE TABLE exam_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_id INT NOT NULL,
    marks_obtained INT NOT NULL,
    grade VARCHAR(5),
    result ENUM('Pass', 'Fail', 'Absent') NOT NULL,
    remarks TEXT,
    exam_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES examinations(id) ON DELETE CASCADE
);

-- Enhanced Payments table with comprehensive fee management
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id VARCHAR(20) UNIQUE NOT NULL,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('Cash', 'Card', 'Bank Transfer', 'Cheque', 'Online') NOT NULL,
    payment_type ENUM('Tuition', 'Exam Fee', 'Material Fee', 'Late Fee', 'Refund') NOT NULL,
    status ENUM('Paid', 'Pending', 'Overdue', 'Cancelled', 'Refunded') DEFAULT 'Paid',
    due_date DATE,
    late_fee DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    receipt_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Fee Structure table
CREATE TABLE fee_structures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    fee_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date_offset INT NOT NULL, -- Days from enrollment
    is_mandatory BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Enhanced Expenses table with detailed categorization
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id VARCHAR(20) UNIQUE NOT NULL,
    description VARCHAR(200) NOT NULL,
    category ENUM('Fuel', 'Maintenance', 'Insurance', 'Utilities', 'Salaries', 'Equipment', 'Training', 'Other') NOT NULL,
    subcategory VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    vendor VARCHAR(100),
    invoice_number VARCHAR(50),
    payment_method ENUM('Cash', 'Card', 'Bank Transfer', 'Cheque') NOT NULL,
    status ENUM('Pending', 'Paid', 'Approved', 'Rejected') DEFAULT 'Pending',
    approved_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Communications table for stakeholder communication
CREATE TABLE communications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    communication_type ENUM('Email', 'SMS', 'Notification', 'Announcement') NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    status ENUM('Sent', 'Delivered', 'Read', 'Failed') DEFAULT 'Sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications table for system notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('Info', 'Warning', 'Error', 'Success') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reports table for storing generated reports
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(100) NOT NULL,
    report_type ENUM('Student', 'Faculty', 'Financial', 'Attendance', 'Exam', 'Custom') NOT NULL,
    parameters JSON,
    generated_by INT NOT NULL,
    file_path VARCHAR(255),
    status ENUM('Generating', 'Completed', 'Failed') DEFAULT 'Generating',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE
);

-- System Settings table
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Audit Log table for security and tracking
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default admin user
INSERT INTO users (username, email, password_hash, role, permissions) VALUES
('admin', 'admin@airschool.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Kj8Q8Q8Q8', 'admin', '{"all": true}');

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('school_name', 'Air School Management System', 'Name of the aviation school'),
('school_address', '123 Aviation Boulevard, City, State', 'School address'),
('contact_phone', '+1-555-AVIATION', 'School contact phone'),
('contact_email', 'info@airschool.com', 'School contact email'),
('currency', 'USD', 'Default currency'),
('timezone', 'UTC', 'System timezone'),
('max_students_per_course', '25', 'Maximum students allowed per course'),
('attendance_threshold', '75', 'Minimum attendance percentage required'),
('late_fee_percentage', '5', 'Late fee percentage'),
('payment_grace_period', '7', 'Payment grace period in days');

-- Insert sample data
INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, course, status, admission_status) VALUES
('STU001', 'John', 'Doe', 'john.doe@email.com', '+1-555-0123', '1995-05-20', 'PPL', 'Active', 'Approved'),
('STU002', 'Jane', 'Smith', 'jane.smith@email.com', '+1-555-0124', '1992-08-15', 'CPL', 'Active', 'Approved'),
('STU003', 'Mike', 'Johnson', 'mike.johnson@email.com', '+1-555-0125', '1990-12-10', 'ATPL', 'Graduated', 'Approved');

INSERT INTO faculty (employee_id, first_name, last_name, email, phone, date_of_birth, department, position, experience, qualification, salary, hire_date) VALUES
('EMP001', 'Captain', 'Smith', 'captain.smith@airschool.com', '+1-555-0101', '1975-03-15', 'Flight Training', 'Chief Flight Instructor', 15, 'ATP, CFI, CFII', 85000.00, '2020-01-15'),
('EMP002', 'Dr. Sarah', 'Johnson', 'sarah.johnson@airschool.com', '+1-555-0102', '1980-07-22', 'Ground School', 'Ground School Instructor', 8, 'PhD in Aviation, CFI', 65000.00, '2021-03-01'),
('EMP003', 'Mike', 'Wilson', 'mike.wilson@airschool.com', '+1-555-0103', '1978-11-08', 'Simulator', 'Simulator Instructor', 12, 'CFI, MEI', 70000.00, '2019-06-15');

INSERT INTO courses (course_name, course_code, description, category, duration_months, total_hours, theory_hours, practical_hours, fee, instructor_id, max_students, min_students, start_date, status) VALUES
('Private Pilot License', 'PPL', 'Learn to fly single-engine aircraft for personal use', 'Pilot Training', 6, 200, 80, 120, 15000.00, 1, 20, 5, '2024-03-01', 'Active'),
('Commercial Pilot License', 'CPL', 'Professional pilot training for commercial operations', 'Pilot Training', 12, 400, 150, 250, 35000.00, 1, 15, 3, '2024-04-01', 'Active'),
('Ground School - Navigation', 'GS-NAV', 'Ground school course covering navigation principles', 'Ground School', 3, 60, 60, 0, 2500.00, 2, 25, 5, '2024-02-15', 'Active');

-- Database Migration Script
-- This script updates the existing database to match the enhanced models

USE air_school_db;

-- Update users table with new columns
ALTER TABLE users 
ADD COLUMN permissions JSON,
ADD COLUMN last_login TIMESTAMP NULL,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update students table with new columns
ALTER TABLE students 
ADD COLUMN student_id VARCHAR(20) UNIQUE,
ADD COLUMN emergency_contact_name VARCHAR(100),
ADD COLUMN emergency_contact_phone VARCHAR(20),
ADD COLUMN medical_conditions TEXT,
ADD COLUMN previous_flight_experience TEXT,
ADD COLUMN admission_date DATE DEFAULT (CURRENT_DATE),
ADD COLUMN graduation_date DATE NULL,
ADD COLUMN admission_status ENUM('Pending', 'Approved', 'Rejected', 'Waitlisted') DEFAULT 'Pending',
ADD COLUMN documents_submitted JSON,
ADD COLUMN notes TEXT,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update faculty table with new columns
ALTER TABLE faculty 
ADD COLUMN employee_id VARCHAR(20) UNIQUE,
ADD COLUMN hire_date DATE,
ADD COLUMN certifications JSON,
ADD COLUMN availability_schedule JSON,
ADD COLUMN specializations JSON,
ADD COLUMN performance_ratings JSON,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update courses table with new columns
ALTER TABLE courses 
ADD COLUMN duration_months INT,
ADD COLUMN total_hours INT,
ADD COLUMN theory_hours INT,
ADD COLUMN practical_hours INT,
ADD COLUMN end_date DATE,
ADD COLUMN schedule JSON,
ADD COLUMN prerequisites JSON,
ADD COLUMN learning_objectives TEXT,
ADD COLUMN completion_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update attendance table with new columns
ALTER TABLE attendance 
ADD COLUMN course_id INT,
ADD COLUMN session_type ENUM('Theory', 'Practical', 'Simulator', 'Exam') DEFAULT 'Theory',
ADD COLUMN check_in_time TIME,
ADD COLUMN check_out_time TIME,
ADD COLUMN instructor_id INT,
ADD COLUMN notes TEXT;

-- Update payments table with new columns
ALTER TABLE payments 
ADD COLUMN payment_id VARCHAR(20) UNIQUE,
ADD COLUMN course_id INT,
ADD COLUMN payment_type ENUM('Tuition', 'Exam Fee', 'Material Fee', 'Late Fee', 'Refund') DEFAULT 'Tuition',
ADD COLUMN due_date DATE,
ADD COLUMN late_fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN receipt_number VARCHAR(50);

-- Update expenses table with new columns
ALTER TABLE expenses 
ADD COLUMN expense_id VARCHAR(20) UNIQUE,
ADD COLUMN subcategory VARCHAR(50),
ADD COLUMN vendor VARCHAR(100),
ADD COLUMN invoice_number VARCHAR(50),
ADD COLUMN payment_method ENUM('Cash', 'Card', 'Bank Transfer', 'Cheque') NOT NULL,
ADD COLUMN status ENUM('Pending', 'Paid', 'Approved', 'Rejected') DEFAULT 'Pending',
ADD COLUMN approved_by INT;

-- Create new tables for enhanced features

-- Student-Course Enrollment table
CREATE TABLE IF NOT EXISTS student_course_enrollments (
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

-- Examinations table
CREATE TABLE IF NOT EXISTS examinations (
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
CREATE TABLE IF NOT EXISTS exam_results (
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

-- Fee Structure table
CREATE TABLE IF NOT EXISTS fee_structures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    fee_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date_offset INT NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Communications table
CREATE TABLE IF NOT EXISTS communications (
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

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('Info', 'Warning', 'Error', 'Success') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- System Settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Audit Log table
CREATE TABLE IF NOT EXISTS audit_logs (
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

-- Update existing data with default values
UPDATE users SET permissions = '{"all": true}', is_active = TRUE WHERE permissions IS NULL;
UPDATE students SET student_id = CONCAT('STU', LPAD(id, 3, '0')), admission_status = 'Approved' WHERE student_id IS NULL;
UPDATE faculty SET employee_id = CONCAT('EMP', LPAD(id, 3, '0')), hire_date = created_at WHERE employee_id IS NULL;
UPDATE courses SET duration_months = duration, total_hours = duration * 40, theory_hours = duration * 20, practical_hours = duration * 20 WHERE duration_months IS NULL;
UPDATE payments SET payment_id = CONCAT('PAY', LPAD(id, 3, '0')), payment_type = 'Tuition' WHERE payment_id IS NULL;
UPDATE expenses SET expense_id = CONCAT('EXP', LPAD(id, 3, '0')), payment_method = 'Cash', status = 'Paid' WHERE expense_id IS NULL;

-- Insert default system settings
INSERT IGNORE INTO system_settings (setting_key, setting_value, description) VALUES
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

-- Add foreign key constraints for new columns
ALTER TABLE attendance ADD FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE attendance ADD FOREIGN KEY (instructor_id) REFERENCES faculty(id) ON DELETE SET NULL;
ALTER TABLE payments ADD FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE expenses ADD FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_faculty_employee_id ON faculty(employee_id);
CREATE INDEX idx_courses_course_code ON courses(course_code);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_examinations_date ON examinations(exam_date);
CREATE INDEX idx_communications_recipient ON communications(recipient_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

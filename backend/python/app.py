# Air School Management System - Python Flask Backend

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import base64
import hmac
import hashlib
import json
import os
from functools import wraps

# Initialize Flask app
import os
app = Flask(__name__, 
            static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')),
            static_url_path='')
app.config['SECRET_KEY'] = 'yourdgds'
# MySQL Database Configuration
# app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/air_school_db'
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:Hello@localhost:3306/air_school_db"


# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)

# Simple token functions (replacing JWT)
def create_token(user_id):
    """Create a simple token for the user"""
    payload = {
        'user_id': user_id,
        'exp': (datetime.utcnow() + timedelta(hours=24)).timestamp()
    }
    payload_json = json.dumps(payload)
    payload_b64 = base64.b64encode(payload_json.encode()).decode()
    signature = hmac.new(
        app.config['SECRET_KEY'].encode(),
        payload_b64.encode(),
        hashlib.sha256
    ).hexdigest()
    return f"{payload_b64}.{signature}"

def verify_token(token):
    """Verify and decode a token"""
    try:
        payload_b64, signature = token.split('.')
        
        # Verify signature
        expected_signature = hmac.new(
            app.config['SECRET_KEY'].encode(),
            payload_b64.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected_signature):
            return None
            
        # Decode payload
        payload_json = base64.b64decode(payload_b64.encode()).decode()
        payload = json.loads(payload_json)
        
        # Check expiration
        if datetime.utcnow().timestamp() > payload['exp']:
            return None
            
        return payload
    except:
        return None

# Database Models (compatible with existing schema)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), default='admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    address = db.Column(db.Text)
    course = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='Active')
    join_date = db.Column(db.Date, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Faculty(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    address = db.Column(db.Text)
    department = db.Column(db.String(50), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    qualification = db.Column(db.String(200))
    salary = db.Column(db.Float)
    status = db.Column(db.String(20), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(100), nullable=False)
    course_code = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # in months
    fee = db.Column(db.Float, nullable=False)
    instructor = db.Column(db.String(100))
    max_students = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='Active')
    enrolled_students = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    course = db.Column(db.String(20), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # Present, Absent, Late
    time = db.Column(db.Time)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    course = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='Paid')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Note: Additional models can be added later when database schema is enhanced

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = verify_token(token)
            if not data:
                return jsonify({'message': 'Token is invalid'}), 401
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Authentication Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        token = create_token(user.id)
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        })
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role=data.get('role', 'admin')
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

# Serve index.html at root URL
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Serve any HTML file
@app.route('/<path:path>.html')
def serve_html(path):
    return app.send_static_file(f'{path}.html')

# Test route (no authentication required)
@app.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({
        'message': 'Air School Management System API is running!',
        'status': 'success',
        'database': 'MySQL connection will be tested on first request'
    })

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

# Dashboard Routes
@app.route('/api/dashboard', methods=['GET'])
@token_required
def get_dashboard_data(current_user):
    try:
        total_students = Student.query.count()
        total_faculty = Faculty.query.count()
        total_courses = Course.query.count()
        
        # Calculate attendance percentage
        today = datetime.now().date()
        total_attendance = Attendance.query.filter_by(date=today).count()
        present_attendance = Attendance.query.filter_by(date=today, status='Present').count()
        attendance_percentage = (present_attendance / total_attendance * 100) if total_attendance > 0 else 0
        
        # Calculate total revenue
        total_revenue = db.session.query(db.func.sum(Payment.amount)).scalar() or 0
        
        return jsonify({
            'students': total_students,
            'faculty': total_faculty,
            'courses': total_courses,
            'attendance': round(attendance_percentage, 1),
            'revenue': total_revenue
        })
    except Exception as e:
        # Return mock data if database is not available
        return jsonify({
            'students': 150,
            'faculty': 25,
            'courses': 8,
            'attendance': 85.0,
            'revenue': 125000
        })

# Student Routes
@app.route('/api/students', methods=['GET'])
@token_required
def get_students(current_user):
    students = Student.query.all()
    return jsonify({
        'data': [{
            'id': s.id,
            'firstName': s.first_name,
            'lastName': s.last_name,
            'email': s.email,
            'phone': s.phone,
            'dateOfBirth': s.date_of_birth.isoformat() if s.date_of_birth else None,
            'address': s.address,
            'course': s.course,
            'status': s.status,
            'joinDate': s.join_date.isoformat() if s.join_date else None
        } for s in students]
    })

@app.route('/api/students', methods=['POST'])
@token_required
def create_student(current_user):
    data = request.get_json()
    
    # Check if email already exists
    existing_student = Student.query.filter_by(email=data['email']).first()
    if existing_student:
        return jsonify({'message': 'Student with this email already exists', 'error': 'duplicate_email'}), 409
    
    try:
        student = Student(
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
            phone=data['phone'],
            date_of_birth=datetime.strptime(data['dateOfBirth'], '%Y-%m-%d').date(),
            address=data.get('address'),
            course=data['course'],
            status=data.get('status', 'Active')
        )
        
        db.session.add(student)
        db.session.commit()
        
        return jsonify({'message': 'Student created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating student', 'error': str(e)}), 500

@app.route('/api/students/<int:student_id>', methods=['PUT'])
@token_required
def update_student(current_user, student_id):
    student = Student.query.get_or_404(student_id)
    data = request.get_json()
    
    student.first_name = data['firstName']
    student.last_name = data['lastName']
    student.email = data['email']
    student.phone = data['phone']
    student.date_of_birth = datetime.strptime(data['dateOfBirth'], '%Y-%m-%d').date()
    student.address = data.get('address')
    student.course = data['course']
    student.status = data['status']
    
    db.session.commit()
    
    return jsonify({'message': 'Student updated successfully'})

@app.route('/api/students/<int:student_id>', methods=['DELETE'])
@token_required
def delete_student(current_user, student_id):
    student = Student.query.get_or_404(student_id)
    db.session.delete(student)
    db.session.commit()
    
    return jsonify({'message': 'Student deleted successfully'})

# Faculty Routes
@app.route('/api/faculty', methods=['GET'])
@token_required
def get_faculty(current_user):
    faculty = Faculty.query.all()
    return jsonify({
        'data': [{
            'id': f.id,
            'firstName': f.first_name,
            'lastName': f.last_name,
            'email': f.email,
            'phone': f.phone,
            'dateOfBirth': f.date_of_birth.isoformat() if f.date_of_birth else None,
            'address': f.address,
            'department': f.department,
            'position': f.position,
            'experience': f.experience,
            'qualification': f.qualification,
            'salary': f.salary,
            'status': f.status
        } for f in faculty]
    })

@app.route('/api/faculty', methods=['POST'])
@token_required
def create_faculty(current_user):
    data = request.get_json()
    
    faculty = Faculty(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        phone=data['phone'],
        date_of_birth=datetime.strptime(data['dateOfBirth'], '%Y-%m-%d').date(),
        address=data.get('address'),
        department=data['department'],
        position=data['position'],
        experience=data['experience'],
        qualification=data.get('qualification'),
        salary=data.get('salary'),
        status=data.get('status', 'Active')
    )
    
    db.session.add(faculty)
    db.session.commit()
    
    return jsonify({'message': 'Faculty created successfully'}), 201

@app.route('/api/faculty/<int:faculty_id>', methods=['PUT'])
@token_required
def update_faculty(current_user, faculty_id):
    faculty = Faculty.query.get_or_404(faculty_id)
    data = request.get_json()
    
    faculty.first_name = data['firstName']
    faculty.last_name = data['lastName']
    faculty.email = data['email']
    faculty.phone = data['phone']
    faculty.date_of_birth = datetime.strptime(data['dateOfBirth'], '%Y-%m-%d').date()
    faculty.address = data.get('address')
    faculty.department = data['department']
    faculty.position = data['position']
    faculty.experience = data['experience']
    faculty.qualification = data.get('qualification')
    faculty.salary = data.get('salary')
    faculty.status = data['status']
    
    db.session.commit()
    
    return jsonify({'message': 'Faculty updated successfully'})

@app.route('/api/faculty/<int:faculty_id>', methods=['DELETE'])
@token_required
def delete_faculty(current_user, faculty_id):
    faculty = Faculty.query.get_or_404(faculty_id)
    db.session.delete(faculty)
    db.session.commit()
    
    return jsonify({'message': 'Faculty deleted successfully'})

# Course Routes
@app.route('/api/courses', methods=['GET'])
@token_required
def get_courses(current_user):
    courses = Course.query.all()
    return jsonify({
        'data': [{
            'id': c.id,
            'courseName': c.course_name,
            'courseCode': c.course_code,
            'description': c.description,
            'category': c.category,
            'duration': c.duration,
            'fee': c.fee,
            'instructor': c.instructor or 'Not Assigned',
            'maxStudents': c.max_students,
            'startDate': c.start_date.isoformat() if c.start_date else None,
            'status': c.status,
            'enrolledStudents': c.enrolled_students
        } for c in courses]
    })

@app.route('/api/courses', methods=['POST'])
@token_required
def create_course(current_user):
    data = request.get_json()
    
    course = Course(
        course_name=data['courseName'],
        course_code=data['courseCode'],
        description=data.get('description'),
        category=data['category'],
        duration=data['duration'],
        fee=data['fee'],
        instructor=data.get('instructor') or 'Not Assigned',
        max_students=data['maxStudents'],
        start_date=datetime.strptime(data['startDate'], '%Y-%m-%d').date() if data.get('startDate') else None,
        status=data.get('status', 'Active')
    )
    
    db.session.add(course)
    db.session.commit()
    
    return jsonify({'message': 'Course created successfully'}), 201

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
@token_required
def update_course(current_user, course_id):
    course = Course.query.get_or_404(course_id)
    data = request.get_json()
    
    course.course_name = data['courseName']
    course.course_code = data['courseCode']
    course.description = data.get('description')
    course.category = data['category']
    course.duration = data['duration']
    course.fee = data['fee']
    course.instructor = data.get('instructor') or 'Not Assigned'
    course.max_students = data['maxStudents']
    course.start_date = datetime.strptime(data['startDate'], '%Y-%m-%d').date() if data.get('startDate') else None
    course.status = data['status']
    
    db.session.commit()
    
    return jsonify({'message': 'Course updated successfully'})

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
@token_required
def delete_course(current_user, course_id):
    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    db.session.commit()
    
    return jsonify({'message': 'Course deleted successfully'})

# Attendance Routes
@app.route('/api/attendance', methods=['GET'])
@token_required
def get_attendance(current_user):
    attendance = Attendance.query.all()
    return jsonify({
        'data': [{
            'id': a.id,
            'studentId': a.student_id,
            'studentName': f"{Student.query.get(a.student_id).first_name} {Student.query.get(a.student_id).last_name}" if Student.query.get(a.student_id) else 'Unknown',
            'course': a.course,
            'date': a.date.isoformat(),
            'status': a.status,
            'time': a.time.strftime('%H:%M') if a.time else None
        } for a in attendance]
    })

@app.route('/api/attendance', methods=['POST'])
@token_required
def create_attendance(current_user):
    data = request.get_json()
    
    for record in data['records']:
        attendance = Attendance(
            student_id=record['studentId'],
            course=record['course'],
            date=datetime.strptime(record['date'], '%Y-%m-%d').date(),
            status=record['status'],
            time=datetime.strptime(record['time'], '%H:%M').time()
        )
        db.session.add(attendance)
    
    db.session.commit()
    
    return jsonify({'message': 'Attendance recorded successfully'}), 201

@app.route('/api/attendance/<int:attendance_id>', methods=['DELETE'])
@token_required
def delete_attendance(current_user, attendance_id):
    attendance = Attendance.query.get_or_404(attendance_id)
    db.session.delete(attendance)
    db.session.commit()
    
    return jsonify({'message': 'Attendance record deleted successfully'})

# Payment Routes
@app.route('/api/payments', methods=['GET'])
@token_required
def get_payments(current_user):
    payments = Payment.query.all()
    return jsonify({
        'data': [{
            'id': p.id,
            'studentId': p.student_id,
            'studentName': f"{Student.query.get(p.student_id).first_name} {Student.query.get(p.student_id).last_name}" if Student.query.get(p.student_id) else 'Unknown',
            'course': p.course,
            'amount': p.amount,
            'paymentDate': p.payment_date.isoformat(),
            'paymentMethod': p.payment_method,
            'status': p.status,
            'notes': p.notes
        } for p in payments]
    })

@app.route('/api/payments', methods=['POST'])
@token_required
def create_payment(current_user):
    data = request.get_json()
    
    payment = Payment(
        student_id=data['studentId'],
        course=data['course'],
        amount=data['amount'],
        payment_date=datetime.strptime(data['paymentDate'], '%Y-%m-%d').date(),
        payment_method=data['paymentMethod'],
        status=data.get('status', 'Paid'),
        notes=data.get('notes')
    )
    
    db.session.add(payment)
    db.session.commit()
    
    return jsonify({'message': 'Payment recorded successfully'}), 201

@app.route('/api/payments/<int:payment_id>', methods=['DELETE'])
@token_required
def delete_payment(current_user, payment_id):
    payment = Payment.query.get_or_404(payment_id)
    db.session.delete(payment)
    db.session.commit()
    
    return jsonify({'message': 'Payment deleted successfully'})

# Expense Routes
@app.route('/api/expenses', methods=['GET'])
@token_required
def get_expenses(current_user):
    expenses = Expense.query.all()
    return jsonify({
        'data': [{
            'id': e.id,
            'description': e.description,
            'category': e.category,
            'amount': e.amount,
            'date': e.date.isoformat(),
            'notes': e.notes
        } for e in expenses]
    })

@app.route('/api/expenses', methods=['POST'])
@token_required
def create_expense(current_user):
    data = request.get_json()
    
    expense = Expense(
        description=data['description'],
        category=data['category'],
        amount=data['amount'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        notes=data.get('notes')
    )
    
    db.session.add(expense)
    db.session.commit()
    
    return jsonify({'message': 'Expense recorded successfully'}), 201

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
@token_required
def delete_expense(current_user, expense_id):
    expense = Expense.query.get_or_404(expense_id)
    db.session.delete(expense)
    db.session.commit()
    
    return jsonify({'message': 'Expense deleted successfully'})

# Reports Routes
@app.route('/api/reports', methods=['GET'])
@token_required
def get_reports(current_user):
    # Generate report data
    total_students = Student.query.count()
    active_courses = Course.query.filter_by(status='Active').count()
    total_faculty = Faculty.query.filter_by(status='Active').count()
    
    # Calculate monthly revenue
    current_month = datetime.now().replace(day=1)
    monthly_revenue = db.session.query(db.func.sum(Payment.amount)).filter(
        Payment.payment_date >= current_month
    ).scalar() or 0
    
    # Calculate average attendance
    attendance_records = Attendance.query.all()
    if attendance_records:
        present_count = sum(1 for a in attendance_records if a.status == 'Present')
        avg_attendance = (present_count / len(attendance_records)) * 100
    else:
        avg_attendance = 0
    
    # Calculate financial metrics
    total_expenses = db.session.query(db.func.sum(Expense.amount)).scalar() or 0
    net_revenue = monthly_revenue - total_expenses
    
    return jsonify({
        'data': {
            'totalStudents': total_students,
            'activeCourses': active_courses,
            'totalFaculty': total_faculty,
            'monthlyRevenue': monthly_revenue,
            'totalExpenses': total_expenses,
            'netRevenue': net_revenue,
            'avgAttendance': round(avg_attendance, 1)
        }
    })

# Note: Additional API endpoints can be added when database schema is enhanced

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500

# Initialize database
def create_tables():
    try:
        with app.app_context():
            db.create_all()
            
            # Create default admin user if not exists
            if not User.query.filter_by(username='admin').first():
                admin_user = User(
                    username='admin',
                    email='admin@airschool.com',
                    password_hash=generate_password_hash('admin123'),
                    role='admin'
                )
                db.session.add(admin_user)
                db.session.commit()
            print("Database initialized successfully!")
    except Exception as e:
        print(f"Database connection failed: {e}")
        print("Please ensure MySQL is running and the database 'air_school_db' exists")
        print("You can create the database using: CREATE DATABASE air_school_db;")

# Call the function when the app starts
create_tables()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

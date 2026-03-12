# Air School Management System - Setup Guide

This guide will help you set up the Air School Management System for your MCA final year project.

## 📋 Prerequisites

### Required Software
- **Web Server**: Apache/Nginx or Python/Java runtime
- **Database**: MySQL 8.0 or higher
- **Browser**: Modern web browser (Chrome, Firefox, Safari, Edge)
- **Text Editor**: VS Code, Sublime Text, or any preferred editor

### For Python Backend
- Python 3.8 or higher
- pip (Python package manager)

## 🚀 Installation Steps

### Step 1: Download and Extract
1. Download the project files
2. Extract to your web server directory (e.g., `htdocs`, `www`, or project folder)

### Step 2: Database Setup
1. **Start MySQL server**
2. **Create database**:
   ```sql
   CREATE DATABASE air_school_db;
   ```
3. **Import schema**:
   ```sql
   USE air_school_db;
   SOURCE database/schema.sql;
   ```
4. **Verify tables created**:
   ```sql
   SHOW TABLES;
   ```

### Step 3: Backend Configuration

#### Python Flask Backend
1. **Navigate to Python backend**:
   ```bash
   cd backend/python
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure database connection** in `app.py`:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:your_password@localhost/air_school_db'
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```


### Step 4: Frontend Configuration
1. **Update API endpoints** in JavaScript files:
   - For Python: `http://localhost:5000/api`

2. **Test frontend** by opening `index.html` in browser

## 🔧 Configuration Details

### Database Configuration
```sql
-- Database: air_school_db
-- Tables: users, students, faculty, courses, attendance, payments, expenses
-- Sample data included for testing
```

### API Endpoints
- **Dashboard**: `/api/dashboard`
- **Students**: `/api/students`
- **Faculty**: `/api/faculty`
- **Courses**: `/api/courses`
- **Attendance**: `/api/attendance`
- **Payments**: `/api/payments`
- **Expenses**: `/api/expenses`

### Default Login Credentials
- **Username**: admin
- **Password**: admin123

## 🧪 Testing the Installation

### 1. Database Test
```sql
SELECT COUNT(*) FROM students;
SELECT COUNT(*) FROM faculty;
SELECT COUNT(*) FROM courses;
```

### 2. Backend API Test
```bash
# Test dashboard endpoint
curl http://localhost:5000/api/dashboard

# Test students endpoint
curl http://localhost:5000/api/students
```

### 3. Frontend Test
1. Open `index.html` in browser
2. Check if dashboard loads
3. Test navigation between pages
4. Verify data displays correctly

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
- **Problem**: Cannot connect to MySQL
- **Solution**: 
  - Check MySQL service is running
  - Verify credentials in configuration
  - Ensure database exists

#### API Not Responding
- **Problem**: Frontend cannot reach backend
- **Solution**:
  - Check backend is running on correct port
  - Verify CORS configuration
  - Check firewall settings

#### Frontend Not Loading
- **Problem**: Pages show blank or errors
- **Solution**:
  - Check browser console for errors
  - Verify file paths are correct
  - Ensure web server is configured properly

### Error Messages
- **"Database connection failed"**: Check MySQL credentials and service
- **"API endpoint not found"**: Verify backend is running and URL is correct
- **"CORS error"**: Check CORS configuration in backend

## 📊 Sample Data

The system comes with sample data for testing:
- **3 Students**: John Doe, Jane Smith, Mike Johnson
- **3 Faculty**: Captain Smith, Dr. Sarah Johnson, Mike Wilson
- **3 Courses**: PPL, CPL, Ground School Navigation
- **Sample Attendance**: Recent attendance records
- **Sample Payments**: Financial transactions
- **Sample Expenses**: Operational costs

## 🔐 Security Considerations

### Development Environment
- Change default passwords
- Use environment variables for sensitive data
- Enable HTTPS in production

### Production Deployment
- Use strong database passwords
- Configure firewall rules
- Enable SSL/TLS encryption
- Regular security updates

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_students_course ON students(course);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_payments_date ON payments(payment_date);
```

### Backend Optimization
- Enable database connection pooling
- Implement caching for frequently accessed data
- Use pagination for large datasets

## 🚀 Deployment Options

### Local Development
- Use XAMPP/WAMP for PHP
- Use Python virtual environment
- Use Maven for Java

### Production Deployment
- **Cloud**: AWS, Azure, Google Cloud
- **VPS**: DigitalOcean, Linode, Vultr
- **Shared Hosting**: For PHP backend only

## 📝 Project Documentation

### For MCA Final Year Project
1. **System Architecture**: Document the multi-tier architecture
2. **Technology Stack**: Explain frontend and backend technologies
3. **Database Design**: ER diagrams and schema documentation
4. **API Documentation**: RESTful API endpoints and responses
5. **User Manual**: Step-by-step user guide
6. **Testing**: Unit tests and integration tests

### Documentation Files
- `README.md`: Project overview and features
- `SETUP.md`: This setup guide
- `API.md`: API documentation
- `USER_GUIDE.md`: User manual

## 🎯 Project Features for MCA

### Technical Features
- **Multi-technology Backend**: Python, Java, PHP options
- **Responsive Design**: Mobile-friendly interface
- **RESTful API**: Standard web service architecture
- **Database Integration**: MySQL with proper relationships
- **Authentication**: JWT-based security
- **Real-time Updates**: Dynamic data loading

### Business Features
- **Student Management**: Complete lifecycle management
- **Course Management**: Scheduling and tracking
- **Financial Management**: Payments and expenses
- **Reporting**: Analytics and data visualization
- **Attendance Tracking**: Real-time monitoring

## 📞 Support

### Getting Help
- Check this setup guide first
- Review error messages carefully
- Test each component individually
- Verify prerequisites are met

### Common Solutions
- **Restart services**: MySQL, web server, backend
- **Check logs**: Error logs for debugging
- **Verify configuration**: Database and API settings
- **Test connectivity**: Database and API endpoints

---

**Good luck with your MCA final year project!** 🎓✈️

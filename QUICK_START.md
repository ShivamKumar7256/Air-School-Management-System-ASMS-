# Air School Management System - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Python 3.8+ installed
- MySQL database server running
- Modern web browser

### Step 1: Install Dependencies
```bash
cd backend/python
pip install -r requirements.txt
```

### Step 2: Setup Database
1. Create MySQL database:
```sql
CREATE DATABASE air_school_db;
```

2. The application will automatically create tables on first run.

### Step 3: Start the Application
```bash
# From project root directory
python start_app.py
```

### Step 4: Access the Application
- **Frontend**: Open `index.html` in your web browser
- **Backend API**: http://localhost:5000
- **Default Login**: admin / admin123

## 🔧 Configuration

### Database Connection
Edit `backend/python/app.py` line 20:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/air_school_db"
```

### API Endpoints
All frontend JavaScript files are configured to use:
- Base URL: `http://localhost:5000/api`

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
- Ensure MySQL is running
- Check database credentials in `app.py`
- Verify database `air_school_db` exists

**Port Already in Use**
- Change port in `app.py` line 688: `app.run(debug=True, host='0.0.0.0', port=5001)`
- Update frontend API URLs accordingly

**Module Not Found**
- Install requirements: `pip install -r backend/python/requirements.txt`

## 📊 Features

- ✅ Student Management
- ✅ Faculty Management  
- ✅ Course Management (with instructor assignment)
- ✅ Attendance Tracking
- ✅ Financial Management
- ✅ Reports & Analytics
- ✅ Responsive Design
- ✅ Real-time Updates

## 🎯 Fixed Issues

- ✅ Removed Java and PHP backend dependencies
- ✅ Fixed instructor name "undefined" issue
- ✅ Updated documentation
- ✅ Streamlined to Python-only backend
- ✅ Added proper error handling
- ✅ Improved instructor validation

---

**Ready to use!** The system is now simplified and focused on the Python Flask backend only.

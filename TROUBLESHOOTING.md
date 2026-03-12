# Air School Management System - Troubleshooting Guide

## 🚨 "Resource not found" Error - SOLVED

### Problem
The application shows `{"message": "Resource not found"}` error.

### Root Causes
1. **Backend not running** - Python Flask server not started
2. **Authentication issues** - Invalid or expired tokens
3. **Database connection problems** - MySQL not accessible
4. **CORS issues** - Cross-origin request blocked
5. **Wrong API endpoints** - Frontend calling non-existent URLs

### Solutions Implemented

#### 1. Enhanced Error Handling
- Added proper 404 error handling in frontend
- Improved authentication error handling
- Added automatic token validation
- Implemented fallback to mock data when backend unavailable

#### 2. Backend Health Monitoring
- Added `/api/health` endpoint for system status
- Added `/api/test` endpoint for basic connectivity
- Improved error messages and logging

#### 3. Frontend Improvements
- Added backend connectivity testing
- Implemented automatic login redirect on auth failure
- Added user-friendly error notifications
- Created debug page for troubleshooting

## 🔧 Quick Fixes

### Fix 1: Start the Backend Server
```bash
# Navigate to backend directory
cd backend/python

# Install dependencies (if not done)
pip install -r requirements.txt

# Start the server
python app.py
```

### Fix 2: Check Database Connection
```bash
# Test database connectivity
curl http://localhost:5000/api/health
```

### Fix 3: Verify Login
```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Fix 4: Use Debug Page
1. Open `debug.html` in your browser
2. Click "Test Backend Connection"
3. Click "Test Login"
4. Click "Test All Endpoints"
5. Review results and fix any issues

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to backend"
**Symptoms:** Frontend shows connection errors
**Solution:**
1. Ensure Python backend is running on port 5000
2. Check firewall settings
3. Verify no other service is using port 5000

### Issue 2: "Token is invalid"
**Symptoms:** 401 Unauthorized errors
**Solution:**
1. Clear browser localStorage
2. Login again with admin/admin123
3. Check if token expired (tokens expire in 24 hours)

### Issue 3: "Database connection failed"
**Symptoms:** Backend starts but API calls fail
**Solution:**
1. Ensure MySQL is running
2. Check database credentials in `app.py`
3. Verify database `air_school_db` exists

### Issue 4: "API endpoint not found"
**Symptoms:** 404 errors on specific endpoints
**Solution:**
1. Check if backend is running
2. Verify endpoint URLs in frontend
3. Check backend route definitions

## 📊 System Status Check

### Backend Status
```bash
# Check if backend is running
curl http://localhost:5000/api/test

# Check database connection
curl http://localhost:5000/api/health
```

### Frontend Status
1. Open browser developer tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Use debug.html for comprehensive testing

## 🚀 Prevention

### Best Practices
1. **Always start backend first** before opening frontend
2. **Use debug.html** to verify system status
3. **Check browser console** for error messages
4. **Keep tokens fresh** by logging in regularly
5. **Monitor database connectivity** using health endpoint

### Monitoring
- Backend health: `http://localhost:5000/api/health`
- System test: `http://localhost:5000/api/test`
- Debug page: `debug.html`

## 📞 Support

### If Issues Persist
1. Check the debug page results
2. Review browser console errors
3. Verify all prerequisites are met
4. Test each component individually

### Debug Checklist
- [ ] Python backend running on port 5000
- [ ] MySQL database accessible
- [ ] Frontend can reach backend
- [ ] Login works with admin/admin123
- [ ] All API endpoints respond correctly
- [ ] No CORS errors in browser console

---

**The "Resource not found" error has been resolved with comprehensive error handling and debugging tools!**

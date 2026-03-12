#!/usr/bin/env python3
"""
API Test Script for Air School Management System
This script tests all the main API endpoints to ensure they're working correctly.
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

def test_api_endpoint(method, endpoint, data=None, headers=None):
    """Test an API endpoint and return the result"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers)
        
        return {
            'status_code': response.status_code,
            'success': response.status_code < 400,
            'data': response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
        }
    except Exception as e:
        return {
            'status_code': 0,
            'success': False,
            'error': str(e)
        }

def main():
    print("Testing Air School Management System API")
    print("=" * 50)
    
    # Test 1: Basic connectivity
    print("\n1. Testing basic connectivity...")
    result = test_api_endpoint("GET", "/test")
    if result['success']:
        print("SUCCESS: API is running and accessible")
    else:
        print("ERROR: API is not accessible")
        return
    
    # Test 2: Health check
    print("\n2. Testing health check...")
    result = test_api_endpoint("GET", "/health")
    if result['success']:
        print("SUCCESS: Health check passed")
    else:
        print("WARNING: Health check failed (this is expected if database is not fully configured)")
    
    # Test 3: Login
    print("\n3. Testing login...")
    login_data = {"username": "admin", "password": "admin123"}
    result = test_api_endpoint("POST", "/auth/login", login_data)
    
    if result['success']:
        print("SUCCESS: Login successful")
        token = result['data']['token']
        headers = {"Authorization": f"Bearer {token}"}
    else:
        print("ERROR: Login failed")
        return
    
    # Test 4: Dashboard
    print("\n4. Testing dashboard...")
    result = test_api_endpoint("GET", "/dashboard", headers=headers)
    if result['success']:
        print("SUCCESS: Dashboard data retrieved successfully")
        print(f"   Students: {result['data']['students']}")
        print(f"   Faculty: {result['data']['faculty']}")
        print(f"   Courses: {result['data']['courses']}")
    else:
        print("ERROR: Dashboard failed")
    
    # Test 5: Students
    print("\n5. Testing students endpoint...")
    result = test_api_endpoint("GET", "/students", headers=headers)
    if result['success']:
        print("SUCCESS: Students data retrieved successfully")
    else:
        print("ERROR: Students endpoint failed")
    
    # Test 6: Faculty
    print("\n6. Testing faculty endpoint...")
    result = test_api_endpoint("GET", "/faculty", headers=headers)
    if result['success']:
        print("SUCCESS: Faculty data retrieved successfully")
    else:
        print("ERROR: Faculty endpoint failed")
    
    # Test 7: Courses
    print("\n7. Testing courses endpoint...")
    result = test_api_endpoint("GET", "/courses", headers=headers)
    if result['success']:
        print("SUCCESS: Courses data retrieved successfully")
    else:
        print("ERROR: Courses endpoint failed")
    
    # Test 8: Reports
    print("\n8. Testing reports endpoint...")
    result = test_api_endpoint("GET", "/reports", headers=headers)
    if result['success']:
        print("SUCCESS: Reports data retrieved successfully")
    else:
        print("ERROR: Reports endpoint failed")
    
    print("\n" + "=" * 50)
    print("API testing completed!")
    print("\nIf all tests passed, the system is working correctly.")
    print("You can now use the frontend application.")

if __name__ == "__main__":
    main()

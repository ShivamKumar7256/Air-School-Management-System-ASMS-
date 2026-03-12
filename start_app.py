#!/usr/bin/env python3
"""
Air School Management System - Startup Script
This script starts the Flask backend server for the Air School Management System.
"""

import os
import sys
import subprocess

def main():
    print("Air School Management System - Starting Backend Server")
    print("=" * 50)
    
    # Change to the backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend', 'python')
    
    if not os.path.exists(backend_dir):
        print("Error: Backend directory not found!")
        print("Please ensure you're running this from the project root directory.")
        sys.exit(1)
    
    # Check if requirements are installed
    try:
        import flask
        import flask_sqlalchemy
        import flask_cors
        print("✓ All required packages are available")
    except ImportError as e:
        print(f"✗ Missing required package: {e}")
        print("Please install requirements: pip install -r backend/python/requirements.txt")
        sys.exit(1)
    
    # Start the Flask application
    print("\nStarting Flask server...")
    print("Backend will be available at: http://localhost:5000")
    print("Frontend should be opened at: http://localhost:3000 (or your web server)")
    print("\nPress Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Change to backend directory and run the app
        os.chdir(backend_dir)
        subprocess.run([sys.executable, 'app.py'], check=True)
    except KeyboardInterrupt:
        print("\n\nServer stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"\nError starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

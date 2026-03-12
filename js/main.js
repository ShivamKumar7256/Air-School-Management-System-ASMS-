// Air School Management System - Main JavaScript

// Global variables
let currentUser = null;
let dashboardData = {
    students: 0,
    faculty: 0,
    courses: 0,
    attendance: 0,
    revenue: 0
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadDashboardData();
    setupEventListeners();
});

// Initialize application
function initializeApp() {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
        currentUser = JSON.parse(user);
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = currentUser.username;
        }
    } else {
        // Redirect to login if no user
        window.location.href = 'login.html';
    }
    
    // Test backend connectivity
    testBackendConnectivity();
    
    // Set current date for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
}

// Test backend connectivity
async function testBackendConnectivity() {
    try {
        const response = await fetch('http://localhost:5000/api/test');
        if (!response.ok) {
            console.warn('Backend connectivity test failed');
            showNotification('Backend server may not be running. Some features may not work properly.', 'warning');
        }
    } catch (error) {
        console.warn('Backend connectivity test failed:', error);
        showNotification('Cannot connect to backend server. Please ensure the Python backend is running on port 5000.', 'warning');
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // API call to backend
        const response = await fetch('http://localhost:5000/api/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateDashboardCards(data);
        } else if (response.status === 401) {
            // Token expired or invalid, redirect to login
            console.warn('Authentication failed, redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        } else if (response.status === 404) {
            console.error('API endpoint not found');
            showNotification('Backend service not available', 'error');
            // Use mock data for demonstration
            updateDashboardCards({
                students: 150,
                faculty: 25,
                courses: 8,
                attendance: 85,
                revenue: 125000
            });
        } else {
            console.error('API request failed with status:', response.status);
            // Use mock data for demonstration
            updateDashboardCards({
                students: 150,
                faculty: 25,
                courses: 8,
                attendance: 85,
                revenue: 125000
            });
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Use mock data for demonstration
        updateDashboardCards({
            students: 150,
            faculty: 25,
            courses: 8,
            attendance: 85,
            revenue: 125000
        });
    }
}

// Update dashboard cards with data
function updateDashboardCards(data) {
    const studentCount = document.getElementById('studentCount');
    const facultyCount = document.getElementById('facultyCount');
    const courseCount = document.getElementById('courseCount');
    const attendanceToday = document.getElementById('attendanceToday');
    const totalRevenue = document.getElementById('totalRevenue');
    
    if (studentCount) studentCount.textContent = data.students;
    if (facultyCount) facultyCount.textContent = data.faculty;
    if (courseCount) courseCount.textContent = data.courses;
    if (attendanceToday) attendanceToday.textContent = data.attendance + '%';
    if (totalRevenue) totalRevenue.textContent = '$' + data.revenue.toLocaleString();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInputs = document.querySelectorAll('input[type="text"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(handleSearch, 300));
    });
    
    // Filter functionality
    const filterSelects = document.querySelectorAll('select');
    filterSelects.forEach(select => {
        select.addEventListener('change', handleFilter);
    });
    
    // Modal close on outside click
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const tableId = event.target.id.replace('Search', 'Table');
    const table = document.getElementById(tableId);
    
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}

// Handle filter functionality
function handleFilter(event) {
    const filterValue = event.target.value;
    const filterType = event.target.id.replace('Filter', '');
    
    // Implement filter logic based on filter type
    console.log(`Filtering by ${filterType}: ${filterValue}`);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Show loading spinner
function showLoading(element) {
    element.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
}

// Hide loading spinner
function hideLoading(element, content) {
    element.innerHTML = content;
}

// API helper functions
class API {
    static async request(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        
        const config = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
                    throw new Error('Authentication failed');
                } else if (response.status === 404) {
                    throw new Error('API endpoint not found');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    static async get(url) {
        return this.request(url, { method: 'GET' });
    }
    
    static async post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    static async put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    static async delete(url) {
        return this.request(url, { method: 'DELETE' });
    }
}

// Export functions for use in other files
window.API = API;
window.showNotification = showNotification;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.showLoading = showLoading;
window.hideLoading = hideLoading;

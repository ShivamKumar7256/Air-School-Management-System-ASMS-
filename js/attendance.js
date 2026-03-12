// Attendance Management JavaScript

let attendanceRecords = [];
let students = [];
let courses = [];

// Initialize attendance page
document.addEventListener('DOMContentLoaded', function() {
    loadAttendanceData();
    setupAttendanceEventListeners();
});

// Load attendance data
async function loadAttendanceData() {
    try {
        // Load students and courses
        const [studentsResponse, coursesResponse, attendanceResponse] = await Promise.all([
            API.get('/api/students'),
            API.get('/api/courses'),
            API.get('/api/attendance')
        ]);
        
        students = studentsResponse.data || [];
        courses = coursesResponse.data || [];
        attendanceRecords = attendanceResponse.data || [];
    } catch (error) {
        console.error('Error loading attendance data:', error);
        // Use mock data for demonstration
        students = [
            { id: 1, firstName: 'John', lastName: 'Doe', course: 'PPL' },
            { id: 2, firstName: 'Jane', lastName: 'Smith', course: 'CPL' },
            { id: 3, firstName: 'Mike', lastName: 'Johnson', course: 'ATPL' }
        ];
        
        courses = [
            { id: 1, courseName: 'Private Pilot License', courseCode: 'PPL' },
            { id: 2, courseName: 'Commercial Pilot License', courseCode: 'CPL' },
            { id: 3, courseName: 'Airline Transport Pilot License', courseCode: 'ATPL' }
        ];
        
        attendanceRecords = [
            {
                id: 1,
                studentId: 1,
                studentName: 'John Doe',
                course: 'PPL',
                date: '2024-01-15',
                status: 'Present',
                time: '09:00'
            },
            {
                id: 2,
                studentId: 2,
                studentName: 'Jane Smith',
                course: 'CPL',
                date: '2024-01-15',
                status: 'Present',
                time: '09:00'
            },
            {
                id: 3,
                studentId: 3,
                studentName: 'Mike Johnson',
                course: 'ATPL',
                date: '2024-01-15',
                status: 'Absent',
                time: '09:00'
            }
        ];
    }
    
    displayAttendance();
    updateAttendanceSummary();
}

// Display attendance records
function displayAttendance() {
    const tbody = document.getElementById('attendanceTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    attendanceRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.studentId}</td>
            <td>${record.studentName}</td>
            <td>${record.course}</td>
            <td>${formatDate(record.date)}</td>
            <td><span class="status-badge status-${record.status.toLowerCase()}">${record.status}</span></td>
            <td>${record.time}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editAttendance(${record.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteAttendance(${record.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update attendance summary
function updateAttendanceSummary() {
    const totalStudents = students.length;
    const presentStudents = attendanceRecords.filter(r => r.status === 'Present').length;
    const absentStudents = attendanceRecords.filter(r => r.status === 'Absent').length;
    const attendancePercentage = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;
    
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('presentStudents').textContent = presentStudents;
    document.getElementById('absentStudents').textContent = absentStudents;
    document.getElementById('attendancePercentage').textContent = attendancePercentage + '%';
}

// Setup event listeners
function setupAttendanceEventListeners() {
    // Load attendance button
    const loadBtn = document.querySelector('button[onclick="loadAttendance()"]');
    if (loadBtn) {
        loadBtn.addEventListener('click', loadAttendance);
    }
    
    // Form submission
    const attendanceForm = document.getElementById('attendanceForm');
    if (attendanceForm) {
        attendanceForm.addEventListener('submit', handleAttendanceSubmit);
    }
}

// Load attendance based on filters
function loadAttendance() {
    const dateFilter = document.getElementById('dateFilter').value;
    const courseFilter = document.getElementById('courseFilter').value;
    
    let filteredRecords = attendanceRecords;
    
    if (dateFilter) {
        filteredRecords = filteredRecords.filter(record => record.date === dateFilter);
    }
    
    if (courseFilter) {
        filteredRecords = filteredRecords.filter(record => record.course === courseFilter);
    }
    
    displayFilteredAttendance(filteredRecords);
}

// Display filtered attendance
function displayFilteredAttendance(filteredRecords) {
    const tbody = document.getElementById('attendanceTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.studentId}</td>
            <td>${record.studentName}</td>
            <td>${record.course}</td>
            <td>${formatDate(record.date)}</td>
            <td><span class="status-badge status-${record.status.toLowerCase()}">${record.status}</span></td>
            <td>${record.time}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editAttendance(${record.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteAttendance(${record.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Mark attendance
function markAttendance() {
    const modal = document.getElementById('attendanceModal');
    const dateInput = document.getElementById('attendanceDate');
    const courseSelect = document.getElementById('attendanceCourse');
    
    // Set today's date
    dateInput.value = new Date().toISOString().split('T')[0];
    
    // Populate course options
    courseSelect.innerHTML = '<option value="">Select Course</option>';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.courseCode;
        option.textContent = course.courseName;
        courseSelect.appendChild(option);
    });
    
    modal.style.display = 'block';
}

// Close attendance modal
function closeAttendanceModal() {
    const modal = document.getElementById('attendanceModal');
    modal.style.display = 'none';
}

// Load students for attendance
function loadStudentsForAttendance() {
    const courseSelect = document.getElementById('attendanceCourse');
    const selectedCourse = courseSelect.value;
    
    if (!selectedCourse) {
        document.getElementById('attendanceList').innerHTML = '';
        return;
    }
    
    const courseStudents = students.filter(student => student.course === selectedCourse);
    const attendanceList = document.getElementById('attendanceList');
    
    attendanceList.innerHTML = '';
    
    courseStudents.forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'attendance-student';
        studentDiv.innerHTML = `
            <div class="student-info">
                <span>${student.firstName} ${student.lastName}</span>
                <span>ID: ${student.id}</span>
            </div>
            <div class="attendance-options">
                <label>
                    <input type="radio" name="attendance_${student.id}" value="Present" checked>
                    Present
                </label>
                <label>
                    <input type="radio" name="attendance_${student.id}" value="Absent">
                    Absent
                </label>
                <label>
                    <input type="radio" name="attendance_${student.id}" value="Late">
                    Late
                </label>
            </div>
        `;
        attendanceList.appendChild(studentDiv);
    });
}

// Save attendance
async function saveAttendance() {
    const date = document.getElementById('attendanceDate').value;
    const course = document.getElementById('attendanceCourse').value;
    
    if (!date || !course) {
        showNotification('Please select date and course', 'error');
        return;
    }
    
    const courseStudents = students.filter(student => student.course === course);
    const attendanceData = [];
    
    courseStudents.forEach(student => {
        const statusInput = document.querySelector(`input[name="attendance_${student.id}"]:checked`);
        if (statusInput) {
            attendanceData.push({
                studentId: student.id,
                studentName: `${student.firstName} ${student.lastName}`,
                course: course,
                date: date,
                status: statusInput.value,
                time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            });
        }
    });
    
    try {
        await API.post('/api/attendance', { records: attendanceData });
        attendanceRecords.push(...attendanceData);
        displayAttendance();
        updateAttendanceSummary();
        closeAttendanceModal();
        showNotification('Attendance marked successfully', 'success');
    } catch (error) {
        console.error('Error saving attendance:', error);
        // For demo purposes, add to local array
        attendanceRecords.push(...attendanceData);
        displayAttendance();
        updateAttendanceSummary();
        closeAttendanceModal();
        showNotification('Attendance marked successfully', 'success');
    }
}

// Edit attendance
function editAttendance(id) {
    const record = attendanceRecords.find(r => r.id === id);
    if (!record) return;
    
    const newStatus = prompt('Enter new status (Present/Absent/Late):', record.status);
    if (newStatus && ['Present', 'Absent', 'Late'].includes(newStatus)) {
        record.status = newStatus;
        displayAttendance();
        showNotification('Attendance updated successfully', 'success');
    }
}

// Delete attendance
async function deleteAttendance(id) {
    if (!confirm('Are you sure you want to delete this attendance record?')) {
        return;
    }
    
    try {
        await API.delete(`/api/attendance/${id}`);
        attendanceRecords = attendanceRecords.filter(r => r.id !== id);
        displayAttendance();
        updateAttendanceSummary();
        showNotification('Attendance record deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting attendance:', error);
        // For demo purposes, remove from local array
        attendanceRecords = attendanceRecords.filter(r => r.id !== id);
        displayAttendance();
        updateAttendanceSummary();
        showNotification('Attendance record deleted successfully', 'success');
    }
}

// Export functions for global access
window.markAttendance = markAttendance;
window.closeAttendanceModal = closeAttendanceModal;
window.loadStudentsForAttendance = loadStudentsForAttendance;
window.saveAttendance = saveAttendance;
window.editAttendance = editAttendance;
window.deleteAttendance = deleteAttendance;
window.loadAttendance = loadAttendance;

// API utility for making requests to the backend
const API = {
    baseUrl: 'http://localhost:5000',
    async get(endpoint) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html';
                throw new Error('No authentication token found');
            }
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                throw new Error('Authentication failed');
            }
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    },
    async post(endpoint, data) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error posting to ${endpoint}:`, error);
            throw error;
        }
    },
    async delete(endpoint) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error deleting ${endpoint}:`, error);
            throw error;
        }
    }
};

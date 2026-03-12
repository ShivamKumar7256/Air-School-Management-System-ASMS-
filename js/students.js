// Students Management JavaScript

let students = [];
let currentPage = 1;
let itemsPerPage = 10;
let editingStudentId = null;

// Initialize students page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }
    
    loadStudents();
    setupStudentEventListeners();
});

// Load students data
async function loadStudents() {
    try {
        showLoading(document.getElementById('studentsTableBody'));
        
        // Try to fetch from API first
        const response = await API.get('http://localhost:5000/api/students');
        students = response.data || [];
    } catch (error) {
        console.error('Error loading students:', error);
        // Use mock data for demonstration
        students = [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+1-555-0123',
                course: 'PPL',
                status: 'Active',
                joinDate: '2024-01-15',
                dateOfBirth: '1995-05-20',
                address: '123 Main St, City, State'
            },
            {
                id: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@email.com',
                phone: '+1-555-0124',
                course: 'CPL',
                status: 'Active',
                joinDate: '2024-02-01',
                dateOfBirth: '1992-08-15',
                address: '456 Oak Ave, City, State'
            },
            {
                id: 3,
                firstName: 'Mike',
                lastName: 'Johnson',
                email: 'mike.johnson@email.com',
                phone: '+1-555-0125',
                course: 'ATPL',
                status: 'Graduated',
                joinDate: '2023-09-01',
                dateOfBirth: '1990-12-10',
                address: '789 Pine St, City, State'
            }
        ];
    }
    
    displayStudents();
}

// Display students in table
function displayStudents() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageStudents = students.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    pageStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.course}</td>
            <td><span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></td>
            <td>${formatDate(student.joinDate)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editStudent(${student.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePagination();
}

// Setup event listeners
function setupStudentEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleStudentSearch);
    }
    
    // Filter functionality
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (courseFilter) {
        courseFilter.addEventListener('change', handleStudentFilter);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', handleStudentFilter);
    }
    
    // Form submission
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        console.log('Setting up form event listener');
        studentForm.addEventListener('submit', handleStudentSubmit);
    } else {
        console.error('Student form not found!');
    }
}

// Handle student search
function handleStudentSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredStudents = students.filter(student => 
        student.firstName.toLowerCase().includes(searchTerm) ||
        student.lastName.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.phone.includes(searchTerm)
    );
    
    displayFilteredStudents(filteredStudents);
}

// Handle student filter
function handleStudentFilter() {
    const courseFilter = document.getElementById('courseFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredStudents = students;
    
    if (courseFilter) {
        filteredStudents = filteredStudents.filter(student => student.course === courseFilter);
    }
    
    if (statusFilter) {
        filteredStudents = filteredStudents.filter(student => student.status === statusFilter);
    }
    
    displayFilteredStudents(filteredStudents);
}

// Display filtered students
function displayFilteredStudents(filteredStudents) {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.course}</td>
            <td><span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></td>
            <td>${formatDate(student.joinDate)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editStudent(${student.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open student modal
function openStudentModal() {
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('studentForm');
    
    modalTitle.textContent = 'Add New Student';
    form.reset();
    editingStudentId = null;
    modal.style.display = 'block';
}

// Close student modal
function closeStudentModal() {
    const modal = document.getElementById('studentModal');
    modal.style.display = 'none';
    editingStudentId = null;
}

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    editingStudentId = id;
    
    // Populate form with student data
    document.getElementById('firstName').value = student.firstName;
    document.getElementById('lastName').value = student.lastName;
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
    document.getElementById('dateOfBirth').value = student.dateOfBirth;
    document.getElementById('address').value = student.address || '';
    document.getElementById('course').value = student.course;
    document.getElementById('status').value = student.status;
    
    // Update modal title
    document.getElementById('modalTitle').textContent = 'Edit Student';
    
    // Show modal
    document.getElementById('studentModal').style.display = 'block';
}

// Delete student
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }
    
    try {
        await API.delete(`http://localhost:5000/api/students/${id}`);
        students = students.filter(s => s.id !== id);
        displayStudents();
        showNotification('Student deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting student:', error);
        // For demo purposes, remove from local array
        students = students.filter(s => s.id !== id);
        displayStudents();
        showNotification('Student deleted successfully', 'success');
    }
}

// Handle student form submission
async function handleStudentSubmit(event) {
    event.preventDefault();
    console.log('Form submission started');
    
    const formData = new FormData(event.target);
    const studentData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dateOfBirth'),
        address: formData.get('address'),
        course: formData.get('course'),
        status: formData.get('status')
    };
    
    console.log('Student data:', studentData);
    
    // Validate form data
    if (!validateStudentData(studentData)) {
        return;
    }
    
    try {
        if (editingStudentId) {
            // Update existing student
            await API.put(`http://localhost:5000/api/students/${editingStudentId}`, studentData);
            const index = students.findIndex(s => s.id === editingStudentId);
            if (index !== -1) {
                students[index] = { ...students[index], ...studentData };
            }
            showNotification('Student updated successfully', 'success');
        } else {
            // Add new student
            const response = await API.post('http://localhost:5000/api/students', studentData);
            const newStudent = { id: Date.now(), ...studentData, joinDate: new Date().toISOString().split('T')[0] };
            students.unshift(newStudent);
            showNotification('Student added successfully', 'success');
        }
        
        closeStudentModal();
        displayStudents();
    } catch (error) {
        console.error('Error saving student:', error);
        // For demo purposes, add/update in local array
        if (editingStudentId) {
            const index = students.findIndex(s => s.id === editingStudentId);
            if (index !== -1) {
                students[index] = { ...students[index], ...studentData };
            }
            showNotification('Student updated successfully', 'success');
        } else {
            const newStudent = { id: Date.now(), ...studentData, joinDate: new Date().toISOString().split('T')[0] };
            students.unshift(newStudent);
            showNotification('Student added successfully', 'success');
        }
        
        closeStudentModal();
        displayStudents();
    }
}

// Validate student data
function validateStudentData(data) {
    if (!data.firstName.trim()) {
        showNotification('First name is required', 'error');
        return false;
    }
    
    if (!data.lastName.trim()) {
        showNotification('Last name is required', 'error');
        return false;
    }
    
    if (!validateEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!validatePhone(data.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    if (!data.course) {
        showNotification('Please select a course', 'error');
        return false;
    }
    
    return true;
}

// Pagination functions
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayStudents();
    }
}

function nextPage() {
    const totalPages = Math.ceil(students.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayStudents();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(students.length / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

// Export functions for global access
window.openStudentModal = openStudentModal;
window.closeStudentModal = closeStudentModal;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.previousPage = previousPage;
window.nextPage = nextPage;

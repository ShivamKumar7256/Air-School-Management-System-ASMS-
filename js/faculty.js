// Faculty Management JavaScript

let faculty = [];
let currentPage = 1;
let itemsPerPage = 10;
let editingFacultyId = null;

// Initialize faculty page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }
    
    loadFaculty();
    setupFacultyEventListeners();
});

// Load faculty data
async function loadFaculty() {
    try {
        showLoading(document.getElementById('facultyTableBody'));
        
        // Try to fetch from API first
        const response = await API.get('http://localhost:5000/api/faculty');
        faculty = response.data || [];
    } catch (error) {
        console.error('Error loading faculty:', error);
        // Use mock data for demonstration
        faculty = [
            {
                id: 1,
                firstName: 'Captain',
                lastName: 'Smith',
                email: 'captain.smith@airschool.com',
                phone: '+1-555-0101',
                department: 'Flight Training',
                position: 'Chief Flight Instructor',
                experience: 15,
                qualification: 'ATP, CFI, CFII',
                salary: 85000,
                status: 'Active',
                dateOfBirth: '1975-03-15',
                address: '123 Aviation Blvd, City, State'
            },
            {
                id: 2,
                firstName: 'Dr. Sarah',
                lastName: 'Johnson',
                email: 'sarah.johnson@airschool.com',
                phone: '+1-555-0102',
                department: 'Ground School',
                position: 'Ground School Instructor',
                experience: 8,
                qualification: 'PhD in Aviation, CFI',
                salary: 65000,
                status: 'Active',
                dateOfBirth: '1980-07-22',
                address: '456 Education Ave, City, State'
            },
            {
                id: 3,
                firstName: 'Mike',
                lastName: 'Wilson',
                email: 'mike.wilson@airschool.com',
                phone: '+1-555-0103',
                department: 'Simulator',
                position: 'Simulator Instructor',
                experience: 12,
                qualification: 'CFI, MEI',
                salary: 70000,
                status: 'Active',
                dateOfBirth: '1978-11-08',
                address: '789 Training St, City, State'
            }
        ];
    }
    
    displayFaculty();
}

// Display faculty in table
function displayFaculty() {
    const tbody = document.getElementById('facultyTableBody');
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageFaculty = faculty.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    pageFaculty.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.firstName} ${member.lastName}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.department}</td>
            <td>${member.position}</td>
            <td>${member.experience} years</td>
            <td><span class="status-badge status-${member.status.toLowerCase()}">${member.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editFaculty(${member.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteFaculty(${member.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePagination();
}

// Setup event listeners
function setupFacultyEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleFacultySearch);
    }
    
    // Filter functionality
    const departmentFilter = document.getElementById('departmentFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', handleFacultyFilter);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', handleFacultyFilter);
    }
    
    // Form submission
    const facultyForm = document.getElementById('facultyForm');
    if (facultyForm) {
        console.log('Setting up faculty form event listener');
        facultyForm.addEventListener('submit', handleFacultySubmit);
    } else {
        console.error('Faculty form not found!');
    }
}

// Handle faculty search
function handleFacultySearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredFaculty = faculty.filter(member => 
        member.firstName.toLowerCase().includes(searchTerm) ||
        member.lastName.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm) ||
        member.phone.includes(searchTerm) ||
        member.position.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredFaculty(filteredFaculty);
}

// Handle faculty filter
function handleFacultyFilter() {
    const departmentFilter = document.getElementById('departmentFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredFaculty = faculty;
    
    if (departmentFilter) {
        filteredFaculty = filteredFaculty.filter(member => member.department === departmentFilter);
    }
    
    if (statusFilter) {
        filteredFaculty = filteredFaculty.filter(member => member.status === statusFilter);
    }
    
    displayFilteredFaculty(filteredFaculty);
}

// Display filtered faculty
function displayFilteredFaculty(filteredFaculty) {
    const tbody = document.getElementById('facultyTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredFaculty.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.firstName} ${member.lastName}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.department}</td>
            <td>${member.position}</td>
            <td>${member.experience} years</td>
            <td><span class="status-badge status-${member.status.toLowerCase()}">${member.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editFaculty(${member.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteFaculty(${member.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open faculty modal
function openFacultyModal() {
    const modal = document.getElementById('facultyModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('facultyForm');
    
    modalTitle.textContent = 'Add New Faculty';
    form.reset();
    editingFacultyId = null;
    modal.style.display = 'block';
}

// Close faculty modal
function closeFacultyModal() {
    const modal = document.getElementById('facultyModal');
    modal.style.display = 'none';
    editingFacultyId = null;
}

// Edit faculty
function editFaculty(id) {
    const member = faculty.find(f => f.id === id);
    if (!member) return;
    
    editingFacultyId = id;
    
    // Populate form with faculty data
    document.getElementById('firstName').value = member.firstName;
    document.getElementById('lastName').value = member.lastName;
    document.getElementById('email').value = member.email;
    document.getElementById('phone').value = member.phone;
    document.getElementById('dateOfBirth').value = member.dateOfBirth;
    document.getElementById('address').value = member.address || '';
    document.getElementById('department').value = member.department;
    document.getElementById('position').value = member.position;
    document.getElementById('experience').value = member.experience;
    document.getElementById('qualification').value = member.qualification || '';
    document.getElementById('salary').value = member.salary || '';
    document.getElementById('status').value = member.status;
    
    // Update modal title
    document.getElementById('modalTitle').textContent = 'Edit Faculty';
    
    // Show modal
    document.getElementById('facultyModal').style.display = 'block';
}

// Delete faculty
async function deleteFaculty(id) {
    if (!confirm('Are you sure you want to delete this faculty member?')) {
        return;
    }
    
    try {
        await API.delete(`http://localhost:5000/api/faculty/${id}`);
        faculty = faculty.filter(f => f.id !== id);
        displayFaculty();
        showNotification('Faculty member deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting faculty:', error);
        // For demo purposes, remove from local array
        faculty = faculty.filter(f => f.id !== id);
        displayFaculty();
        showNotification('Faculty member deleted successfully', 'success');
    }
}

// Handle faculty form submission
async function handleFacultySubmit(event) {
    event.preventDefault();
    console.log('Faculty form submission started');
    
    const formData = new FormData(event.target);
    const facultyData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dateOfBirth'),
        address: formData.get('address'),
        department: formData.get('department'),
        position: formData.get('position'),
        experience: parseInt(formData.get('experience')),
        qualification: formData.get('qualification'),
        salary: parseFloat(formData.get('salary')) || 0,
        status: formData.get('status')
    };
    
    console.log('Faculty data:', facultyData);
    
    // Validate form data
    if (!validateFacultyData(facultyData)) {
        return;
    }
    
    try {
        if (editingFacultyId) {
            // Update existing faculty
            await API.put(`http://localhost:5000/api/faculty/${editingFacultyId}`, facultyData);
            const index = faculty.findIndex(f => f.id === editingFacultyId);
            if (index !== -1) {
                faculty[index] = { ...faculty[index], ...facultyData };
            }
            showNotification('Faculty member updated successfully', 'success');
        } else {
            // Add new faculty
            const response = await API.post('http://localhost:5000/api/faculty', facultyData);
            const newFaculty = { id: Date.now(), ...facultyData };
            faculty.unshift(newFaculty);
            showNotification('Faculty member added successfully', 'success');
        }
        
        closeFacultyModal();
        displayFaculty();
    } catch (error) {
        console.error('Error saving faculty:', error);
        // For demo purposes, add/update in local array
        if (editingFacultyId) {
            const index = faculty.findIndex(f => f.id === editingFacultyId);
            if (index !== -1) {
                faculty[index] = { ...faculty[index], ...facultyData };
            }
            showNotification('Faculty member updated successfully', 'success');
        } else {
            const newFaculty = { id: Date.now(), ...facultyData };
            faculty.unshift(newFaculty);
            showNotification('Faculty member added successfully', 'success');
        }
        
        closeFacultyModal();
        displayFaculty();
    }
}

// Validate faculty data
function validateFacultyData(data) {
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
    
    if (!data.department) {
        showNotification('Please select a department', 'error');
        return false;
    }
    
    if (!data.position.trim()) {
        showNotification('Position is required', 'error');
        return false;
    }
    
    if (data.experience < 0) {
        showNotification('Experience cannot be negative', 'error');
        return false;
    }
    
    return true;
}

// Pagination functions
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayFaculty();
    }
}

function nextPage() {
    const totalPages = Math.ceil(faculty.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayFaculty();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(faculty.length / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

// Export functions for global access
window.openFacultyModal = openFacultyModal;
window.closeFacultyModal = closeFacultyModal;
window.editFaculty = editFaculty;
window.deleteFaculty = deleteFaculty;
window.previousPage = previousPage;
window.nextPage = nextPage;

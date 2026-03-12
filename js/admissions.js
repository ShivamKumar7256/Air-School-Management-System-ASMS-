// Student Admissions Management JavaScript

let admissions = [];
let editingAdmissionId = null;

// Initialize admissions page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }
    
    loadAdmissions();
    setupAdmissionEventListeners();
});

// Load admissions data
async function loadAdmissions() {
    try {
        showLoading(document.getElementById('admissionsTableBody'));
        
        // Try to fetch from API first
        const response = await API.get('http://localhost:5000/api/admissions');
        admissions = response.data || [];
    } catch (error) {
        console.error('Error loading admissions:', error);
        // Use mock data for demonstration
        admissions = [
            {
                id: 1,
                studentId: 'STU001',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+1-555-0123',
                course: 'PPL',
                status: 'Active',
                admissionStatus: 'Approved',
                admissionDate: '2024-01-15',
                documentsSubmitted: ['ID', 'Medical'],
                notes: 'Excellent candidate'
            },
            {
                id: 2,
                studentId: 'STU002',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@email.com',
                phone: '+1-555-0124',
                course: 'CPL',
                status: 'Active',
                admissionStatus: 'Approved',
                admissionDate: '2024-01-20',
                documentsSubmitted: ['ID', 'Medical', 'Education'],
                notes: 'Strong academic background'
            },
            {
                id: 3,
                studentId: 'STU003',
                firstName: 'Mike',
                lastName: 'Johnson',
                email: 'mike.johnson@email.com',
                phone: '+1-555-0125',
                course: 'ATPL',
                status: 'Applied',
                admissionStatus: 'Pending',
                admissionDate: '2024-02-01',
                documentsSubmitted: ['ID'],
                notes: 'Awaiting medical certificate'
            }
        ];
    }
    
    displayAdmissions();
}

// Display admissions in table
function displayAdmissions() {
    const tbody = document.getElementById('admissionsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    admissions.forEach(admission => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${admission.studentId}</td>
            <td>${admission.firstName} ${admission.lastName}</td>
            <td>${admission.email}</td>
            <td>${admission.phone}</td>
            <td>${admission.course}</td>
            <td><span class="status-badge status-${admission.admissionStatus.toLowerCase()}">${admission.admissionStatus}</span></td>
            <td>${formatDate(admission.admissionDate)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editAdmission(${admission.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="viewAdmission(${admission.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="approveAdmission(${admission.id})" ${admission.admissionStatus === 'Approved' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Setup event listeners
function setupAdmissionEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleAdmissionSearch);
    }
    
    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const courseFilter = document.getElementById('courseFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', handleAdmissionFilter);
    }
    if (courseFilter) {
        courseFilter.addEventListener('change', handleAdmissionFilter);
    }
    
    // Form submission
    const admissionForm = document.getElementById('admissionForm');
    if (admissionForm) {
        admissionForm.addEventListener('submit', handleAdmissionSubmit);
    }
}

// Handle admission search
function handleAdmissionSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredAdmissions = admissions.filter(admission => 
        admission.firstName.toLowerCase().includes(searchTerm) ||
        admission.lastName.toLowerCase().includes(searchTerm) ||
        admission.email.toLowerCase().includes(searchTerm) ||
        admission.studentId.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredAdmissions(filteredAdmissions);
}

// Handle admission filter
function handleAdmissionFilter() {
    const statusFilter = document.getElementById('statusFilter').value;
    const courseFilter = document.getElementById('courseFilter').value;
    
    let filteredAdmissions = admissions;
    
    if (statusFilter) {
        filteredAdmissions = filteredAdmissions.filter(admission => admission.admissionStatus === statusFilter);
    }
    
    if (courseFilter) {
        filteredAdmissions = filteredAdmissions.filter(admission => admission.course === courseFilter);
    }
    
    displayFilteredAdmissions(filteredAdmissions);
}

// Display filtered admissions
function displayFilteredAdmissions(filteredAdmissions) {
    const tbody = document.getElementById('admissionsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredAdmissions.forEach(admission => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${admission.studentId}</td>
            <td>${admission.firstName} ${admission.lastName}</td>
            <td>${admission.email}</td>
            <td>${admission.phone}</td>
            <td>${admission.course}</td>
            <td><span class="status-badge status-${admission.admissionStatus.toLowerCase()}">${admission.admissionStatus}</span></td>
            <td>${formatDate(admission.admissionDate)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editAdmission(${admission.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="viewAdmission(${admission.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="approveAdmission(${admission.id})" ${admission.admissionStatus === 'Approved' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open admission modal
function openAdmissionModal() {
    const modal = document.getElementById('admissionModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('admissionForm');
    
    modalTitle.textContent = 'New Student Admission';
    form.reset();
    editingAdmissionId = null;
    modal.style.display = 'block';
}

// Close admission modal
function closeAdmissionModal() {
    const modal = document.getElementById('admissionModal');
    modal.style.display = 'none';
    editingAdmissionId = null;
}

// Edit admission
function editAdmission(id) {
    const admission = admissions.find(a => a.id === id);
    if (!admission) return;
    
    editingAdmissionId = id;
    
    // Populate form with admission data
    document.getElementById('firstName').value = admission.firstName;
    document.getElementById('lastName').value = admission.lastName;
    document.getElementById('email').value = admission.email;
    document.getElementById('phone').value = admission.phone;
    document.getElementById('dateOfBirth').value = admission.dateOfBirth || '';
    document.getElementById('address').value = admission.address || '';
    document.getElementById('course').value = admission.course;
    document.getElementById('admissionStatus').value = admission.admissionStatus;
    document.getElementById('notes').value = admission.notes || '';
    
    // Check documents
    const documentCheckboxes = document.querySelectorAll('input[name="documents"]');
    documentCheckboxes.forEach(checkbox => {
        checkbox.checked = admission.documentsSubmitted.includes(checkbox.value);
    });
    
    // Update modal title
    document.getElementById('modalTitle').textContent = 'Edit Admission';
    
    // Show modal
    document.getElementById('admissionModal').style.display = 'block';
}

// View admission details
function viewAdmission(id) {
    const admission = admissions.find(a => a.id === id);
    if (!admission) return;
    
    const details = `
        Student ID: ${admission.studentId}
        Name: ${admission.firstName} ${admission.lastName}
        Email: ${admission.email}
        Phone: ${admission.phone}
        Course: ${admission.course}
        Status: ${admission.admissionStatus}
        Admission Date: ${formatDate(admission.admissionDate)}
        Documents: ${admission.documentsSubmitted.join(', ')}
        Notes: ${admission.notes || 'None'}
    `;
    
    alert(details);
}

// Approve admission
async function approveAdmission(id) {
    if (!confirm('Are you sure you want to approve this admission?')) {
        return;
    }
    
    try {
        const admission = admissions.find(a => a.id === id);
        if (admission) {
            admission.admissionStatus = 'Approved';
            admission.status = 'Active';
            displayAdmissions();
            showNotification('Admission approved successfully', 'success');
        }
    } catch (error) {
        console.error('Error approving admission:', error);
        showNotification('Error approving admission', 'error');
    }
}

// Handle admission form submission
async function handleAdmissionSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const documents = Array.from(document.querySelectorAll('input[name="documents"]:checked')).map(cb => cb.value);
    
    const admissionData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dateOfBirth'),
        address: formData.get('address'),
        course: formData.get('course'),
        admissionStatus: formData.get('admissionStatus'),
        documentsSubmitted: documents,
        notes: formData.get('notes')
    };
    
    // Validate form data
    if (!validateAdmissionData(admissionData)) {
        return;
    }
    
    try {
        if (editingAdmissionId) {
            // Update existing admission
            const index = admissions.findIndex(a => a.id === editingAdmissionId);
            if (index !== -1) {
                admissions[index] = { ...admissions[index], ...admissionData };
            }
            showNotification('Admission updated successfully', 'success');
        } else {
            // Add new admission
            const newAdmission = { 
                id: Date.now(), 
                studentId: `STU${String(Date.now()).slice(-3)}`,
                ...admissionData,
                admissionDate: new Date().toISOString().split('T')[0],
                status: 'Applied'
            };
            admissions.unshift(newAdmission);
            showNotification('Admission created successfully', 'success');
        }
        
        closeAdmissionModal();
        displayAdmissions();
    } catch (error) {
        console.error('Error saving admission:', error);
        showNotification('Error saving admission', 'error');
    }
}

// Validate admission data
function validateAdmissionData(data) {
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

// Export functions for global access
window.openAdmissionModal = openAdmissionModal;
window.closeAdmissionModal = closeAdmissionModal;
window.editAdmission = editAdmission;
window.viewAdmission = viewAdmission;
window.approveAdmission = approveAdmission;

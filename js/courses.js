// Courses Management JavaScript

let courses = [];
let instructors = [];

// Initialize courses page
document.addEventListener('DOMContentLoaded', function() {
    // Auth check
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }
    loadCourses();
    loadInstructors();
    setupCourseEventListeners();
});

// Load courses data
async function loadCourses() {
    try {
        // Try to fetch from API first
        const response = await API.get('http://localhost:5000/api/courses');
        courses = response.data || [];
    } catch (error) {
        console.error('Error loading courses:', error);
        // Use mock data for demonstration
        courses = [
            {
                id: 1,
                courseName: 'Private Pilot License',
                courseCode: 'PPL',
                description: 'Learn to fly single-engine aircraft for personal use',
                category: 'Pilot Training',
                duration: 6,
                fee: 15000,
                instructor: 'Captain Smith',
                maxStudents: 20,
                startDate: '2024-03-01',
                status: 'Active',
                enrolledStudents: 15
            },
            {
                id: 2,
                courseName: 'Commercial Pilot License',
                courseCode: 'CPL',
                description: 'Professional pilot training for commercial operations',
                category: 'Pilot Training',
                duration: 12,
                fee: 35000,
                instructor: 'Captain Johnson',
                maxStudents: 15,
                startDate: '2024-04-01',
                status: 'Active',
                enrolledStudents: 12
            },
            {
                id: 3,
                courseName: 'Ground School - Navigation',
                courseCode: 'GS-NAV',
                description: 'Ground school course covering navigation principles',
                category: 'Ground School',
                duration: 3,
                fee: 2500,
                instructor: 'Dr. Sarah Johnson',
                maxStudents: 25,
                startDate: '2024-02-15',
                status: 'Active',
                enrolledStudents: 18
            }
        ];
    }
    
    displayCourses();
}

// Load instructors data
async function loadInstructors() {
    try {
        const response = await API.get('http://localhost:5000/api/faculty');
        instructors = response.data || [];
    } catch (error) {
        console.error('Error loading instructors:', error);
        // Use mock data
        instructors = [
            { id: 1, firstName: 'Captain', lastName: 'Smith' },
            { id: 2, firstName: 'Captain', lastName: 'Johnson' },
            { id: 3, firstName: 'Dr. Sarah', lastName: 'Johnson' }
        ];
    }
    
    populateInstructorSelect();
}

// Display courses in grid
function displayCourses() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <h4>${course.courseName}</h4>
            <div class="course-info">
                <span><strong>Code:</strong> ${course.courseCode}</span>
                <span><strong>Category:</strong> ${course.category}</span>
                <span><strong>Duration:</strong> ${course.duration} months</span>
                <span><strong>Fee:</strong> ${formatCurrency(course.fee)}</span>
                <span><strong>Instructor:</strong> ${course.instructor || 'Not Assigned'}</span>
                <span><strong>Students:</strong> ${course.enrolledStudents}/${course.maxStudents}</span>
                <span><strong>Status:</strong> <span class="status-badge status-${course.status.toLowerCase()}">${course.status}</span></span>
            </div>
            <div class="course-actions">
                <button class="btn btn-sm btn-primary" onclick="editCourse(${course.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        grid.appendChild(courseCard);
    });
}

// Populate instructor select
function populateInstructorSelect() {
    const instructorSelect = document.getElementById('instructor');
    if (!instructorSelect) return;
    
    instructorSelect.innerHTML = '<option value="">Select Instructor</option>';
    instructors.forEach(instructor => {
        const option = document.createElement('option');
        const fullName = `${instructor.firstName} ${instructor.lastName}`;
        option.value = fullName;
        option.textContent = fullName;
        instructorSelect.appendChild(option);
    });
}

// Setup event listeners
function setupCourseEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleCourseSearch);
    }
    
    // Filter functionality
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCourseFilter);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', handleCourseFilter);
    }
    
    // Form submission
    const courseForm = document.getElementById('courseForm');
    if (courseForm) {
        console.log('Setting up course form event listener');
        courseForm.addEventListener('submit', handleCourseSubmit);
    } else {
        console.error('Course form not found!');
    }
}

// Handle course search
function handleCourseSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredCourses = courses.filter(course => 
        course.courseName.toLowerCase().includes(searchTerm) ||
        course.courseCode.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredCourses(filteredCourses);
}

// Handle course filter
function handleCourseFilter() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredCourses = courses;
    
    if (categoryFilter) {
        filteredCourses = filteredCourses.filter(course => course.category === categoryFilter);
    }
    
    if (statusFilter) {
        filteredCourses = filteredCourses.filter(course => course.status === statusFilter);
    }
    
    displayFilteredCourses(filteredCourses);
}

// Display filtered courses
function displayFilteredCourses(filteredCourses) {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    filteredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <h4>${course.courseName}</h4>
            <div class="course-info">
                <span><strong>Code:</strong> ${course.courseCode}</span>
                <span><strong>Category:</strong> ${course.category}</span>
                <span><strong>Duration:</strong> ${course.duration} months</span>
                <span><strong>Fee:</strong> ${formatCurrency(course.fee)}</span>
                <span><strong>Instructor:</strong> ${course.instructor || 'Not Assigned'}</span>
                <span><strong>Students:</strong> ${course.enrolledStudents}/${course.maxStudents}</span>
                <span><strong>Status:</strong> <span class="status-badge status-${course.status.toLowerCase()}">${course.status}</span></span>
            </div>
            <div class="course-actions">
                <button class="btn btn-sm btn-primary" onclick="editCourse(${course.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        grid.appendChild(courseCard);
    });
}

// Open course modal
function openCourseModal() {
    const modal = document.getElementById('courseModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('courseForm');
    
    modalTitle.textContent = 'Add New Course';
    form.reset();
    editingCourseId = null;
    modal.style.display = 'block';
}

// Close course modal
function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    modal.style.display = 'none';
    editingCourseId = null;
}

// Edit course
function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    
    editingCourseId = id;
    
    // Populate form with course data
    document.getElementById('courseName').value = course.courseName;
    document.getElementById('courseCode').value = course.courseCode;
    document.getElementById('description').value = course.description || '';
    document.getElementById('category').value = course.category;
    document.getElementById('duration').value = course.duration;
    document.getElementById('fee').value = course.fee;
    document.getElementById('instructor').value = course.instructor;
    document.getElementById('maxStudents').value = course.maxStudents;
    document.getElementById('startDate').value = course.startDate;
    document.getElementById('status').value = course.status;
    
    // Update modal title
    document.getElementById('modalTitle').textContent = 'Edit Course';
    
    // Show modal
    document.getElementById('courseModal').style.display = 'block';
}

// Delete course
async function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) {
        return;
    }
    
    try {
        await API.delete(`http://localhost:5000/api/courses/${id}`);
        courses = courses.filter(c => c.id !== id);
        displayCourses();
        showNotification('Course deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting course:', error);
        // For demo purposes, remove from local array
        courses = courses.filter(c => c.id !== id);
        displayCourses();
        showNotification('Course deleted successfully', 'success');
    }
}

// Handle course form submission
async function handleCourseSubmit(event) {
    event.preventDefault();
    console.log('Course form submission started');
    
    const formData = new FormData(event.target);
    const courseData = {
        courseName: formData.get('courseName'),
        courseCode: formData.get('courseCode'),
        description: formData.get('description'),
        category: formData.get('category'),
        duration: parseInt(formData.get('duration')),
        fee: parseFloat(formData.get('fee')),
        instructor: formData.get('instructor'),
        maxStudents: parseInt(formData.get('maxStudents')),
        startDate: formData.get('startDate'),
        status: formData.get('status')
    };
    
    // Validate form data
    if (!validateCourseData(courseData)) {
        return;
    }
    
    try {
        if (editingCourseId) {
            // Update existing course
            await API.put(`http://localhost:5000/api/courses/${editingCourseId}`, courseData);
            const index = courses.findIndex(c => c.id === editingCourseId);
            if (index !== -1) {
                courses[index] = { ...courses[index], ...courseData };
            }
            showNotification('Course updated successfully', 'success');
        } else {
            // Add new course
            const response = await API.post('http://localhost:5000/api/courses', courseData);
            const newCourse = { 
                id: Date.now(), 
                ...courseData, 
                enrolledStudents: 0 
            };
            courses.unshift(newCourse);
            showNotification('Course added successfully', 'success');
        }
        
        closeCourseModal();
        displayCourses();
    } catch (error) {
        console.error('Error saving course:', error);
        // For demo purposes, add/update in local array
        if (editingCourseId) {
            const index = courses.findIndex(c => c.id === editingCourseId);
            if (index !== -1) {
                courses[index] = { ...courses[index], ...courseData };
            }
            showNotification('Course updated successfully', 'success');
        } else {
            const newCourse = { 
                id: Date.now(), 
                ...courseData, 
                enrolledStudents: 0 
            };
            courses.unshift(newCourse);
            showNotification('Course added successfully', 'success');
        }
        
        closeCourseModal();
        displayCourses();
    }
}

// Validate course data
function validateCourseData(data) {
    if (!data.courseName.trim()) {
        showNotification('Course name is required', 'error');
        return false;
    }
    
    if (!data.courseCode.trim()) {
        showNotification('Course code is required', 'error');
        return false;
    }
    
    if (!data.category) {
        showNotification('Please select a category', 'error');
        return false;
    }
    
    if (data.duration <= 0) {
        showNotification('Duration must be greater than 0', 'error');
        return false;
    }
    
    if (data.fee < 0) {
        showNotification('Fee cannot be negative', 'error');
        return false;
    }
    
    if (data.maxStudents <= 0) {
        showNotification('Maximum students must be greater than 0', 'error');
        return false;
    }
    
    if (!data.instructor || data.instructor.trim() === '') {
        showNotification('Please select an instructor', 'error');
        return false;
    }
    
    return true;
}

// Export functions for global access
window.openCourseModal = openCourseModal;
window.closeCourseModal = closeCourseModal;
window.editCourse = editCourse;
window.deleteCourse = deleteCourse;

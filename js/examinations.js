// Examination Management JavaScript

let examinations = [];
let editingExamId = null;

// Initialize examinations page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!user || !token) {
        window.location.href = 'login.html';
        return;
    }
    
    loadExaminations();
    setupExamEventListeners();
});

// Load examinations data
async function loadExaminations() {
    try {
        showLoading(document.getElementById('examinationsTableBody'));
        
        // Try to fetch from API first
        const response = await API.get('http://localhost:5000/api/examinations');
        examinations = response.data || [];
    } catch (error) {
        console.error('Error loading examinations:', error);
        // Use mock data for demonstration
        examinations = [
            {
                id: 1,
                examName: 'PPL Theory Exam',
                courseId: 1,
                courseName: 'Private Pilot License',
                examType: 'Theory',
                examDate: '2024-03-15',
                startTime: '09:00',
                endTime: '12:00',
                maxMarks: 100,
                passingMarks: 70,
                instructorId: 1,
                instructorName: 'Captain Smith',
                venue: 'Classroom A',
                instructions: 'Bring calculator and ruler',
                status: 'Scheduled'
            },
            {
                id: 2,
                examName: 'CPL Practical Test',
                courseId: 2,
                courseName: 'Commercial Pilot License',
                examType: 'Practical',
                examDate: '2024-03-20',
                startTime: '10:00',
                endTime: '15:00',
                maxMarks: 100,
                passingMarks: 80,
                instructorId: 1,
                instructorName: 'Captain Smith',
                venue: 'Flight Simulator',
                instructions: 'Wear appropriate flight attire',
                status: 'Scheduled'
            },
            {
                id: 3,
                examName: 'Navigation Oral Exam',
                courseId: 3,
                courseName: 'Ground School - Navigation',
                examType: 'Oral',
                examDate: '2024-03-25',
                startTime: '14:00',
                endTime: '16:00',
                maxMarks: 50,
                passingMarks: 35,
                instructorId: 2,
                instructorName: 'Dr. Sarah Johnson',
                venue: 'Office 101',
                instructions: 'Bring navigation charts',
                status: 'Completed'
            }
        ];
    }
    
    displayExaminations();
}

// Display examinations in table
function displayExaminations() {
    const tbody = document.getElementById('examinationsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    examinations.forEach(exam => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exam.examName}</td>
            <td>${exam.courseName || `Course ${exam.courseId}`}</td>
            <td><span class="exam-type-badge exam-type-${exam.examType.toLowerCase()}">${exam.examType}</span></td>
            <td>${formatDate(exam.examDate)}</td>
            <td>${exam.startTime}${exam.endTime ? ` - ${exam.endTime}` : ''}</td>
            <td>${exam.venue || 'TBD'}</td>
            <td><span class="status-badge status-${exam.status.toLowerCase().replace(' ', '-')}">${exam.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editExam(${exam.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="viewExam(${exam.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="startExam(${exam.id})" ${exam.status === 'Completed' ? 'disabled' : ''}>
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteExam(${exam.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Setup event listeners
function setupExamEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleExamSearch);
    }
    
    // Filter functionality
    const examTypeFilter = document.getElementById('examTypeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (examTypeFilter) {
        examTypeFilter.addEventListener('change', handleExamFilter);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', handleExamFilter);
    }
    
    // Form submission
    const examForm = document.getElementById('examForm');
    if (examForm) {
        examForm.addEventListener('submit', handleExamSubmit);
    }
}

// Handle exam search
function handleExamSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredExams = examinations.filter(exam => 
        exam.examName.toLowerCase().includes(searchTerm) ||
        (exam.courseName && exam.courseName.toLowerCase().includes(searchTerm)) ||
        exam.venue.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredExams(filteredExams);
}

// Handle exam filter
function handleExamFilter() {
    const examTypeFilter = document.getElementById('examTypeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredExams = examinations;
    
    if (examTypeFilter) {
        filteredExams = filteredExams.filter(exam => exam.examType === examTypeFilter);
    }
    
    if (statusFilter) {
        filteredExams = filteredExams.filter(exam => exam.status === statusFilter);
    }
    
    displayFilteredExams(filteredExams);
}

// Display filtered exams
function displayFilteredExams(filteredExams) {
    const tbody = document.getElementById('examinationsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredExams.forEach(exam => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exam.examName}</td>
            <td>${exam.courseName || `Course ${exam.courseId}`}</td>
            <td><span class="exam-type-badge exam-type-${exam.examType.toLowerCase()}">${exam.examType}</span></td>
            <td>${formatDate(exam.examDate)}</td>
            <td>${exam.startTime}${exam.endTime ? ` - ${exam.endTime}` : ''}</td>
            <td>${exam.venue || 'TBD'}</td>
            <td><span class="status-badge status-${exam.status.toLowerCase().replace(' ', '-')}">${exam.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editExam(${exam.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="viewExam(${exam.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="startExam(${exam.id})" ${exam.status === 'Completed' ? 'disabled' : ''}>
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteExam(${exam.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Open exam modal
function openExamModal() {
    const modal = document.getElementById('examModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('examForm');
    
    modalTitle.textContent = 'Schedule Examination';
    form.reset();
    editingExamId = null;
    modal.style.display = 'block';
}

// Close exam modal
function closeExamModal() {
    const modal = document.getElementById('examModal');
    modal.style.display = 'none';
    editingExamId = null;
}

// Edit exam
function editExam(id) {
    const exam = examinations.find(e => e.id === id);
    if (!exam) return;
    
    editingExamId = id;
    
    // Populate form with exam data
    document.getElementById('examName').value = exam.examName;
    document.getElementById('courseId').value = exam.courseId;
    document.getElementById('examType').value = exam.examType;
    document.getElementById('examDate').value = exam.examDate;
    document.getElementById('startTime').value = exam.startTime;
    document.getElementById('endTime').value = exam.endTime || '';
    document.getElementById('maxMarks').value = exam.maxMarks;
    document.getElementById('passingMarks').value = exam.passingMarks;
    document.getElementById('instructorId').value = exam.instructorId || '';
    document.getElementById('venue').value = exam.venue || '';
    document.getElementById('instructions').value = exam.instructions || '';
    
    // Update modal title
    document.getElementById('modalTitle').textContent = 'Edit Examination';
    
    // Show modal
    document.getElementById('examModal').style.display = 'block';
}

// View exam details
function viewExam(id) {
    const exam = examinations.find(e => e.id === id);
    if (!exam) return;
    
    const details = `
        Exam Name: ${exam.examName}
        Course: ${exam.courseName || `Course ${exam.courseId}`}
        Type: ${exam.examType}
        Date: ${formatDate(exam.examDate)}
        Time: ${exam.startTime}${exam.endTime ? ` - ${exam.endTime}` : ''}
        Venue: ${exam.venue || 'TBD'}
        Max Marks: ${exam.maxMarks}
        Passing Marks: ${exam.passingMarks}
        Instructor: ${exam.instructorName || 'TBD'}
        Instructions: ${exam.instructions || 'None'}
        Status: ${exam.status}
    `;
    
    alert(details);
}

// Start exam
async function startExam(id) {
    if (!confirm('Are you sure you want to start this examination?')) {
        return;
    }
    
    try {
        const exam = examinations.find(e => e.id === id);
        if (exam) {
            exam.status = 'In Progress';
            displayExaminations();
            showNotification('Examination started successfully', 'success');
        }
    } catch (error) {
        console.error('Error starting exam:', error);
        showNotification('Error starting examination', 'error');
    }
}

// Delete exam
async function deleteExam(id) {
    if (!confirm('Are you sure you want to delete this examination?')) {
        return;
    }
    
    try {
        examinations = examinations.filter(e => e.id !== id);
        displayExaminations();
        showNotification('Examination deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting exam:', error);
        showNotification('Error deleting examination', 'error');
    }
}

// Handle exam form submission
async function handleExamSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    const examData = {
        examName: formData.get('examName'),
        courseId: parseInt(formData.get('courseId')),
        examType: formData.get('examType'),
        examDate: formData.get('examDate'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        maxMarks: parseInt(formData.get('maxMarks')),
        passingMarks: parseInt(formData.get('passingMarks')),
        instructorId: formData.get('instructorId') ? parseInt(formData.get('instructorId')) : null,
        venue: formData.get('venue'),
        instructions: formData.get('instructions')
    };
    
    // Validate form data
    if (!validateExamData(examData)) {
        return;
    }
    
    try {
        if (editingExamId) {
            // Update existing exam
            const index = examinations.findIndex(e => e.id === editingExamId);
            if (index !== -1) {
                examinations[index] = { ...examinations[index], ...examData };
            }
            showNotification('Examination updated successfully', 'success');
        } else {
            // Add new exam
            const newExam = { 
                id: Date.now(), 
                ...examData,
                status: 'Scheduled',
                courseName: getCourseName(examData.courseId),
                instructorName: getInstructorName(examData.instructorId)
            };
            examinations.unshift(newExam);
            showNotification('Examination scheduled successfully', 'success');
        }
        
        closeExamModal();
        displayExaminations();
    } catch (error) {
        console.error('Error saving exam:', error);
        showNotification('Error saving examination', 'error');
    }
}

// Validate exam data
function validateExamData(data) {
    if (!data.examName.trim()) {
        showNotification('Exam name is required', 'error');
        return false;
    }
    
    if (!data.courseId) {
        showNotification('Please select a course', 'error');
        return false;
    }
    
    if (!data.examType) {
        showNotification('Please select exam type', 'error');
        return false;
    }
    
    if (!data.examDate) {
        showNotification('Exam date is required', 'error');
        return false;
    }
    
    if (!data.startTime) {
        showNotification('Start time is required', 'error');
        return false;
    }
    
    if (data.maxMarks <= 0) {
        showNotification('Max marks must be greater than 0', 'error');
        return false;
    }
    
    if (data.passingMarks <= 0 || data.passingMarks > data.maxMarks) {
        showNotification('Passing marks must be between 1 and max marks', 'error');
        return false;
    }
    
    return true;
}

// Helper functions
function getCourseName(courseId) {
    const courses = {
        1: 'Private Pilot License',
        2: 'Commercial Pilot License',
        3: 'Ground School - Navigation'
    };
    return courses[courseId] || `Course ${courseId}`;
}

function getInstructorName(instructorId) {
    const instructors = {
        1: 'Captain Smith',
        2: 'Dr. Sarah Johnson',
        3: 'Mike Wilson'
    };
    return instructors[instructorId] || 'TBD';
}

// Export functions for global access
window.openExamModal = openExamModal;
window.closeExamModal = closeExamModal;
window.editExam = editExam;
window.viewExam = viewExam;
window.startExam = startExam;
window.deleteExam = deleteExam;

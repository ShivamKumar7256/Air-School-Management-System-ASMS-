// Reports and Analytics JavaScript

let reportData = {};
let charts = {};

// Initialize reports page
document.addEventListener('DOMContentLoaded', function() {
    loadReportData();
    setupReportEventListeners();
    initializeCharts();
});

// Load report data
async function loadReportData() {
    try {
        const response = await API.get('/api/reports');
        reportData = response.data || {};
    } catch (error) {
        console.error('Error loading report data:', error);
        // Use mock data for demonstration
        reportData = {
            totalStudents: 150,
            activeCourses: 8,
            monthlyRevenue: 125000,
            avgAttendance: 85,
            enrollmentTrend: [
                { month: 'Jan', students: 120 },
                { month: 'Feb', students: 135 },
                { month: 'Mar', students: 150 },
                { month: 'Apr', students: 145 },
                { month: 'May', students: 160 },
                { month: 'Jun', students: 175 }
            ],
            revenueData: [
                { month: 'Jan', revenue: 100000, expenses: 80000 },
                { month: 'Feb', revenue: 110000, expenses: 85000 },
                { month: 'Mar', revenue: 125000, expenses: 90000 },
                { month: 'Apr', revenue: 120000, expenses: 88000 },
                { month: 'May', revenue: 135000, expenses: 95000 },
                { month: 'Jun', revenue: 140000, expenses: 100000 }
            ],
            courseData: [
                { course: 'PPL', students: 60 },
                { course: 'CPL', students: 45 },
                { course: 'ATPL', students: 30 },
                { course: 'Ground School', students: 15 }
            ],
            attendanceData: [
                { month: 'Jan', attendance: 88 },
                { month: 'Feb', attendance: 85 },
                { month: 'Mar', attendance: 87 },
                { month: 'Apr', attendance: 83 },
                { month: 'May', attendance: 89 },
                { month: 'Jun', attendance: 86 }
            ]
        };
    }
    
    updateReportCards();
    updateCharts();
}

// Setup event listeners
function setupReportEventListeners() {
    // Report type change
    const reportTypeSelect = document.getElementById('reportType');
    if (reportTypeSelect) {
        reportTypeSelect.addEventListener('change', updateReportFilters);
    }
    
    // Generate report button
    const generateBtn = document.querySelector('button[onclick="loadReport()"]');
    if (generateBtn) {
        generateBtn.addEventListener('click', loadReport);
    }
}

// Update report cards
function updateReportCards() {
    document.getElementById('totalStudents').textContent = reportData.totalStudents || 0;
    document.getElementById('activeCourses').textContent = reportData.activeCourses || 0;
    document.getElementById('monthlyRevenue').textContent = formatCurrency(reportData.monthlyRevenue || 0);
    document.getElementById('avgAttendance').textContent = (reportData.avgAttendance || 0) + '%';
}

// Initialize charts
function initializeCharts() {
    // Enrollment Chart
    const enrollmentCtx = document.getElementById('enrollmentChart');
    if (enrollmentCtx) {
        charts.enrollment = new Chart(enrollmentCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Student Enrollment',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Finance Chart
    const financeCtx = document.getElementById('financeChart');
    if (financeCtx) {
        charts.finance = new Chart(financeCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [],
                        backgroundColor: '#28a745'
                    },
                    {
                        label: 'Expenses',
                        data: [],
                        backgroundColor: '#dc3545'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Course Chart
    const courseCtx = document.getElementById('courseChart');
    if (courseCtx) {
        charts.course = new Chart(courseCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#667eea',
                        '#f093fb',
                        '#4facfe',
                        '#43e97b'
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });
    }
    
    // Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        charts.attendance = new Chart(attendanceCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Attendance %',
                    data: [],
                    borderColor: '#f093fb',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// Update charts with data
function updateCharts() {
    // Update enrollment chart
    if (charts.enrollment && reportData.enrollmentTrend) {
        charts.enrollment.data.labels = reportData.enrollmentTrend.map(item => item.month);
        charts.enrollment.data.datasets[0].data = reportData.enrollmentTrend.map(item => item.students);
        charts.enrollment.update();
    }
    
    // Update finance chart
    if (charts.finance && reportData.revenueData) {
        charts.finance.data.labels = reportData.revenueData.map(item => item.month);
        charts.finance.data.datasets[0].data = reportData.revenueData.map(item => item.revenue);
        charts.finance.data.datasets[1].data = reportData.revenueData.map(item => item.expenses);
        charts.finance.update();
    }
    
    // Update course chart
    if (charts.course && reportData.courseData) {
        charts.course.data.labels = reportData.courseData.map(item => item.course);
        charts.course.data.datasets[0].data = reportData.courseData.map(item => item.students);
        charts.course.update();
    }
    
    // Update attendance chart
    if (charts.attendance && reportData.attendanceData) {
        charts.attendance.data.labels = reportData.attendanceData.map(item => item.month);
        charts.attendance.data.datasets[0].data = reportData.attendanceData.map(item => item.attendance);
        charts.attendance.update();
    }
}

// Update report filters
function updateReportFilters() {
    const reportType = document.getElementById('reportType').value;
    
    // Hide all report sections
    const reportSections = document.querySelectorAll('.report-section');
    reportSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected report section
    const selectedSection = document.getElementById(reportType + 'Report');
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update report based on type
    switch (reportType) {
        case 'overview':
            updateOverviewReport();
            break;
        case 'students':
            updateStudentReport();
            break;
        case 'attendance':
            updateAttendanceReport();
            break;
        case 'finance':
            updateFinanceReport();
            break;
        case 'courses':
            updateCourseReport();
            break;
    }
}

// Update overview report
function updateOverviewReport() {
    // Overview report is already updated in updateReportCards()
}

// Update student report
function updateStudentReport() {
    const tableBody = document.getElementById('studentReportTable');
    if (!tableBody) return;
    
    // Mock student performance data
    const studentPerformance = [
        { id: 1, name: 'John Doe', course: 'PPL', attendance: 95, progress: 80, status: 'Active' },
        { id: 2, name: 'Jane Smith', course: 'CPL', attendance: 88, progress: 65, status: 'Active' },
        { id: 3, name: 'Mike Johnson', course: 'ATPL', attendance: 92, progress: 90, status: 'Active' }
    ];
    
    tableBody.innerHTML = '';
    studentPerformance.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.attendance}%</td>
            <td>${student.progress}%</td>
            <td><span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Update attendance report
function updateAttendanceReport() {
    document.getElementById('overallAttendance').textContent = (reportData.avgAttendance || 0) + '%';
    document.getElementById('bestCourse').textContent = 'PPL';
    document.getElementById('absentStudents').textContent = '5';
}

// Update finance report
function updateFinanceReport() {
    const totalRevenue = reportData.monthlyRevenue || 0;
    const totalExpenses = 100000; // Mock data
    const netProfit = totalRevenue - totalExpenses;
    const outstandingFees = 25000; // Mock data
    
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('netProfit').textContent = formatCurrency(netProfit);
    document.getElementById('outstandingFees').textContent = formatCurrency(outstandingFees);
}

// Update course report
function updateCourseReport() {
    document.getElementById('popularCourse').textContent = 'PPL';
    document.getElementById('completionRate').textContent = '85%';
    document.getElementById('avgDuration').textContent = '8 months';
}

// Load report based on filters
function loadReport() {
    const reportType = document.getElementById('reportType').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    // Simulate loading report with filters
    showNotification('Generating report...', 'info');
    
    setTimeout(() => {
        updateReportFilters();
        showNotification('Report generated successfully', 'success');
    }, 1000);
}

// Generate report
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    // Create report data
    const reportData = {
        type: reportType,
        dateFrom: dateFrom,
        dateTo: dateTo,
        generatedAt: new Date().toISOString()
    };
    
    // Simulate report generation
    showNotification('Generating report...', 'info');
    
    setTimeout(() => {
        // In a real application, this would generate a PDF or Excel file
        showNotification('Report generated successfully', 'success');
        
        // Create a download link (mock)
        const link = document.createElement('a');
        link.href = '#';
        link.download = `report_${reportType}_${dateFrom}_to_${dateTo}.pdf`;
        link.click();
    }, 2000);
}

// Export data
function exportData() {
    const reportType = document.getElementById('reportType').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    // Simulate data export
    showNotification('Exporting data...', 'info');
    
    setTimeout(() => {
        // In a real application, this would export to CSV or Excel
        showNotification('Data exported successfully', 'success');
        
        // Create a download link (mock)
        const link = document.createElement('a');
        link.href = '#';
        link.download = `data_${reportType}_${dateFrom}_to_${dateTo}.csv`;
        link.click();
    }, 1500);
}

// Export functions for global access
window.loadReport = loadReport;
window.generateReport = generateReport;
window.exportData = exportData;

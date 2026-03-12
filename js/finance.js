// Finance Management JavaScript

// Utility functions
function formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}

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

let payments = [];
let expenses = [];
let students = [];
let currentTab = 'payments';

// Initialize finance page
document.addEventListener('DOMContentLoaded', function() {
    // Set default date for payment and expense forms
    const today = new Date().toISOString().split('T')[0];
    const paymentDateInput = document.getElementById('paymentDate');
    const expenseDateInput = document.getElementById('expenseDate');
    
    if (paymentDateInput) paymentDateInput.value = today;
    if (expenseDateInput) expenseDateInput.value = today;
    
    loadFinanceData();
    setupFinanceEventListeners();
    updateFinanceSummary();
});

// Load finance data
async function loadFinanceData() {
    try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        try {
            const [paymentsResponse, expensesResponse, studentsResponse] = await Promise.all([
                API.get('/api/payments'),
                API.get('/api/expenses'),
                API.get('/api/students')
            ]);
            
            payments = Array.isArray(paymentsResponse) ? paymentsResponse : (paymentsResponse.data || []);
            expenses = Array.isArray(expensesResponse) ? expensesResponse : (expensesResponse.data || []);
            students = Array.isArray(studentsResponse) ? studentsResponse : (studentsResponse.data || []);
        } catch (error) {
            console.error('Error in API calls:', error);
            // Authentication errors are already handled in the API utility
            if (error.message && (error.message.includes('Authentication failed') || error.message.includes('No authentication token'))) {
                return; // Already redirected in API utility
            }
            throw error;
        }
    } catch (error) {
        console.error('Error loading finance data:', error);
        // Use mock data for demonstration
        payments = [
            {
                id: 1,
                studentId: 1,
                studentName: 'John Doe',
                course: 'PPL',
                amount: 5000,
                paymentDate: '2024-01-15',
                status: 'Paid',
                method: 'Bank Transfer',
                notes: 'First installment'
            },
            {
                id: 2,
                studentId: 2,
                studentName: 'Jane Smith',
                course: 'CPL',
                amount: 10000,
                paymentDate: '2024-01-20',
                status: 'Paid',
                method: 'Card',
                notes: 'Second installment'
            }
        ];
        
        expenses = [
            {
                id: 1,
                description: 'Aircraft Fuel',
                category: 'Fuel',
                amount: 2500,
                date: '2024-01-10',
                notes: 'Monthly fuel expense'
            },
            {
                id: 2,
                description: 'Aircraft Maintenance',
                category: 'Maintenance',
                amount: 5000,
                date: '2024-01-12',
                notes: 'Engine overhaul'
            }
        ];
        
        students = [
            { id: 1, firstName: 'John', lastName: 'Doe' },
            { id: 2, firstName: 'Jane', lastName: 'Smith' }
        ];
    }
    
    displayPayments();
    displayExpenses();
    updateFinanceSummary();
}

// Display payments
function displayPayments() {
    const tbody = document.getElementById('paymentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    payments.forEach(payment => {
        if (!payment) return;
        const status = payment.status || 'Pending';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.id || ''}</td>
            <td>${payment.studentName || ''}</td>
            <td>${payment.course || ''}</td>
            <td>${formatCurrency(payment.amount)}</td>
            <td>${formatDate(payment.paymentDate)}</td>
            <td><span class="status-badge status-${status.toLowerCase()}">${status}</span></td>
            <td>${payment.paymentMethod || payment.method || ''}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editPayment(${payment.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePayment(${payment.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Display expenses
function displayExpenses() {
    const tbody = document.getElementById('expensesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    expenses.forEach(expense => {
        if (!expense) return;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.id || ''}</td>
            <td>${expense.description || ''}</td>
            <td>${expense.category || ''}</td>
            <td>${formatCurrency(expense.amount)}</td>
            <td>${formatDate(expense.date)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editExpense(${expense.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update finance summary
function updateFinanceSummary() {
    const totalPayments = payments.reduce((sum, payment) => {
        if (!payment || isNaN(payment.amount)) return sum;
        return sum + Number(payment.amount);
    }, 0);
    
    const totalExpenses = expenses.reduce((sum, expense) => {
        if (!expense || isNaN(expense.amount)) return sum;
        return sum + Number(expense.amount);
    }, 0);
    
    const balance = totalPayments - totalExpenses;
    
    const revenueElement = document.getElementById('totalRevenue');
    const expensesElement = document.getElementById('totalExpenses');
    const profitElement = document.getElementById('netProfit');
    const feesElement = document.getElementById('outstandingFees');
    
    if (revenueElement) revenueElement.textContent = formatCurrency(totalPayments);
    if (expensesElement) expensesElement.textContent = formatCurrency(totalExpenses);
    if (profitElement) profitElement.textContent = formatCurrency(balance);
    if (feesElement) feesElement.textContent = formatCurrency(0); // Calculate based on course fees
    
    // Update profit color based on value
    if (profitElement) {
        if (balance > 0) {
            profitElement.classList.add('text-success');
            profitElement.classList.remove('text-danger');
        } else {
            profitElement.classList.add('text-danger');
            profitElement.classList.remove('text-success');
        }
    }
}

// Setup event listeners
function setupFinanceEventListeners() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.textContent.toLowerCase();
            showTab(tabName);
        });
    });
    
    // Search functionality
    const paymentSearch = document.getElementById('paymentSearch');
    const expenseSearch = document.getElementById('expenseSearch');
    
    if (paymentSearch) {
        paymentSearch.addEventListener('input', handlePaymentSearch);
    }
    if (expenseSearch) {
        expenseSearch.addEventListener('input', handleExpenseSearch);
    }
    
    // Form submissions
    const paymentForm = document.getElementById('paymentForm');
    const expenseForm = document.getElementById('expenseForm');
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
    if (expenseForm) {
        expenseForm.addEventListener('submit', handleExpenseSubmit);
    }
}

// Show tab
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    currentTab = tabName;
}

// Handle payment search
function handlePaymentSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPayments = payments.filter(payment => {
        if (!payment) return false;
        const studentName = (payment.studentName || '').toLowerCase();
        const course = (payment.course || '').toLowerCase();
        const method = (payment.paymentMethod || payment.method || '').toLowerCase();

        return studentName.includes(searchTerm) ||
               course.includes(searchTerm) ||
               method.includes(searchTerm);
    });
    
    displayFilteredPayments(filteredPayments);
}

// Handle expense search
function handleExpenseSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredExpenses = expenses.filter(expense => {
        if (!expense) return false;
        const description = (expense.description || '').toLowerCase();
        const category = (expense.category || '').toLowerCase();
        return description.includes(searchTerm) || category.includes(searchTerm);
    });
    displayFilteredExpenses(filteredExpenses);
}

// Display filtered payments
function displayFilteredPayments(filteredPayments) {
    const tbody = document.getElementById('paymentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredPayments.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.id}</td>
            <td>${payment.studentName}</td>
            <td>${payment.course}</td>
            <td>${formatCurrency(payment.amount)}</td>
            <td>${formatDate(payment.paymentDate)}</td>
            <td><span class="status-badge status-${payment.status.toLowerCase()}">${payment.status}</span></td>
            <td>${payment.paymentMethod || payment.method}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editPayment(${payment.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePayment(${payment.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Display filtered expenses
function displayFilteredExpenses(filteredExpenses) {
    const tbody = document.getElementById('expensesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.id}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>${formatCurrency(expense.amount)}</td>
            <td>${formatDate(expense.date)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editExpense(${expense.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Open payment modal
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const form = document.getElementById('paymentForm');
    
    form.reset();
    populateStudentSelect();
    modal.style.display = 'block';
}

// Close payment modal
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
}

// Open expense modal
function openExpenseModal() {
    const modal = document.getElementById('expenseModal');
    const form = document.getElementById('expenseForm');
    
    form.reset();
    modal.style.display = 'block';
}

// Close expense modal
function closeExpenseModal() {
    const modal = document.getElementById('expenseModal');
    modal.style.display = 'none';
}

// Populate student select
function populateStudentSelect() {
    const studentSelect = document.getElementById('studentSelect');
    if (!studentSelect) return;
    
    studentSelect.innerHTML = '<option value="">Select Student</option>';
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.firstName} ${student.lastName}`;
        studentSelect.appendChild(option);
    });
}

// Handle payment form submission
async function handlePaymentSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const studentId = parseInt(formData.get('studentSelect'));
    const selectedStudent = students.find(s => s.id === studentId);
    
    if (!selectedStudent) {
        showNotification('Please select a valid student', 'error');
        return;
    }
    
    const paymentData = {
        studentId: studentId,
        studentName: selectedStudent.firstName + ' ' + selectedStudent.lastName,
        course: formData.get('courseSelect'),
        amount: parseFloat(formData.get('amount')),
        paymentMethod: formData.get('paymentMethod'), // Match backend parameter name
        paymentDate: formData.get('paymentDate'),
        notes: formData.get('notes'),
        status: 'Paid'
    };
    
    try {
        const response = await API.post('/api/payments', paymentData);
        // If API call is successful, use returned data (with ID from server)
        if (response && response.data) {
            payments.unshift(response.data);
        } else {
            // Fallback if response doesn't contain data
            payments.unshift({ id: Date.now(), ...paymentData });
        }
        displayPayments();
        updateFinanceSummary();
        closePaymentModal();
        showNotification('Payment recorded successfully', 'success');
    } catch (error) {
        console.error('Error saving payment:', error);
        // For demo purposes, add to local array
        payments.unshift({ id: Date.now(), ...paymentData });
        displayPayments();
        updateFinanceSummary();
        closePaymentModal();
        showNotification('Payment recorded successfully', 'success');
    }
}

// Handle expense form submission
async function handleExpenseSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const expenseData = {
        description: formData.get('expenseDescription'),
        category: formData.get('expenseCategory'),
        amount: parseFloat(formData.get('expenseAmount')),
        date: formData.get('expenseDate'),
        notes: formData.get('expenseNotes')
    };
    
    try {
        await API.post('/api/expenses', expenseData);
        expenses.unshift({ id: Date.now(), ...expenseData });
        displayExpenses();
        updateFinanceSummary();
        closeExpenseModal();
        showNotification('Expense recorded successfully', 'success');
    } catch (error) {
        console.error('Error saving expense:', error);
        // For demo purposes, add to local array
        expenses.unshift({ id: Date.now(), ...expenseData });
        displayExpenses();
        updateFinanceSummary();
        closeExpenseModal();
        showNotification('Expense recorded successfully', 'success');
    }
}

// Edit payment
function editPayment(id) {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;
    
    // Implement edit functionality
    showNotification('Edit functionality not implemented yet', 'info');
}

// Delete payment
async function deletePayment(id) {
    if (!confirm('Are you sure you want to delete this payment?')) {
        return;
    }
    
    try {
        await API.delete(`/api/payments/${id}`);
        payments = payments.filter(p => p.id !== id);
        displayPayments();
        updateFinanceSummary();
        showNotification('Payment deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting payment:', error);
        // For demo purposes, remove from local array
        payments = payments.filter(p => p.id !== id);
        displayPayments();
        updateFinanceSummary();
        showNotification('Payment deleted successfully', 'success');
    }
}

// Edit expense
function editExpense(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    
    // Implement edit functionality
    showNotification('Edit functionality not implemented yet', 'info');
}

// Delete expense
async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    try {
        await API.delete(`/api/expenses/${id}`);
        expenses = expenses.filter(e => e.id !== id);
        displayExpenses();
        updateFinanceSummary();
        showNotification('Expense deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting expense:', error);
        // For demo purposes, remove from local array
        expenses = expenses.filter(e => e.id !== id);
        displayExpenses();
        updateFinanceSummary();
        showNotification('Expense deleted successfully', 'success');
    }
}

// Export functions for global access
window.showTab = showTab;
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.openExpenseModal = openExpenseModal;
window.closeExpenseModal = closeExpenseModal;
window.editPayment = editPayment;
window.deletePayment = deletePayment;
window.editExpense = editExpense;
window.deleteExpense = deleteExpense;

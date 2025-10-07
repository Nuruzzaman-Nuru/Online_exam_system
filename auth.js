// Authentication System

class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.ADMIN_CODE = 'ADMIN123'; // In a real app, this would be server-side

        // Create default admin if none exists
        if (!this.users.find(u => u.role === 'admin')) {
            this.users.push({
                id: 'admin-' + Date.now(),
                username: 'admin',
                password: 'admin123', // In a real app, this would be hashed
                role: 'admin',
                fullName: 'System Admin',
                email: 'admin@system.com',
                active: true
            });
            this.saveUsers();
        }
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    signup(userData) {
        // Validate required fields
        if (!userData.username || !userData.password || !userData.fullName || !userData.email) {
            throw new Error('All required fields must be filled');
        }

        // Check if username already exists
        if (this.users.find(u => u.username === userData.username)) {
            throw new Error('Username already exists');
        }

        // Create new user object
        const newUser = {
            id: this.generateId(),
            username: userData.username,
            password: userData.password, // In a real app, this would be hashed
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role || 'student',
            mobile: userData.mobile || '',
            address: userData.address || '',
            active: true,
            createdAt: new Date().toISOString()
        };

        // Add to users array and save
        this.users.push(newUser);
        this.saveUsers();

        return newUser;
    }

    login(username, password, adminCode = '') {
        // Find user
        const user = this.users.find(u => u.username === username);
        
        if (!user) {
            throw new Error('User not found');
        }

        // Check password
        if (user.password !== password) { // In a real app, would use proper password comparison
            throw new Error('Invalid password');
        }

        // Check if user is active
        if (!user.active) {
            throw new Error('Account is inactive. Please contact administrator.');
        }

        // For admin login, verify admin code
        if (user.role === 'admin' && adminCode !== this.ADMIN_CODE) {
            throw new Error('Invalid admin access code');
        }

        // Set current user
        this.currentUser = {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            email: user.email
        };

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    isTeacher() {
        return this.currentUser?.role === 'teacher';
    }

    isStudent() {
        return this.currentUser?.role === 'student';
    }

    updateUser(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) throw new Error('User not found');

        // Don't allow updating critical fields directly
        delete updates.id;
        delete updates.createdAt;

        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        this.saveUsers();

        // If updating current user, refresh currentUser
        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = {
                id: this.users[userIndex].id,
                username: this.users[userIndex].username,
                fullName: this.users[userIndex].fullName,
                role: this.users[userIndex].role,
                email: this.users[userIndex].email
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }

        return this.users[userIndex];
    }

    deleteUser(userId) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) throw new Error('User not found');

        // Don't allow deleting the last admin
        if (this.users[userIndex].role === 'admin' && 
            this.users.filter(u => u.role === 'admin').length === 1) {
            throw new Error('Cannot delete the last admin user');
        }

        this.users.splice(userIndex, 1);
        this.saveUsers();
    }

    getUsers() {
        return this.users.map(u => ({
            ...u,
            password: undefined // Don't expose passwords
        }));
    }
}

// Initialize auth instance
const auth = new Auth();

// UI Functions
function toggleAuth() {
    const authModal = document.getElementById('authModal');
    authModal.classList.toggle('hidden');
}

function showAuthTab(tab) {
    // Hide all forms
    document.querySelectorAll('#loginForm, #adminLoginForm, #signupForm').forEach(form => {
        form.classList.add('hidden');
    });

    // Show selected form
    const formId = tab === 'admin-login' ? 'adminLoginForm' : `${tab}Form`;
    const selectedForm = document.getElementById(formId);
    if (selectedForm) {
        selectedForm.classList.remove('hidden');
    }

    // Update tab styling
    document.querySelectorAll('.auth-tabs button').forEach(button => {
        if (button.textContent.toLowerCase().includes(tab)) {
            button.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
            button.classList.remove('text-gray-500');
        } else {
            button.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
            button.classList.add('text-gray-500');
        }
    });
}

function handleLoginSubmit() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validate inputs
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    try {
        const user = auth.login(username, password);
        toggleAuth(); // Close the modal

        // Redirect based on user role
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (user.role === 'teacher') {
            window.location.href = 'teacher-dashboard.html';
        } else {
            window.location.href = 'student-dashboard.html';
        }
    } catch (error) {
        alert(error.message);
    }
}

function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const adminCode = document.getElementById('adminCode').value.trim();

    // Validate inputs
    if (!username || !password || !adminCode) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const user = auth.login(username, password, adminCode);
        if (user.role !== 'admin') {
            throw new Error('Access denied: Not an admin account');
        }
        toggleAuth(); // Close the modal
        window.location.href = 'admin-dashboard.html';
    } catch (error) {
        alert(error.message);
    }
}

function handleSignup() {
    const fullName = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('userRole').value;

    // Validate inputs
    if (!fullName || !email || !password || !role) {
        alert('Please fill in all required fields');
        return;
    }

    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
        alert('Please enter a valid email address');
        return;
    }

    try {
        const userData = {
            fullName,
            username: email,
            email,
            password,
            role,
            mobile: '',
            address: ''
        };

        const newUser = auth.signup(userData);

        // Show credentials in a popup
        const credentialsHtml = `
            <div class="credentials-popup">
                <h3>✅ Account Created Successfully!</h3>
                <div class="credentials-box">
                    <p class="mb-3"><strong>Your Login Credentials:</strong></p>
                    <div class="credential-item">
                        <span>Username:</span>
                        <code>${email}</code>
                        <button class="copy-btn" onclick="copyToClipboard('${email}')">Copy</button>
                    </div>
                    <div class="credential-item">
                        <span>Password:</span>
                        <code>${password}</code>
                        <button class="copy-btn" onclick="copyToClipboard('${password}')">Copy</button>
                    </div>
                </div>
                <p class="save-note">Please save these credentials securely!</p>
                <button onclick="closeCredentialsAndLogin()" class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full">
                    Got it! Let me login
                </button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = credentialsHtml;
        document.body.appendChild(overlay);

    } catch (error) {
        alert(error.message);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            // Show a brief success message near the button
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = originalText, 1500);
        })
        .catch(() => alert('Failed to copy text'));
}

function closeCredentialsAndLogin() {
    // Remove the credentials overlay
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.remove();
    }
    // Switch to login tab
    showAuthTab('login');
}

function handleLogout() {
    auth.logout();
    window.location.href = 'index.html';
}

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = auth.getCurrentUser();
    const authButtons = document.getElementById('authButtons');
    
    if (currentUser) {
        // User is logged in
        if (currentUser.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (currentUser.role === 'teacher') {
            window.location.href = 'teacher-dashboard.html';
        } else if (currentUser.role === 'student') {
            window.location.href = 'student-dashboard.html';
        }
        
        // Show logout button, hide login button
        if (authButtons) {
            authButtons.querySelector('button:first-child').classList.add('hidden');
            authButtons.querySelector('button:last-child').classList.remove('hidden');
        }
    } else {
        // User is not logged in
        if (authButtons) {
            authButtons.querySelector('button:first-child').classList.remove('hidden');
            authButtons.querySelector('button:last-child').classList.add('hidden');
        }
    }
});
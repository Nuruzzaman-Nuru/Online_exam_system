// Authentication handling
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.initializeAdminAccount();
        this.setupEventListeners();
    }

    initializeAdminAccount() {
        // Ensure an admin account exists for admin login/testing
        if (!this.users.some(u => u.role === 'admin')) {
            const admin = {
                id: 'admin-' + Date.now(),
                username: 'admin',
                password: 'admin123', // change after first use
                role: 'admin',
                fullName: 'Administrator',
                address: '',
                mobile: ''
            };
            this.users.push(admin);
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }

    setupEventListeners() {
        // Setup form submission handlers
        const signupForm = document.getElementById('signupForm');
        const loginForm = document.getElementById('loginForm');
        const adminLoginForm = document.getElementById('adminLoginForm');

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin();
            });
        }
    }

    handleSignup() {
        const userRole = document.getElementById('userRole').value;
        const fullName = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        if (!userRole || !fullName || !email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            const userData = {
                username: email,
                password: password,
                role: userRole,
                fullName: fullName,
                email: email,
                address: '',
                mobile: ''
            };

            const newUser = this.signup(userData);
            this.showNotification('Account created successfully!', 'success');
            this.showUserDetails(newUser);
            this.redirectToUserDashboard(userRole);
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    signup(userData) {
        if (this.users.some(user => user.username === userData.username)) {
            throw new Error('Email already registered');
        }

        const user = {
            id: Date.now().toString(),
            username: userData.username,
            password: userData.password, // In a real app, this should be hashed
            role: userData.role,
            fullName: userData.fullName,
            email: userData.email,
            address: userData.address,
            mobile: userData.mobile
        };

        this.users.push(user);
        localStorage.setItem('users', JSON.stringify(this.users));
        return user;
    }

    handleLogin() {
        const email = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const user = this.login(email, password);
            this.showNotification('Login successful!', 'success');
            this.redirectToUserDashboard(user.role);
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    showUserDetails(user) {
        const details = `
Account Details:
---------------
Role: ${user.role}
Name: ${user.fullName}
Email: ${user.email}
        `;
        alert(details);
    }

    showNotification(message, type = 'info') {
        // You can enhance this with a better UI notification system
        if (type === 'error') {
            alert('Error: ' + message);
        } else {
            alert(message);
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isTeacher() {
        return this.currentUser?.role === 'teacher';
    }

    isStudent() {
        return this.currentUser?.role === 'student';
    }
    isAdmin() {
        return this.currentUser?.role === 'admin';
    }
    getCurrentUser() {
        return this.currentUser;
    }

    redirectToUserDashboard(role) {
        switch (role) {
            case 'student':
                window.location.href = 'student-dashboard.html';
                break;
            case 'teacher':
                window.location.href = 'teacher-dashboard.html';
                break;
            case 'admin':
                window.location.href = 'admin-dashboard.html';
                break;
            default:
                this.showNotification('Invalid role', 'error');
        }
    }

    handleAdminLogin() {
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const accessCode = document.getElementById('adminCode').value;

        // In a real application, this would be securely stored and verified
        const ADMIN_ACCESS_CODE = 'ADMIN2025';

        try {
            const user = this.users.find(u => 
                u.role === 'admin' && 
                u.username === username && 
                u.password === password
            );

            if (!user || accessCode !== ADMIN_ACCESS_CODE) {
                throw new Error('Invalid admin credentials');
            }

            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showNotification('Admin login successful!', 'success');
            this.redirectToUserDashboard('admin');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }
}

// Initialize the authentication system
const auth = new Auth();
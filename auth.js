// Authentication Functions

// Show/Hide Auth Modal
function toggleAuth() {
    const authModal = document.getElementById('authModal');
    authModal.classList.toggle('hidden');
}

// Show different auth tabs
function showAuthTab(tab) {
    // Hide all forms first
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('adminLoginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');

    // Show the selected form
    if (tab === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
    } else if (tab === 'admin-login') {
        document.getElementById('adminLoginForm').classList.remove('hidden');
    } else if (tab === 'signup') {
        document.getElementById('signupForm').classList.remove('hidden');
    }

    // Update tab styles
    const allTabs = document.querySelectorAll('button[onclick^="showAuthTab"]');
    allTabs.forEach(t => {
        t.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
        t.classList.add('text-gray-500', 'hover:text-gray-700');
    });
    
    // Highlight active tab
    const activeTab = document.querySelector(`button[onclick="showAuthTab('${tab}')"]`);
    if (activeTab) {
        activeTab.classList.remove('text-gray-500', 'hover:text-gray-700');
        activeTab.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
    }
}

// Handle Login Form Submission
function handleLoginSubmit() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Add validation
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Get stored user data
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
        alert('User not found. Please sign up first.');
        return;
    }

    // Simple password check (in real app, this would be done server-side)
    if (userData.email === username && userData.password === password) {
        // Redirect based on user role
        if (userData.userRole === 'student') {
            window.location.href = 'student-dashboard.html';
        } else if (userData.userRole === 'teacher') {
            window.location.href = 'teacher-dashboard.html';
        }
        toggleAuth();
    } else {
        alert('Invalid credentials');
    }
}

// Handle Admin Login
function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const adminCode = document.getElementById('adminCode').value;

    // Add validation
    if (!username || !password || !adminCode) {
        alert('Please fill in all fields');
        return;
    }

    // In a real application, these would be verified against a server
    const ADMIN_CODE = 'ADMIN123'; // This would normally be stored securely on a server
    
    if (adminCode !== ADMIN_CODE) {
        alert('Invalid admin access code');
        return;
    }

    // Verify admin credentials (in real app, this would be done server-side)
    const adminUser = {
        username: 'admin',
        password: 'admin123'
    };

    if (username === adminUser.username && password === adminUser.password) {
        // Store admin session
        localStorage.setItem('adminSession', JSON.stringify({
            isAdmin: true,
            username: username,
            loginTime: new Date().toISOString()
        }));
        
        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
        toggleAuth();
    } else {
        alert('Invalid admin credentials');
    }
}

// Handle Signup
function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const userRole = document.getElementById('userRole').value;

    // Add validation
    if (!name || !email || !password || !userRole) {
        alert('Please fill in all fields and select a role');
        return;
    }

    // Create signup data object
    const signupData = {
        name: name,
        email: email,
        password: password,
        userRole: userRole
    };

    // Store user data (in real application, this would be sent to a server)
    localStorage.setItem('userData', JSON.stringify(signupData));

    // Show success message
    alert('Signup successful! Please login.');

    // Switch to login tab
    showAuthTab('login');
}

// Show different auth tabs
function showAuthTab(tab) {
    // Hide all forms first
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('adminLoginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');

    // Show the selected form
    if (tab === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
    } else if (tab === 'admin-login') {
        document.getElementById('adminLoginForm').classList.remove('hidden');
    } else if (tab === 'signup') {
        document.getElementById('signupForm').classList.remove('hidden');
    }

    // Update tab styles
    const allTabs = document.querySelectorAll('button[onclick^="showAuthTab"]');
    allTabs.forEach(t => {
        t.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
        t.classList.add('text-gray-500', 'hover:text-gray-700');
    });
    
    // Highlight active tab
    const activeTab = document.querySelector(`button[onclick="showAuthTab('${tab}')"]`);
    if (activeTab) {
        activeTab.classList.remove('text-gray-500', 'hover:text-gray-700');
        activeTab.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
    }
}

// Handle Regular Login Form Submission
function handleLoginSubmit() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Add validation
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Get stored user data
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
        alert('User not found. Please sign up first.');
        return;
    }

    // Simple password check (in real app, this would be done server-side)
    if (userData.email === username && userData.password === password) {
        // Redirect based on user role
        if (userData.userRole === 'student') {
            window.location.href = 'student-dashboard.html';
        } else if (userData.userRole === 'teacher') {
            window.location.href = 'teacher-dashboard.html';
        }
        toggleAuth();
    } else {
        alert('Invalid credentials');
    }
}

// Handle Admin Login Form Submission
function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const adminCode = document.getElementById('adminCode').value;

    // Add validation
    if (!username || !password || !adminCode) {
        alert('Please fill in all fields');
        return;
    }

    // In a real application, these would be verified against a server
    // This is just for demonstration purposes
    const ADMIN_CODE = 'ADMIN123'; // This would normally be stored securely on a server
    
    if (adminCode !== ADMIN_CODE) {
        alert('Invalid admin access code');
        return;
    }

    // Verify admin credentials (in real app, this would be done server-side)
    const adminUser = {
        username: 'admin',
        password: 'admin123'
    };

    if (username === adminUser.username && password === adminUser.password) {
        // Store admin session
        localStorage.setItem('adminSession', JSON.stringify({
            isAdmin: true,
            username: username,
            loginTime: new Date().toISOString()
        }));
        
        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
        toggleAuth();
    } else {
        alert('Invalid admin credentials');
    }
}

// Level configurations
const levelConfig = {
    student: [
        "Primary Level",
        "Secondary Level",
        "Higher Secondary",
        "Undergraduate",
        "Graduate",
        "Post Graduate"
    ],
    teacher: [
        "Primary Teacher",
        "Secondary Teacher",
        "Higher Secondary Teacher",
        "University Lecturer",
        "Assistant Professor",
        "Associate Professor",
        "Professor"
    ]
};

// Update level options based on selected role
function updateLevelOptions() {
    const roleSelect = document.getElementById('userRole');
    const levelSelect = document.getElementById('userLevel');
    const selectedRole = roleSelect.value;

    // Clear existing options
    levelSelect.innerHTML = '<option value="">Choose your level</option>';

    // Add new options based on selected role
    if (selectedRole && levelConfig[selectedRole]) {
        levelConfig[selectedRole].forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level;
            levelSelect.appendChild(option);
        });
    }
}

// Handle Signup
function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const userRole = document.getElementById('userRole').value;
    const userLevel = document.getElementById('userLevel').value;

    // Add validation
    if (!name || !email || !password || !userRole || !userLevel) {
        alert('Please fill in all fields and select both role and level');
        return;
    }

    // Create signup data object
    const signupData = {
        name: name,
        email: email,
        password: password,
        userRole: userRole,
        userLevel: userLevel
    };

    // Store user data (in real application, this would be sent to a server)
    localStorage.setItem('userData', JSON.stringify(signupData));

    // Show success message
    alert('Signup successful! Please login.');

    // Switch to login tab
    showAuthTab('login');
}

// Handle Logout
function handleLogout() {
    // Clear stored data
    localStorage.removeItem('userData');
    localStorage.removeItem('adminData');
    localStorage.removeItem('userType');

    // Redirect to home page
    window.location.href = 'index.html';
}

// Add event listener for mobile menu toggle
function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}
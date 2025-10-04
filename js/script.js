// Enhanced Online Exam System - cleaned and DOM-safe

// State management
let currentIndex = 0;
let userAnswers = {};
let timeLeft = 30 * 60; // default 30 minutes
let timerInterval = null;

// DOM references (filled on load)
let authContainer = null;
let authSection = null;
let adminDashboard = null;
let teacherDashboard = null;
let studentDashboard = null;
let quizSection = null;
let questionArea = null;
let prevBtn = null;
let nextBtn = null;
let submitBtn = null;
let timerEl = null;
let currentEl = null;
let totalEl = null;
let resultSection = null;
let scoreText = null;
let details = null;

// Toggle mobile menu visibility
function toggleMenu() {
    // On mobile, the hamburger should show only the center links and keep actions hidden
    const center = document.getElementById('navCenter');
    const actions = document.getElementById('navActions');
    if (center) {
        const isShown = center.classList.toggle('show');
        // if opening center, ensure actions are hidden
        if (isShown && actions) actions.classList.remove('show');
    }
}

// Authentication UI functions
function toggleAuth() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.toggle('hidden');
    }
}

function showAuthTab(tab) {
    // Hide all forms
    document.querySelectorAll('#loginForm, #signupForm').forEach(form => {
        form.classList.add('hidden');
    });
    
    // Show selected form
    const selectedForm = document.getElementById(tab + 'Form');
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

// Login form submission handler
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

// Signup form submission handler
function handleSignupSubmit() {
    // Get form values
    const fullName = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    // Validate inputs
    if (!fullName || !email || !password) {
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
            password,
            role: 'student', // Default role
            mobile: '',
            address: ''
        };

        auth.signup(userData);
        alert('Account created successfully! You can now login.');
        showAuthTab('login'); // Switch to login tab
    } catch (error) {
        alert(error.message);
    }
}

// Logout handler
function handleLogout() {
    auth.logout();
    window.location.href = 'index.html';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication state
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

// Close mobile menus when clicking outside
window.addEventListener('click', (e) => {
    const toggle = document.querySelector('.menu-toggle');
    const center = document.getElementById('navCenter');
    const actions = document.getElementById('navActions');
    if (!toggle || !center) return;
    // if click is inside the nav or on the toggle, ignore
    const nav = document.querySelector('.nav-content');
    if (nav && nav.contains(e.target)) return;
    // otherwise hide mobile menus
    center.classList.remove('show');
    if (actions) actions.classList.remove('show');
    // also clear solo/active state when clicking outside
    if (actions) {
        actions.classList.remove('solo');
        actions.querySelectorAll('.nav-action').forEach(b => b.classList.remove('active'));
    }
});

// Open the auth container and optionally show a specific panel (login/signup/admin)
function openAuthAndShow(panel) {
    // First, make sure all elements exist
    const homeSection = document.getElementById('homeSection');
    const authContainer = document.getElementById('authContainer');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const adminForm = document.getElementById('adminForm');

    if (!authContainer || !homeSection || !loginForm || !signupForm || !adminForm) {
        console.error('Required elements not found');
        return;
    }

    // Hide the home section
    homeSection.style.display = 'none';
    
    // Show the auth container
    authContainer.style.display = 'block';

    // Get the correct form ID
    const formMap = {
        login: 'loginForm',
        signup: 'signupForm',
        admin: 'adminForm'
    };

    const formId = formMap[panel];
    if (!formId) return;

    // Hide all forms first
    document.querySelectorAll('.auth-panel').forEach(form => {
        form.style.display = 'none';
    });

    // Show the selected form
    const selectedForm = document.getElementById(formId);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }

    // Update tab selection
    document.querySelectorAll('.auth-tabs .tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-target') === formId) {
            tab.classList.add('active');
        }
    });

    // Update nav button active states
    document.querySelectorAll('.nav-action').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    const buttonMap = {
        login: 'loginBtn',
        signup: 'signupBtn',
        admin: 'adminBtn'
    };

    const buttonId = buttonMap[panel];
    if (buttonId) {
        const button = document.getElementById(buttonId);
        if (button) button.classList.add('active');
    }
}

// Show home section and hide auth container
function showHome() {
    const homeSection = document.getElementById('homeSection');
    const authContainer = document.getElementById('authContainer');
    
    if (homeSection) {
        homeSection.style.display = 'block';
    }
    
    if (authContainer) {
        authContainer.style.display = 'none';
    }
    
    // Remove active state from all nav buttons
    document.querySelectorAll('.nav-action').forEach(btn => {
        btn.classList.remove('active');
    });

    // Hide all auth panels
    document.querySelectorAll('.auth-panel').forEach(panel => {
        panel.style.display = 'none';
    });

    // Reset active tab
    document.querySelectorAll('.auth-tabs .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Set login tab as active by default
    const loginTab = document.querySelector('.auth-tabs .tab[data-target="loginForm"]');
    if (loginTab) {
        loginTab.classList.add('active');
    }
}

// Wire up after DOM ready
// Slideshow functionality
let currentSlide = 0;
let slideInterval;

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length || !dots.length) return;
    
    // Handle wrap-around
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    else currentSlide = n;
    
    // Hide all slides and remove active dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function changeSlide(n) {
    // Stop auto-slideshow when user interacts
    clearInterval(slideInterval);
    showSlide(currentSlide + n);
    // Restart auto-slideshow
    startSlideshow();
}

function setSlide(n) {
    // Stop auto-slideshow when user interacts
    clearInterval(slideInterval);
    showSlide(n);
    // Restart auto-slideshow
    startSlideshow();
}

function startSlideshow() {
    // Clear any existing interval
    if (slideInterval) clearInterval(slideInterval);
    
    // Set initial state
    const slides = document.querySelectorAll('.slide');
    if (slides.length) {
        // Show first slide
        slides[0].style.opacity = '1';
        
        // Start automatic slideshow
        let currentSlideIndex = 0;
        slideInterval = setInterval(() => {
            // Hide current slide
            slides[currentSlideIndex].style.opacity = '0';
            
            // Move to next slide
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            
            // Show next slide
            slides[currentSlideIndex].style.opacity = '1';
            
            // Update dots
            const dots = document.querySelectorAll('.slider-dot');
            dots.forEach((dot, index) => {
                if (index === currentSlideIndex) {
                    dot.classList.add('opacity-100');
                    dot.classList.remove('opacity-50');
                } else {
                    dot.classList.add('opacity-50');
                    dot.classList.remove('opacity-100');
                }
            });
        }, 5000); // Change slide every 5 seconds
    }
}

// Add event listeners for slider dots
document.addEventListener('DOMContentLoaded', function() {
    const dots = document.querySelectorAll('.slider-dot');
    const slides = document.querySelectorAll('.slide');
    
    // Initialize first slide and dot
    if (slides.length > 0) {
        slides[0].style.opacity = '1';
    }
    if (dots.length > 0) {
        dots[0].classList.add('opacity-100');
        dots[0].classList.remove('opacity-50');
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Clear existing interval
            if (slideInterval) clearInterval(slideInterval);
            
            // Hide all slides
            slides.forEach(slide => {
                slide.style.opacity = '0';
            });
            
            // Show selected slide
            slides[index].style.opacity = '1';
            
            // Update dots
            dots.forEach((d, i) => {
                if (i === index) {
                    d.classList.add('opacity-100');
                    d.classList.remove('opacity-50');
                } else {
                    d.classList.add('opacity-50');
                    d.classList.remove('opacity-100');
                }
            });
            
            // Restart slideshow
            startSlideshow();
        });
    });
    
    // Start the slideshow
    startSlideshow();
});

// Load common footer
async function loadFooter() {
    try {
        const response = await fetch('footer.html');
        const footerContent = await response.text();
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerContent;
            // Set footer year
            const yearEl = document.getElementById('year');
            if (yearEl) yearEl.textContent = new Date().getFullYear();
        }
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

window.addEventListener('load', () => {
    // Load the footer
    loadFooter();

    // Start the slideshow if on home page
    const slidesContainer = document.querySelector('.slideshow-container');
    if (slidesContainer) startSlideshow();

    // auth tabs
    document.querySelectorAll('.auth-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tabs .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.auth-panel').forEach(p => {
                p.style.display = 'none';
            });
            const target = tab.getAttribute('data-target');
            const panelEl = document.getElementById(target);
            if (panelEl) panelEl.style.display = 'block';
        });
    });

    // nav action buttons: keep all buttons visible when clicked
    const navActions = document.getElementById('navActions');
    if (navActions) {
        navActions.querySelectorAll('.nav-action').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                // Just handle the click without hiding other buttons
                ev.stopPropagation();
            });
        });
    }

    // Quiz controls
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const questions = questionManager.getQuestions();
            if (currentIndex < questions.length - 1) {
                currentIndex++;
                renderQuestion();
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to submit your exam?')) {
                submitQuiz();
            }
        });
    }

    // initial view depending on auth state (auth.js expected)
    try {
        const currentUser = auth.getCurrentUser();
        if (currentUser) showDashboard(); else showHome();
    } catch (e) {
        showHome();
    }

    // Teacher Dashboard Controls
    const addQuestionBtn = document.getElementById('showAddQuestionForm');
    const viewQuestionsBtn = document.getElementById('showQuestionList');

    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', () => {
            const form = document.getElementById('addQuestionForm');
            const list = document.getElementById('questionList');
            if (form) form.style.display = 'block';
            if (list) list.style.display = 'none';
        });
    }

    if (viewQuestionsBtn) {
        viewQuestionsBtn.addEventListener('click', () => {
            const form = document.getElementById('addQuestionForm');
            const list = document.getElementById('questionList');
            if (form) form.style.display = 'none';
            if (list) {
                list.style.display = 'block';
                renderQuestionList();
            }
        });
    }
});

// Authentication handlers
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        auth.login(username, password);
        showDashboard();
    } catch (error) {
        alert(error.message);
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    try {
        auth.login(username, password);
        showDashboard();
    } catch (error) {
        alert(error.message);
    }
}

function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // In a real application, this would send the data to a server
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}

function handleSignup(event) {
    event.preventDefault();
    const userData = {
        fullName: document.getElementById('signupFullName').value,
        username: document.getElementById('signupUsername').value,
        password: document.getElementById('signupPassword').value,
        mobile: document.getElementById('signupMobile').value,
        address: document.getElementById('signupAddress').value,
        role: document.getElementById('role').value
    };

    try {
        auth.signup(userData);

        const credentialsHtml = `
            <div class="credentials-popup">
                <h3>✅ Account Created Successfully!</h3>
                <div class="credentials-box">
                    <p><strong>Your Login Credentials:</strong></p>
                    <div class="credential-item">
                        <span>Username:</span>
                        <code>${userData.username}</code>
                        <button class="copy-btn" data-value="${userData.username}">Copy</button>
                    </div>
                    <div class="credential-item">
                        <span>Password:</span>
                        <code>${userData.password}</code>
                        <button class="copy-btn" data-value="${userData.password}">Copy</button>
                    </div>
                </div>
                <p class="save-note">Please save these credentials securely!</p>
                <button class="btn primary" id="closeCredBtn">Got it!</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = credentialsHtml;
        document.body.appendChild(overlay);

        // wire copy buttons inside overlay
        overlay.querySelectorAll('.copy-btn').forEach(b => {
            b.addEventListener('click', async () => {
                const value = b.dataset.value || '';
                try { await navigator.clipboard.writeText(value); b.textContent = 'Copied!'; setTimeout(() => b.textContent = 'Copy', 1500); } catch (e) { alert('Copy failed'); }
            });
        });

        const closeBtn = overlay.querySelector('#closeCredBtn');
        if (closeBtn) closeBtn.addEventListener('click', closeCredentials);

        const form = document.getElementById('signupForm');
        if (form) form.reset();
    } catch (error) {
        alert(error.message);
    }
}

function handleLogout() {
    try { auth.logout(); } catch (e) {}

    // Clear any running exam timer
    if (typeof timerInterval !== 'undefined' && timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Reset quiz and UI state
    timeLeft = 30 * 60;
    currentIndex = 0;
    userAnswers = {};
    if (timerEl) timerEl.textContent = '--:--';

    // Hide any dashboards, quiz or result views
    if (teacherDashboard) teacherDashboard.classList.add('hidden');
    if (studentDashboard) studentDashboard.classList.add('hidden');
    if (adminDashboard) adminDashboard.classList.add('hidden');
    if (quizSection) quizSection.classList.add('hidden');
    if (resultSection) resultSection.classList.add('hidden');

    // Remove overlays and reset forms
    const overlay = document.querySelector('.overlay'); if (overlay) overlay.remove();
    document.querySelectorAll('form').forEach(f => { try { f.reset(); } catch (e) {} });

    // Reset auth container state
    if (authContainer) authContainer.classList.add('hidden');

    // Show public home
    showHome();

    // Notify user
    try { window.alert('You have been logged out.'); } catch (e) {}

    // clear any nav-actions solo/active state
    const actions = document.getElementById('navActions');
    if (actions) {
        actions.classList.remove('solo');
        actions.querySelectorAll('.nav-action').forEach(b => b.classList.remove('active'));
    }
}

function closeCredentials() {
    const overlay = document.querySelector('.overlay');
    if (overlay) { overlay.classList.add('fade-out'); setTimeout(() => overlay.remove(), 240); }
}

// UI state management
function showAuth() {
    openAuthAndShow('login');
}

function showDashboard() {
    const authContainer = document.getElementById('authContainer');
    if (authContainer) authContainer.style.display = 'none';

    try {
        const user = auth.getCurrentUser();
        if (!user) {
            openAuthAndShow('login');
            return;
        }

        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (user.role === 'teacher') {
            window.location.href = 'teacher-dashboard.html';
        } else {
            window.location.href = 'student-dashboard.html';
        }
    } catch (e) {
        // If there's an error, redirect to home page
        window.location.href = 'index.html';
    }
}

// Question management
function handleAddQuestion(event) {
    event.preventDefault();
    const questionText = document.getElementById('questionText').value;
    const options = Array.from(document.getElementById('options').getElementsByTagName('input')).map(i => i.value);
    const correctAnswer = parseInt(document.getElementById('correctAnswer').value);

    const question = { q: questionText, type: 'radio', options, answer: correctAnswer };
    questionManager.addQuestion(question);
    const form = document.getElementById('questionForm'); if (form) form.reset();
    renderQuestionList();
}

function renderQuestionList() {
    const list = document.getElementById('questionsList');
    const questions = questionManager.getQuestions();
    if (!list) return;

    list.innerHTML = questions.map((q, idx) => `
        <div class="question-item">
            <h3>Question ${idx + 1}</h3>
            <p>${q.q}</p>
            <ul>
                ${q.options.map((opt, i) => `<li>${i === q.answer ? '✓ ' : ''}${opt}</li>`).join('')}
            </ul>
            <button onclick="deleteQuestion('${q.id}')" class="btn">Delete</button>
        </div>
    `).join('');
}

function deleteQuestion(id) {
    if (confirm('Are you sure you want to delete this question?')) { questionManager.deleteQuestion(id); renderQuestionList(); }
}

// Exam functions
function startExam() {
    const questions = questionManager.getQuestions();
    if (questions.length === 0) { alert('No questions available.'); return; }

    currentIndex = 0; userAnswers = {}; timeLeft = 30 * 60;
    if (studentDashboard) studentDashboard.classList.add('hidden');
    if (quizSection) quizSection.classList.remove('hidden');
    if (totalEl) totalEl.textContent = questions.length;
    startTimer(); renderQuestion();
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
            return;
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function renderQuestion() {
    const questions = questionManager.getQuestions();
    if (!questions || questions.length === 0) return;
    const q = questions[currentIndex];
    if (currentEl) currentEl.textContent = currentIndex + 1;

    if (questionArea) {
        questionArea.innerHTML = `
            <div class="question">
                <h3>${currentIndex + 1}. ${q.q}</h3>
                <ul class="options">
                    ${q.options.map((opt, idx) => `
                        <li class="option">
                            <input type="${q.type}" name="answer" value="${idx}" id="opt${idx}" ${userAnswers[q.id] === idx ? 'checked' : ''}>
                            <label for="opt${idx}">${opt}</label>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        questionArea.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => { userAnswers[q.id] = parseInt(input.value); });
        });
    }

    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === questions.length - 1;
}

function submitQuiz() {
    if (timerInterval) clearInterval(timerInterval);
    const questions = questionManager.getQuestions();
    let score = 0;
    const results = questions.map(q => { const isCorrect = userAnswers[q.id] === q.answer; if (isCorrect) score++; return { question: q.q, userAnswer: q.options[userAnswers[q.id]] || 'Not answered', correctAnswer: q.options[q.answer], isCorrect }; });

    const quizEl = document.getElementById('quiz'); if (quizEl) quizEl.classList.add('hidden');
    if (resultSection) resultSection.classList.remove('hidden');
    if (scoreText) scoreText.textContent = `Score: ${score} out of ${questions.length} (${Math.round((score/questions.length)*100)}%)`;
    if (details) details.innerHTML = results.map((r, idx) => `
        <div class="details-item ${r.isCorrect ? 'correct' : 'incorrect'}">
            <h4>Question ${idx + 1}</h4>
            <p>${r.question}</p>
            <p>Your answer: ${r.userAnswer}</p>
            <p>Correct answer: ${r.correctAnswer}</p>
        </div>
    `).join('');
}

function returnToDashboard() { if (quizSection) quizSection.classList.add('hidden'); if (resultSection) resultSection.classList.add('hidden'); showDashboard(); }

function copyToClipboard(text) { navigator.clipboard.writeText(text).catch(() => alert('Copy failed')); }

function backToHome() {
    if (teacherDashboard) teacherDashboard.classList.add('hidden');
    if (studentDashboard) studentDashboard.classList.add('hidden');
    if (adminDashboard) adminDashboard.classList.add('hidden');
    if (quizSection) quizSection.classList.add('hidden');
    if (authContainer) authContainer.classList.add('hidden');
    showHome();

    // Remove active state from all nav buttons
    document.querySelectorAll('.nav-action').forEach(btn => {
        btn.classList.remove('active');
    });
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function renderAdminPanel() {
    const statsEl = document.getElementById('adminStats');
    const usersEl = document.getElementById('adminUsers');
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Ensure every user has an 'active' flag (default true)
    let changed = false;
    users = users.map(u => {
        if (typeof u.active === 'undefined') { u.active = true; changed = true; }
        return u;
    });
    if (changed) saveUsers(users);

    if (statsEl) statsEl.textContent = `Users: ${users.length} | Questions: ${questionManager.getQuestions().length}`;
    if (!usersEl) return;

    usersEl.innerHTML = users.map(u => {
        const initials = (u.fullName || u.username || 'U').split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase();
        const roleLabel = (u.role || 'student').replace(/^(.)/, s => s.toUpperCase());
        const statusClass = u.active ? 'active' : 'inactive';
        const statusText = u.active ? 'Active' : 'Inactive';

        return `
            <div class="admin-user" data-id="${u.id}">
                <div class="left">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-meta">
                        <div class="username">${u.username}</div>
                        <div class="role">${roleLabel}</div>
                    </div>
                </div>
                <div class="user-actions">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <button class="admin-edit" onclick="openAdminEdit('${u.id}')">Edit</button>
                </div>
            </div>
        `;
    }).join('');
}

function openAdminEdit(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    if (!user) { alert('User not found'); return; }

    // Prompt for role change
    const newRole = prompt('Set role for user (student / teacher / admin):', user.role || 'student');
    if (newRole === null) return; // cancelled
    const role = (newRole || 'student').toLowerCase();
    if (!['student','teacher','admin'].includes(role)) { alert('Invalid role. No changes made.'); return; }

    // Toggle active state
    const makeActive = confirm(`Current status: ${user.active ? 'Active' : 'Inactive'}\n\nPress OK to set user ACTIVE, Cancel to set INACTIVE.`);

    // Optionally change password
    const changePwd = confirm('Do you want to change the user password?');
    if (changePwd) {
        const newPwd = prompt('Enter new password (leave blank to cancel):');
        if (newPwd !== null && newPwd.trim() !== '') user.password = newPwd;
    }

    // Apply changes
    user.role = role;
    user.active = !!makeActive;

    // Save and re-render
    saveUsers(users);
    renderAdminPanel();
    alert('User updated successfully');
}
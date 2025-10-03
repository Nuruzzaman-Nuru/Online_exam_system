// Enhanced Online Exam System

// Quiz state
let currentIndex = 0;
let userAnswers = {};
let timeLeft = 30 * 60; // 30 minutes
let timerInterval = null;

// UI Elements
const authSection = document.getElementById('authSection');
<<<<<<< HEAD
=======
const authContainer = document.getElementById('authContainer');
const adminDashboard = document.getElementById('adminDashboard');
>>>>>>> 56a26c6 (Initial commit)
const teacherDashboard = document.getElementById('teacherDashboard');
const studentDashboard = document.getElementById('studentDashboard');
const quizSection = document.getElementById('quizSection');
const questionArea = document.getElementById('question-area');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const timerEl = document.getElementById('timer');
const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');
const resultSection = document.getElementById('result');
const scoreText = document.getElementById('scoreText');
const details = document.getElementById('details');

// Navigation and UI Management
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
}

<<<<<<< HEAD
function showAuth() {
    document.getElementById('homeSection').classList.add('hidden');
    document.getElementById('authContainer').classList.remove('hidden');
=======

// Open the auth container and optionally show a specific panel (login/signup/admin)
function openAuthAndShow(panel) {
    document.getElementById('homeSection').classList.add('hidden');
    authContainer.classList.remove('hidden');
    // normalize short names to actual panel ids
    let target = panel;
    if (panel === 'login') target = 'loginForm';
    if (panel === 'signup') target = 'signupForm';
    if (panel === 'admin') target = 'adminForm';
    // switch tabs
    document.querySelectorAll('.auth-tabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.add('hidden'));
    if (target) {
        const tab = document.querySelector(`.auth-tabs .tab[data-target="${target}"]`);
        if (tab) tab.classList.add('active');
        const panelEl = document.getElementById(target);
        if (panelEl) panelEl.classList.remove('hidden');
    }
>>>>>>> 56a26c6 (Initial commit)
}

function showHome() {
    document.getElementById('homeSection').classList.remove('hidden');
<<<<<<< HEAD
    document.getElementById('authContainer').classList.add('hidden');
=======
    authContainer.classList.add('hidden');
>>>>>>> 56a26c6 (Initial commit)
}

// Check authentication status on load
window.addEventListener('load', () => {
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        showDashboard();
    } else {
        showHome();
    }
<<<<<<< HEAD
=======
    // footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    // wire auth tab clicks
    document.querySelectorAll('.auth-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tabs .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.auth-panel').forEach(p => p.classList.add('hidden'));
            const target = tab.getAttribute('data-target');
            const panelEl = document.getElementById(target);
            if (panelEl) panelEl.classList.remove('hidden');
        });
    });
>>>>>>> 56a26c6 (Initial commit)
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

<<<<<<< HEAD
=======
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

>>>>>>> 56a26c6 (Initial commit)
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
                        <button onclick="copyToClipboard('${userData.username}')" class="copy-btn">Copy</button>
                    </div>
                    <div class="credential-item">
                        <span>Password:</span>
                        <code>${userData.password}</code>
                        <button onclick="copyToClipboard('${userData.password}')" class="copy-btn">Copy</button>
                    </div>
                </div>
                <p class="save-note">Please save these credentials securely!</p>
                <button onclick="closeCredentials()" class="btn primary">Got it!</button>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = credentialsHtml;
        document.body.appendChild(overlay);
        document.getElementById('signupForm').reset();
    } catch (error) {
        alert(error.message);
    }
}

function handleLogout() {
    auth.logout();
<<<<<<< HEAD
    showAuth();
=======
    showHome();
>>>>>>> 56a26c6 (Initial commit)
}

// UI state management
function showAuth() {
<<<<<<< HEAD
    authSection.classList.remove('hidden');
    teacherDashboard.classList.add('hidden');
    studentDashboard.classList.add('hidden');
    quizSection.classList.add('hidden');
=======
    // Open the auth container and default to login panel
    openAuthAndShow('login');
>>>>>>> 56a26c6 (Initial commit)
}

function showDashboard() {
    authSection.classList.add('hidden');
    quizSection.classList.add('hidden');

<<<<<<< HEAD
    if (auth.isTeacher()) {
        teacherDashboard.classList.remove('hidden');
        studentDashboard.classList.add('hidden');
        renderQuestionList();
    } else {
        teacherDashboard.classList.add('hidden');
=======
    // hide all dashboards first
    teacherDashboard.classList.add('hidden');
    studentDashboard.classList.add('hidden');
    adminDashboard.classList.add('hidden');

    if (auth.isAdmin()) {
        adminDashboard.classList.remove('hidden');
        renderAdminPanel();
    } else if (auth.isTeacher()) {
        teacherDashboard.classList.remove('hidden');
        renderQuestionList();
    } else {
>>>>>>> 56a26c6 (Initial commit)
        studentDashboard.classList.remove('hidden');
    }
}

// Question management
function handleAddQuestion(event) {
    event.preventDefault();
    const questionText = document.getElementById('questionText').value;
    const options = Array.from(document.getElementById('options').getElementsByTagName('input'))
        .map(input => input.value);
    const correctAnswer = parseInt(document.getElementById('correctAnswer').value);

    const question = {
        q: questionText,
        type: 'radio',
        options,
        answer: correctAnswer
    };

    questionManager.addQuestion(question);
    document.getElementById('questionForm').reset();
    renderQuestionList();
}

function renderQuestionList() {
    const list = document.getElementById('questionsList');
    const questions = questionManager.getQuestions();
    
    list.innerHTML = questions.map((q, idx) => `
        <div class="question-item">
            <h3>Question ${idx + 1}</h3>
            <p>${q.q}</p>
            <ul>
                ${q.options.map((opt, i) => `
                    <li>${i === q.answer ? '✓ ' : ''}${opt}</li>
                `).join('')}
            </ul>
            <button onclick="deleteQuestion('${q.id}')" class="btn">Delete</button>
        </div>
    `).join('');
}

function deleteQuestion(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        questionManager.deleteQuestion(id);
        renderQuestionList();
    }
}

// Exam taking functions
function startExam() {
    const questions = questionManager.getQuestions();
    if (questions.length === 0) {
        alert('No questions available.');
        return;
    }

    currentIndex = 0;
    userAnswers = {};
    timeLeft = 30 * 60; // 30 minutes
    
    studentDashboard.classList.add('hidden');
    quizSection.classList.remove('hidden');
    totalEl.textContent = questions.length;
    
    startTimer();
    renderQuestion();
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
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function renderQuestion() {
    const questions = questionManager.getQuestions();
    const q = questions[currentIndex];
    currentEl.textContent = currentIndex + 1;
    
    questionArea.innerHTML = `
        <div class="question">
            <h3>${currentIndex + 1}. ${q.q}</h3>
            <ul class="options">
                ${q.options.map((opt, idx) => `
                    <li class="option">
                        <input type="${q.type}" 
                               name="answer" 
                               value="${idx}"
                               id="opt${idx}"
                               ${userAnswers[q.id] === idx ? 'checked' : ''}>
                        <label for="opt${idx}">${opt}</label>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // Add change event listeners
    questionArea.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            userAnswers[q.id] = parseInt(input.value);
        });
    });

    // Update navigation
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === questions.length - 1;
}

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
});

nextBtn.addEventListener('click', () => {
    const questions = questionManager.getQuestions();
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
    }
});

submitBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to submit your exam?')) {
        submitQuiz();
    }
});

function submitQuiz() {
    clearInterval(timerInterval);
    const questions = questionManager.getQuestions();
    
    let score = 0;
    const results = questions.map(q => {
        const isCorrect = userAnswers[q.id] === q.answer;
        if (isCorrect) score++;
        return {
            question: q.q,
            userAnswer: q.options[userAnswers[q.id]] || 'Not answered',
            correctAnswer: q.options[q.answer],
            isCorrect
        };
    });

    // Display results
    document.getElementById('quiz').classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    scoreText.textContent = `Score: ${score} out of ${questions.length} (${Math.round((score/questions.length)*100)}%)`;
    
    details.innerHTML = results.map((r, idx) => `
        <div class="details-item ${r.isCorrect ? 'correct' : 'incorrect'}">
            <h4>Question ${idx + 1}</h4>
            <p>${r.question}</p>
            <p>Your answer: ${r.userAnswer}</p>
            <p>Correct answer: ${r.correctAnswer}</p>
        </div>
    `).join('');
}

function returnToDashboard() {
    quizSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    showDashboard();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
<<<<<<< HEAD
        const btn = event.target;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = 'Copy';
        }, 2000);
=======
        // attempt to find the button that triggered this by searching for a code element with matching text
        const btn = Array.from(document.querySelectorAll('.copy-btn')).find(b => b.previousElementSibling && b.previousElementSibling.textContent === text) || null;
        if (btn) {
            const old = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = old, 1500);
        }
>>>>>>> 56a26c6 (Initial commit)
    });
}

function closeCredentials() {
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
<<<<<<< HEAD
=======
}

// Return UI to the public home page and reset auth UI
function backToHome() {
    // hide dashboards and quiz
    teacherDashboard.classList.add('hidden');
    studentDashboard.classList.add('hidden');
    adminDashboard.classList.add('hidden');
    quizSection.classList.add('hidden');
    // reset auth panels to login
    openAuthAndShow('login');
    // then immediately hide auth to show pure home (acts like a back button)
    showHome();
}

// Admin utilities
function renderAdminPanel() {
    const statsEl = document.getElementById('adminStats');
    const usersEl = document.getElementById('adminUsers');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    statsEl.textContent = `Users: ${users.length} | Questions: ${questionManager.getQuestions().length}`;
    usersEl.innerHTML = users.map(u => `
        <div class="admin-user">
            <strong>${u.username}</strong> — ${u.role}
        </div>
    `).join('');
>>>>>>> 56a26c6 (Initial commit)
}
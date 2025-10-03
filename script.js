// Enhanced Online Exam System - cleaned and DOM-safe

// State
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

function toggleMenu() {
    // toggle visibility for center links and actions on small screens
    const center = document.getElementById('navCenter');
    const actions = document.getElementById('navActions');
    if (center) center.classList.toggle('show');
    if (actions) actions.classList.toggle('show');
}

// Open the auth container and optionally show a specific panel (login/signup/admin)
function openAuthAndShow(panel) {
    document.getElementById('homeSection').classList.add('hidden');
    if (authContainer) authContainer.classList.remove('hidden');

    let target = panel;
    if (panel === 'login') target = 'loginForm';
    if (panel === 'signup') target = 'signupForm';
    if (panel === 'admin') target = 'adminForm';

    document.querySelectorAll('.auth-tabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.add('hidden'));
    if (target) {
        const tab = document.querySelector(`.auth-tabs .tab[data-target="${target}"]`);
        if (tab) tab.classList.add('active');
        const panelEl = document.getElementById(target);
        if (panelEl) panelEl.classList.remove('hidden');
    }
}

function showHome() {
    document.getElementById('homeSection').classList.remove('hidden');
    if (authContainer) authContainer.classList.add('hidden');
}

// Wire up after DOM ready
window.addEventListener('load', () => {
    // element refs
    authContainer = document.getElementById('authContainer');
    authSection = document.getElementById('authSection');
    adminDashboard = document.getElementById('adminDashboard');
    teacherDashboard = document.getElementById('teacherDashboard');
    studentDashboard = document.getElementById('studentDashboard');
    quizSection = document.getElementById('quizSection');
    questionArea = document.getElementById('question-area');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    submitBtn = document.getElementById('submitBtn');
    timerEl = document.getElementById('timer');
    currentEl = document.getElementById('current');
    totalEl = document.getElementById('total');
    resultSection = document.getElementById('result');
    scoreText = document.getElementById('scoreText');
    details = document.getElementById('details');

    // footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // auth tabs
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

    // button wiring (guarding in case elements missing)
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; renderQuestion(); }});
    if (nextBtn) nextBtn.addEventListener('click', () => { const questions = questionManager.getQuestions(); if (currentIndex < questions.length - 1) { currentIndex++; renderQuestion(); }});
    if (submitBtn) submitBtn.addEventListener('click', () => { if (confirm('Are you sure you want to submit your exam?')) submitQuiz(); });

    // initial view depending on auth state (auth.js expected)
    try {
        const currentUser = auth.getCurrentUser();
        if (currentUser) showDashboard(); else showHome();
    } catch (e) {
        showHome();
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
    showHome();
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
    if (authSection) authSection.classList.add('hidden');
    if (quizSection) quizSection.classList.add('hidden');

    // hide all dashboards first
    if (teacherDashboard) teacherDashboard.classList.add('hidden');
    if (studentDashboard) studentDashboard.classList.add('hidden');
    if (adminDashboard) adminDashboard.classList.add('hidden');

    try {
        if (auth.isAdmin()) { if (adminDashboard) adminDashboard.classList.remove('hidden'); renderAdminPanel(); }
        else if (auth.isTeacher()) { if (teacherDashboard) teacherDashboard.classList.remove('hidden'); renderQuestionList(); }
        else { if (studentDashboard) studentDashboard.classList.remove('hidden'); }
    } catch (e) {
        // fallback
        if (studentDashboard) studentDashboard.classList.remove('hidden');
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

function startTimer() { updateTimerDisplay(); timerInterval = setInterval(() => { timeLeft--; if (timeLeft <= 0) { clearInterval(timerInterval); submitQuiz(); return; } updateTimerDisplay(); }, 1000); }

function updateTimerDisplay() { if (!timerEl) return; const minutes = Math.floor(timeLeft / 60); const seconds = timeLeft % 60; timerEl.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`; }

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
    showHome();
}

function renderAdminPanel() {
    const statsEl = document.getElementById('adminStats');
    const usersEl = document.getElementById('adminUsers');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (statsEl) statsEl.textContent = `Users: ${users.length} | Questions: ${questionManager.getQuestions().length}`;
    if (usersEl) usersEl.innerHTML = users.map(u => `<div class="admin-user"><strong>${u.username}</strong> — ${u.role}</div>`).join('');
}
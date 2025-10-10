document.addEventListener('DOMContentLoaded', function() {
    // Load the header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            // Insert the header at the beginning of the body
            document.body.insertAdjacentHTML('afterbegin', data);
            
            // Add the necessary styles
            if (!document.querySelector('link[href="css/header.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'css/header.css';
                document.head.appendChild(link);
            }
            
            // Update active link
            updateActiveLink();
            
            // Initialize header functionality
            initializeHeader();
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
});

function updateActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initializeHeader() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
    
    // Handle header scroll behavior
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.home-nav');
        if (window.scrollY > 50) {
            nav.style.background = '#1a237e';
            nav.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'transparent';
            nav.style.boxShadow = 'none';
        }
    });
}

// Function to toggle mobile menu
function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}
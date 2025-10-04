document.addEventListener('DOMContentLoaded', function() {
    // Initialize Slideshow
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const slideInterval = 5000; // Change slide every 5 seconds

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.add('hidden'));
        
        // Show the current slide
        slides[index].classList.remove('hidden');

        // Update navigation dots
        updateNavigationDots(index);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Initialize slide navigation dots
    function initializeSlideNavigation() {
        const dots = document.querySelectorAll('[data-slide]');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
    }

    // Update navigation dots
    function updateNavigationDots(activeIndex) {
        const dots = document.querySelectorAll('[data-slide]');
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('opacity-100');
                dot.classList.remove('opacity-50');
            } else {
                dot.classList.add('opacity-50');
                dot.classList.remove('opacity-100');
            }
        });
    }

    // Check Authentication State
    function checkAuthState() {
        const userData = localStorage.getItem('userData');
        const adminData = localStorage.getItem('adminData');
        const authButtons = document.getElementById('authButtons');
        
        if (userData || adminData) {
            // User is logged in
            document.querySelector('button[onclick="toggleAuth()"]').classList.add('hidden');
            document.querySelector('button[onclick="handleLogout()"]').classList.remove('hidden');
        } else {
            // User is logged out
            document.querySelector('button[onclick="toggleAuth()"]').classList.remove('hidden');
            document.querySelector('button[onclick="handleLogout()"]').classList.add('hidden');
        }
    }

    // Initialize
    initializeSlideNavigation();
    showSlide(currentSlide);
    checkAuthState();

    // Start the slideshow
    setInterval(nextSlide, slideInterval);

    // Add event listeners for auth state changes
    window.addEventListener('storage', checkAuthState);
});
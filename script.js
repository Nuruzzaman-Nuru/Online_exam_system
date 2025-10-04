document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const slideInterval = 5000; // Change slide every 5 seconds

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.add('hidden'));
        
        // Show the current slide
        slides[index].classList.remove('hidden');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Start the slideshow
    setInterval(nextSlide, slideInterval);
});
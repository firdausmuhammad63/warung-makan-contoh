
document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // Mobile Menu Toggle
    // ===============================
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
    });

    // Tutup menu ketika klik di luar menu
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });

    // ===============================
    // Hero Slider
    // ===============================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = (i === index) ? '1' : '0';
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('bg-white', i === index);
            dot.classList.toggle('bg-white/50', i !== index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Auto slide setiap 5 detik
    slideInterval = setInterval(nextSlide, 5000);
    showSlide(currentSlide);

    // Dot click event
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            let index = parseInt(dot.getAttribute('data-index'));
            showSlide(index);
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });

    // ===============================
    // Fade-in on scroll
    // ===============================
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // ===============================
    // Optional: Sticky Navbar Shadow on Scroll
    // ===============================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50){
            navbar.classList.add('shadow-2xl');
        } else {
            navbar.classList.remove('shadow-2xl');
        }
    });

    // ===============================
    // Optional: Back to Top Button
    // ===============================
    const backToTop = document.createElement('button');
    backToTop.id = "backToTop";
    backToTop.innerHTML = '&#8679;';
    backToTop.className = "fixed bottom-8 right-8 w-12 h-12 bg-amber-800 text-white rounded-full shadow-lg hover:bg-amber-700 transition-all duration-300 opacity-0 invisible flex items-center justify-center text-2xl z-50";
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if(window.scrollY > 300){
            backToTop.classList.remove('opacity-0', 'invisible');
            backToTop.classList.add('opacity-100', 'visible');
        } else {
            backToTop.classList.add('opacity-0', 'invisible');
            backToTop.classList.remove('opacity-100', 'visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});


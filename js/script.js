// ===== MOBILE NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && navMenu) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && navMenu) {
            if (!mobileMenu.contains(event.target) && !navMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });
});

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== BACK TO TOP BUTTON =====
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide back to top button
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ===== FILTER FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    // Events filter
    const eventsFilters = document.querySelectorAll('.events-filters .filter-btn');
    const eventCards = document.querySelectorAll('.event-card');
    
    eventsFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            eventsFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            eventCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Projects filter
    const projectsFilters = document.querySelectorAll('.projects-filters .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    projectsFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            projectsFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// ===== FORM HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Basic validation
            if (!data.firstName || !data.lastName || !data.email || !data.interest || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            this.reset();
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showNotification('Please enter your email address.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate newsletter subscription
            showNotification('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
        });
    }
});

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-weight: 500;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== LOADING ANIMATIONS =====
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .event-card, .project-card, .member-card, .announcement-item, .stat-card, .resource-category');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
});

// ===== STATISTICS COUNTER ANIMATION =====
document.addEventListener('DOMContentLoaded', function() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number with suffix
            const text = element.textContent;
            const suffix = text.replace(/[\d\s]/g, '');
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    };
    
    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        counterObserver.observe(stat);
    });
});

// ===== TYPING EFFECT FOR HERO SECTION =====
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.querySelector('.highlight')) {
        const highlightText = heroTitle.querySelector('.highlight');
        const words = ['Innovation', 'Technology', 'Collaboration', 'Learning', 'Growth'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                highlightText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                highlightText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 100 : 150;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Wait before deleting
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Wait before typing next word
            }
            
            setTimeout(typeEffect, typeSpeed);
        }
        
        // Start typing effect after a delay
        setTimeout(typeEffect, 1000);
    }
});

// ===== SEARCH FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    // Add search functionality if search input exists
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const searchableItems = document.querySelectorAll('[data-searchable]');
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});

// ===== LAZY LOADING FOR IMAGES =====
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ===== THEME TOGGLE (if implemented) =====
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});

// ===== ADD CSS ANIMATIONS =====
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS animations to head if not already added
    if (!document.querySelector('#dynamic-animations')) {
        const style = document.createElement('style');
        style.id = 'dynamic-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .notification-close:hover {
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 16); // ~60fps
    });
    
    // Prefetch important resources
    const importantLinks = document.querySelectorAll('a[href^="#"]');
    importantLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Prefetch any images in the target section
                const images = target.querySelectorAll('img:not([src])');
                images.forEach(img => {
                    if (img.dataset.src) {
                        const tempImg = new Image();
                        tempImg.src = img.dataset.src;
                    }
                });
            }
        });
    });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Script error:', e.error);
    // Could implement error reporting here
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation support
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    
    focusableElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (this.tagName === 'BUTTON' || this.role === 'button') {
                    e.preventDefault();
                    this.click();
                }
            }
        });
    });
    
    // Add ARIA labels where needed
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
        if (!button.textContent.trim()) {
            const icon = button.querySelector('i');
            if (icon) {
                const iconClass = icon.className;
                if (iconClass.includes('menu')) {
                    button.setAttribute('aria-label', 'Toggle navigation menu');
                } else if (iconClass.includes('close')) {
                    button.setAttribute('aria-label', 'Close');
                } else if (iconClass.includes('arrow-up')) {
                    button.setAttribute('aria-label', 'Back to top');
                }
            }
        }
    });
});

// ===== ANALYTICS INTEGRATION (placeholder) =====
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    console.log(`Analytics: ${category} - ${action} - ${label}`);
}

// Track important interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const formName = this.className || 'unknown-form';
            trackEvent('Form', 'Submit', formName);
        });
    });
    
    // Track navigation clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('href').replace('#', '');
            trackEvent('Navigation', 'Click', section);
        });
    });
    
    // Track button clicks
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim() || 'button';
            trackEvent('Button', 'Click', buttonText);
        });
    });
});

console.log('NU Technocrats Club website loaded successfully! 🚀');
(function() {
    'use strict';

    // === Mobile Navigation Toggle ===
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // === Smooth Scroll ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // === Navbar scroll effect ===
    const navbar = document.querySelector('.navbar');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 100);
                ticking = false;
            });
            ticking = true;
        }
    });

    // === Theme Toggle ===
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'fas fa-moon';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        }
    });

    // === Contact Form ===
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = new FormData(this);
            const name = data.get('name');
            const email = data.get('email');
            const subject = data.get('subject');
            const message = data.get('message');

            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // === Notification System ===
    function showNotification(message, type) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>`;
        document.body.appendChild(notif);

        const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
        Object.assign(notif.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: bgColor,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            zIndex: '10000',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out'
        });

        notif.querySelector('.notification-close').addEventListener('click', () => notif.remove());
        setTimeout(() => { if (notif.parentNode) notif.remove(); }, 5000);
    }

    // === Intersection Observer for Scroll Animations ===
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // === Skill Bars Animation ===
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.skill-progress').forEach(bar => {
                        const w = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => { bar.style.width = w; }, 300);
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        skillsObserver.observe(skillsSection);
    }

    // === Initialize on DOM Ready ===
    document.addEventListener('DOMContentLoaded', () => {
        // Observe animation elements
        document.querySelectorAll('.skill-category, .timeline-item, .education-card, .stat, .preprint-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Typing effect using data attribute to avoid flash
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && !heroTitle.dataset.typed) {
            heroTitle.dataset.typed = 'true';
            const text = heroTitle.textContent;
            heroTitle.innerHTML = '';
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    heroTitle.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, 30);
                }
            };
            setTimeout(type, 500);
        }
    });

})();

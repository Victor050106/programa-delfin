/* ============================
   Programa Delfín - Universidad Libre Barranquilla
   Script de interactividad
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== Navbar scroll effect =====
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveSection();
    });

    // ===== Menú móvil =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== Resaltar sección activa =====
    const sections = document.querySelectorAll('section[id]');

    function updateActiveSection() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollPos >= top && scrollPos < bottom) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // ===== Animación al hacer scroll (timeline + cards) =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item').forEach(item => {
        scrollObserver.observe(item);
    });

    // ===== Smooth scroll para enlaces internos =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ===== Contador animado en hero stats =====
    const stats = document.querySelectorAll('.stat-number');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => animateCounter(stat));
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroObserver.observe(heroStats);

    function animateCounter(el) {
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (!match) return;

        const finalValue = parseInt(match[1], 10);
        const suffix = text.replace(match[1], '');
        let current = 0;
        const duration = 1500;
        const step = Math.max(1, Math.ceil(finalValue / (duration / 16)));

        const interval = setInterval(() => {
            current += step;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(interval);
            }
            el.textContent = current + suffix;
        }, 16);
    }

    // ===== Inicializar sección activa al cargar =====
    updateActiveSection();

    // ===== Log de bienvenida (consola para desarrolladores) =====
    console.log('%c¡Bienvenidos al Programa Delfín! 🐬', 'color: #c8102e; font-size: 16px; font-weight: bold;');
    console.log('%cUniversidad Libre - Seccional Barranquilla', 'color: #d4a017; font-size: 12px;');
});

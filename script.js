/* ============================
   Programa Delfín - Universidad Libre Barranquilla
   Script de interactividad
   ============================ */

/* -------------------------------------------------------------
   CONFIGURACIÓN DEL FORMULARIO DE INSCRIPCIÓN
   -------------------------------------------------------------
   Pega aquí la URL base de tu Google Form (la del prefill).
   Pasos para obtener el enlace prellenado:
     1. Abre tu Google Form → menú ⋮ → "Obtener enlace prellenado".
     2. En el campo "Actividad" escribe: __ACTIVIDAD__
        (después lo reemplazaremos por el nombre real).
     3. Clic en "Obtener enlace" → copia la URL.
     4. Pégala abajo entre las comillas.

   Si no tienes formulario aún, deja la URL en blanco: el modal
   mostrará un aviso de "próximamente".
   ------------------------------------------------------------- */
const FORM_URL = ''; // p.ej. 'https://docs.google.com/forms/d/e/XXXX/viewform?usp=pp_url&entry.123456=__ACTIVIDAD__'

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

        // Si el número es un año o un valor grande, no animamos
        if (finalValue > 100) {
            el.textContent = finalValue + suffix;
            return;
        }

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

    // ===== Modal de inscripción a actividades =====
    const formModal = document.getElementById('formModal');
    const formModalTitle = document.getElementById('formModalTitle');
    const formModalMeta = document.getElementById('formModalMeta');
    const formModalLink = document.getElementById('formModalLink');
    const formModalClose = document.getElementById('formModalClose');
    const formModalCancel = document.getElementById('formModalCancel');
    let lastFocused = null;

    const iconClock = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    const iconPin = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

    function setLinkLabel(text) {
        // Conserva el ícono SVG dentro del enlace; solo cambia el texto.
        const first = formModalLink.firstChild;
        if (first && first.nodeType === Node.TEXT_NODE) {
            first.textContent = text;
        } else {
            formModalLink.insertBefore(document.createTextNode(text), formModalLink.firstChild);
        }
    }

    function openFormModal(activity, time, place, directForm) {
        if (!formModal) return;

        formModalTitle.textContent = activity;

        let metaHtml = '';
        if (time) metaHtml += `<span>${iconClock} ${time}</span>`;
        if (place) metaHtml += `<span>${iconPin} ${place}</span>`;
        formModalMeta.innerHTML = metaHtml;

        // Prioridad: formulario específico de la actividad (data-form) >
        // formulario genérico con prellenado (FORM_URL).
        let url = '';
        if (directForm) {
            url = directForm;
        } else if (FORM_URL) {
            url = FORM_URL.replace('__ACTIVIDAD__', encodeURIComponent(activity));
        }

        if (url) {
            formModalLink.href = url;
            setLinkLabel('Ir al formulario ');
            formModalLink.removeAttribute('aria-disabled');
            formModalLink.style.pointerEvents = '';
            formModalLink.style.opacity = '';
        } else {
            formModalLink.href = '#';
            setLinkLabel('Formulario próximamente ');
            formModalLink.setAttribute('aria-disabled', 'true');
            formModalLink.style.pointerEvents = 'none';
            formModalLink.style.opacity = '0.65';
        }

        lastFocused = document.activeElement;
        formModal.hidden = false;
        requestAnimationFrame(() => formModal.classList.add('active'));
        document.body.style.overflow = 'hidden';
        setTimeout(() => formModalClose.focus(), 50);
    }

    function closeFormModal() {
        if (!formModal) return;
        formModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            formModal.hidden = true;
            if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        }, 300);
    }

    document.querySelectorAll('.event-row').forEach(row => {
        row.addEventListener('click', () => {
            const activity = row.dataset.activity || row.querySelector('.event-name')?.textContent.trim() || 'Actividad';
            const time = row.dataset.time || '';
            const place = row.dataset.place || '';
            const directForm = row.dataset.form || '';
            openFormModal(activity, time, place, directForm);
        });
    });

    if (formModalClose) formModalClose.addEventListener('click', closeFormModal);
    if (formModalCancel) formModalCancel.addEventListener('click', closeFormModal);
    if (formModal) {
        formModal.addEventListener('click', (e) => {
            if (e.target === formModal) closeFormModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && formModal && !formModal.hidden) closeFormModal();
    });

    // ===== Inicializar sección activa al cargar =====
    updateActiveSection();

    // ===== Log de bienvenida (consola para desarrolladores) =====
    console.log('%cPrograma Delfín 2026', 'color: #C8102E; font-size: 16px; font-weight: bold;');
    console.log('%cUniversidad Libre · Seccional Barranquilla', 'color: #C8961F; font-size: 12px;');
});

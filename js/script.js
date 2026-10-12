/* ==========================================================================
   Droguería New Life · Script principal
   Solo funcionalidad puntual: sin frameworks ni dependencias.
   ========================================================================== */

(() => {
    'use strict';

    /* ----------------------------------------------------------------------
       CONFIGURACIÓN CENTRAL DEL NEGOCIO
       Reemplaza estos valores cuando tengas la información real.
       ---------------------------------------------------------------------- */
    const CONFIG = {
        businessName: 'Droguería New Life',
        /* Número de WhatsApp en formato internacional, solo dígitos (sin + ni espacios). */
        whatsappNumber: '573206934045',
        whatsappMessage: 'Hola, me gustaría conocer más sobre los productos y servicios disponibles.'
    };

    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    /* ----------------------------------------------------------------------
       ENLACES DE WHATSAPP
       Genera el enlace wa.me a partir de la configuración central.
       ---------------------------------------------------------------------- */
    const buildWhatsAppUrl = (message) =>
        `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

    $$('[data-whatsapp]').forEach((link) => {
        link.href = buildWhatsAppUrl(CONFIG.whatsappMessage);
        link.target = '_blank';
        link.rel = 'noopener';
    });

    /* ----------------------------------------------------------------------
       AÑO DINÁMICO EN EL PIE DE PÁGINA
       ---------------------------------------------------------------------- */
    const yearEl = $('#year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    /* ----------------------------------------------------------------------
       HEADER: cambio de apariencia al hacer scroll
       ---------------------------------------------------------------------- */
    const header = $('#site-header');
    const navLinks = $$('.nav-link');
    const sections = $$('main section[id]');

    let scrollTicking = false;

    const setActive = (id) => {
        navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'true');
            } else {
                link.classList.remove('is-active');
                link.removeAttribute('aria-current');
            }
        });
    };

    const updateActiveLink = () => {
        // Desplazamiento usado también en scroll-padding-top del CSS.
        const offset = header.offsetHeight + 56;
        const activePos = window.scrollY + offset;
        let currentId = sections.length ? sections[0].id : '';

        for (const section of sections) {
            if (section.offsetTop <= activePos + 4) {
                currentId = section.id;
            } else {
                break;
            }
        }

        setActive(currentId);
    };

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const id = link.getAttribute('href').slice(1);
            setActive(id);
        });
    });

    const handleScroll = () => {
        if (scrollTicking) return;
        scrollTicking = true;

        window.requestAnimationFrame(() => {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
            updateActiveLink();
            scrollTicking = false;
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveLink, { passive: true });

    /* ----------------------------------------------------------------------
       MENÚ MÓVIL (hamburguesa)
       ---------------------------------------------------------------------- */
    const navToggle = $('.nav-toggle');
    const navList = $('#primary-nav');

    const closeMenu = () => {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-locked');
    };

    navToggle.addEventListener('click', () => {
        const isOpen = header.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('nav-locked', isOpen);
    });

    navList.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    /* ----------------------------------------------------------------------
       ESTADO ABIERTO / CERRADO Y DÍA DE HOY
       Horario del negocio en minutos desde medianoche (formato 24 h).
       ---------------------------------------------------------------------- */
    const SCHEDULE = [
        { days: [1, 2, 3, 4, 5], opens: 9 * 60, closes: 20 * 60 + 30 }, // lun a vie
        { days: [6], opens: 9 * 60, closes: 19 * 60 }                    // sábado
    ];

    const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    const formatHour = (minutes) => {
        const hour24 = Math.floor(minutes / 60);
        const mins = String(minutes % 60).padStart(2, '0');
        const suffix = hour24 >= 12 ? 'p. m.' : 'a. m.';
        const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
        return `${hour12}:${mins} ${suffix}`;
    };

    const slotForDay = (day) => SCHEDULE.find((slot) => slot.days.includes(day)) || null;

    const updateOpenStatus = () => {
        const wrap = $('[data-open-status]');
        const label = $('[data-open-status-text]');
        if (!wrap || !label) return;

        const now = new Date();
        const today = now.getDay();
        const minutes = now.getHours() * 60 + now.getMinutes();
        const todaySlot = slotForDay(today);

        if (todaySlot && minutes >= todaySlot.opens && minutes < todaySlot.closes) {
            wrap.classList.remove('is-closed');
            label.textContent = `Abierto ahora · cerramos a las ${formatHour(todaySlot.closes)}`;
            return;
        }

        wrap.classList.add('is-closed');

        if (todaySlot && minutes < todaySlot.opens) {
            label.textContent = `Cerrado · abrimos hoy a las ${formatHour(todaySlot.opens)}`;
            return;
        }

        for (let offset = 1; offset <= 7; offset += 1) {
            const day = (today + offset) % 7;
            const slot = slotForDay(day);
            if (slot) {
                const when = offset === 1 ? 'mañana' : `el ${DAY_NAMES[day]}`;
                label.textContent = `Cerrado · abrimos ${when} a las ${formatHour(slot.opens)}`;
                return;
            }
        }
    };

    updateOpenStatus();
    window.setInterval(updateOpenStatus, 60000);

    const markTodayInHours = () => {
        const today = new Date().getDay();
        $$('.hours-card').forEach((row) => {
            const days = (row.getAttribute('data-days') || '').split(/\s+/).filter(Boolean).map(Number);
            if (!days.includes(today)) return;
            row.classList.add('is-today');
            const dayName = row.querySelector('.hours-day');
            if (dayName && !dayName.querySelector('.hours-today')) {
                const tag = document.createElement('span');
                tag.className = 'hours-today';
                tag.textContent = 'Hoy';
                dayName.append(tag);
            }
        });
    };

    markTodayInHours();

    /* ----------------------------------------------------------------------
       CATEGORÍAS: acordeón ligero
       ---------------------------------------------------------------------- */
    const handleAccordion = (button) => {
        const details = document.getElementById(button.getAttribute('aria-controls'));
        const card = button.closest('.category-card');
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            button.setAttribute('aria-expanded', 'false');
            details.style.maxHeight = '0px';
            card.classList.remove('is-open');
        } else {
            button.setAttribute('aria-expanded', 'true');
            details.style.maxHeight = details.scrollHeight + 'px';
            card.classList.add('is-open');
        }
    };

    $$('.category-toggle').forEach((button) => {
        button.addEventListener('click', () => handleAccordion(button));
    });

    /* ----------------------------------------------------------------------
       CARRUSEL: galería de imágenes del local
       ---------------------------------------------------------------------- */
    const carousel = $('.carousel');
    if (carousel) {
        const slides = $$('.carousel__slide', carousel);
        const dots = $$('.carousel__dot', carousel);
        const prevBtn = $('.carousel__btn--prev', carousel);
        const nextBtn = $('.carousel__btn--next', carousel);
        let current = 0;
        let autoplayTimer = null;

        const goTo = (index) => {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        };

        prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
        nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
        });

        carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
        carousel.addEventListener('mouseleave', startAutoplay);

        function startAutoplay() {
            clearInterval(autoplayTimer);
            autoplayTimer = setInterval(() => goTo(current + 1), 5000);
        }

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }

        startAutoplay();
    }
})();
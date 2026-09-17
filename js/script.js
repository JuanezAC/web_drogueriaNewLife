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

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
       APARICIÓN CONSCIENTE AL HACER SCROLL (reveal)
       Respeta prefers-reduced-motion.
       ---------------------------------------------------------------------- */
    const revealEls = $$('.reveal');

    if ('IntersectionObserver' in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );

        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

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
})();
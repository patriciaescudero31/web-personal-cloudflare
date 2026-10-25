/**
 * Patri Escudero · Make Up Artist — script.js
 * Navegación, Modal de contacto, Tabs de proyectos, Scroll reveal y efectos UI
 */

document.addEventListener('DOMContentLoaded', () => {

  // ═══ ELEMENTOS ═══
  const navbar        = document.getElementById('navbar');
  const navToggle     = document.getElementById('nav-toggle');
  const navMenu       = document.getElementById('nav-menu');
  const navLinks      = document.querySelectorAll('.nav-link');
  const contactModal  = document.getElementById('contact-modal');
  const modalClose    = document.getElementById('modal-close');
  const btnContactar  = document.getElementById('btn-contactar');
  const contactForm   = document.getElementById('contact-form');
  const toast         = document.getElementById('toast');
  const toastText     = document.getElementById('toast-text');
  const navContactBtn = document.getElementById('nav-contact-btn');
  const heroContactar = document.getElementById('hero-contactar');

  // ═══ 1. NAVBAR — scroll shadow ═══
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ═══ 2. MOBILE MENU ═══
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-xmark', isOpen);
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // ═══ 3. ACTIVE NAV LINK highlight ═══
  const sections = document.querySelectorAll('section[id]');
  const highlightNavLink = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-menu a[href*="${id}"]`);
      if (link) {
        const isActive = scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight;
        link.classList.toggle('active', isActive);
      }
    });
  };
  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // ═══ 4. MODAL DE CONTACTO ═══
  const openModal = () => {
    contactModal.classList.add('active');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = contactForm.querySelector('input');
    if (firstInput) firstInput.focus();
  };

  const closeModal = () => {
    contactModal.classList.remove('active');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (btnContactar) btnContactar.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (navContactBtn) navContactBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (heroContactar) heroContactar.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (contactModal) {
    contactModal.addEventListener('click', (e) => { if (e.target === contactModal) closeModal(); });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) closeModal();
  });

  // ═══ 5. FORMULARIO + TOAST ═══
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = document.getElementById('form-name').value.trim();
      closeModal();
      contactForm.reset();
      showToast(`¡Gracias, ${nameVal}! Tu mensaje ha sido recibido. Te contactaré lo antes posible.`);
    });
  }

  function showToast(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
  }

  // ═══ 6. TABS DE PROYECTOS (filtro por categoría) ═══
  const tabButtons  = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Quitar clase activa de todos
      tabButtons.forEach(b => b.classList.remove('tab-btn--active'));
      btn.classList.add('tab-btn--active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'todos' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ═══ 7. SCROLL REVEAL ═══
  const revealEls = document.querySelectorAll(
    '.service-card, .project-card, .about-grid, .about-side, .contact-box, .section-header, .highlight-item, .hero-stats, .hero-card-frame'
  );

  revealEls.forEach(el => el.setAttribute('data-reveal', ''));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('revealed'), i * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // ═══ 8. SMOOTH ANCHOR SCROLL ═══
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ═══ 9. COUNTER ANIMATION (stats in hero) ═══
  function animateCount(el, target, suffix = '', duration = 1400) {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statItems = document.querySelectorAll('.stat-item strong');
  if (statItems.length) {
    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          statItems.forEach(el => {
            const text = el.textContent.trim();
            const match = text.match(/^(\d+)/);
            if (match) {
              const num = parseInt(match[1]);
              const suffix = text.replace(match[1], '');
              el.textContent = '0' + suffix;
              animateCount(el, num, suffix);
            }
          });
          statsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(document.querySelector('.hero-stats'));
  }

});

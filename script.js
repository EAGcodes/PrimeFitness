/* =========================================================
   PRIME FITNESS — script.js
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader && loader.classList.add('is-hidden'), 500);
  });
  // Fallback in case 'load' is slow/blocked
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('is-hidden');
  }, 2200);

  /* ---------- Active link highlight on scroll ---------- */
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinkEls = Array.from(document.querySelectorAll('.nav-link'));

  function setActiveNavLink() {
    let currentId = sections[0] ? sections[0].id : '';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });

    navLinkEls.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
    });
  }

  /* ---------- Sticky nav (glassmorphism on scroll) ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
    setActiveNavLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-group]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated number counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const isInfinity = el.getAttribute('data-infinity') === 'true';
    const duration = 1500;
    const start = performance.now();

    if (isInfinity) {
      el.textContent = '∞';
      return;
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterEls.forEach((el) => counterObserver.observe(el));

  /* ---------- Stat progress bars (load-counter signature element) ---------- */
  const statBars = document.querySelectorAll('.stat-bar');
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-filled');
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  statBars.forEach((bar) => barObserver.observe(bar));

  /* ---------- Contact form (static-friendly: no backend) ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const message = form.message.value.trim();

      if (!name || !phone) {
        formStatus.textContent = 'Please fill in your name and phone number.';
        formStatus.style.color = '#ff6b6b';
        return;
      }

      // Route to WhatsApp with prefilled message (works without a backend).
      const text = encodeURIComponent(
        `Hi Prime Fitness! My name is ${name} (${phone}).\n${message || "I'd like more info on membership."}`
      );
      formStatus.style.color = '';
      formStatus.textContent = 'Opening WhatsApp...';
      window.open(`https://wa.me/251967830734?text=${text}`, '_blank');
      form.reset();
      setTimeout(() => { formStatus.textContent = ''; }, 4000);
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Subtle parallax on hero shapes ---------- */
  const heroGlows = document.querySelectorAll('.hero-glow, .hero-plate');
  let lastY = 0;
  function parallax() {
    const y = window.scrollY;
    if (Math.abs(y - lastY) > 1) {
      heroGlows.forEach((el, i) => {
        const speed = 0.06 + (i % 3) * 0.03;
        el.style.transform = `translateY(${y * speed}px)`;
      });
      lastY = y;
    }
    requestAnimationFrame(parallax);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(parallax);
  }
})();
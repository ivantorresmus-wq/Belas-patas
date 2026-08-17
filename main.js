// =====================================================
// BELAS PATAS — main.js
// =====================================================

// ── NAV STUCK ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('stuck');
  } else {
    navbar.classList.remove('stuck');
  }
}, { passive: true });

// ── HAMBURGER MENU ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // animate hamburger
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translateY(7px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ── SMOOTH SCROLL ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight + 10;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── INTERSECTION OBSERVER — FADE IN ──────────────────
const fadeEls = document.querySelectorAll('.fade, .fade-r');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ── TABS — CURSOS ─────────────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-${tab}-content`)?.classList.add('active');

    // re-trigger fade for cards in the newly shown tab
    const newCards = document.getElementById(`tab-${tab}-content`)?.querySelectorAll('.fade');
    newCards?.forEach(card => {
      card.classList.remove('in');
      // Force reflow
      void card.offsetWidth;
      card.classList.add('in');
    });
  });
});

// ── HERO STAT COUNTER ANIMATION ───────────────────────
function animateCounter(el, target, duration = 1600, suffix = '+') {
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = suffix + Math.floor(eased * target).toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      const valEl = entry.target.querySelector('.stat-val');
      if (!valEl || valEl.dataset.animated) return;
      valEl.dataset.animated = 'true';

      if (id === 'stat-alunos') animateCounter(valEl, 5000);
      if (id === 'stat-cursos') animateCounter(valEl, 20);
      if (id === 'stat-anos') animateCounter(valEl, 15);

      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

['stat-alunos', 'stat-cursos', 'stat-anos'].forEach(id => {
  const el = document.getElementById(id);
  if (el) statsObserver.observe(el);
});

// ── ACTIVE NAV LINK on scroll ──────────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--blue)';
    }
  });
}, { passive: true });

// ── Initial fade trigger for visible elements ─────────
window.addEventListener('load', () => {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('in');
    }
  });
});

// ── HERO SLIDER ───────────────────────────────────────
const slides = document.querySelectorAll('.slide');
const bullets = document.querySelectorAll('.slider-bullet');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  bullets.forEach(b => b.classList.remove('active'));
  
  // Re-trigger animations
  const fadeElements = slides[index].querySelectorAll('.fade');
  fadeElements.forEach(el => {
    el.classList.remove('in');
    void el.offsetWidth; // trigger reflow
    el.classList.add('in');
  });

  slides[index].classList.add('active');
  bullets[index].classList.add('active');
  currentSlide = index;
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  showSlide(next);
}

function prevSlide() {
  const prev = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(prev);
}

function startSlider() {
  slideInterval = setInterval(nextSlide, 7000);
}

function resetSliderTimer() {
  clearInterval(slideInterval);
  startSlider();
}

if (slides.length > 0) {
  nextBtn.addEventListener('click', () => { nextSlide(); resetSliderTimer(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetSliderTimer(); });
  bullets.forEach((btn, idx) => {
    btn.addEventListener('click', () => { showSlide(idx); resetSliderTimer(); });
  });
  
  // Initialize animations on first slide
  setTimeout(() => {
    const fadeElements = slides[0].querySelectorAll('.fade');
    fadeElements.forEach(el => el.classList.add('in'));
  }, 100);

  startSlider();
}

/* ==============================================
   main.js — Siqi Dai Personal Website
   Features:
     1. Scroll progress bar
     2. Active nav highlight (IntersectionObserver)
     3. Section fade-in on scroll
     4. Back-to-top button
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. Scroll Progress Bar ---- */
  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });


  /* ---- 2. Active Nav Highlight ---- */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const id = entry.target.id;
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => navObserver.observe(section));


  /* ---- 3. Section Fade-in on Scroll ---- */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // only animate once
      }
    });
  }, {
    threshold: 0.08
  });

  // Also fade in header
  const headerEl = document.querySelector('header');
  if (headerEl) {
    headerEl.style.opacity = '0';
    headerEl.style.transform = 'translateY(20px)';
    headerEl.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    setTimeout(() => {
      headerEl.style.opacity = '1';
      headerEl.style.transform = 'translateY(0)';
    }, 100);
  }

  sections.forEach(section => fadeObserver.observe(section));


  /* ---- 4. Back-to-Top Button ---- */
  const topBtn = document.getElementById('back-to-top');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        topBtn.classList.add('show');
      } else {
        topBtn.classList.remove('show');
      }
    }, { passive: true });

    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- 5. Dark Mode Toggle ---- */
  const themeBtn = document.createElement('button');
  themeBtn.id = 'theme-toggle';
  themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  themeBtn.setAttribute('aria-label', 'Toggle dark mode');
  document.body.appendChild(themeBtn);

  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });

});

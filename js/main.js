document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const progressBar = document.getElementById("progress-bar");
  const nav = document.querySelector(".site-nav");
  const sections = document.querySelectorAll("section[id]");
  const revealItems = document.querySelectorAll("[data-reveal]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const topBtn = document.getElementById("back-to-top");
  const interactiveCards = document.querySelectorAll(".interactive-card");
  const typedRole = document.getElementById("typed-role");
  const phrases = [
    "I build with machine learning, research, cybersecurity, and practical software systems.",
    "I care about elegant technical work that still feels useful and clear.",
    "I’m interested in ML systems, accessibility, security, and clean product thinking."
  ];

  const themeBtn = document.createElement("button");
  themeBtn.id = "theme-toggle";
  themeBtn.setAttribute("aria-label", "Toggle dark mode");
  document.body.appendChild(themeBtn);

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
      return;
    }

    root.removeAttribute("data-theme");
    themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }

  applyTheme(localStorage.getItem("theme") || "light");

  themeBtn.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });

  function updateScrollUi() {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }

    if (nav) {
      nav.classList.toggle("scrolled", scrollTop > 12);
    }

    if (topBtn) {
      topBtn.classList.toggle("show", scrollTop > 420);
    }
  }

  window.addEventListener("scroll", updateScrollUi, { passive: true });
  updateScrollUi();

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => link.classList.remove("active"));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) {
          active.classList.add("active");
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "-20% 0px -60% 0px"
    }
  );

  sections.forEach((section) => navObserver.observe(section));

  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--mouse-x", `${mouseX}%`);
      card.style.setProperty("--mouse-y", `${mouseY}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
    });
  });

  if (typedRole) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex += 1;
        typedRole.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          window.setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndex -= 1;
        typedRole.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      window.setTimeout(tick, deleting ? 28 : 42);
    }

    typedRole.textContent = "";
    tick();
  }
});

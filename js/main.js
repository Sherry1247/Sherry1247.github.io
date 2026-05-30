const init = () => {
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

  const savedTheme = localStorage.getItem("theme");
  applyTheme(savedTheme || "dark");

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

  function createBinaryParticle(x, y) {
    const particle = document.createElement("span");
    particle.className = "binary-particle";
    particle.textContent = Math.random() > 0.5 ? "01" : "10";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty("--dx", `${Math.random() > 0.5 ? 12 : -12}px`);
    particle.style.setProperty("--dy", `${-36 - Math.random() * 18}px`);
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 920);
  }

  let lastBinaryTime = 0;
  document.addEventListener("mousemove", (event) => {
    const now = Date.now();
    if (now - lastBinaryTime < 80) return;
    lastBinaryTime = now;

    if (event.target.closest("button") || event.target.closest("a")) {
      return;
    }
    createBinaryParticle(event.clientX, event.clientY);
  });

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
      threshold: 0.08,
      rootMargin: "0px 0px -12% 0px"
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
      const rotateY = ((mouseX - 50) / 50) * -5;
      const rotateX = ((mouseY - 50) / 50) * 4;

      card.style.setProperty("--mouse-x", `${mouseX}%`);
      card.style.setProperty("--mouse-y", `${mouseY}%`);
      card.style.setProperty("--project-rotate-x", `${rotateX}deg`);
      card.style.setProperty("--project-rotate-y", `${rotateY}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
      card.style.setProperty("--project-rotate-x", "0deg");
      card.style.setProperty("--project-rotate-y", "0deg");
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

  // Enhanced button interactions
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      btn.style.setProperty("--btn-x", `${x}px`);
      btn.style.setProperty("--btn-y", `${y}px`);
    });
  });

  // Interests Expansion Panel Logic
  const interestCards = document.querySelectorAll(".interest-card");
  const expansionPanel = document.getElementById("interests-expansion-panel");
  const panelContents = document.querySelectorAll(".interest-panel-content");

  // Set up bookshelf inspection details on load (since elements are static in DOM)
  const readingPanel = document.getElementById("panel-reading");
  if (readingPanel) {
    const books = readingPanel.querySelectorAll(".book-item");
    const detailsBox = readingPanel.querySelector("#book-details");
    
    if (books.length && detailsBox) {
      books.forEach((book) => {
        const updateBox = () => {
          const title = book.getAttribute("data-title");
          const author = book.getAttribute("data-author");
          const desc = book.getAttribute("data-desc");
          detailsBox.classList.add("active");
          detailsBox.innerHTML = `
            <h5>${title}</h5>
            <p class="book-author">By ${author}</p>
            <p class="book-desc">${desc}</p>
          `;
        };
        book.addEventListener("mouseenter", updateBox);
        book.addEventListener("click", updateBox);
      });
    }
  }

  interestCards.forEach((card) => {
    card.addEventListener("click", () => {
      const type = card.getAttribute("data-interest-type");
      if (!type) return;

      const targetPanel = document.getElementById(`panel-${type}`);

      // Handle card toggle active
      if (card.classList.contains("active")) {
        card.classList.remove("active");
        expansionPanel.classList.remove("expanded");
        if (targetPanel) {
          targetPanel.classList.remove("active");
        }
        return;
      }

      // Close other cards and panels
      interestCards.forEach((c) => c.classList.remove("active"));
      panelContents.forEach((p) => p.classList.remove("active"));

      // Activate current
      card.classList.add("active");
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
      expansionPanel.classList.add("expanded");
    });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

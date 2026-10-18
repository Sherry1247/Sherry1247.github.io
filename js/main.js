const init = () => {
  const root = document.documentElement;
  const progressBar = document.getElementById("progress-bar");
  const nav = document.querySelector(".site-nav");
  const sections = document.querySelectorAll("section[id]");
  const revealItems = document.querySelectorAll("[data-reveal]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const topBtn = document.getElementById("back-to-top");
  const typedRole = document.getElementById("typed-role");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-links");
  const phrases = [
    "I build intelligent systems that sense, adapt, and help people act."
  ];

  const themeBtn = document.createElement("button");
  themeBtn.id = "theme-toggle";
  themeBtn.setAttribute("aria-label", "Toggle dark mode");
  document.body.appendChild(themeBtn);

  function applyTheme(theme) {
    const nextTheme = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    themeBtn.innerHTML = nextTheme === "dark"
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  }

  const savedTheme = localStorage.getItem("theme");
  applyTheme(savedTheme === "light" ? "light" : "dark");

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

  if (navToggle && navMenu) {
    const closeNavigation = () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
      navToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      navToggle.innerHTML = isOpen
        ? '<i class="fas fa-xmark" aria-hidden="true"></i>'
        : '<i class="fas fa-bars" aria-hidden="true"></i>';
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeNavigation();
      }
    });
  }

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

  if (typedRole) {
    // Keep the primary positioning statement stable. Animated copy caused
    // the hero to open with a visually truncated sentence and made the page
    // harder to scan for recruiters and collaborators.
    typedRole.textContent = phrases[0];
  }

  // Data-driven overview: group related work into a short set of featured
  // workstreams. The detailed experience and project sections below remain
  // the source of truth for the complete history.
  const portfolioTimeline = document.getElementById("portfolio-timeline");
  if (portfolioTimeline) {
    const timelineItems = [
      { title: "Research & virtual sensing", meta: "Research · ASME / URS", dates: "Fall 2025 – Present", start: 4, end: 100, featured: true, note: "URS research, digital twin modeling, and the ASME-winning self-correction framework." },
      { title: "Product engineering & leadership", meta: "Engineering · SAIL / Rec App", dates: "Jan 2026 – Present", start: 31, end: 100, featured: true, note: "SignBridge team leadership plus full-stack and recovery work for Rec App." },
      { title: "Accessibility & spatial HCI", meta: "Research · MadAbility", dates: "Apr – Sep 2026 · Completed", start: 50, end: 100, note: "AR/VR stair navigation research with Quest 3 and RealSense." },
      { title: "Security operations", meta: "Experience · SOC", dates: "May 2026 – Present", start: 54, end: 100, note: "Incident triage, threat intelligence, and response workflows." },
      { title: "Generative AI & data projects", meta: "Projects · ML / AI", dates: "Fall 2025 – Spring 2026", start: 4, end: 72, note: "Survival analysis and iterative diffusion-based image editing." },
      { title: "Applied systems & student tools", meta: "Projects · Spatial / product", dates: "2026", start: 45, end: 88, note: "CourseOptimizer, MediMenu, and industrial asset intelligence." }
    ];

    const renderTimeline = () => {
      portfolioTimeline.innerHTML = `
        <div class="portfolio-timeline-axis" aria-hidden="true">
          <span>Workstream</span>
          <div class="portfolio-timeline-years"><span>2025</span><span>Spring 2026</span><span>Summer 2026</span><span>Now</span></div>
        </div>
        <div class="portfolio-timeline-list">
          ${timelineItems.map((item) => `
            <article class="portfolio-timeline-row${item.featured ? " is-featured" : ""}">
              <div class="portfolio-timeline-label"><strong>${item.title}</strong><span>${item.meta}</span><small>${item.dates}</small><p class="portfolio-timeline-note">${item.note}</p></div>
              <div class="portfolio-timeline-track"><span class="portfolio-timeline-bar" style="--timeline-start:${item.start}%;--timeline-width:${item.end - item.start}%"></span><span class="portfolio-timeline-end" style="--timeline-end:${item.end}%"></span></div>
            </article>
          `).join("")}
        </div>
      `;

      requestAnimationFrame(() => portfolioTimeline.classList.add("is-ready"));
    };

    renderTimeline();
  }


  // Experience timeline: light up the rail and each role as it scrolls into view.
  const expTimeline = document.getElementById("exp-timeline");
  if (expTimeline) {
    const items = Array.from(expTimeline.querySelectorAll(".timeline-item"));
    root.classList.add("js-timeline");
    let ticking = false;
    const updateTimeline = () => {
      ticking = false;
      const trigger = window.innerHeight * 0.62;
      const top = expTimeline.getBoundingClientRect().top;
      items.forEach((item) => {
        const lit = item.getBoundingClientRect().top < trigger;
        item.classList.toggle("is-lit", lit);
      });
      const rail = Math.max(0, Math.min(trigger - top, expTimeline.offsetHeight));
      expTimeline.style.setProperty("--progress", `${rail}px`);
    };
    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateTimeline);
      }
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    updateTimeline();
  }

  // The contact phone behaves like a small piece of interface rather than a
  // static mockup: live time, pointer-responsive depth, and an expandable
  // availability indicator. Motion is disabled by the reduced-motion rules.
  const contactPhone = document.querySelector(".contact-phone");
  const dynamicIsland = document.querySelector(".iphone-dynamic-island");
  const phoneTime = document.querySelector(".iphone-time");

  if (phoneTime) {
    const updatePhoneTime = () => {
      phoneTime.textContent = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit"
      }).format(new Date());
    };
    updatePhoneTime();
    window.setInterval(updatePhoneTime, 30000);
  }

  if (contactPhone) {
    contactPhone.addEventListener("pointermove", (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const bounds = contactPhone.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      contactPhone.style.setProperty("--phone-ry", `${x * 7}deg`);
      contactPhone.style.setProperty("--phone-rx", `${y * -7}deg`);
      contactPhone.style.setProperty("--phone-glow-x", `${(x + 0.5) * 100}%`);
      contactPhone.style.setProperty("--phone-glow-y", `${(y + 0.5) * 100}%`);
    });

    contactPhone.addEventListener("pointerleave", () => {
      contactPhone.style.removeProperty("--phone-ry");
      contactPhone.style.removeProperty("--phone-rx");
      contactPhone.style.removeProperty("--phone-glow-x");
      contactPhone.style.removeProperty("--phone-glow-y");
    });
  }

  if (dynamicIsland) {
    dynamicIsland.addEventListener("click", () => {
      const expanded = dynamicIsland.getAttribute("aria-expanded") === "true";
      dynamicIsland.setAttribute("aria-expanded", String(!expanded));
      dynamicIsland.closest(".contact-phone")?.classList.toggle("island-expanded", !expanded);
    });
  }


  // Skills: label orbit logos from their devicon class, spotlight follows the pointer,
  // and on touch screens the orbit plays while a card is on screen.
  const skillNames = { cplusplus: "C++", csharp: "C#", html5: "HTML5", css3: "CSS3", mysql: "MySQL", pytorch: "PyTorch", tensorflow: "TensorFlow", scikitlearn: "scikit-learn", numpy: "NumPy", opencv: "OpenCV", fastapi: "FastAPI", github: "GitHub", javascript: "JavaScript", jupyter: "Jupyter", keras: "Keras", pandas: "pandas", matplotlib: "Matplotlib", plotly: "Plotly", redis: "Redis", unity: "Unity", react: "React", firebase: "Firebase", git: "Git", python: "Python", java: "Java" };
  document.querySelectorAll(".skill-orbit-ring span").forEach((tile) => {
    const match = tile.querySelector("i")?.className.match(/devicon-([a-z0-9]+)-/);
    if (!match) return;
    const key = match[1];
    tile.dataset.label = skillNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  });

  const capabilityCards = document.querySelectorAll(".capability-card");
  capabilityCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
    });
  });
  if (window.matchMedia("(hover: none)").matches && "IntersectionObserver" in window) {
    const liveObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-live", e.isIntersecting)),
      { threshold: 0.6 }
    );
    capabilityCards.forEach((card) => liveObserver.observe(card));
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

  const toggleInterest = (card) => {
      const type = card.getAttribute("data-interest-type");
      if (!type) return;

      const targetPanel = document.getElementById(`panel-${type}`);

      // Handle card toggle active
      if (card.classList.contains("active")) {
        card.classList.remove("active");
        card.setAttribute("aria-expanded", "false");
        expansionPanel.classList.remove("expanded");
        if (targetPanel) {
          targetPanel.classList.remove("active");
        }
        return;
      }

      // Close other cards and panels
      interestCards.forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-expanded", "false");
      });
      panelContents.forEach((p) => p.classList.remove("active"));

      // Activate current
      card.classList.add("active");
      card.setAttribute("aria-expanded", "true");
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
      expansionPanel.classList.add("expanded");
  };

  interestCards.forEach((card) => {
    card.addEventListener("click", () => toggleInterest(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleInterest(card);
      }
    });
  });

  // Progressive Disclosure Accordions for Experience & Projects
  const collapsibleCards = document.querySelectorAll(".collapsible-card");
  collapsibleCards.forEach((card) => {
    const toggleBtn = card.querySelector(".card-toggle-btn");
    const detailsWrapper = card.querySelector(".card-details-wrapper");
    if (!toggleBtn || !detailsWrapper) return;

    const toggleCard = (shouldExpand) => {
      const isCurrentlyExpanded = card.classList.contains("is-expanded");
      const expand = shouldExpand !== undefined ? shouldExpand : !isCurrentlyExpanded;

      card.classList.toggle("is-expanded", expand);
      toggleBtn.setAttribute("aria-expanded", String(expand));

      const label = toggleBtn.querySelector(".toggle-label");
      if (label) {
        label.textContent = expand ? "Hide Details" : "View Details";
      }

      if (expand && detailsWrapper.hasAttribute("hidden")) {
        detailsWrapper.removeAttribute("hidden");
      }
    };

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCard();
    });

    // Native browser search (Ctrl+F) support via beforematch
    detailsWrapper.addEventListener("beforematch", () => {
      toggleCard(true);
    });
  });

  // PDF Presentation Modal
  const pdfModal = document.getElementById("pdf-modal");
  if (pdfModal) {
    const pdfFrame = document.getElementById("pdf-modal-frame");
    const pdfTitle = document.getElementById("pdf-modal-title");
    const pdfOpenLink = document.getElementById("pdf-modal-open");
    let lastFocusedEl = null;

    const openPdfModal = (src, title) => {
      lastFocusedEl = document.activeElement;
      pdfFrame.src = src;
      pdfOpenLink.href = src;
      pdfTitle.textContent = title || "Presentation";
      pdfModal.hidden = false;
      pdfModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("pdf-modal-open");
      pdfModal.querySelector(".pdf-modal-close").focus();
    };

    const closePdfModal = () => {
      pdfModal.hidden = true;
      pdfModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("pdf-modal-open");
      pdfFrame.src = "";
      if (lastFocusedEl) {
        lastFocusedEl.focus();
      }
    };

    document.querySelectorAll("[data-pdf-modal]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openPdfModal(trigger.getAttribute("data-pdf-src"), trigger.getAttribute("data-pdf-title"));
      });
    });

    pdfModal.querySelectorAll("[data-pdf-modal-close]").forEach((el) => {
      el.addEventListener("click", closePdfModal);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !pdfModal.hidden) {
        closePdfModal();
      }
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

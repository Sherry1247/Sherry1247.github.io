// Dropdown navigation: hover/focus open the menus via CSS; this adds touch
// support, Escape/outside-click closing, the mobile toggle, and highlighting
// of the current page (and, on the home page, the current section).
(() => {
  const menu = document.getElementById("primary-navigation");
  const toggle = document.querySelector(".nav-toggle");
  if (!menu) return;

  const items = Array.from(menu.querySelectorAll(".nav-item"));
  const closeAll = () => items.forEach((i) => i.classList.remove("is-open"));

  // mobile panel toggle
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      toggle.innerHTML = open
        ? '<i class="fas fa-xmark" aria-hidden="true"></i>'
        : '<i class="fas fa-bars" aria-hidden="true"></i>';
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
      })
    );
  }

  // touch devices have no hover: first tap opens the menu, second tap follows the link
  const canHover = window.matchMedia("(hover: hover)");
  menu.querySelectorAll(".has-dropdown > .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (canHover.matches || window.innerWidth <= 760) return;
      const item = link.parentElement;
      if (!item.classList.contains("is-open")) {
        e.preventDefault();
        closeAll();
        item.classList.add("is-open");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  // current page
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const pageToKey = {
    "education.html": "education",
    "courses.html": "education",
    "experience.html": "experience",
    "projects.html": "projects",
    "interests.html": "interests",
  };
  const setCurrent = (key) => {
    items.forEach((i) => i.classList.toggle("is-current", i.dataset.page === key));
  };
  const key = pageToKey[file] ||
    (file.startsWith("experience") ? "experience" : file.startsWith("projects") ? "projects" : null);
  if (key) {
    setCurrent(key);
  } else {
    // home: follow the section in view
    const map = { about: "about", skills: "about", education: "education", experience: "experience",
      stories: "projects", projects: "projects", interests: "interests", contact: "contact" };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting && map[en.target.id]) setCurrent(map[en.target.id]);
      }),
      { rootMargin: "-25% 0px -60% 0px" }
    );
    Object.keys(map).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();

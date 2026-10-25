// Sub-page behaviour: experience filter chips, and opening an interest
// collection from ?open=reading|cinema|music|museums.
(() => {
  const chips = document.querySelectorAll(".filter-chips .chip");
  if (chips.length) {
    const items = document.querySelectorAll("#exp-timeline .timeline-item");
    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        const f = chip.dataset.filter;
        chips.forEach((c) => c.classList.toggle("is-active", c === chip));
        items.forEach((it) => {
          it.hidden = !(f === "all" || it.dataset.group === f);
        });
      })
    );
    // landing on #exp-xxx: make sure the target is visible
    const target = location.hash && document.querySelector(location.hash);
    if (target && target.classList.contains("timeline-item")) {
      setTimeout(() => target.scrollIntoView({ block: "start" }), 120);
    }
  }

  const params = new URLSearchParams(location.search);
  const open = params.get("open");
  if (open) {
    const card = document.querySelector('.interest-card[data-interest-type="' + open + '"]');
    if (card) {
      setTimeout(() => {
        card.click();
        card.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 200);
    }
  }
})();

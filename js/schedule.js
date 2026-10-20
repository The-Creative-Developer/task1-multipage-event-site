/* Schedule page: day tabs and the session-type filter. */

(function () {
  "use strict";

  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const filter = document.getElementById("type-filter");
  const count = document.getElementById("result-count");

  function activePanel() {
    return panels.find((panel) => !panel.hidden);
  }

  function applyFilter() {
    const type = filter.value;
    const sessions = activePanel().querySelectorAll(".session");
    let shown = 0;

    sessions.forEach((session) => {
      const match = type === "all" || session.dataset.type === type;
      session.hidden = !match;
      if (match) shown += 1;
    });

    count.textContent = `Showing ${shown} of ${sessions.length} sessions`;
  }

  function selectTab(tab) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
    applyFilter();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));

    // Arrow keys move between tabs (WAI-ARIA tabs pattern)
    tab.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === "Home") next = tabs[0];
      if (event.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        selectTab(next);
        next.focus();
      }
    });
  });

  filter.addEventListener("change", applyFilter);
  applyFilter();
})();

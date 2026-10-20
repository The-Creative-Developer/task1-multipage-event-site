/* Pixel Summit — shared script loaded on every page. */

(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    links.classList.toggle("is-open", open);
  }

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close with Escape and give focus back to the button
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && links.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Close when the user clicks outside the menu
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nav")) setMenu(false);
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Countdown (home page only) ---------- */
  const countdown = document.getElementById("countdown");

  if (countdown) {
    const target = new Date(countdown.dataset.target).getTime();
    const parts = {
      days: countdown.querySelector('[data-unit="days"]'),
      hours: countdown.querySelector('[data-unit="hours"]'),
      minutes: countdown.querySelector('[data-unit="minutes"]'),
      seconds: countdown.querySelector('[data-unit="seconds"]'),
    };

    let timer;

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const pad = (n) => String(n).padStart(2, "0");

      parts.days.textContent = Math.floor(diff / 86400000);
      parts.hours.textContent = pad(Math.floor(diff / 3600000) % 24);
      parts.minutes.textContent = pad(Math.floor(diff / 60000) % 60);
      parts.seconds.textContent = pad(Math.floor(diff / 1000) % 60);

      if (diff === 0) clearInterval(timer);
    };

    timer = setInterval(tick, 1000);
    tick();
  }
})();

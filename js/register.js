/* Register page: accessible client-side form validation.
   There is no backend for this static site, so a valid form shows a
   confirmation message instead of being sent anywhere. */

(function () {
  "use strict";

  const form = document.getElementById("register-form");
  const status = document.getElementById("form-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const field = (name) => form.elements[name];

  // Each rule returns an error message, or "" when the field is valid.
  const rules = {
    name: () => (field("name").value.trim().length < 2 ? "Enter your full name." : ""),
    email: () => {
      const value = field("email").value.trim();
      if (!value) return "Enter your email address.";
      if (!emailPattern.test(value)) return "Enter an email like name@example.com.";
      return "";
    },
    college: () => (field("college").value.trim() ? "" : "Enter your college name."),
    year: () => (field("year").value ? "" : "Choose your year of study."),
    role: () => (form.querySelector('input[name="role"]:checked') ? "" : "Choose how you are coming."),
    agree: () => (field("agree").checked ? "" : "You need to agree to the code of conduct."),
  };

  // The element that gets aria-invalid for each rule
  function targetFor(name) {
    return name === "role" ? document.getElementById("role") : field(name);
  }

  function showError(name, message) {
    const target = targetFor(name);
    document.getElementById(`${name}-error`).textContent = message;
    if (message) target.setAttribute("aria-invalid", "true");
    else target.removeAttribute("aria-invalid");
  }

  function validate(name) {
    const message = rules[name]();
    showError(name, message);
    return message === "";
  }

  // Re-check a field once the user leaves it, then live while they fix it
  Object.keys(rules).forEach((name) => {
    const inputs = name === "role" ? form.querySelectorAll('input[name="role"]') : [field(name)];
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validate(name));
      input.addEventListener("change", () => validate(name));
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") validate(name);
      });
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalid = Object.keys(rules).filter((name) => !validate(name));

    if (invalid.length) {
      status.className = "form-status form-status--error";
      status.textContent = `Please fix ${invalid.length} ${invalid.length === 1 ? "field" : "fields"} below.`;
      const first = targetFor(invalid[0]);
      (first.matches("fieldset") ? first.querySelector("input") : first).focus();
      return;
    }

    const firstName = field("name").value.trim().split(" ")[0];
    status.className = "form-status form-status--success";
    status.textContent = `Thanks, ${firstName}! You're registered. Check ${field("email").value.trim()} for your ticket.`;
    form.reset();
    status.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();

const header = document.querySelector("header");
const progress = document.getElementById("progress-bar");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("header nav");

function updateScrollState() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 100);
  if (progress) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  }
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();

if (header && navToggle && nav) {
  function setMenuOpen(isOpen) {
    header.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  navToggle.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("nav-open"));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", event => {
    if (!header.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && header.classList.contains("nav-open")) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenuOpen(false);
  });
}

// Content stays visible when motion is reduced or this API is unavailable.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll("section").forEach(section => {
    section.classList.add("hidden");
    observer.observe(section);
  });
}

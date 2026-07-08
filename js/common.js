/* ============================================================
   Smart Recycling — shared layout & behaviour
   Included on every page. Builds header, footer, loader,
   blobs, settings modal, back-to-top, and wires up all the
   persistent site-wide settings (theme / language / font /
   contrast) via localStorage.
   ============================================================ */

(function () {
  const NAV_LINKS = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "solution.html", label: "Solution" },
    { href: "team.html", label: "Team" },
    { href: "chatbot.html", label: "AI Chat" },
    { href: "story.html", label: "Story" },
    { href: "quiz.html", label: "Quiz" },
    { href: "gallery.html", label: "Gallery" },
    { href: "contact.html", label: "Contact" }
  ];

  function currentPage() {
    const path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function buildNav() {
    const here = currentPage();
    return NAV_LINKS.map(l => {
      const active = l.href === here ? ' class="active" aria-current="page"' : "";
      return `<a href="${l.href}"${active}>${l.label}</a>`;
    }).join("");
  }

  function injectShell() {
    document.body.insertAdjacentHTML("afterbegin", `
      <div id="overlay"></div>
      <a id="top"></a>
      <a href="#main" class="skip-link">Skip to content</a>

      <div id="loader">
        <img src="icons/logo.svg" alt="Smart Recycling logo loading">
        <span>Loading Smart Recycling…</span>
      </div>

      <div class="blob b1"></div>
      <div class="blob b2"></div>
      <div class="blob b3"></div>

      <header>
        <a class="left" href="index.html">
          <img src="icons/logo.svg" alt="Smart Recycling logo">
          <span class="brand-text">Smart Recycling</span>
        </a>
        <nav aria-label="Main navigation">${buildNav()}</nav>
        <div style="display:flex;gap:8px;">
          <button class="toggle" id="darkToggle" type="button">Dark Mode</button>
          <button class="toggle" id="openSettings" type="button">Settings</button>
        </div>
      </header>

      <a href="#top" class="back-to-top" id="backToTop">Back to top</a>

      <div id="settingsPanel" class="settings-panel" role="dialog" aria-modal="true" aria-label="Quick settings">
        <h3>Settings</h3>

        <label for="langSelect">Language</label>
        <select id="langSelect">
          <option value="en">English</option>
          <option value="mt">Maltese</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
        </select>

        <label for="themeSelect">Theme</label>
        <select id="themeSelect">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <label for="fontSelect">Font Size</label>
        <select id="fontSelect">
          <option value="normal">Normal</option>
          <option value="large">Large</option>
          <option value="xlarge">Extra Large</option>
        </select>

        <label for="contrastSelect">High Contrast</label>
        <select id="contrastSelect">
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>

        <button id="closeSettings" type="button">Close</button>
      </div>
    `);

    document.body.insertAdjacentHTML("beforeend", `
      <footer>©2026 Smart Recycling — a student project. <a href="settings.html">Accessibility &amp; settings</a></footer>
    `);
  }

  function initLoader() {
    window.addEventListener("load", () => {
      const loader = document.getElementById("loader");
      setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => (loader.style.display = "none"), 400);
      }, 350);
    });
  }

  function initScrollReveal() {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".card").forEach(c => io.observe(c));
  }

  function initButtonGlow() {
    document.querySelectorAll(".btn").forEach(b => {
      b.addEventListener("mousemove", e => {
        b.style.boxShadow = `${(e.offsetX - 50) / 5}px ${(e.offsetY - 20) / 5}px 24px rgba(75,124,255,.5)`;
      });
    });
  }

  function initBackToTop() {
    const back = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) back.classList.add("show");
      else back.classList.remove("show");
    });
  }

  function initSettingsPanel() {
    const settingsPanel = document.getElementById("settingsPanel");
    const overlay = document.getElementById("overlay");
    document.getElementById("openSettings").onclick = () => {
      settingsPanel.classList.add("show");
      overlay.classList.add("show");
    };
    function closeSettings() {
      settingsPanel.classList.remove("show");
      overlay.classList.remove("show");
    }
    document.getElementById("closeSettings").onclick = closeSettings;
    overlay.onclick = closeSettings;
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeSettings(); });
  }

  const translations = {
    en: { hero: "Recycling (but smarter)", explore: "Explore Our Work" },
    mt: { hero: "Irriċikla (b'mod aktar intelliġenti)", explore: "Esplora x-Xogħol Tagħna" },
    fr: { hero: "Recycler (mais plus intelligemment)", explore: "Explorer Notre Travail" },
    es: { hero: "Reciclar (pero más inteligente)", explore: "Explorar Nuestro Trabajo" }
  };

  function applyLanguage(lang) {
    const lead = document.querySelector(".hero .lead");
    const btn = document.querySelector(".hero .btn");
    if (lead && translations[lang]) lead.textContent = translations[lang].hero;
    if (btn && translations[lang]) btn.textContent = translations[lang].explore;
  }

  function initLanguage() {
    const langSelect = document.getElementById("langSelect");
    langSelect.onchange = () => {
      localStorage.setItem("lang", langSelect.value);
      applyLanguage(langSelect.value);
    };
    const saved = localStorage.getItem("lang");
    if (saved) { langSelect.value = saved; applyLanguage(saved); }
  }

  function applyTheme(theme) {
    const themeSelect = document.getElementById("themeSelect");
    const darkToggle = document.getElementById("darkToggle");
    document.body.classList.toggle("dark", theme === "dark");
    if (themeSelect) themeSelect.value = theme;
    if (darkToggle) darkToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", theme);
  }

  function initTheme() {
    const themeSelect = document.getElementById("themeSelect");
    const darkToggle = document.getElementById("darkToggle");
    themeSelect.onchange = () => applyTheme(themeSelect.value);
    darkToggle.onclick = () => applyTheme(document.body.classList.contains("dark") ? "light" : "dark");
    applyTheme(localStorage.getItem("theme") || "light");
  }

  function applyFont(size) {
    localStorage.setItem("fontSize", size);
    document.body.style.fontSize = size === "normal" ? "16px" : size === "large" ? "18px" : "20px";
    const sel = document.getElementById("fontSelect");
    if (sel) sel.value = size;
  }

  function initFont() {
    const fontSelect = document.getElementById("fontSelect");
    fontSelect.onchange = () => applyFont(fontSelect.value);
    applyFont(localStorage.getItem("fontSize") || "normal");
  }

  function applyContrast(c) {
    localStorage.setItem("contrast", c);
    document.body.style.filter = c === "on" ? "contrast(1.4)" : "none";
    const sel = document.getElementById("contrastSelect");
    if (sel) sel.value = c;
  }

  function initContrast() {
    const contrastSelect = document.getElementById("contrastSelect");
    contrastSelect.onchange = () => applyContrast(contrastSelect.value);
    applyContrast(localStorage.getItem("contrast") || "off");
  }

  function initHeroSpotlight() {
    document.addEventListener("mousemove", e => {
      document.documentElement.style.setProperty("--mx", e.clientX + "px");
      document.documentElement.style.setProperty("--my", e.clientY + "px");
    });
  }

  // Expose small helpers other page scripts might want (story/game/chatbot)
  window.SmartRecycling = {
    applyTheme, applyFont, applyContrast, applyLanguage
  };

  document.addEventListener("DOMContentLoaded", () => {
    injectShell();
    initLoader();
    initScrollReveal();
    initButtonGlow();
    initBackToTop();
    initSettingsPanel();
    initLanguage();
    initTheme();
    initFont();
    initContrast();
    initHeroSpotlight();

    // Let page-specific scripts know the shell is ready
    document.dispatchEvent(new CustomEvent("shellReady"));
  });
})();

(function () {
  var AUTH_KEY = "metroAuthSession";
  var THEME_KEY = "metroTheme";
  var QUOTES = [
    "Safe routes save time, stress, and energy.",
    "Plan calmly. Travel smart. Reach safely.",
    "Every better commute begins with a clear route.",
    "Transit works best when the journey feels predictable.",
    "Good route planning turns busy cities into simple decisions."
  ];

  function bodyPage() {
    return document.body.getAttribute("data-page") || "";
  }

  function isAuthed() {
    return localStorage.getItem(AUTH_KEY) === "true";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    var toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
    }
  }

  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY) || "light";
    setTheme(saved);
  }

  function ensureThemeToggle() {
    var navWrap = document.querySelector(".nav-wrap");
    if (!navWrap || document.getElementById("themeToggle")) {
      return;
    }

    var rightSide = navWrap.querySelector(".site-nav");
    var toggle = document.createElement("button");
    toggle.id = "themeToggle";
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") || "light";
      setTheme(current === "dark" ? "light" : "dark");
    });

    if (rightSide && rightSide.parentNode) {
      rightSide.parentNode.insertBefore(toggle, rightSide);
    } else {
      navWrap.appendChild(toggle);
    }
    setTheme(localStorage.getItem(THEME_KEY) || "light");
  }

  function initMenu() {
    var menuBtn = document.getElementById("menuBtn");
    var nav = document.getElementById("siteNav");
    if (menuBtn && nav) {
      menuBtn.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }
  }

  function initActiveNav() {
    var nav = document.getElementById("siteNav");
    var page = bodyPage();
    if (page && nav) {
      Array.prototype.forEach.call(nav.querySelectorAll("a[data-nav]"), function (link) {
        if (link.getAttribute("data-nav") === page) {
          link.classList.add("active");
        }
      });
    }
  }

  function initYear() {
    var yearNode = document.getElementById("year");
    if (yearNode) {
      yearNode.textContent = new Date().getFullYear();
    }
  }

  function ensureFooterQuote() {
    var footerContainer = document.querySelector(".footer .container");
    if (!footerContainer) {
      return;
    }

    var quoteNode = document.getElementById("footerQuote");
    if (!quoteNode) {
      quoteNode = document.createElement("div");
      quoteNode.id = "footerQuote";
      quoteNode.className = "footer-quote";
      footerContainer.insertBefore(quoteNode, footerContainer.firstChild);
    }

    var index = 0;
    function render() {
      quoteNode.textContent = QUOTES[index];
      index = (index + 1) % QUOTES.length;
    }
    render();
    setInterval(render, 5000);
  }

  function enforceAuth() {
    var page = bodyPage();
    var authOnly = page === "auth";
    if (!authOnly && !isAuthed()) {
      window.location.href = "./index.html";
      return false;
    }
    if (authOnly && isAuthed()) {
      window.location.href = "./dashboard.html";
      return false;
    }
    return true;
  }

  function initAuthPage() {
    if (bodyPage() !== "auth") {
      return;
    }

    var form = document.getElementById("authForm");
    var notice = document.getElementById("authNotice");
    if (!form || !notice) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      localStorage.setItem(AUTH_KEY, "true");
      notice.textContent = "Access granted. Entering MetroPath...";
      notice.className = "notice";
      setTimeout(function () {
        window.location.href = "./dashboard.html";
      }, 500);
    });
  }

  function initLogout() {
    var logout = document.getElementById("logoutBtn");
    if (!logout) {
      return;
    }
    logout.addEventListener("click", function () {
      localStorage.removeItem(AUTH_KEY);
      window.location.href = "./index.html";
    });
  }

  initTheme();
  if (!enforceAuth()) {
    return;
  }
  initMenu();
  initActiveNav();
  initYear();
  ensureThemeToggle();
  ensureFooterQuote();
  initAuthPage();
  initLogout();
})();

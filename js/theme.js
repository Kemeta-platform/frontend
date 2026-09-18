document.addEventListener("DOMContentLoaded", () => {
  const desktopToggle = document.getElementById("theme-toggle");
  const mobileToggle = document.getElementById("mobile-theme-toggle");
  const root = document.documentElement; // <html>
  const body = document.body;

  function updateIcons(isDark) {
    [desktopToggle, mobileToggle].forEach(btn => {
      if (!btn) return;
      const icon = btn.querySelector("i");
      if (icon) {
        if (isDark) {
          icon.className = "fas fa-moon";
        } else {
          icon.className = "fas fa-sun";
        }
      }
    });
  }

  function setTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      body.classList.add("dark-mode");
      localStorage.setItem("kemeta_theme", "dark");
      updateIcons(true);
    } else {
      root.removeAttribute("data-theme");
      body.classList.remove("dark-mode");
      localStorage.setItem("kemeta_theme", "light");
      updateIcons(false);
    }
  }

  const savedTheme = localStorage.getItem("kemeta_theme");
  setTheme(savedTheme === "dark" ? "dark" : "light");

  function handleToggle() {
    const isDark = root.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
  }

  desktopToggle?.addEventListener("click", handleToggle);
  mobileToggle?.addEventListener("click", handleToggle);
});
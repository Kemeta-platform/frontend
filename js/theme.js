/* ==================================================
   THEME TOGGLE CONTROLLER
================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (!themeToggleBtn) return;

  const icon = themeToggleBtn.querySelector("i");
  const root = document.documentElement; // وسم <html>

  // 1. وظيفة لتحديث الأيقونة
  function updateThemeUI(isDark) {
    if (!icon) return;
    if (isDark) {
      icon.className = "fas fa-moon"; // يظهر قمر
    } else {
      icon.className = "fas fa-sun";  // تظهر شمس
    }
  }

  // 2. فحص الثيم المحفوظ عند فتح الصفحة
  const savedTheme = localStorage.getItem("kemeta_theme");
  if (savedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
    updateThemeUI(true);
  } else {
    root.removeAttribute("data-theme");
    updateThemeUI(false);
  }

  // 3. عند الضغط على الزر: تبديل الثيم وحفظه
  themeToggleBtn.addEventListener("click", () => {
    const isCurrentlyDark = root.getAttribute("data-theme") === "dark";

    if (isCurrentlyDark) {
      // التحويل إلى الوضع الفاتح
      root.removeAttribute("data-theme");
      localStorage.setItem("kemeta_theme", "light");
      updateThemeUI(false);
    } else {
      // التحويل إلى الوضع الداكن
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("kemeta_theme", "dark");
      updateThemeUI(true);
    }
  });
});
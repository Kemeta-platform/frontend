/* ==================================================
   AUTH & SIGN-UP MODULE ENHANCEMENTS
   (Attach to register/login pages)
================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Auto-save Input Fields to localStorage
  const autoSaveInputs = document.querySelectorAll(
    "input:not([type='password']), select, textarea"
  );
  autoSaveInputs.forEach((input) => {
    const key = `kemeta_draft_${input.name || input.id}`;
    if (localStorage.getItem(key)) {
      input.value = localStorage.getItem(key);
    }
    input.addEventListener("input", () => {
      localStorage.setItem(key, input.value);
    });
  });

  // 2. Client-side Password Strength Evaluator
  const passwordInput = document.querySelector("#passwordInput");
  const strengthMeter = document.querySelector("#passwordStrengthMeter");
  const strengthText = document.querySelector("#passwordStrengthText");

  if (passwordInput && strengthMeter) {
    passwordInput.addEventListener("input", (e) => {
      const val = e.target.value;
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      strengthMeter.className = "strength-meter-bar";
      if (val.length === 0) {
        strengthMeter.style.width = "0%";
        if (strengthText) strengthText.textContent = "";
      } else if (score <= 2) {
        strengthMeter.style.width = "35%";
        strengthMeter.classList.add("weak");
        if (strengthText) strengthText.textContent = "Weak Password";
      } else if (score === 3) {
        strengthMeter.style.width = "70%";
        strengthMeter.classList.add("medium");
        if (strengthText) strengthText.textContent = "Medium Strength";
      } else {
        strengthMeter.style.width = "100%";
        strengthMeter.classList.add("strong");
        if (strengthText) strengthText.textContent = "Strong Password";
      }
    });
  }

  // 3. Compact Country Dropdown with Real Flags
  const countries = [
    { name: "Egypt", flag: "🇪🇬", code: "+20" },
    { name: "United States", flag: "🇺🇸", code: "+1" },
    { name: "United Kingdom", flag: "🇬🇧", code: "+44" },
    { name: "Germany", flag: "🇩🇪", code: "+49" },
    { name: "France", flag: "🇫🇷", code: "+33" },
    { name: "Italy", flag: "🇮🇹", code: "+39" },
    { name: "Saudi Arabia", flag: "🇸🇦", code: "+966" },
    { name: "United Arab Emirates", flag: "🇦🇪", code: "+971" }
  ];

  const countrySelectContainer = document.querySelector("#countrySelectDropdown");
  if (countrySelectContainer) {
    countrySelectContainer.innerHTML = `
      <div class="country-scroll-wrapper" style="max-height: 140px; overflow-y: auto;">
        ${countries
          .map(
            (c) => `
          <div class="country-option" data-code="${c.code}" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <span>${c.flag}</span>
            <span>${c.name}</span>
            <span style="opacity: 0.6; margin-left: auto;">${c.code}</span>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // 4. Profile Picture Preview & Adjust
  const avatarInput = document.querySelector("#avatarUploadInput");
  const avatarPreview = document.querySelector("#avatarPreviewImg");
  if (avatarInput && avatarPreview) {
    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          avatarPreview.src = event.target.result;
          avatarPreview.style.objectFit = "cover";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 5. Multi-step Back Button Navigation
  const backButtons = document.querySelectorAll(".auth-back-btn");
  backButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "../index.html";
      }
    });
  });
});
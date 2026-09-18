// دالة إظهار وإخفاء كلمة المرور
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  }
}

// ==========================================
// 1. قائمة لغات العالم الشاملة (World Languages)
// ==========================================
const worldLanguages = [
  { name: "English", code: "EN" },
  { name: "العربية (Arabic)", code: "AR" },
  { name: "Français (French)", code: "FR" },
  { name: "Deutsch (German)", code: "DE" },
  { name: "Español (Spanish)", code: "ES" },
  { name: "Italiano (Italian)", code: "IT" },
  { name: "Русский (Russian)", code: "RU" },
  { name: "中文 (Chinese)", code: "ZH" }
];

// ==========================================
// 2. قائمة دول العالم الشاملة مع كود العلم (Flags)
// ==========================================
const worldCountries = [
    { name: "United States", code: "us" },
  { name: "United Kingdom", code: "gb" },
  { name: "Canada", code: "ca" },
  { name: "Germany", code: "de" },
  { name: "France", code: "fr" },
  { name: "Saudi Arabia", code: "sa" },
  { name: "United Arab Emirates", code: "ae" },
  { name: "Egypt", code: "eg" },
  { name: "Other", code: "un" }
];

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  let otpInterval = null;
let userData = JSON.parse(localStorage.getItem('userData')) || {
  firstName: '',
  lastName: '',
  email: ''
};
const savedFormData = JSON.parse(localStorage.getItem('registerFormData')) || {};

Object.keys(savedFormData).forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.value = savedFormData[id];
  }
});

function saveRegisterData() {
  const fields = [
    'firstName',
    'lastName',
    'email',
    'password',
    'confirmPassword',
    'languageInput',
    'nationalityInput'
  ];

  const data = {};

  fields.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      data[id] = input.value;
    }
  });

  localStorage.setItem('registerFormData', JSON.stringify(data));
}

[
  'firstName',
  'lastName',
  'email',
  'password',
  'confirmPassword',
  'languageInput',
  'nationalityInput'
].forEach(id => {
  const input = document.getElementById(id);

  input?.addEventListener('input', saveRegisterData);
});

  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4')
  ];

  const globalBackBtn = document.getElementById('globalBackBtn');
  const mobileBackBtn = document.getElementById('mobileBackBtn');
  const formStep1 = document.getElementById('formStep1');
  const formStep3 = document.getElementById('formStep3');
  const btnVerify = document.getElementById('btnVerify');
  const btnGoBackEmail = document.getElementById('btnGoBackEmail');
  const resendBtn = document.getElementById('resendBtn');
  const otpInputs = document.querySelectorAll('.otp-box');
  const avatarInput = document.getElementById('avatarInput');
  const avatarContainer = document.getElementById('avatarPreviewContainer');

populateLanguages();
populateNationalities();

setupCustomDropdowns();
  document.getElementById('firstName').value = userData.firstName;
document.getElementById('lastName').value = userData.lastName;
document.getElementById('email').value = userData.email;

  setupPasswordValidation();

  // ================= 1. التنقل بين الخطوات =================
  function goToStep(stepNumber) {
    currentStep = stepNumber;

    steps.forEach((step, index) => {
      if (index + 1 === stepNumber) {
        step.classList.remove('d-none');
      } else {
        step.classList.add('d-none');
      }
    });

    for (let i = 1; i <= 3; i++) {
      const indicator = document.getElementById(`indicator-${i}`);
      const badge = document.getElementById(`badge-${i}`);

      if (indicator && badge) {
        indicator.classList.remove('active', 'completed');

        if (i < currentStep) {
          indicator.classList.add('completed');
          badge.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (i === currentStep) {
          indicator.classList.add('active');
          badge.textContent = i;
        } else {
          badge.textContent = i;
        }
      }
    }

    if (currentStep === 4) {
      for (let i = 1; i <= 3; i++) {
        const indicator = document.getElementById(`indicator-${i}`);
        const badge = document.getElementById(`badge-${i}`);
        if (indicator && badge) {
          indicator.classList.add('completed');
          badge.innerHTML = '<i class="fa-solid fa-check"></i>';
        }
      }
    }
  }

function handleBackAction(e) {
  e.preventDefault();
  if (currentStep === 4 || currentStep === 1) {
    window.location.href = '../index.html';
  } else {
    goToStep(currentStep - 1);
  }
}

  globalBackBtn?.addEventListener('click', handleBackAction);
  mobileBackBtn?.addEventListener('click', handleBackAction);

  formStep1?.addEventListener('submit', (e) => {
    e.preventDefault();
    const p1 = document.getElementById('password').value;
    const p2 = document.getElementById('confirmPassword').value;

    if (p1 !== p2) {
      alert('Passwords do not match! Please check again.');
      return;
    }

    const validation = validatePassword(p1);
    if (!validation.isValid) {
      alert(`Weak Password:\n• ${validation.errors.join('\n• ')}`);
      return;
    }

  userData.firstName = document.getElementById('firstName').value.trim();
userData.lastName = document.getElementById('lastName').value.trim();
userData.email = document.getElementById('email').value.trim();

localStorage.setItem('userData', JSON.stringify(userData));

    const displayEmail = document.getElementById('displayEmail');
    const successName = document.getElementById('successName');

    if (displayEmail) displayEmail.textContent = userData.email;
    if (successName) successName.textContent = userData.firstName;

    goToStep(2);
    startOtpTimer();
    if (otpInputs.length > 0) otpInputs[0].focus();
  });

  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  btnVerify?.addEventListener('click', () => {
    let code = '';
    otpInputs.forEach(input => code += input.value);

    if (code.length < 6) {
      alert('Please enter the full 6-digit verification code.');
      return;
    }

    goToStep(3);
  });

  btnGoBackEmail?.addEventListener('click', (e) => {
    e.preventDefault();
    goToStep(1);
  });

function startOtpTimer() {
    if (otpInterval) clearInterval(otpInterval);
    let timeLeft = 60; // تم تعديلها إلى 60 ثانية

    if (resendBtn) {
      resendBtn.innerHTML = 'Resend in <span id="timer">01:00</span>';
      resendBtn.style.pointerEvents = 'none';
      resendBtn.style.opacity = '0.7';
    }

    otpInterval = setInterval(() => {
      timeLeft--;
      const seconds = timeLeft < 10 ? '0' + timeLeft : timeLeft;
      const currentTimer = document.getElementById('timer');
      if (currentTimer) currentTimer.textContent = `00:${seconds}`;

      if (timeLeft <= 0) {
        clearInterval(otpInterval);
        if (resendBtn) {
          resendBtn.innerHTML = '<strong>Resend Code</strong>';
          resendBtn.style.pointerEvents = 'auto';
          resendBtn.style.opacity = '1';
        }
      }
    }, 1000);
  }

  resendBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    startOtpTimer();
    alert('A new 6-digit code has been sent to your email.');
  });

let selectedImage = null;
let imageScale = 1;
let imageX = 0;
let imageY = 0;

avatarInput?.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  // فحص النوع والحجم حسب الـ SRS
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
    alert('Unsupported file type. Please upload a JPG or PNG image under 5 MB.');
    this.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImage = new Image();
    selectedImage.onload = () => {
      imageScale = Math.max(300 / selectedImage.width, 300 / selectedImage.height);
      imageX = 0;
      imageY = 0;
      showCropper();
    };
    selectedImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

function showCropper() {
  avatarContainer.innerHTML = `
    <div class="crop-box">
      <canvas id="cropCanvas" width="300" height="300"></canvas>

      <div class="crop-controls">
        <input
          type="range"
          id="zoomSlider"
          min="0.5"
          max="3"
          step="0.01"
          value="${imageScale}"
        >

        <button type="button" id="saveCrop">
          Save
        </button>
      </div>
    </div>
  `;

  const canvas = document.getElementById('cropCanvas');
  const ctx = canvas.getContext('2d');
  const zoomSlider = document.getElementById('zoomSlider');
  const saveCrop = document.getElementById('saveCrop');

  function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = selectedImage.width * imageScale;
    const height = selectedImage.height * imageScale;

    const x = (canvas.width - width) / 2 + imageX;
    const y = (canvas.height - height) / 2 + imageY;

    ctx.drawImage(
      selectedImage,
      x,
      y,
      width,
      height
    );
  }

  drawImage();

  zoomSlider.addEventListener('input', () => {
    imageScale = Number(zoomSlider.value);
    drawImage();
  });

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;

    startX = e.clientX - imageX;
    startY = e.clientY - imageY;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    imageX = e.clientX - startX;
    imageY = e.clientY - startY;

    drawImage();
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  saveCrop.addEventListener('click', () => {
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);

    avatarContainer.innerHTML = `
      <img
        src="${croppedImage}"
        alt="Profile Preview"
        class="profile-preview"
      >
    `;

    localStorage.setItem('userAvatar', croppedImage);
  });
}



formStep3?.addEventListener('submit', (e) => {
    e.preventDefault();

    const langVal = document.getElementById('languageInput')?.value.trim();
    const countryVal = document.getElementById('nationalityInput')?.value.trim();

    if (!langVal || !countryVal) {
      alert('This field is required.');
      return;
    }

    const isValidLanguage = worldLanguages.some(l => l.name === langVal);
    if (!isValidLanguage) {
      alert('Please select a supported language.');
      return;
    }

    const isValidCountry = worldCountries.some(c => c.name.toLowerCase() === countryVal.toLowerCase());
    if (!isValidCountry) {
      alert('Please select a valid country.');
      return;
    }

    userData.preferredLanguage = langVal;
    userData.country = countryVal;
    localStorage.setItem('userData', JSON.stringify(userData));

    goToStep(4);
  });
  });

// ==========================================
// دوال توليد البيانات (Languages & Countries)
// ==========================================

// توليد جميع اللغات
function populateLanguages() {
  const languageList = document.getElementById('languageList');
  if (!languageList) return;

  languageList.innerHTML = worldLanguages
    .map(
      (l) => `
      <div class="custom-option" data-value="${l.name}">
        <span class="option-code">${l.code}</span>
        <span class="option-text">${l.name}</span>
      </div>
    `
    )
    .join('');
}

function populateNationalities() {
  const nationalityList = document.getElementById('nationalityList');

  if (!nationalityList) return;

  nationalityList.innerHTML = worldCountries.map(country => `
    <div class="custom-option" data-value="${country.name}">
      <img
        src="https://flagcdn.com/w40/${country.code}.png"
        alt="${country.name}"
        class="country-flag-img"
      >
      <span class="option-text">${country.name}</span>
    </div>
  `).join('');
}


function validatePassword(pass) {
  return {
    isLengthValid: pass.length >= 8 && pass.length <= 64,
    isUpperValid: /[A-Z]/.test(pass),
    isLowerValid: /[a-z]/.test(pass), // فحص الحرف الصغير
    isNumValid: /[0-9]/.test(pass),
    isSpecialValid: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    get isValid() {
      return this.isLengthValid && this.isUpperValid && this.isLowerValid && this.isNumValid && this.isSpecialValid;
    }
  };
}

function setupPasswordValidation() {
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const checklist = document.getElementById('passwordChecklist');
  const strengthContainer = document.getElementById('strengthContainer');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const confirmFeedback = document.getElementById('confirmPassFeedback');

  if (!passwordInput) return;

  const chkLength = document.getElementById('chk-length');
  const chkUpper = document.getElementById('chk-uppercase');
  const chkNum = document.getElementById('chk-number');
  const chkSpecial = document.getElementById('chk-special');

  function updateRule(element, isValid) {
    if (!element) return;
    const icon = element.querySelector('i');
    if (isValid) {
      element.classList.add('valid');
      icon.className = 'fa-solid fa-circle-check';
    } else {
      element.classList.remove('valid');
      icon.className = 'fa-solid fa-circle-xmark';
    }
  }

  // فحص كلمة المرور وتحديث الشريط والقائمة
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;

    if (val.length === 0) {
      checklist?.classList.remove('show');
      strengthContainer?.classList.add('d-none');
      return;
    }

    // إظهار الشريط وقائمة الشروط
    checklist?.classList.add('show');
    strengthContainer?.classList.remove('d-none');

    const v = validatePassword(val);

    // تحديث الأيقونات لكل شرط
    updateRule(chkLength, v.isLengthValid);
    updateRule(chkUpper, v.isUpperValid);
    updateRule(chkNum, v.isNumValid);
    updateRule(chkSpecial, v.isSpecialValid);

    // حساب درجة القوة (0 إلى 4)
    let score = 0;
    if (v.isLengthValid) score++;
    if (v.isUpperValid) score++;
    if (v.isNumValid) score++;
    if (v.isSpecialValid) score++;

    // تحديث لون وعرض شريط القوة
    if (strengthBar && strengthText) {
      strengthBar.className = 'strength-bar-fill';
      if (score <= 1) {
        strengthBar.style.width = '25%';
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#e63946';
      } else if (score === 2 || score === 3) {
        strengthBar.style.width = score === 2 ? '50%' : '75%';
        strengthBar.classList.add('medium');
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#f4a261';
      } else if (score === 4) {
        strengthBar.style.width = '100%';
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#2a9d8f';
      }
    }

    // التحقق التلقائي من التطابق لو المستخدم كان كاتب في Confirm Password
    checkPasswordsMatch();
  });

  // فحص تطابق التأكيد أثناء الكتابة
  function checkPasswordsMatch() {
    if (!confirmInput || !confirmFeedback) return;
    if (confirmInput.value.length > 0) {
      if (confirmInput.value !== passwordInput.value) {
        confirmFeedback.classList.remove('d-none');
      } else {
        confirmFeedback.classList.add('d-none');
      }
    } else {
      confirmFeedback.classList.add('d-none');
    }
  }

  confirmInput?.addEventListener('input', checkPasswordsMatch);
}


function setupCustomDropdowns() {
  const wrappers = document.querySelectorAll('.custom-select-wrapper');

  wrappers.forEach(wrapper => {
    const input = wrapper.querySelector('input');
    const dropdown = wrapper.querySelector('.custom-dropdown-menu');
    const trigger = wrapper.querySelector('.custom-select-trigger');

    if (!input || !dropdown || !trigger) return;

    // 1. تشغيل السهم: فتح / إغلاق الدروب داون عند الضغط على السهم أو الحاوية
    trigger.addEventListener('click', (e) => {
      // إذا لم يكن النقر على خانة الكتابة نفسها (يعني تم النقر على السهم أو طرف البوكس)
      if (e.target !== input) {
        e.stopPropagation();

        // إغلاق أي قائمة أخرى مفتوحة
        wrappers.forEach(w => {
          if (w !== wrapper) w.classList.remove('active');
        });

        // تبديل حالة الفتح والإغلاق
        const isOpen = wrapper.classList.toggle('active');
        if (isOpen) {
          input.focus();
          filterOptions('');
        }
      }
    });

    // 2. فتح القائمة عند الضغط داخل حقل الكتابة
    input.addEventListener('focus', () => {
      wrappers.forEach(w => {
        if (w !== wrapper) w.classList.remove('active');
      });
      wrapper.classList.add('active');
      filterOptions('');
    });

    // 3. البحث أثناء الكتابة
    input.addEventListener('input', () => {
      const searchText = input.value.toLowerCase().trim();
      wrapper.classList.add('active');
      filterOptions(searchText);
    });

    // 4. اختيار عنصر من القائمة
    dropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.custom-option');
      if (!option) return;

      input.value = option.dataset.value;
      wrapper.classList.remove('active');
    });

    function filterOptions(searchText) {
      const options = dropdown.querySelectorAll('.custom-option');
      options.forEach(option => {
        const textElement = option.querySelector('.option-text');
        if (!textElement) return;

        const optionText = textElement.textContent.toLowerCase().trim();
        if (searchText === '' || optionText.startsWith(searchText)) {
          option.style.display = 'flex';
        } else {
          option.style.display = 'none';
        }
      });
    }
  });

  // قفل القوائم عند الضغط خارجها
  document.addEventListener('click', (e) => {
    wrappers.forEach(wrapper => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('active');
      }
    });
  });
}
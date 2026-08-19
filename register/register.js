// دالة إظهار وإخفاء كلمة المرور (عامة لتعمل مع الـ HTML)
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

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  let otpInterval = null;
  let userData = {
    firstName: '',
    lastName: '',
    email: ''
  };

  // عناصر الخطوات
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4')
  ];

  // الأزرار والحقول
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

  // ================= 1. التنقل بين الخطوات =================
  function goToStep(stepNumber) {
    currentStep = stepNumber;

    // إظهار الخطوة الحالية وإخفاء الباقي
    steps.forEach((step, index) => {
      if (index + 1 === stepNumber) {
        step.classList.remove('d-none');
      } else {
        step.classList.add('d-none');
      }
    });

    // تحديث مؤشرات الخطوات في اللوحة الجانبية (الشمال)
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

    // إذا وصلنا لخطوة النجاح (الرابعة)
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

  // ================= 2. زر الرجوع (ديسكتوب وموبايل) =================
  function handleBackAction(e) {
    e.preventDefault();
    if (currentStep > 1 && currentStep < 4) {
      goToStep(currentStep - 1);
    } else if (currentStep === 1) {
      window.location.href = '../index.html';
    }
  }

  globalBackBtn?.addEventListener('click', handleBackAction);
  mobileBackBtn?.addEventListener('click', handleBackAction);

  // ================= 3. الخطوة الأولى: إنشاء الحساب =================
  formStep1?.addEventListener('submit', (e) => {
    e.preventDefault();
    const p1 = document.getElementById('password').value;
    const p2 = document.getElementById('confirmPassword').value;

    if (p1 !== p2) {
      alert('Passwords do not match!');
      return;
    }

    userData.firstName = document.getElementById('firstName').value.trim();
    userData.lastName = document.getElementById('lastName').value.trim();
    userData.email = document.getElementById('email').value.trim();

    const displayEmail = document.getElementById('displayEmail');
    const successName = document.getElementById('successName');

    if (displayEmail) displayEmail.textContent = userData.email;
    if (successName) successName.textContent = userData.firstName;

    goToStep(2);
    startOtpTimer();
    if (otpInputs.length > 0) otpInputs[0].focus();
  });

  // ================= 4. الخطوة الثانية: إدخال OTP والعداد =================
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

    let timeLeft = 45;
    const timerElem = document.getElementById('timer');

    if (resendBtn) {
      resendBtn.innerHTML = 'Resend in <span id="timer">00:45</span>';
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

  // ================= 5. الخطوة الثالثة: صورة الملف الشخصي =================
  avatarInput?.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (avatarContainer) {
          avatarContainer.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`;
        }
      };
      reader.readAsDataURL(file);
    }
  });

  formStep3?.addEventListener('submit', (e) => {
    e.preventDefault();
    goToStep(4);
  });

  // ================= 6. تشغيل القوائم المنسدلة المخصصة =================
  setupCustomDropdowns();
});

// دالة إعداد القوائم المنسدلة (اللغة والجنسية مع البحث المباشر)
function setupCustomDropdowns() {
  const wrappers = document.querySelectorAll('.custom-select-wrapper');

  wrappers.forEach(wrapper => {
    const input = wrapper.querySelector('.custom-select-trigger input');
    const options = wrapper.querySelectorAll('.custom-option');

    wrapper.querySelector('.custom-select-trigger')?.addEventListener('click', (e) => {
      e.stopPropagation();
      wrappers.forEach(w => { if (w !== wrapper) w.classList.remove('active'); });
      wrapper.classList.toggle('active');
      if (wrapper.classList.contains('active')) {
        input.focus();
      }
    });

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        input.value = option.getAttribute('data-value');
        wrapper.classList.remove('active');
      });
    });

    if (input && input.id === 'nationalityInput') {
      input.addEventListener('input', () => {
        const filter = input.value.toLowerCase();
        wrapper.classList.add('active');

        options.forEach(opt => {
          const text = opt.querySelector('.option-text').textContent.toLowerCase();
          if (text.includes(filter)) {
            opt.style.display = 'flex';
          } else {
            opt.style.display = 'none';
          }
        });
      });
    }
  });

  document.addEventListener('click', () => {
    wrappers.forEach(w => w.classList.remove('active'));
  });
}
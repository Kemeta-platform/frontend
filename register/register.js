document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  let userData = {
    firstName: '',
    lastName: '',
    email: ''
  };

  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4')
  ];

  const globalBackBtn = document.getElementById('globalBackBtn');
  const formStep1 = document.getElementById('formStep1');
  const formStep3 = document.getElementById('formStep3');
  const btnVerify = document.getElementById('btnVerify');
  const btnGoBackEmail = document.getElementById('btnGoBackEmail');
  const otpInputs = document.querySelectorAll('.otp-box');
  const avatarInput = document.getElementById('avatarInput');
  const avatarContainer = document.getElementById('avatarPreviewContainer');

  // Go to step function
  function goToStep(stepNumber) {
    currentStep = stepNumber;

    // Show/Hide steps
    steps.forEach((step, index) => {
      if (index + 1 === stepNumber) {
        step.classList.remove('d-none');
      } else {
        step.classList.add('d-none');
      }
    });

    // Update Left Panel Indicators
    for (let i = 1; i <= 3; i++) {
      const indicator = document.getElementById(`indicator-${i}`);
      const badge = document.getElementById(`badge-${i}`);

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

    if (currentStep === 4) {
      for (let i = 1; i <= 3; i++) {
        const indicator = document.getElementById(`indicator-${i}`);
        const badge = document.getElementById(`badge-${i}`);
        indicator.classList.add('completed');
        badge.innerHTML = '<i class="fa-solid fa-check"></i>';
      }
    }
  }

  // Top Back Button
  globalBackBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentStep > 1 && currentStep < 4) {
      goToStep(currentStep - 1);
    } else if (currentStep === 1) {
      window.location.href = '../index.html';
    }
  });

  // Step 1: Sign Up Submit
  formStep1.addEventListener('submit', (e) => {
    e.preventDefault();
    const p1 = document.getElementById('password').value;
    const p2 = document.getElementById('confirmPassword').value;

    if (p1 !== p2) {
      alert('Passwords do not match!');
      return;
    }

    userData.firstName = document.getElementById('firstName').value;
    userData.lastName = document.getElementById('lastName').value;
    userData.email = document.getElementById('email').value;

    document.getElementById('displayEmail').textContent = userData.email;
    document.getElementById('successName').textContent = userData.firstName;

    goToStep(2);
    startOtpTimer();
    otpInputs[0].focus();
  });

  // OTP Auto Focus Logic
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

  // Step 2: Verify OTP
  btnVerify.addEventListener('click', () => {
    let code = '';
    otpInputs.forEach(input => code += input.value);

    if (code.length < 6) {
      alert('Please enter the full 6-digit verification code.');
      return;
    }

    goToStep(3);
  });

  btnGoBackEmail.addEventListener('click', (e) => {
    e.preventDefault();
    goToStep(1);
  });

  // OTP Countdown Timer
  function startOtpTimer() {
    let timeLeft = 45;
    const timerElem = document.getElementById('timer');
    const resendBtn = document.getElementById('resendBtn');

    const countdown = setInterval(() => {
      timeLeft--;
      const seconds = timeLeft < 10 ? '0' + timeLeft : timeLeft;
      timerElem.textContent = `00:${seconds}`;

      if (timeLeft <= 0) {
        clearInterval(countdown);
        resendBtn.innerHTML = 'Resend Code';
      }
    }, 1000);
  }

  // Step 3: Avatar Upload Preview
  avatarInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarContainer.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });

  // Step 3: Complete Profile Submit
  formStep3.addEventListener('submit', (e) => {
    e.preventDefault();
    goToStep(4);
  });
});

// Toggle password visibility (FontAwesome version)
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

// ================= Custom Dropdowns Logic =================
function setupCustomDropdowns() {
  const wrappers = document.querySelectorAll('.custom-select-wrapper');

  wrappers.forEach(wrapper => {
    const input = wrapper.querySelector('.custom-select-trigger input');
    const menu = wrapper.querySelector('.custom-dropdown-menu');
    const options = wrapper.querySelectorAll('.custom-option');

    // فتح / إغلاق القائمة عند الضغط
    wrapper.querySelector('.custom-select-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      // إغلاق أي قائمة أخرى مفتوحة
      wrappers.forEach(w => { if (w !== wrapper) w.classList.remove('active'); });
      wrapper.classList.toggle('active');
      if (wrapper.classList.contains('active')) {
        input.focus();
      }
    });

    // اختيار عنصر من القائمة
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        input.value = option.getAttribute('data-value');
        wrapper.classList.remove('active');
      });
    });

    // فلترة وبحث مباشر في قائمة الجنسيات عند الكتابة
    if (input.id === 'nationalityInput') {
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

  // إغلاق القوائم عند الضغط في أي مكان خارجها
  document.addEventListener('click', () => {
    wrappers.forEach(w => w.classList.remove('active'));
  });
}

// تشغيل القوائم المنسدلة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  setupCustomDropdowns();
});
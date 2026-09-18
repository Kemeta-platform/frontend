function togglePass(id, btn) {
  const input = document.getElementById(id);
  const icon = btn.querySelector('i');
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  icon.className = isPass ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
}

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  let timerInterval = null;

  const steps = [1, 2, 3, 4].map(n => document.getElementById(`step-${n}`));
  const otpInputs = document.querySelectorAll('.otp-box');

  function goToStep(num) {
    currentStep = num;
    steps.forEach((s, idx) => s?.classList.toggle('d-none', idx + 1 !== num));

    for (let i = 1; i <= 3; i++) {
      const ind = document.getElementById(`indicator-${i}`);
      const badge = document.getElementById(`badge-${i}`);
      if (!ind || !badge) continue;

      ind.classList.remove('active', 'completed');
      if (i < currentStep || currentStep === 4) {
        ind.classList.add('completed');
        badge.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else if (i === currentStep) {
        ind.classList.add('active');
        badge.textContent = i;
      } else {
        badge.textContent = i;
      }
    }
  }

  function handleBack(e) {
    e.preventDefault();
    currentStep === 1 || currentStep === 4 ? (window.location.href = '../login/index.html') : goToStep(currentStep - 1);
  }

  document.getElementById('globalBackBtn')?.addEventListener('click', handleBack);
  document.getElementById('mobileBackBtn')?.addEventListener('click', handleBack);
  document.getElementById('btnGoBackEmail')?.addEventListener('click', () => goToStep(1));

  // Step 1: Submit Email
  document.getElementById('formResetStep1')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value.trim();
    if (!email) return;

    const display = document.getElementById('displayEmail');
    if (display) display.textContent = email;

    goToStep(2);
    startTimer();
    otpInputs[0]?.focus();
  });

  // Step 2: OTP Inputs & Verification
  otpInputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      if (input.value && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) otpInputs[idx - 1].focus();
    });
  });

  document.getElementById('btnVerify')?.addEventListener('click', () => {
    const code = Array.from(otpInputs).map(i => i.value).join('');
    if (code.length < 6) return alert('Please enter the full 6-digit verification code.');
    goToStep(3);
  });

  function startTimer() {
    clearInterval(timerInterval);
    let time = 45;
    const resendBtn = document.getElementById('resendBtn');
    if (resendBtn) {
      resendBtn.innerHTML = 'Resend in <span id="timer">00:45</span>';
      resendBtn.style.pointerEvents = 'none';
      resendBtn.style.opacity = '0.7';
    }

    timerInterval = setInterval(() => {
      time--;
      const timerEl = document.getElementById('timer');
      if (timerEl) timerEl.textContent = `00:${time < 10 ? '0' + time : time}`;

      if (time <= 0) {
        clearInterval(timerInterval);
        if (resendBtn) {
          resendBtn.innerHTML = '<strong>Resend Code</strong>';
          resendBtn.style.pointerEvents = 'auto';
          resendBtn.style.opacity = '1';
        }
      }
    }, 1000);
  }

  document.getElementById('resendBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    startTimer();
    alert('A new code has been sent to your email.');
  });

  // Step 3: Set New Password
  document.getElementById('formResetStep3')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const p1 = document.getElementById('newPassword').value;
    const p2 = document.getElementById('confirmNewPassword').value;
    const err = document.getElementById('matchError');

    if (p1 !== p2) {
      err?.classList.remove('d-none');
      return;
    }
    err?.classList.add('d-none');

    localStorage.setItem('loginPassword', p1);
    goToStep(4);
  });
});
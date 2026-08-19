document.addEventListener('DOMContentLoaded', () => {
  // 1. جلب العناصر من الـ DOM
  const toggleBtn = document.getElementById('togglePasswordBtn');
  const passwordInput = document.getElementById('passwordInput');
  const loginForm = document.getElementById('loginForm');

  // 2. إظهار / إخفاء كلمة المرور (متوافق تماماً مع FontAwesome)
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault(); // لمنع عمل submit بالغلط
      
      const icon = toggleBtn.querySelector('i');
      const isPassword = passwordInput.type === 'password';

      // تبديل نوع الحقل بين text و password
      passwordInput.type = isPassword ? 'text' : 'password';

      // تبديل كلاسات أيقونة FontAwesome
      if (icon) {
        if (isPassword) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        } else {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      }
    });
  }

  // 3. معالجة تسجيل الدخول (Login Submit)
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const emailInput = loginForm.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      // تحقق بسيط
      if (!email || !password) {
        alert('Please fill in all required fields.');
        return;
      }

      // رسالة نجاح وتوجيه إلى الداشبورد (أو الصفحة الرئيسية)
      alert(`Welcome back! Successfully logged in as: ${email}`);
      
      // التوجيه لصفحة الداشبورد:
      // window.location.href = '../dashboard/index.html';
    });
  }
});
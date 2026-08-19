 // إظهار / إخفاء كلمة المرور (Show/Hide Password)
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const passwordInput = document.getElementById('passwordInput');
    const toggleIcon = document.getElementById('toggleIcon');

    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      
      // تبديل الأيقونة
      toggleIcon.classList.toggle('bi-eye-slash', !isPassword);
      toggleIcon.classList.toggle('bi-eye', isPassword);
    });

    // معالجة تسجيل الدخول (تجريبي)
    function handleLogin(event) {
      event.preventDefault();
      alert('Login submitted successfully!');
    }
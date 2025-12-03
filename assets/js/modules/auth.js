// assets/js/modules/auth.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form[0].value.trim();
    const password = form[1].value;

    if (password === 'demo123' && email) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      window.location.href = 'dashboard.html';
    } else {
      alert('Используйте пароль: demo123 (для демо-режима)');
    }
  });

  // Переключение языка
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      window.switchLanguage(e.target.value);
    });
  }
});
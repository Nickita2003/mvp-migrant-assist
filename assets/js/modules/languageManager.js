// assets/js/modules/languageManager.js
const SUPPORTED_LANGUAGES = ['ru', 'uz', 'tg', 'ky', 'hy', 'az', 'en', 'uk', 'kk', 'zh'];
let currentLang = localStorage.getItem('userLang') || 'ru';

// Экспортируем функцию для внешнего вызова
window.switchLanguage = async function(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;
  currentLang = lang;
  localStorage.setItem('userLang', lang);
  const translations = await loadTranslations(lang);
  applyTranslations(translations);
};

async function loadTranslations(lang) {
  try {
    const response = await fetch(`../assets/js/i18n/${lang}.json`);
    if (!response.ok) throw new Error('Not found');
    return await response.json();
  } catch (err) {
    console.warn(`Fallback to ru for ${lang}`);
    const resp = await fetch('../assets/js/i18n/ru.json');
    return await resp.json();
  }
}

function applyTranslations(translations) {
  // Обычный текст
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });

  // Placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key]) {
      el.placeholder = translations[key];
    }
  });

  // Атрибут title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (translations[key]) {
      el.title = translations[key];
    }
  });

  // Обновляем язык HTML и заголовок
  document.documentElement.lang = currentLang;
  if (translations.pageTitle) document.title = translations.pageTitle;
  if (translations.dashboardTitle) document.title = translations.dashboardTitle;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
  // Устанавливаем выбранный язык в селект
  const select = document.getElementById('languageSelect');
  if (select) {
    select.value = currentLang;
  }

  const translations = await loadTranslations(currentLang);
  applyTranslations(translations);
});
// assets/js/modules/languageManager.js

const SUPPORTED_LANGS = ['ru', 'en', 'uz', 'tg', 'ky', 'hy', 'az', 'uk', 'kk', 'zh'];
let currentLang = 'ru';

async function loadTranslations(lang) {
  try {
    const response = await fetch(`assets/i18n/${lang}.json`);
    if (!response.ok) throw new Error(`404: ${lang}.json not found`);
    return await response.json();
  } catch (error) {
    console.warn(`⚠️ Файл перевода не найден для "${lang}". Используется русский.`);
    try {
      const fallback = await fetch(`assets/i18n/ru.json`);
      return await fallback.json();
    } catch (fallbackError) {
      console.error('❌ Не удалось загрузить даже русский перевод:', fallbackError);
      return {};
    }
  }
}

function applyTranslations(translations) {
  const titleEl = document.querySelector('title[data-i18n]');
  if (titleEl) {
    const key = titleEl.getAttribute('data-i18n');
    if (translations[key]) document.title = translations[key];
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key || !translations[key]) return;

    if (el.hasAttribute('data-i18n-placeholder')) {
      el.placeholder = translations[key];
    } else if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && !el.placeholder) {
      el.placeholder = translations[key];
    } else {
      el.textContent = translations[key];
    }
  });

  document.documentElement.lang = currentLang;
}

export async function switchLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = 'ru';
  currentLang = lang;
  localStorage.setItem('selectedLanguage', lang);
  const translations = await loadTranslations(lang);
  applyTranslations(translations);
}

export async function initLanguage() {
  let lang = localStorage.getItem('selectedLanguage');
  if (!lang) {
    const browserLang = navigator.language.split('-')[0];
    lang = SUPPORTED_LANGS.includes(browserLang) ? browserLang : 'ru';
  }
  if (!SUPPORTED_LANGS.includes(lang)) lang = 'ru';

  const select = document.getElementById('languageSelect');
  if (select) select.value = lang;

  await switchLanguage(lang);
}

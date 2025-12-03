// assets/js/modules/voiceAssistant.js
export function initVoiceAssistant() {
  const btn = document.getElementById('voiceBtn');
  const output = document.getElementById('voiceOutput');

  if (!btn || !output) return;

  const synth = window.speechSynthesis;
  let isListening = false;

  btn.addEventListener('click', () => {
    if (isListening) return;

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = document.documentElement.lang || 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    isListening = true;
    output.textContent = 'Слушаю...';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      output.textContent = `Вы сказали: ${transcript}`;
      speakResponse(`Вы сказали: ${transcript}`);
    };

    recognition.onerror = (event) => {
      output.textContent = 'Ошибка распознавания.';
      isListening = false;
    };

    recognition.onend = () => {
      isListening = false;
    };
  });

  function speakResponse(text) {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = recognition.lang;
    utterance.rate = 0.9;
    synth.speak(utterance);
  }
}

// Запуск при загрузке страницы (если есть элементы)
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('voiceBtn')) {
    initVoiceAssistant();
  }
});
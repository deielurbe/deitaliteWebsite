// ===================================
// i18n (Internationalization) for deitalite
// ===================================

const i18n = {
  currentLang: 'en',
  supportedLangs: ['en', 'nl', 'es'],
  langNames: {
    en: 'English',
    nl: 'Nederlands',
    es: 'Español'
  },

  init() {
    const savedLang = this.getSavedLanguage();
    const browserLang = this.detectBrowserLanguage();
    const initialLang = savedLang || browserLang || 'en';
    this.setLanguage(initialLang);
    this.setupLanguageSelector();
  },

  getSavedLanguage() {
    try {
      return localStorage.getItem('deitalite_lang');
    } catch (e) {
      return null;
    }
  },

  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.toLowerCase().split('-')[0];
    if (this.supportedLangs.includes(langCode)) {
      return langCode;
    }
    return 'en';
  },

  setLanguage(lang) {
    if (!this.supportedLangs.includes(lang)) {
      console.warn(`Language ${lang} not supported, falling back to English`);
      lang = 'en';
    }

    this.currentLang = lang;

    try {
      localStorage.setItem('deitalite_lang', lang);
    } catch (e) {
      // localStorage not available
    }

    document.documentElement.lang = lang;
    this.updateContent();
    this.updateLanguageSelectorUI();
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  },

  updateContent() {
    const lang = this.currentLang;
    const trans = translations[lang];

    if (!trans) {
      console.error(`Translations not found for language: ${lang}`);
      return;
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = trans[key];

      if (translation) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          element.innerHTML = translation;
        }
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const translation = trans[key];
      if (translation) {
        element.innerHTML = translation;
      }
    });
  },

  setupLanguageSelector() {
    const selector = document.getElementById('language-selector');
    if (!selector) return;

    const button = selector.querySelector('.lang-button');
    const dropdown = selector.querySelector('.lang-dropdown');
    const options = selector.querySelectorAll('.lang-option');

    // Toggle dropdown on button click
    if (button) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = selector.classList.contains('open');
        this.toggleDropdown(selector, !isOpen);
        if (!isOpen && options.length > 0) {
          // Focus the active option when opening
          const active = dropdown.querySelector('.lang-option.active') || options[0];
          active.focus();
        }
      });

      // Keyboard support on button
      button.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.toggleDropdown(selector, true);
          const active = dropdown.querySelector('.lang-option.active') || options[0];
          active.focus();
        }
        if (e.key === 'Escape') {
          this.toggleDropdown(selector, false);
        }
      });
    }

    // Option click and keyboard handlers
    options.forEach((option, index) => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = option.getAttribute('data-lang');
        this.setLanguage(lang);
        this.toggleDropdown(selector, false);
        if (button) button.focus();
      });

      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          option.click();
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = options[index + 1] || options[0];
          next.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = options[index - 1] || options[options.length - 1];
          prev.focus();
        }
        if (e.key === 'Escape') {
          this.toggleDropdown(selector, false);
          if (button) button.focus();
        }
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        this.toggleDropdown(selector, false);
      }
    });
  },

  toggleDropdown(selector, open) {
    const button = selector.querySelector('.lang-button');
    if (open) {
      selector.classList.add('open');
    } else {
      selector.classList.remove('open');
    }
    // Update all aria-expanded attributes
    selector.setAttribute('aria-expanded', String(open));
    if (button) button.setAttribute('aria-expanded', String(open));
  },

  updateLanguageSelectorUI() {
    const currentLangElement = document.getElementById('current-lang');

    if (currentLangElement) {
      currentLangElement.textContent = this.langNames[this.currentLang];
    }

    document.querySelectorAll('.lang-option').forEach(option => {
      const lang = option.getAttribute('data-lang');
      if (lang === this.currentLang) {
        option.classList.add('active');
        option.setAttribute('aria-selected', 'true');
      } else {
        option.classList.remove('active');
        option.setAttribute('aria-selected', 'false');
      }
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
  i18n.init();
}
